variable "project" {}
variable "region" {}
variable "tfstate_bucket" {}
variable "build_trigger_name" {}
variable "github_owner" {}
variable "github_repo" {}
variable "environments_projects" {
    type = map(string)
}