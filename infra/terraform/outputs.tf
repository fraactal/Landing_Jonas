output "lead_api_function_url" {
  description = "Public Lambda Function URL for the lead API. Do not treat this URL as a secret."
  value       = aws_lambda_function_url.lead_api.function_url
}

output "leads_table_name" {
  description = "DynamoDB table used to persist leads."
  value       = aws_dynamodb_table.leads.name
}