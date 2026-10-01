import json
import unittest
from datetime import datetime, timezone
from pathlib import Path
import sys
from unittest.mock import patch

BOOKING_PATH = Path(__file__).resolve().parents[1] / "booking_api"
sys.path.insert(0, str(BOOKING_PATH))

import availability
import handler
from availability import BusyInterval, DEFAULT_CONFIG, compute_available_slots
from google_calendar import CalendarAuthError, CalendarClientError

for module_name in ("handler", "validation", "availability", "google_calendar"):
    sys.modules.pop(module_name, None)


class Context:
    aws_request_id = "booking-request-123"


class FakeCalendarClient:
    def __init__(self, *, busy=None, create_response=None, get_response=None, create_error=False):
        self.busy = busy or []
        self.create_response = create_response or {
            "id": "event-123",
            "conferenceData": {
                "createRequest": {"status": {"statusCode": "success"}},
                "entryPoints": [{"entryPointType": "video", "uri": "https://meet.google.com/abc-defg-hij"}],
            },
        }
        self.get_response = get_response or self.create_response
        self.create_error = create_error
        self.freebusy_calls = []
        self.created = []
        self.get_calls = []

    def get_busy_intervals(self, start, end):
        self.freebusy_calls.append((start, end))
        return self.busy

    def create_booking_event(self, **kwargs):
        if self.create_error:
            raise CalendarClientError("calendar failed")
        self.created.append(kwargs)
        return self.create_response

    def get_event(self, event_id):
        self.get_calls.append(event_id)
        return self.get_response


def event_for(payload, method="POST"):
    return {
        "requestContext": {"http": {"method": method}},
        "headers": {"origin": "https://jonathanvaldes.com", "content-type": "application/json"},
        "body": json.dumps(payload),
        "isBase64Encoded": False,
    }


VALID_START = "2026-10-05T13:00:00Z"  # 10:00 America/Santiago during DST.
VALID_PAYLOAD = {
    "action": "createBooking",
    "name": "Juan Pérez",
    "company": "Empresa ABC",
    "email": "juan@empresa.cl",
    "phone": "+56 9 1234 5678",
    "problemType": "Conectar sistemas",
    "message": "Queremos conversar sobre una integración entre sistemas.",
    "startAt": VALID_START,
    "privacyAccepted": True,
    "source": "website",
    "clientRequestId": "booking-test-123",
    "website": "",
}

FIXED_NOW = datetime(2026, 10, 1, 12, 0, tzinfo=timezone.utc)


class AvailabilityTests(unittest.TestCase):
    def test_valid_business_slot_is_returned(self):
        slots = compute_available_slots([], now=FIXED_NOW, config=DEFAULT_CONFIG)
        starts = [slot.start_at_iso for slot in slots]
        self.assertIn("2026-10-02T13:00:00Z", starts)

    def test_weekend_is_not_returned(self):
        slots = compute_available_slots([], now=FIXED_NOW, config=DEFAULT_CONFIG)
        local_weekdays = [slot.start.astimezone(DEFAULT_CONFIG.timezone).weekday() for slot in slots]
        self.assertNotIn(5, local_weekdays)
        self.assertNotIn(6, local_weekdays)

    def test_outside_business_hours_is_rejected(self):
        start = datetime(2026, 10, 5, 22, 0, tzinfo=timezone.utc)
        self.assertFalse(DEFAULT_CONFIG.is_allowed_start(start, now=FIXED_NOW))

    def test_buffer_blocks_adjacent_slot(self):
        busy = [
            BusyInterval(
                start=datetime(2026, 10, 5, 13, 30, tzinfo=timezone.utc),
                end=datetime(2026, 10, 5, 14, 0, tzinfo=timezone.utc),
            )
        ]
        slots = compute_available_slots(busy, now=FIXED_NOW, config=DEFAULT_CONFIG)
        starts = [slot.start_at_iso for slot in slots]
        self.assertNotIn("2026-10-05T13:00:00Z", starts)

    def test_minimum_notice_two_hours(self):
        now = datetime(2026, 10, 5, 12, 0, tzinfo=timezone.utc)
        too_soon = datetime(2026, 10, 5, 13, 0, tzinfo=timezone.utc)
        self.assertFalse(DEFAULT_CONFIG.is_allowed_start(too_soon, now=now))

    def test_horizon_thirty_days(self):
        too_far = datetime(2026, 11, 2, 13, 0, tzinfo=timezone.utc)
        self.assertFalse(DEFAULT_CONFIG.is_allowed_start(too_far, now=FIXED_NOW))

    def test_dst_uses_iana_timezone(self):
        summer = datetime(2026, 10, 5, 13, 0, tzinfo=timezone.utc)
        winter = datetime(2026, 6, 1, 14, 0, tzinfo=timezone.utc)
        self.assertEqual(summer.astimezone(DEFAULT_CONFIG.timezone).strftime("%H:%M"), "10:00")
        self.assertEqual(winter.astimezone(DEFAULT_CONFIG.timezone).strftime("%H:%M"), "10:00")


