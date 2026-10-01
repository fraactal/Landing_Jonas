import json
import os
import urllib.error
import urllib.parse
import urllib.request
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from availability import BusyInterval, parse_google_datetime, to_utc_iso

TOKEN_URL = "https://oauth2.googleapis.com/token"
CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3"
SCOPES = (
    "https://www.googleapis.com/auth/calendar.freebusy",
    "https://www.googleapis.com/auth/calendar.events",
)


class CalendarAuthError(Exception):
    """Raised when OAuth/secret configuration cannot produce a usable token."""


class CalendarClientError(Exception):
    """Raised when Google Calendar operations fail."""


@dataclass(frozen=True)
class GoogleOAuthConfig:
    client_id: str
    client_secret: str
    refresh_token: str
    calendar_id: str


def _read_secret_from_aws(secret_arn: str) -> dict[str, Any]:
    import boto3

    client = boto3.client("secretsmanager")
    response = client.get_secret_value(SecretId=secret_arn)
    secret_string = response.get("SecretString")
    if not secret_string:
        raise CalendarAuthError("SecretString is empty")
    return json.loads(secret_string)


def load_google_oauth_config() -> GoogleOAuthConfig:
    raw_json = os.environ.get("BOOKING_GOOGLE_OAUTH_CONFIG")
    secret_arn = os.environ.get("BOOKING_GOOGLE_SECRET_ARN")

    if raw_json:
        try:
            payload = json.loads(raw_json)
        except json.JSONDecodeError as exc:
            raise CalendarAuthError("Invalid BOOKING_GOOGLE_OAUTH_CONFIG") from exc
    elif secret_arn:
        payload = _read_secret_from_aws(secret_arn)
    else:
        raise CalendarAuthError("Missing Google OAuth configuration")

    try:
        config = GoogleOAuthConfig(
            client_id=str(payload["client_id"]).strip(),
            client_secret=str(payload["client_secret"]).strip(),
            refresh_token=str(payload["refresh_token"]).strip(),
            calendar_id=str(payload["calendar_id"]).strip(),
        )
    except KeyError as exc:
        raise CalendarAuthError("Incomplete Google OAuth configuration") from exc

    if not all((config.client_id, config.client_secret, config.refresh_token, config.calendar_id)):
        raise CalendarAuthError("Empty Google OAuth configuration value")

    return config


class GoogleCalendarClient:
    def __init__(self, config: GoogleOAuthConfig):
        self.config = config
        self._access_token: str | None = None

    def _json_request(self, url: str, *, method: str = "POST", body: dict[str, Any] | None = None, token: str | None = None) -> dict[str, Any]:
        data = None if body is None else json.dumps(body).encode("utf-8")
        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        request = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(request, timeout=8) as response:
                payload = response.read().decode("utf-8")
                return json.loads(payload) if payload else {}
        except urllib.error.HTTPError as exc:
            if exc.code in (401, 403):
                raise CalendarAuthError("Google auth failed") from exc
            raise CalendarClientError("Google Calendar request failed") from exc
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise CalendarClientError("Google Calendar request failed") from exc

    def _form_request(self, url: str, body: dict[str, str]) -> dict[str, Any]:
        encoded = urllib.parse.urlencode(body).encode("utf-8")
        request = urllib.request.Request(
            url,
            data=encoded,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=8) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            raise CalendarAuthError("Google token refresh failed") from exc
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise CalendarAuthError("Google token refresh failed") from exc

    def _token(self) -> str:
        if self._access_token:
            return self._access_token

        response = self._form_request(
            TOKEN_URL,
            {
                "client_id": self.config.client_id,
                "client_secret": self.config.client_secret,
                "refresh_token": self.config.refresh_token,
                "grant_type": "refresh_token",
            },
        )
        token = response.get("access_token")
        if not isinstance(token, str) or not token:
            raise CalendarAuthError("Google token response did not include access_token")
        self._access_token = token
        return token

    def get_busy_intervals(self, time_min: datetime, time_max: datetime) -> list[BusyInterval]:
        body = {
            "timeMin": to_utc_iso(time_min),
            "timeMax": to_utc_iso(time_max),
            "timeZone": "UTC",
            "items": [{"id": self.config.calendar_id}],
        }
        response = self._json_request(f"{CALENDAR_API_BASE}/freeBusy", body=body, token=self._token())
        calendar = (response.get("calendars") or {}).get(self.config.calendar_id) or {}
        busy_items = calendar.get("busy") or []
        intervals: list[BusyInterval] = []
        for item in busy_items:
            start = item.get("start")
            end = item.get("end")
            if isinstance(start, str) and isinstance(end, str):
                intervals.append(BusyInterval(start=parse_google_datetime(start), end=parse_google_datetime(end)))
        return intervals

    def create_booking_event(self, *, booking: dict[str, Any], duration_minutes: int, client_request_id: str) -> dict[str, Any]:
        conference_request_id = f"meet-{uuid.uuid4()}"
        description_parts = [
            "Diagnóstico tecnológico reservado desde jonathanvaldes.com.",
            "",
            f"Necesidad: {booking['problemType']}",
            f"Mensaje: {booking['message']}",
        ]
        if booking.get("company"):
            description_parts.insert(2, f"Empresa: {booking['company']}")
        if booking.get("phone"):
            description_parts.insert(2, f"Teléfono: {booking['phone']}")

        body = {
            "summary": f"Diagnóstico tecnológico - {booking['name']}",
            "description": "\n".join(description_parts),
            "start": {"dateTime": to_utc_iso(booking["startAtDateTime"]), "timeZone": "UTC"},
            "end": {"dateTime": to_utc_iso(booking["endAtDateTime"]), "timeZone": "UTC"},
            "attendees": [{"email": booking["email"]}],
            "extendedProperties": {
                "private": {
                    "source": "jonathanvaldes.com",
                    "clientRequestId": client_request_id,
                    "durationMinutes": str(duration_minutes),
                }
            },
            "conferenceData": {
                "createRequest": {
                    "requestId": conference_request_id,
                    "conferenceSolutionKey": {"type": "hangoutsMeet"},
                }
            },
        }
        url = f"{CALENDAR_API_BASE}/calendars/{urllib.parse.quote(self.config.calendar_id, safe='')}/events?conferenceDataVersion=1&sendUpdates=all"
        return self._json_request(url, body=body, token=self._token())

    def get_event(self, event_id: str | None) -> dict[str, Any]:
        if not event_id:
            raise CalendarClientError("Missing event id")
        url = f"{CALENDAR_API_BASE}/calendars/{urllib.parse.quote(self.config.calendar_id, safe='')}/events/{urllib.parse.quote(event_id, safe='')}?conferenceDataVersion=1"
        return self._json_request(url, method="GET", token=self._token())