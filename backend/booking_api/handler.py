import base64
import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any

from availability import (
    DEFAULT_CONFIG,
    compute_available_slots,
    is_slot_available,
    utc_now,
)
from google_calendar import CalendarAuthError, CalendarClientError, GoogleCalendarClient, load_google_oauth_config
from validation import MAX_PAYLOAD_BYTES, ValidationError, validate_booking_payload, validate_get_availability_payload

DEFAULT_ALLOWED_ORIGINS = "https://jonathanvaldes.com"
_calendar_client = None


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


def _request_id(context: Any) -> str:
    return getattr(context, "aws_request_id", "unknown")


def _get_calendar_client() -> GoogleCalendarClient:
    global _calendar_client
    if _calendar_client is None:
        _calendar_client = GoogleCalendarClient(load_google_oauth_config())
    return _calendar_client


def _safe_client_request_id(value: str | None) -> str:
    return value or str(uuid.uuid4())


def _availability_response(client: GoogleCalendarClient, now: datetime) -> dict[str, Any]:
    horizon_end = DEFAULT_CONFIG.horizon_end(now)
    busy = client.get_busy_intervals(now, horizon_end)
    slots = compute_available_slots(busy, now=now, config=DEFAULT_CONFIG)
    return {
        "ok": True,
        "timezone": DEFAULT_CONFIG.timezone_name,
        "durationMinutes": DEFAULT_CONFIG.duration_minutes,
        "slots": [
            {
                "startAt": slot.start_at_iso,
                "endAt": slot.end_at_iso,
                "displayDate": slot.display_date,
                "displayTime": slot.display_time,
            }
            for slot in slots
        ],
    }


def _extract_meet_url(event: dict[str, Any]) -> tuple[str | None, str]:
    conference_data = event.get("conferenceData") or {}
    create_request = conference_data.get("createRequest") or {}
    status = create_request.get("status") or {}
    status_code = status.get("statusCode") or "unknown"

    for entry_point in conference_data.get("entryPoints") or []:
        if entry_point.get("entryPointType") == "video" and entry_point.get("uri"):
            return entry_point["uri"], "success"

    if status_code == "success":
        return conference_data.get("hangoutLink") or event.get("hangoutLink"), "success"

    if status_code == "pending":
        return None, "pending"

    return None, status_code


def _handle_get_availability(payload: Any, client: GoogleCalendarClient, request_id: str, origin: str | None) -> dict[str, Any]:
    validate_get_availability_payload(payload)
    now = utc_now()
    print(f"booking_availability_requested request_id={request_id}")
    body = _availability_response(client, now)
    return _response(200, body, origin=origin)


def _handle_create_booking(payload: Any, client: GoogleCalendarClient, request_id: str, origin: str | None) -> dict[str, Any]:
    booking = validate_booking_payload(payload, config=DEFAULT_CONFIG)
    now = utc_now()

    if not DEFAULT_CONFIG.is_allowed_start(booking["startAtDateTime"], now=now):
        print(f"booking_slot_unavailable request_id={request_id}")
        return _response(409, {"ok": False, "error": "slot_unavailable"}, origin=origin)

    recheck_start, recheck_end = DEFAULT_CONFIG.buffered_interval(booking["startAtDateTime"], booking["endAtDateTime"])
    busy = client.get_busy_intervals(recheck_start, recheck_end)
    if not is_slot_available(booking["startAtDateTime"], booking["endAtDateTime"], busy, config=DEFAULT_CONFIG):
        print(f"booking_slot_unavailable request_id={request_id}")
        return _response(409, {"ok": False, "error": "slot_unavailable"}, origin=origin)

    client_request_id = _safe_client_request_id(booking.get("clientRequestId"))
    try:
        event = client.create_booking_event(
            booking=booking,
            duration_minutes=DEFAULT_CONFIG.duration_minutes,
            client_request_id=client_request_id,
        )
    except CalendarClientError:
        print(f"booking_calendar_failed request_id={request_id}")
        return _response(502, {"ok": False, "error": "calendar_unavailable"}, origin=origin)

    meet_url, meet_status = _extract_meet_url(event)
    if meet_status == "pending":
        try:
            event = client.get_event(event.get("id"))
            meet_url, meet_status = _extract_meet_url(event)
        except CalendarClientError:
            meet_url = None
            meet_status = "pending"

    booking_id = event.get("id") or client_request_id
    print(f"booking_created request_id={request_id} booking_id={booking_id}")

    return _response(
        201,
        {
            "ok": True,
            "bookingId": booking_id,
            "startAt": DEFAULT_CONFIG.to_utc_iso(booking["startAtDateTime"]),
            "endAt": DEFAULT_CONFIG.to_utc_iso(booking["endAtDateTime"]),
            "timezone": DEFAULT_CONFIG.timezone_name,
            "meetStatus": "success" if meet_url else "pending",
            "meetUrl": meet_url,
        },
        origin=origin,
    )


def lambda_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    request_id = _request_id(context)
    origin = _origin_from(event)
    method = _method_from(event)

    if method == "OPTIONS":
        return _response(204, None, origin=origin)

    if method != "POST":
        print(f"booking_method_not_allowed request_id={request_id}")
        return _response(405, {"ok": False, "error": "method_not_allowed"}, origin=origin)

    if not _has_json_content_type(event):
        print(f"booking_validation_failed request_id={request_id}")
        return _response(400, {"ok": False, "error": "invalid_request"}, origin=origin)

    try:
        raw_body = _body_bytes(event)
    except Exception:
        print(f"booking_body_decode_failed request_id={request_id}")
        return _response(400, {"ok": False, "error": "invalid_request"}, origin=origin)

    if len(raw_body) > MAX_PAYLOAD_BYTES:
        print(f"booking_payload_too_large request_id={request_id}")
        return _response(413, {"ok": False, "error": "payload_too_large"}, origin=origin)

    try:
        payload = json.loads(raw_body.decode("utf-8"))
        action = payload.get("action") if isinstance(payload, dict) else None
    except (UnicodeDecodeError, json.JSONDecodeError):
        print(f"booking_validation_failed request_id={request_id}")
        return _response(400, {"ok": False, "error": "invalid_request"}, origin=origin)

    if isinstance(payload, dict) and str(payload.get("website", "")).strip():
        print(f"booking_validation_failed request_id={request_id}")
        return _response(400, {"ok": False, "error": "invalid_request"}, origin=origin)

    try:
        client = _get_calendar_client()
    except CalendarAuthError:
        print(f"booking_auth_failed request_id={request_id}")
        return _response(500, {"ok": False, "error": "internal_error"}, origin=origin)

    try:
        if action == "getAvailability":
            return _handle_get_availability(payload, client, request_id, origin)
        if action == "createBooking":
            return _handle_create_booking(payload, client, request_id, origin)
    except ValidationError:
        print(f"booking_validation_failed request_id={request_id}")
        return _response(400, {"ok": False, "error": "invalid_request"}, origin=origin)
    except CalendarAuthError:
        print(f"booking_auth_failed request_id={request_id}")
        return _response(500, {"ok": False, "error": "internal_error"}, origin=origin)
    except CalendarClientError:
        print(f"booking_calendar_failed request_id={request_id}")
        return _response(502, {"ok": False, "error": "calendar_unavailable"}, origin=origin)

    print(f"booking_validation_failed request_id={request_id}")
    return _response(400, {"ok": False, "error": "invalid_request"}, origin=origin)