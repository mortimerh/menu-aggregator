# Enable the IAM API
resource "google_project_service" "iam_api_enabled" {
  project = var.project
  service = "iam.googleapis.com"
}

# Create a new service account to be used by the scraper
resource "google_service_account" "lunch_scraper" {
  depends_on = [
    google_project_service.iam_api_enabled
  ]
  account_id   = "lunch-scraper"
  display_name = "Lunch Scraper"
}

# Grant the service account the necessary permissions to write to the Google Cloud Storage bucket
resource "google_storage_bucket_iam_member" "bucket_writer" {
  bucket      = var.lunch_menus_bucket_name
  role        = "roles/storage.objectCreator"
  member      = "serviceAccount:${google_service_account.lunch_scraper.email}"
}

# Create the scraper Cloud Function
resource "google_cloudfunctions_function" "lunch_menu_scraper" {
  name        = var.function_name
  description = "Scrapes lunch menus of local restaurants."

  runtime             = "nodejs18"
  available_memory_mb = var.memory
  timeout             = var.timeout

  entry_point        = "run"
  # source_archive = "gs://<your-bucket-name>/lunch_menu_scraper.zip"

  service_account_email = google_service_account.lunch_scraper.email

  environment_variables = {
    PUPPETEER_EXECUTABLE_PATH = "/usr/bin/google-chrome-stable"
  }
}

# Create a new service account to be used to trigger the scraper
resource "google_service_account" "lunch_scraper_invoker" {
  depends_on = [
    google_project_service.iam_api_enabled
  ]
  account_id   = "lunch-scraper-invoker"
  display_name = "Lunch Scraper Invoker"
}

# Grant the invoker service account the necessary permissions to trigger the Cloud Function
resource "google_cloudfunctions_function_iam_member" "lunch_scraper_invoker_role" {
  project        = google_cloudfunctions_function.lunch_menu_scraper.project
  region         = google_cloudfunctions_function.lunch_menu_scraper.region
  cloud_function = google_cloudfunctions_function.lunch_menu_scraper.name

  role   = "roles/cloudfunctions.invoker"
  member = "serviceAccount:${google_service_account.lunch_scraper_invoker.email}"
}


# Create the trigger for the scraper
resource "google_cloud_scheduler_job" "lunch_menu_scraper_trigger" {
  name      = "lunch-menu-scraper-trigger"
  schedule  = var.schedule
  time_zone = var.timezone

  http_target {
    http_method = "GET"
    uri         = google_cloudfunctions_function.lunch_menu_scraper.https_trigger_url

    oidc_token {
      service_account_email = google_service_account.lunch_scraper_invoker.email
    }
  }
}
