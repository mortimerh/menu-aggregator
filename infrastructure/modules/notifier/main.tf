# Enable the neccesary Cloud APIs
resource "google_project_service" "cloud_apis_enabled" {
  for_each           = toset(["iam.googleapis.com", "cloudfunctions.googleapis.com", "cloudbuild.googleapis.com", "run.googleapis.com", "artifactregistry.googleapis.com", "sourcerepo.googleapis.com", "cloudscheduler.googleapis.com", "cloudresourcemanager.googleapis.com", "secretmanager.googleapis.com"])
  project            = var.project
  service            = each.key
  disable_on_destroy = false
}

# Create a new service account to be used by the notifier
resource "google_service_account" "lunch_notifier" {
  depends_on = [
    google_project_service.cloud_apis_enabled
  ]
  project      = var.project
  account_id   = "lunch-notifier"
  display_name = "Lunch notifier"
}
# Grant the service account the necessary permissions to write to the Google Cloud Storage bucket
resource "google_storage_bucket_iam_member" "bucket_writer" {
  bucket = var.lunch_menus_bucket_name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.lunch_notifier.email}"
}

# Create a secret to hold sensitive config for the notifier, e.g. webhooks urls
resource "google_secret_manager_secret" "lunch_notifier_secret" {
  depends_on = [
    google_project_service.cloud_apis_enabled
  ]

  secret_id = "${var.function_name}-config"

  replication {
    automatic = true
  }
}
# Grant the service account access to read the secret
resource "google_secret_manager_secret_iam_member" "secret_accessor" {
  secret_id = google_secret_manager_secret.lunch_notifier_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.lunch_notifier.email}"
}

# Create a bucket to store source for Cloud Function and upload a placeholder .zip
# This is a workaround as the Cloud Function requires code to be deployed
# Cloud Build will later deploy the actual code for the notifier
resource "google_storage_bucket" "lunch_notifier_source_bucket" {
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
  bucket       = google_storage_bucket.lunch_notifier_source_bucket.name
  source       = data.archive_file.placeholder_source_archive.output_path
  content_type = "application/zip"
}

# Create the notifier Cloud Function
resource "google_cloudfunctions_function" "lunch_menu_notifier" {
  name        = var.function_name
  description = "Sends notification(s) of today's lunches."
  region      = var.region

  runtime             = "nodejs16"
  available_memory_mb = var.memory
  timeout             = var.timeout
  entry_point         = "run"
  trigger_http        = true

  service_account_email = google_service_account.lunch_notifier.email

  source_archive_bucket = google_storage_bucket.lunch_notifier_source_bucket.name
  source_archive_object = google_storage_bucket_object.archive.name

  environment_variables = {
    "BUCKET_NAME" = var.lunch_menus_bucket_name
  }

  secret_environment_variables {
    key     = "SECRET_CONFIG"
    secret  = google_secret_manager_secret.lunch_notifier_secret.secret_id
    version = "latest"
  }
}

# Create a new service account to be used to trigger the notifier
resource "google_service_account" "lunch_notifier_invoker" {
  depends_on = [
    google_project_service.cloud_apis_enabled
  ]
  project      = var.project
  account_id   = "lunch-notifier-invoker"
  display_name = "Lunch notifier Invoker"
}

# Grant the invoker service account the necessary permissions to trigger the Cloud Function
resource "google_cloudfunctions_function_iam_member" "lunch_notifier_invoker_role" {
  project        = google_cloudfunctions_function.lunch_menu_notifier.project
  region         = google_cloudfunctions_function.lunch_menu_notifier.region
  cloud_function = google_cloudfunctions_function.lunch_menu_notifier.name

  role   = "roles/cloudfunctions.invoker"
  member = "serviceAccount:${google_service_account.lunch_notifier_invoker.email}"
}


# Create the trigger for the notifier
resource "google_cloud_scheduler_job" "lunch_menu_notifier_trigger" {
  name      = "lunch-menu-notifier-trigger"
  schedule  = var.schedule
  time_zone = var.timezone
  region    = google_cloudfunctions_function.lunch_menu_notifier.region

  http_target {
    http_method = "GET"
    uri         = google_cloudfunctions_function.lunch_menu_notifier.https_trigger_url

    oidc_token {
      service_account_email = google_service_account.lunch_notifier_invoker.email
    }
  }
}
