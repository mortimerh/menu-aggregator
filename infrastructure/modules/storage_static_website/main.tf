# Enable the neccesary Cloud APIs
resource "google_project_service" "cloud_apis_enabled" {
  for_each           = toset(["iam.googleapis.com",  "cloudresourcemanager.googleapis.com"])
  project            = var.project
  service            = each.key
  disable_on_destroy = false
}
# Create new storage bucket in the provided region
# with standard storage class and settings for main_page_suffix and not_found_page
resource "google_storage_bucket" "static_website" {
  project                     = var.project
  name                        = var.name
  location                    = var.location
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  cors {
    origin          = "*"
    method          = ["GET", "HEAD"]
    max_age_seconds = 600
  }
}

# Make bucket public by granting allUsers READER access
resource "google_storage_bucket_iam_member" "member" {
  depends_on = [
    google_project_service.cloud_apis_enabled
  ]
  bucket = google_storage_bucket.static_website.id
  role   = "roles/storage.legacyObjectReader"
  member = "allUsers"
}
