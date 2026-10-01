import re
from datetime import datetime, timezone
from typing import Any

MAX_PAYLOAD_BYTES = 32 * 1024
MAX_NAME_LENGTH = 120
MAX_COMPANY_LENGTH = 160
MAX_EMAIL_LENGTH = 180
MAX_PHONE_LENGTH = 40
MAX_MESSAGE_LENGTH = 2000
MIN_MESSAGE_LENGTH = 10
MAX_CLIENT_REQUEST_ID_LENGTH = 120

ALLOWED_PROBLEM_TYPES = {
    "Automatizar un proceso",
    "Crear una aplicación",
    "Conectar sistemas",
    "Trabajar con mis datos",
    "Mejorar infraestructura",
    "Mejorar calidad",
    "Mejorar monitoreo / visibilidad",
    "No estoy seguro",
    "Otro",
}

GET_AVAILABILITY_FIELDS = {"action", "website"}
CREATE_BOOKING_FIELDS = {
    "action",
    "name",
    "company",
    "email",
    "phone",
    "problemType",
    "message",
    "startAt",
    "privacyAccepted",
    "source",
    "clientRequestId",
    "website",
}

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
UTC_Z_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")
CLIENT_REQUEST_ID_PATTERN = re.compile(r"^[A-Za-z0-9_.:-]{8,120}$")


class ValidationError(Exception):
    """Raised when the public booking request does not match the closed contract."""


def _trimmed_string(value: Any, *, required: bool, max_length: int, min_length: int = 0) -> str | None:
    if value is None:
        if required:
            raise ValidationError("required")
        return None

    if not isinstance(value, str):
        raise ValidationError("invalid_type")

    trimmed = value.strip()
    if required and not trimmed:
        raise ValidationError("required")

    if trimmed and len(trimmed) < min_length:
        raise ValidationError("too_short")

    if len(trimmed) > max_length:
        raise ValidationError("too_long")

    return trimmed or None


def _validate_honeypot(payload: dict[str, Any]) -> None:
    website = _trimmed_string(payload.get("website"), required=False, max_length=2000)
    if website:
        raise ValidationError("invalid_request")


def _parse_utc_start(value: Any) -> datetime:
    if not isinstance(value, str) or not UTC_Z_PATTERN.match(value):
        raise ValidationError("invalid_start")

    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValidationError("invalid_start") from exc

    if parsed.tzinfo != timezone.utc:
        raise ValidationError("invalid_start")

    return parsed


def validate_get_availability_payload(payload: Any) -> None:
    if not isinstance(payload, dict):
        raise ValidationError("invalid_payload")

    if set(payload) - GET_AVAILABILITY_FIELDS:
        raise ValidationError("unexpected_fields")

    if payload.get("action") != "getAvailability":
        raise ValidationError("invalid_action")

    _validate_honeypot(payload)


def validate_booking_payload(payload: Any, *, config) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValidationError("invalid_payload")

    if set(payload) - CREATE_BOOKING_FIELDS:
        raise ValidationError("unexpected_fields")

    if payload.get("action") != "createBooking":
        raise ValidationError("invalid_action")

    _validate_honeypot(payload)

    name = _trimmed_string(payload.get("name"), required=True, max_length=MAX_NAME_LENGTH)
    company = _trimmed_string(payload.get("company"), required=False, max_length=MAX_COMPANY_LENGTH)
    email = _trimmed_string(payload.get("email"), required=True, max_length=MAX_EMAIL_LENGTH)
    phone = _trimmed_string(payload.get("phone"), required=False, max_length=MAX_PHONE_LENGTH)
    message = _trimmed_string(
        payload.get("message"),
        required=True,
        max_length=MAX_MESSAGE_LENGTH,
        min_length=MIN_MESSAGE_LENGTH,
    )
    client_request_id = _trimmed_string(
        payload.get("clientRequestId"),
        required=False,
        max_length=MAX_CLIENT_REQUEST_ID_LENGTH,
        min_length=8,
    )

    if client_request_id and not CLIENT_REQUEST_ID_PATTERN.match(client_request_id):
        raise ValidationError("invalid_client_request_id")

    if not EMAIL_PATTERN.match(email or ""):
        raise ValidationError("invalid_email")

    problem_type = payload.get("problemType")
    if not isinstance(problem_type, str) or problem_type not in ALLOWED_PROBLEM_TYPES:
        raise ValidationError("invalid_problem_type")

    if payload.get("privacyAccepted") is not True:
        raise ValidationError("privacy_required")

    if payload.get("source") != "website":
        raise ValidationError("invalid_source")

    start_at = _parse_utc_start(payload.get("startAt"))
    end_at = start_at + config.duration

    normalized: dict[str, Any] = {
        "name": name,
        "email": email,
        "problemType": problem_type,
        "message": message,
        "startAtDateTime": start_at,
        "endAtDateTime": end_at,
        "privacyAccepted": True,
        "source": "website",
    }

    if company:
        normalized["company"] = company
    if phone:
        normalized["phone"] = phone
    if client_request_id:
        normalized["clientRequestId"] = client_request_id

    return normalized