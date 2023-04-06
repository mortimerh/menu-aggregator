#!/usr/bin/env bash
TF_DIR="environments/shared"
TF_OVERRIDE_FILE="bootstrap_override.tf"
TF_PLAN_FILE="bootstrap_tfplan"

# Exit immediately if any command exits with a non-zero status
set -e

# Change to environment directory
cd "$TF_DIR"

# Remove old files
rm -rf "$TF_OVERRIDE_FILE" "$TF_PLAN_FILE" terraform.tfstate .terraform*

# Create override file to use local state during while creating the GCS bucket for remote state
echo "terraform {" >> "$TF_OVERRIDE_FILE"
echo "  backend \"local\" { }" >> "$TF_OVERRIDE_FILE"
echo "}" >> "$TF_OVERRIDE_FILE"

# Initialize terraform, then create plan for the GCS bucket and apply it
terraform init
terraform plan -target=google_storage_bucket.tfstate_bucket -out "$TF_PLAN_FILE"
terraform apply "$TF_PLAN_FILE"

# Remove the override and plan files
rm -f "$TF_OVERRIDE_FILE" "$TF_PLAN_FILE"

# Migrate state to the created GCS bucket
terraform init -migrate-state

# Remove the local state file that was used during boostrapping
rm -rf terraform.tfstate

echo "Successfully setup remote state. Now run terraform apply manually from $TF_DIR directory to provision pipeline."