class BookingHandlerTests(unittest.TestCase):
    def setUp(self):
        handler._calendar_client = None

    def _run(self, payload=VALID_PAYLOAD, client=None):
        fake = client or FakeCalendarClient()
        with patch.object(handler, "_get_calendar_client", return_value=fake), patch.object(availability, "utc_now", return_value=FIXED_NOW), patch.object(handler, "utc_now", return_value=FIXED_NOW):
            response = handler.lambda_handler(event_for(payload), Context())
        return response, fake

    def test_get_availability_returns_iso_slots(self):
        response, fake = self._run({"action": "getAvailability", "website": ""})
        body = json.loads(response["body"])
        self.assertEqual(response["statusCode"], 200)
        self.assertTrue(body["ok"])
        self.assertEqual(body["timezone"], "America/Santiago")
        self.assertEqual(body["durationMinutes"], 30)
        self.assertIn("startAt", body["slots"][0])
        self.assertTrue(body["slots"][0]["startAt"].endswith("Z"))
        self.assertEqual(len(fake.freebusy_calls), 1)

    def test_valid_booking_creates_calendar_event(self):
        response, fake = self._run()
        body = json.loads(response["body"])
        self.assertEqual(response["statusCode"], 201)
        self.assertTrue(body["ok"])
        self.assertEqual(body["bookingId"], "event-123")
        self.assertEqual(body["meetUrl"], "https://meet.google.com/abc-defg-hij")
        self.assertEqual(len(fake.created), 1)
        self.assertEqual(fake.created[0]["client_request_id"], "booking-test-123")

    def test_invalid_slot_returns_400(self):
        payload = dict(VALID_PAYLOAD, startAt="2026-10-05T13:15:00Z")
        response, fake = self._run(payload)
        self.assertEqual(response["statusCode"], 409)
        self.assertEqual(json.loads(response["body"])["error"], "slot_unavailable")
        self.assertEqual(len(fake.created), 0)

    def test_slot_occupied_returns_409_and_does_not_create_event(self):
        busy = [BusyInterval(start=datetime(2026, 10, 5, 13, 0, tzinfo=timezone.utc), end=datetime(2026, 10, 5, 13, 30, tzinfo=timezone.utc))]
        response, fake = self._run(client=FakeCalendarClient(busy=busy))
        self.assertEqual(response["statusCode"], 409)
        self.assertEqual(json.loads(response["body"])["error"], "slot_unavailable")
        self.assertEqual(len(fake.created), 0)

    def test_honeypot_returns_invalid_request_without_google_create(self):
        payload = dict(VALID_PAYLOAD, website="bot")
        response, fake = self._run(payload)
        self.assertEqual(response["statusCode"], 400)
        self.assertEqual(len(fake.created), 0)

    def test_calendar_error_returns_502(self):
        response, _ = self._run(client=FakeCalendarClient(create_error=True))
        self.assertEqual(response["statusCode"], 502)
        self.assertEqual(json.loads(response["body"])["error"], "calendar_unavailable")

    def test_meet_pending_returns_success_with_null_meet_url(self):
        pending = {
            "id": "event-pending",
            "conferenceData": {"createRequest": {"status": {"statusCode": "pending"}}},
        }
        response, fake = self._run(client=FakeCalendarClient(create_response=pending, get_response=pending))
        body = json.loads(response["body"])
        self.assertEqual(response["statusCode"], 201)
        self.assertTrue(body["ok"])
        self.assertIsNone(body["meetUrl"])
        self.assertEqual(body["meetStatus"], "pending")
        self.assertEqual(fake.get_calls, ["event-pending"])

    def test_auth_error_returns_500(self):
        with patch.object(handler, "_get_calendar_client", side_effect=CalendarAuthError("missing secret")):
            response = handler.lambda_handler(event_for(VALID_PAYLOAD), Context())
        self.assertEqual(response["statusCode"], 500)
        self.assertEqual(json.loads(response["body"])["error"], "internal_error")

    def test_method_not_allowed(self):
        response, _ = self._run(method_payload := VALID_PAYLOAD)
        self.assertEqual(response["statusCode"], 201)
        response = handler.lambda_handler(event_for(method_payload, method="GET"), Context())
        self.assertEqual(response["statusCode"], 405)


if __name__ == "__main__":
    unittest.main()