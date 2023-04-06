Lunch Menu
=============================

Google Cloud Projects
-----------------------------
* Lunch Menu Organisation
  * Lunch Menu Shared
    Project for hosting CI/CD pipeline and other shared resources, e.g. DNS

  * Lunch Menu Staging
    Project for hosting resources for staging environment
    
  * Lunch Menu Production
    Project for hosting resources for staging environment


CI/CD Pipeline
-----------------------------

Initial setup
-----------------------------
1. Create the GCP project for each environment (dev, prod).
1. Update the .tfvars files and the environments/shared/backend.tf file.
1. Run infrastructure/boostrap.sh script to setup the tfstate bucket.
1. Cd to infrastructure/env/shared then run terraform apply. The command will fail since we have not yet setup connection to Github. Follow the instructions in the error message, then re-run the command.
1. The CI/CD pipeline has now been setup and will run automatically on next commit. You can also trigger it manually from GCP console. 

### Errors
#### Bucket does not exist
```
Initializing the backend...
Terraform detected that the backend type changed from "local" to "gcs".

╷
│ Error: Error inspecting states in the "local" backend:
│     querying Cloud Storage failed: storage: bucket doesn't exist
```
Ensure that you are authenticated with the project by running `gcloud auth application-default login --project <PROJECT_ID>`, replacing `<PROJECT_ID>` with the project id for the shared project.

#### Repository mapping does not exist
```
│ Error: Error creating Trigger: googleapi: Error 400: Repository mapping does not exist. Please visit https://console.cloud.google.com/cloud-build/triggers/connect?project=<PROJECT_NUMBER> to connect a repository to your project
│ 
│   with google_cloudbuild_trigger.github_trigger,
│   on main.tf line 56, in resource "google_cloudbuild_trigger" "github_trigger":
│   56: resource "google_cloudbuild_trigger" "github_trigger" {
│ 
```
This is expected when provisioning the first build pipeline for the first time, see Intial setup instructions. 

Overengineered?
-----------------------------
Yupp. I wanted to test some new tech. I'm sure I made a lot of mistakes. Feel free to add any feedback as an issue in the repo.

