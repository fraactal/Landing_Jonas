variable "aws_region" {
  description = "AWS region where the lead capture backend will be created."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "production"

  validation {
    condition     = contains(["production", "staging", "development", "local"], var.environment)
    error_message = "environment must be one of: production, staging, development, local."
  }
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
  description = "Allowed browser origins for the Function URL. Do not use wildcard in production. Localhost belongs only in non-production tfvars."
  type        = list(string)
  default     = ["https://jonathanvaldes.com"]

  validation {
    condition     = alltrue([for origin in var.allowed_origins : origin != "*"])
    error_message = "allowed_origins must not contain wildcard origins."
  }

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

variable "lambda_log_retention_days" {
  description = "CloudWatch log retention in days for public Lambdas. V1 keeps operational logs short-lived."
  type        = number
  default     = 14
}

variable "lead_reserved_concurrent_executions" {
  description = "Reserved concurrency for the lead Lambda. Conservative V1 abuse/cost guard without blocking the service with one slow request."
  type        = number
  default     = 5
}

variable "booking_reserved_concurrent_executions" {
  description = "Reserved concurrency for the booking Lambda. Slightly higher than lead because Calendar calls can be slower."
  type        = number
  default     = 5
}
variable "booking_lambda_function_name" {
  description = "Lambda function name for the booking API."
  type        = string
  default     = "jonathanvaldes-booking-api"
}

variable "booking_lambda_package_path" {
  description = "Path to the zipped booking Lambda package created locally before plan/apply."
  type        = string
  default     = "../../build/booking_api.zip"
}

variable "booking_google_secret_arn" {
  description = "ARN of the AWS Secrets Manager secret containing Google OAuth client_id, client_secret, refresh_token and calendar_id. The secret value is created outside Terraform."
  type        = string

  validation {
    condition     = can(regex("^arn:aws:secretsmanager:[^:]+:[0-9]{12}:secret:.+", var.booking_google_secret_arn)) && !strcontains(var.booking_google_secret_arn, "*")
    error_message = "booking_google_secret_arn must be a specific AWS Secrets Manager secret ARN, not a wildcard."
  }
}

variable "observability_namespace" {
  description = "CloudWatch namespace for low-cardinality application metrics derived from sanitized Lambda logs."
  type        = string
  default     = "JonathanValdes/Website"
}

variable "enable_alerting" {
  description = "Whether CloudWatch alarms should execute actions. Actions are still gated to production."
  type        = bool
  default     = true
}

variable "alerts_topic_name" {
  description = "SNS topic name for operational alarms."
  type        = string
  default     = "jonathanvaldes-alerts"
}

variable "alerts_email" {
  description = "Email endpoint for the SNS alarm subscription. SNS requires manual confirmation before notifications are delivered."
  type        = string
  default     = "jonathan.valdes.o@gmail.com"
}

variable "observability_dashboard_name" {
  description = "CloudWatch dashboard name for website backend observability."
  type        = string
  default     = "jonathanvaldes-website-v1"
}

variable "lambda_alarm_period_seconds" {
  description = "CloudWatch alarm period for Lambda errors, throttles and short-window application failures."
  type        = number
  default     = 300
}

variable "notification_alarm_period_seconds" {
  description = "CloudWatch alarm period for notification and third-party integration failures."
  type        = number
  default     = 600
}

variable "lambda_error_threshold" {
  description = "Unhandled Lambda errors required to trigger the V1 warning alarm."
  type        = number
  default     = 1
}

variable "throttle_threshold" {
  description = "Lambda throttles required across two periods to trigger the V1 warning alarm."
  type        = number
  default     = 3
}

variable "persistence_failure_threshold" {
  description = "Lead persistence failures required to trigger the V1 critical alarm."
  type        = number
  default     = 1
}

variable "notification_failure_threshold" {
  description = "Lead SES notification failures required to trigger the V1 warning alarm."
  type        = number
  default     = 2
}

variable "booking_calendar_auth_failure_threshold" {
  description = "Booking Calendar/OAuth failures required to trigger the V1 critical alarm."
  type        = number
  default     = 2
}

variable "invalid_traffic_threshold" {
  description = "Combined invalid request and honeypot events required to trigger the V1 abuse warning alarm."
  type        = number
  default     = 20
}
