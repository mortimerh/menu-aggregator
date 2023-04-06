# Enable the neccesary Cloud APIs
resource "google_project_service" "cloud_apis_enabled" {
  for_each           = toset(["iam.googleapis.com", "cloudfunctions.googleapis.com", "cloudbuild.googleapis.com", "run.googleapis.com", "artifactregistry.googleapis.com", "sourcerepo.googleapis.com", "cloudscheduler.googleapis.com", "cloudresourcemanager.googleapis.com"])
  project            = var.project
  service            = each.key
  disable_on_destroy = false
}

# Create a new service account to be used by the scraper
resource "google_service_account" "lunch_scraper" {
  depends_on = [
    google_project_service.cloud_apis_enabled
  ]
  project      = var.project
  account_id   = "lunch-scraper"
  display_name = "Lunch Scraper"
}
# Grant the service account the necessary permissions to write to the Google Cloud Storage bucket
resource "google_storage_bucket_iam_member" "bucket_writer" {
  bucket = var.lunch_menus_bucket_name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.lunch_scraper.email}"
}

# Create a bucket to store source for Cloud Function and upload a placeholder .zip
# This is a workaround as the Cloud Function requires code to be deployed
# Cloud Build will later deploy the actual code for the scraper
resource "google_storage_bucket" "lunch_scraper_source_bucket" {
  depends_on = [
    google_project_service.cloud_apis_enabled
  ]
  name          = "${var.project}-gcf-source-${var.function_name}"
  location      = var.region
  storage_class = "STANDARD"
  force_destroy = true
}
data "archive_file" "placeholder_source_archive" {
  type        = "zip"
  output_path = "${path.root}/.terraform/tmp/index.zip"

  source {
    content  = "exports.run = (req, res) => { res.status(200).send(\"OK from placeholder!\"); };"
    filename = "index.js"
  }
}
resource "google_storage_bucket_object" "archive" {
  name         = "index.zip"
  bucket       = google_storage_bucket.lunch_scraper_source_bucket.name
  source       = data.archive_file.placeholder_source_archive.output_path
  content_type = "application/zip"
}

# Create the scraper Cloud Function
resource "google_cloudfunctions_function" "lunch_menu_scraper" {
  name        = var.function_name
  description = "Scrapes lunch menus of local restaurants."
  region      = var.region

  runtime             = "nodejs18"
  available_memory_mb = var.memory
  timeout             = var.timeout
  entry_point         = "run"
  trigger_http        = true

  service_account_email = google_service_account.lunch_scraper.email

  source_archive_bucket = google_storage_bucket.lunch_scraper_source_bucket.name
  source_archive_object = google_storage_bucket_object.archive.name
}

# Create a new service account to be used to trigger the scraper
resource "google_service_account" "lunch_scraper_invoker" {
  depends_on = [
    google_project_service.cloud_apis_enabled
  ]
  project      = var.project
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
  region    = google_cloudfunctions_function.lunch_menu_scraper.region

  http_target {
    http_method = "GET"
    uri         = google_cloudfunctions_function.lunch_menu_scraper.https_trigger_url

    oidc_token {
      service_account_email = google_service_account.lunch_scraper_invoker.email
    }
  }
}
