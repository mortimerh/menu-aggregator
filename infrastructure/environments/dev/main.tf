provider "google" {
  project = var.project
  region  = var.region
}

module "storage_static_website" {
  source   = "../../modules/storage_static_website"
  project  = var.project
  name     = "${var.project}-website"
  location = var.region
}

module "scraper" {
  source                  = "../../modules/scraper"
  project                 = var.project
  region                  = var.region
  function_name           = "lunch-menu-scraper-${local.env}"
  lunch_menus_bucket_name = "${var.project}-website-${local.env}"
}
