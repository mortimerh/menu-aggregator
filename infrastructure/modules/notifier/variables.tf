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
  description = "The schedule in cron format. The default runs once daily att 11.30."
  default = "30 11 * * *"
}

variable "timezone" {
  description = "The timezone to use for the schedule. The default is Stockholm time."
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
  description = "The name of the Google Cloud Storage bucket where the lunch menus are saved."
}