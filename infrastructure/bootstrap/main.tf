provider "google" {
  project = var.project
  region  = var.region
}

## [START Terraform remote state bucket]
#  Create the GCS bucket for sharing terraform state.
##
resource "google_storage_bucket" "tfstate_bucket" {
  project                     = var.project
  name                        = var.tfstate_bucket
  location                    = var.region
  storage_class               = "STANDARD"
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      num_newer_versions = 10
    }
    action {
      type = "Delete"
    }
  }
}
## [END Terraform remote state bucket]

## [START Build pipeline]
#  Setup the Cloud Build pipeline with GitHub trigger.
#
#  NB. The GitHub connection must be setup and authenticated manually. 
#  Follow instructions in error message when runnings this module.
##

resource "google_project_service_identity" "build_sa" {
  provider = google-beta

  project = var.project
  service = "cloudbuild.googleapis.com"
}

resource "google_project_iam_member" "build_sa_project_editor" {
  project = var.project
  role    = "roles/editor"
  member  = "serviceAccount:${google_project_service_identity.build_sa.email}"
}

resource "google_cloudbuild_trigger" "github_trigger" {
  name          = var.build_trigger_name
  filename      = "cloudbuild.yaml"
  ignored_files = [".gitignore"]

  github {
    owner = var.github_owner
    name  = var.github_repo
    push {
      branch = "main"
    }
  }
}
## [END Build pipeline]
