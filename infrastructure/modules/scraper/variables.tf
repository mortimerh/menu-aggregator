variable "project" {
  description = "The ID of the GCP project."
}

variable "region" {
  description = "The region to create the resources in."
}

variable "function_name" {
  description = "The name of the Cloud Function to trigger."
}

variable "schedule" {
  description = "The schedule in cron format. This example runs every 10 minutes between 05.00 and 12.00 Stockholm time."
  default = "0 5-11/1 * * *"
}

variable "timezone" {
  description = "The timezone to use for the schedule."
  default = "Europe/Stockholm"
}

variable "memory" {
  description = "The amount of memory to allocate for the Cloud Function."
  default = 512
}

variable "timeout" {
  description = "The maximum amount of time in seconds that the Cloud Function can run."
  default = 60
}

variable "lunch_menus_bucket_name" {
  description = "The name of the Google Cloud Storage bucket where the lunch menus will be saved."
}