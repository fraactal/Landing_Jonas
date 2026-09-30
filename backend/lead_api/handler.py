import base64
import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any

from validation import MAX_PAYLOAD_BYTES, ValidationError, validate_lead_payload

DEFAULT_ALLOWED_ORIGINS = "https://jonathanvaldes.com"
_table = None


def _allowed_origins() -> set[str]:
    raw_origins = os.environ.get("ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS)
    return {origin.strip() for origin in raw_origins.split(",") if origin.strip()}


def _header_value(event: dict[str, Any], name: str) -> str | None:
    headers = event.get("headers") or {}
    for key, value in headers.items():
        if key.lower() == name.lower():
            return value
    return None


def _origin_from(event: dict[str, Any]) -> str | None:
    return _header_value(event, "origin")


def _has_json_content_type(event: dict[str, Any]) -> bool:
    content_type = _header_value(event, "content-type") or ""
    return "application/json" in content_type.lower()

def _response(status_code: int, body: dict[str, Any] | None = None, *, origin: str | None = None) -> dict[str, Any]:
    headers = {
        "Content-Type": "application/json",
        "Vary": "Origin",
    }

    if origin and origin in _allowed_origins():
        headers.update(
            {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST,OPTIONS",
            }
        )

    return {
        "statusCode": status_code,
        "headers": headers,
        "body": "" if body is None else json.dumps(body, ensure_ascii=False),
    }


def _method_from(event: dict[str, Any]) -> str:
    request_context = event.get("requestContext") or {}
    http_context = request_context.get("http") or {}
    return (http_context.get("method") or event.get("httpMethod") or "").upper()


def _body_bytes(event: dict[str, Any]) -> bytes:
    body = event.get("body") or ""
    if event.get("isBase64Encoded"):
        return base64.b64decode(body)
    return body.encode("utf-8")


def _table_name() -> str:
    table_name = os.environ.get("LEADS_TABLE_NAME")
    if not table_name:
        raise RuntimeError("LEADS_TABLE_NAME is not configured")
    return table_name


def _get_table():
    global _table
    if _table is None:
        import boto3

        _table = boto3.resource("dynamodb").Table(_table_name())
    return _table


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _request_id(context: Any) -> str:
    return getattr(context, "aws_request_id", "unknown")


def lambda_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    request_id = _request_id(context)
    origin = _origin_from(event)
    method = _method_from(event)

    if method == "OPTIONS":
        return _response(204, None, origin=origin)

    if method != "POST":
        print(f"lead_method_not_allowed request_id={request_id}")
        return _response(405, {"ok": False, "error": "method_not_allowed"}, origin=origin)

    if not _has_json_content_type(event):
        print(f"lead_validation_failed request_id={request_id}")
        return _response(400, {"ok": False, "error": "invalid_request"}, origin=origin)

    try:
        raw_body = _body_bytes(event)
    except Exception:
        print(f"lead_body_decode_failed request_id={request_id}")
        return _response(400, {"ok": False, "error": "invalid_request"}, origin=origin)

    if len(raw_body) > MAX_PAYLOAD_BYTES:
        print(f"lead_payload_too_large request_id={request_id}")
        return _response(413, {"ok": False, "error": "payload_too_large"}, origin=origin)

    try:
        payload = json.loads(raw_body.decode("utf-8"))
        lead_data = validate_lead_payload(payload)
    except (UnicodeDecodeError, json.JSONDecodeError, ValidationError):
        print(f"lead_validation_failed request_id={request_id}")
        return _response(400, {"ok": False, "error": "invalid_request"}, origin=origin)

    lead_id = str(uuid.uuid4())
    item = {
        "leadId": lead_id,
        "createdAt": _utc_now_iso(),
        "status": "NEW",
        **lead_data,
    }

    try:
        _get_table().put_item(
            Item=item,
            ConditionExpression="attribute_not_exists(leadId)",
        )
    except Exception:
        print(f"dynamodb_write_failed request_id={request_id}")
        return _response(500, {"ok": False, "error": "internal_error"}, origin=origin)

    print(f"lead_created request_id={request_id} lead_id={lead_id}")
    return _response(201, {"ok": True, "leadId": lead_id, "status": "NEW"}, origin=origin)