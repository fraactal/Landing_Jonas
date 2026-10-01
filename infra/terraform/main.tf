provider "aws" {
  region = var.aws_region
}

locals {
  common_tags = {
    Project     = "jonathanvaldes.com"
    Environment = var.environment
    ManagedBy   = "terraform"
    Module      = "lead-capture"
  }
}

resource "aws_dynamodb_table" "leads" {
  name         = var.leads_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "leadId"

  attribute {
    name = "leadId"
    type = "S"
  }

  tags = local.common_tags
}

resource "aws_ses_domain_identity" "lead_notifications" {
  domain = var.ses_domain_identity
}

resource "aws_ses_domain_dkim" "lead_notifications" {
  domain = aws_ses_domain_identity.lead_notifications.domain
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_cloudwatch_log_group" "lead_api" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = var.lambda_log_retention_days

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "booking_api" {
  name              = "/aws/lambda/${var.booking_lambda_function_name}"
  retention_in_days = var.lambda_log_retention_days

  tags = local.common_tags
}

resource "aws_iam_role" "lead_api" {
  name               = "${var.lambda_function_name}-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "lead_api_logs" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["${aws_cloudwatch_log_group.lead_api.arn}:*"]
  }
}

resource "aws_iam_role_policy" "lead_api_logs" {
  name   = "${var.lambda_function_name}-logs"
  role   = aws_iam_role.lead_api.id
  policy = data.aws_iam_policy_document.lead_api_logs.json
}

data "aws_iam_policy_document" "lead_table_write" {
  statement {
    effect = "Allow"

    actions = [
      "dynamodb:PutItem",
    ]

    resources = [aws_dynamodb_table.leads.arn]
  }
}

resource "aws_iam_role_policy" "lead_table_write" {
  name   = "${var.lambda_function_name}-dynamodb-put-item"
  role   = aws_iam_role.lead_api.id
  policy = data.aws_iam_policy_document.lead_table_write.json
}

data "aws_iam_policy_document" "lead_notification_send" {
  statement {
    effect = "Allow"

    actions = [
      "ses:SendEmail",
    ]

    resources = [aws_ses_domain_identity.lead_notifications.arn]
  }
}

resource "aws_iam_role_policy" "lead_notification_send" {
  name   = "${var.lambda_function_name}-ses-send-email"
  role   = aws_iam_role.lead_api.id
  policy = data.aws_iam_policy_document.lead_notification_send.json
}

resource "aws_lambda_function" "lead_api" {
  function_name                  = var.lambda_function_name
  description                    = "Receives and persists jonathanvaldes.com lead form submissions."
  role                           = aws_iam_role.lead_api.arn
  runtime                        = var.lambda_runtime
  handler                        = "handler.lambda_handler"
  filename                       = var.lambda_package_path
  source_code_hash               = filebase64sha256(var.lambda_package_path)
  reserved_concurrent_executions = var.lead_reserved_concurrent_executions

  environment {
    variables = {
      LEADS_TABLE_NAME       = aws_dynamodb_table.leads.name
      LEAD_NOTIFICATION_TO   = var.lead_notification_to
      LEAD_NOTIFICATION_FROM = var.lead_notification_from
      ALLOWED_ORIGINS        = join(",", var.allowed_origins)
      ENVIRONMENT            = var.environment
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.lead_api,
    aws_iam_role_policy.lead_api_logs,
  ]

  tags = local.common_tags
}

resource "aws_lambda_function_url" "lead_api" {
  function_name      = aws_lambda_function.lead_api.function_name
  authorization_type = "NONE"

  cors {
    allow_headers = ["content-type"]
    allow_methods = ["POST"]
    allow_origins = var.allowed_origins
    max_age       = 300
  }
  lifecycle {
    precondition {
      condition = var.environment != "production" || alltrue([
        for origin in var.allowed_origins :
        !can(regex("^https?://(localhost|127\\.0\\.0\\.1|\\[::1\\])", origin))
      ])
      error_message = "production allowed_origins must not include localhost or loopback origins."
    }
  }
}

resource "aws_iam_role" "booking_api" {
  name               = "${var.booking_lambda_function_name}-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "booking_api_logs" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["${aws_cloudwatch_log_group.booking_api.arn}:*"]
  }
}

resource "aws_iam_role_policy" "booking_api_logs" {
  name   = "${var.booking_lambda_function_name}-logs"
  role   = aws_iam_role.booking_api.id
  policy = data.aws_iam_policy_document.booking_api_logs.json
}

data "aws_iam_policy_document" "booking_google_secret_read" {
  statement {
    effect = "Allow"

    actions = [
      "secretsmanager:GetSecretValue",
    ]

    resources = [var.booking_google_secret_arn]
  }
}

resource "aws_iam_role_policy" "booking_google_secret_read" {
  name   = "${var.booking_lambda_function_name}-google-secret-read"
  role   = aws_iam_role.booking_api.id
  policy = data.aws_iam_policy_document.booking_google_secret_read.json
}

resource "aws_lambda_function" "booking_api" {
  function_name                  = var.booking_lambda_function_name
  description                    = "Provides jonathanvaldes.com booking availability and Google Calendar event creation."
  role                           = aws_iam_role.booking_api.arn
  runtime                        = var.lambda_runtime
  handler                        = "handler.lambda_handler"
  filename                       = var.booking_lambda_package_path
  source_code_hash               = filebase64sha256(var.booking_lambda_package_path)
  reserved_concurrent_executions = var.booking_reserved_concurrent_executions

  environment {
    variables = {
      BOOKING_GOOGLE_SECRET_ARN = var.booking_google_secret_arn
      ALLOWED_ORIGINS           = join(",", var.allowed_origins)
      ENVIRONMENT               = var.environment
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.booking_api,
    aws_iam_role_policy.booking_api_logs,
  ]

  tags = local.common_tags
}

resource "aws_lambda_function_url" "booking_api" {
  function_name      = aws_lambda_function.booking_api.function_name
  authorization_type = "NONE"

  cors {
    allow_headers = ["content-type"]
    allow_methods = ["POST"]
    allow_origins = var.allowed_origins
    max_age       = 300
  }
  lifecycle {
    precondition {
      condition = var.environment != "production" || alltrue([
        for origin in var.allowed_origins :
        !can(regex("^https?://(localhost|127\\.0\\.0\\.1|\\[::1\\])", origin))
      ])
      error_message = "production allowed_origins must not include localhost or loopback origins."
    }
  }
}
