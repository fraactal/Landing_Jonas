variable "aws_region" {
  description = "AWS region where the lead capture backend will be created."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "production"
}

variable "leads_table_name" {
  description = "DynamoDB table name for lead persistence."
  type        = string
  default     = "jonathanvaldes-leads"
}

variable "lambda_function_name" {
  description = "Lambda function name for the lead API."
  type        = string
  default     = "jonathanvaldes-lead-api"
}

variable "lambda_runtime" {
  description = "AWS Lambda Python runtime. Keep this updated to a currently supported Python 3.x runtime before deploy."
  type        = string
  default     = "python3.12"
}

variable "lambda_package_path" {
  description = "Path to the zipped Lambda package created locally before plan/apply."
  type        = string
  default     = "../../build/lead_api.zip"
}

variable "allowed_origins" {
  description = "Allowed browser origins for the Function URL. Do not use wildcard in production."
  type        = list(string)
  default     = ["https://jonathanvaldes.com"]
}

variable "ses_domain_identity" {
  description = "Domain identity used by SES for lead notifications. DNS records must be published separately."
  type        = string
  default     = "jonathanvaldes.com"
}

variable "lead_notification_to" {
  description = "Operational destination for internal lead notifications. Do not expose this in frontend or public API responses."
  type        = string
  default     = "jonathan.valdes.o@gmail.com"
}

variable "lead_notification_from" {
  description = "SES sender address for lead notifications. Must belong to a verified SES identity."
  type        = string
  default     = "notificaciones@jonathanvaldes.com"
}