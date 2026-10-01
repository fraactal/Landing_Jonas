locals {
  observability_alarm_actions = var.enable_alerting && var.environment == "production" ? [aws_sns_topic.alerts.arn] : []

  lead_invalid_request_filters = {
    validation        = "lead_validation_failed"
    media_type        = "lead_unsupported_media_type"
    body_decode       = "lead_body_decode_failed"
    payload_too_large = "lead_payload_too_large"
  }

  booking_invalid_request_filters = {
    validation        = "booking_validation_failed"
    media_type        = "booking_unsupported_media_type"
    body_decode       = "booking_body_decode_failed"
    payload_too_large = "booking_payload_too_large"
  }

  booking_calendar_failure_filters = {
    calendar = "booking_calendar_failed"
    auth     = "booking_auth_failed"
  }
}

resource "aws_sns_topic" "alerts" {
  name = var.alerts_topic_name

  tags = merge(local.common_tags, {
    Module = "observability"
  })
}

resource "aws_sns_topic_subscription" "alerts_email" {
  count     = var.alerts_email == "" ? 0 : 1
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alerts_email
}

resource "aws_cloudwatch_log_metric_filter" "lead_created" {
  name           = "${var.lambda_function_name}-lead-created"
  log_group_name = aws_cloudwatch_log_group.lead_api.name
  pattern        = "lead_created"

  metric_transformation {
    name      = "LeadsCreated"
    namespace = var.observability_namespace
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "lead_invalid_requests" {
  for_each       = local.lead_invalid_request_filters
  name           = "${var.lambda_function_name}-${replace(each.value, "_", "-")}"
  log_group_name = aws_cloudwatch_log_group.lead_api.name
  pattern        = each.value

  metric_transformation {
    name      = "LeadInvalidRequests"
    namespace = var.observability_namespace
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "lead_honeypot_triggered" {
  name           = "${var.lambda_function_name}-lead-honeypot-triggered"
  log_group_name = aws_cloudwatch_log_group.lead_api.name
  pattern        = "lead_honeypot_triggered"

  metric_transformation {
    name      = "LeadHoneypotTriggered"
    namespace = var.observability_namespace
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "lead_dynamodb_write_failures" {
  name           = "${var.lambda_function_name}-dynamodb-write-failed"
  log_group_name = aws_cloudwatch_log_group.lead_api.name
  pattern        = "dynamodb_write_failed"

  metric_transformation {
    name      = "LeadDynamoDbWriteFailures"
    namespace = var.observability_namespace
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "lead_notification_failures" {
  name           = "${var.lambda_function_name}-lead-notification-failed"
  log_group_name = aws_cloudwatch_log_group.lead_api.name
  pattern        = "lead_notification_failed"

  metric_transformation {
    name      = "LeadNotificationFailures"
    namespace = var.observability_namespace
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "booking_created" {
  name           = "${var.booking_lambda_function_name}-booking-created"
  log_group_name = aws_cloudwatch_log_group.booking_api.name
  pattern        = "booking_created"

  metric_transformation {
    name      = "BookingsCreated"
    namespace = var.observability_namespace
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "booking_invalid_requests" {
  for_each       = local.booking_invalid_request_filters
  name           = "${var.booking_lambda_function_name}-${replace(each.value, "_", "-")}"
  log_group_name = aws_cloudwatch_log_group.booking_api.name
  pattern        = each.value

  metric_transformation {
    name      = "BookingInvalidRequests"
    namespace = var.observability_namespace
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "booking_honeypot_triggered" {
  name           = "${var.booking_lambda_function_name}-booking-honeypot-triggered"
  log_group_name = aws_cloudwatch_log_group.booking_api.name
  pattern        = "booking_honeypot_triggered"

  metric_transformation {
    name      = "BookingHoneypotTriggered"
    namespace = var.observability_namespace
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "booking_slot_unavailable" {
  name           = "${var.booking_lambda_function_name}-booking-slot-unavailable"
  log_group_name = aws_cloudwatch_log_group.booking_api.name
  pattern        = "booking_slot_unavailable"

  metric_transformation {
    name      = "BookingSlotUnavailable"
    namespace = var.observability_namespace
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "booking_calendar_auth_failures" {
  for_each       = local.booking_calendar_failure_filters
  name           = "${var.booking_lambda_function_name}-${replace(each.value, "_", "-")}"
  log_group_name = aws_cloudwatch_log_group.booking_api.name
  pattern        = each.value

  metric_transformation {
    name      = "BookingCalendarAuthFailures"
    namespace = var.observability_namespace
    value     = "1"
  }
}

resource "aws_cloudwatch_metric_alarm" "lead_lambda_errors" {
  alarm_name          = "${var.lambda_function_name}-errors"
  alarm_description   = "[WARNING] Lead API has unhandled Lambda errors. Inspect sanitized CloudWatch logs; do not add PII to diagnostics."
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  statistic           = "Sum"
  period              = var.lambda_alarm_period_seconds
  evaluation_periods  = 1
  threshold           = var.lambda_error_threshold
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  actions_enabled     = var.enable_alerting && var.environment == "production"
  alarm_actions       = local.observability_alarm_actions
  ok_actions          = local.observability_alarm_actions

  dimensions = {
    FunctionName = aws_lambda_function.lead_api.function_name
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "lead_lambda_throttles" {
  alarm_name          = "${var.lambda_function_name}-throttles"
  alarm_description   = "[WARNING] Lead API is throttling. Review reserved concurrency, request volume and abuse indicators."
  namespace           = "AWS/Lambda"
  metric_name         = "Throttles"
  statistic           = "Sum"
  period              = var.lambda_alarm_period_seconds
  evaluation_periods  = 2
  threshold           = var.throttle_threshold
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  actions_enabled     = var.enable_alerting && var.environment == "production"
  alarm_actions       = local.observability_alarm_actions
  ok_actions          = local.observability_alarm_actions

  dimensions = {
    FunctionName = aws_lambda_function.lead_api.function_name
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "booking_lambda_errors" {
  alarm_name          = "${var.booking_lambda_function_name}-errors"
  alarm_description   = "[WARNING] Booking API has unhandled Lambda errors. Inspect sanitized CloudWatch logs; do not add PII to diagnostics."
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  statistic           = "Sum"
  period              = var.lambda_alarm_period_seconds
  evaluation_periods  = 1
  threshold           = var.lambda_error_threshold
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  actions_enabled     = var.enable_alerting && var.environment == "production"
  alarm_actions       = local.observability_alarm_actions
  ok_actions          = local.observability_alarm_actions

  dimensions = {
    FunctionName = aws_lambda_function.booking_api.function_name
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "booking_lambda_throttles" {
  alarm_name          = "${var.booking_lambda_function_name}-throttles"
  alarm_description   = "[WARNING] Booking API is throttling. Review reserved concurrency, Calendar latency, request volume and abuse indicators."
  namespace           = "AWS/Lambda"
  metric_name         = "Throttles"
  statistic           = "Sum"
  period              = var.lambda_alarm_period_seconds
  evaluation_periods  = 2
  threshold           = var.throttle_threshold
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  actions_enabled     = var.enable_alerting && var.environment == "production"
  alarm_actions       = local.observability_alarm_actions
  ok_actions          = local.observability_alarm_actions

  dimensions = {
    FunctionName = aws_lambda_function.booking_api.function_name
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "lead_persistence_failures" {
  alarm_name          = "${var.lambda_function_name}-dynamodb-write-failures"
  alarm_description   = "[CRITICAL] Lead persistence failed before the lead was stored. Review Lead Lambda logs, DynamoDB table, IAM PutItem and regional AWS health."
  namespace           = var.observability_namespace
  metric_name         = "LeadDynamoDbWriteFailures"
  statistic           = "Sum"
  period              = var.lambda_alarm_period_seconds
  evaluation_periods  = 1
  threshold           = var.persistence_failure_threshold
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  actions_enabled     = var.enable_alerting && var.environment == "production"
  alarm_actions       = local.observability_alarm_actions
  ok_actions          = local.observability_alarm_actions

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "lead_notification_failures" {
  alarm_name          = "${var.lambda_function_name}-notification-failures"
  alarm_description   = "[WARNING] Lead was stored but internal SES notification failed. Review SES identity, sandbox or production access, sender, recipient and Lambda logs."
  namespace           = var.observability_namespace
  metric_name         = "LeadNotificationFailures"
  statistic           = "Sum"
  period              = var.notification_alarm_period_seconds
  evaluation_periods  = 1
  threshold           = var.notification_failure_threshold
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  actions_enabled     = var.enable_alerting && var.environment == "production"
  alarm_actions       = local.observability_alarm_actions
  ok_actions          = local.observability_alarm_actions

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "booking_calendar_auth_failures" {
  alarm_name          = "${var.booking_lambda_function_name}-calendar-auth-failures"
  alarm_description   = "[CRITICAL] Booking Calendar/OAuth integration is failing. Review Secrets Manager, refresh token, OAuth client, calendar permissions and Google Calendar API status."
  namespace           = var.observability_namespace
  metric_name         = "BookingCalendarAuthFailures"
  statistic           = "Sum"
  period              = var.notification_alarm_period_seconds
  evaluation_periods  = 1
  threshold           = var.booking_calendar_auth_failure_threshold
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  actions_enabled     = var.enable_alerting && var.environment == "production"
  alarm_actions       = local.observability_alarm_actions
  ok_actions          = local.observability_alarm_actions

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "invalid_or_honeypot_traffic" {
  alarm_name          = "jonathanvaldes-invalid-or-honeypot-traffic"
  alarm_description   = "[WARNING] Invalid or honeypot traffic increased. Review aggregate request patterns and cost impact without logging PII."
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  threshold           = var.invalid_traffic_threshold
  treat_missing_data  = "notBreaching"
  actions_enabled     = var.enable_alerting && var.environment == "production"
  alarm_actions       = local.observability_alarm_actions
  ok_actions          = local.observability_alarm_actions

  metric_query {
    id          = "total_invalid"
    expression  = "lead_invalid + booking_invalid + lead_honeypot + booking_honeypot"
    label       = "InvalidOrHoneypotTraffic"
    return_data = true
  }

  metric_query {
    id = "lead_invalid"

    metric {
      metric_name = "LeadInvalidRequests"
      namespace   = var.observability_namespace
      period      = var.lambda_alarm_period_seconds
      stat        = "Sum"
    }
  }

  metric_query {
    id = "booking_invalid"

    metric {
      metric_name = "BookingInvalidRequests"
      namespace   = var.observability_namespace
      period      = var.lambda_alarm_period_seconds
      stat        = "Sum"
    }
  }

  metric_query {
    id = "lead_honeypot"

    metric {
      metric_name = "LeadHoneypotTriggered"
      namespace   = var.observability_namespace
      period      = var.lambda_alarm_period_seconds
      stat        = "Sum"
    }
  }

  metric_query {
    id = "booking_honeypot"

    metric {
      metric_name = "BookingHoneypotTriggered"
      namespace   = var.observability_namespace
      period      = var.lambda_alarm_period_seconds
      stat        = "Sum"
    }
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_dashboard" "website" {
  dashboard_name = var.observability_dashboard_name

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title   = "Lead Lambda traffic and failures"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", aws_lambda_function.lead_api.function_name],
            [".", "Errors", ".", "."],
            [".", "Throttles", ".", "."]
          ]
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title   = "Lead Lambda duration"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          metrics = [
            ["AWS/Lambda", "Duration", "FunctionName", aws_lambda_function.lead_api.function_name, { stat = "Average" }],
            [".", ".", ".", ".", { stat = "p95" }]
          ]
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          title   = "Booking Lambda traffic and failures"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", aws_lambda_function.booking_api.function_name],
            [".", "Errors", ".", "."],
            [".", "Throttles", ".", "."]
          ]
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          title   = "Booking Lambda duration"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          metrics = [
            ["AWS/Lambda", "Duration", "FunctionName", aws_lambda_function.booking_api.function_name, { stat = "Average" }],
            [".", ".", ".", ".", { stat = "p95" }]
          ]
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6
        properties = {
          title   = "Business signals"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          metrics = [
            [var.observability_namespace, "LeadsCreated"],
            [".", "BookingsCreated"],
            [".", "BookingSlotUnavailable"]
          ]
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 12
        width  = 12
        height = 6
        properties = {
          title   = "Failure and abuse signals"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          metrics = [
            [var.observability_namespace, "LeadDynamoDbWriteFailures"],
            [".", "LeadNotificationFailures"],
            [".", "BookingCalendarAuthFailures"],
            [".", "LeadInvalidRequests"],
            [".", "BookingInvalidRequests"],
            [".", "LeadHoneypotTriggered"],
            [".", "BookingHoneypotTriggered"]
          ]
        }
      }
    ]
  })
}