import re
from typing import Any

MAX_PAYLOAD_BYTES = 32 * 1024
MAX_NAME_LENGTH = 120
MAX_COMPANY_LENGTH = 160
MAX_EMAIL_LENGTH = 180
MAX_PHONE_LENGTH = 40
MAX_MESSAGE_LENGTH = 2000
MIN_MESSAGE_LENGTH = 10

ALLOWED_FIELDS = {
    "action",
    "name",
    "company",
    "email",
    "phone",
    "problemType",
    "message",
    "privacyAccepted",
    "source",
    "sourceContext",
    "website",
}

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

ALLOWED_SOURCE_CONTEXTS = {
    "hero",
    "problem-selector",
    "poc",
    "final-cta",
    "form",
}

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class ValidationError(Exception):
    """Raised when the public lead request does not match the closed contract."""


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


def validate_lead_payload(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValidationError("invalid_payload")

    unexpected_fields = set(payload) - ALLOWED_FIELDS
    if unexpected_fields:
        raise ValidationError("unexpected_fields")

    if payload.get("action") != "createLead":
        raise ValidationError("invalid_action")

    website = _trimmed_string(payload.get("website"), required=False, max_length=2000)
    if website:
        raise ValidationError("invalid_request")

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

    if not EMAIL_PATTERN.match(email or ""):
        raise ValidationError("invalid_email")

    problem_type = payload.get("problemType")
    if not isinstance(problem_type, str) or problem_type not in ALLOWED_PROBLEM_TYPES:
        raise ValidationError("invalid_problem_type")

    source = payload.get("source")
    if source != "website":
        raise ValidationError("invalid_source")

    source_context = payload.get("sourceContext")
    if not isinstance(source_context, str) or source_context not in ALLOWED_SOURCE_CONTEXTS:
        raise ValidationError("invalid_source_context")

    if payload.get("privacyAccepted") is not True:
        raise ValidationError("privacy_required")

    normalized: dict[str, Any] = {
        "name": name,
        "email": email,
        "problemType": problem_type,
        "message": message,
        "privacyAccepted": True,
        "source": source,
        "sourceContext": source_context,
    }

    if company:
        normalized["company"] = company
    if phone:
        normalized["phone"] = phone

    return normalized