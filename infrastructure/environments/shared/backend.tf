terraform {
  backend "gcs" {
    bucket = "dockan-lunch-shared-tfstate"
    prefix = "shared"
  }
}
