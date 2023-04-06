#########################################################################################
#
# WARNING
# This file will be added to source control, do not place any secrets here.
#
#########################################################################################
project            = "dockan-lunch-shared"
region             = "europe-west1"
tfstate_bucket     = "dockan-lunch-shared-tfstate"
build_trigger_name = "menu-aggregator-github-trigger"
github_owner       = "mortimerh"
github_repo        = "menu-aggregator"
environments_projects = {
  dev  = "dockan-lunch-dev",
  prod = "dockan-lunch-prod"
}
