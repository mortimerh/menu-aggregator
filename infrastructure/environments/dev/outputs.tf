output "website_bucket_name" {
    value = module.storage_static_website.bucket_name
}

output "scraper_function_name" {
    value = module.scraper.function_name
}