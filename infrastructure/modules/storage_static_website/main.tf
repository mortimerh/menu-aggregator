# [START storage_static_website_create_bucket_tf]
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
}
# [END storage_static_website_create_bucket_tf]

# # [START storage_static_website_make_bucket_public_tf]
# # Make bucket public by granting allUsers READER access
resource "google_storage_bucket_iam_member" "member" {
  bucket  = google_storage_bucket.static_website.id
  role    = "roles/storage.legacyObjectReader"
  member  = "allUsers"
}
# # [END storage_static_website_make_bucket_public_tf]
