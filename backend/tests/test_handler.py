import json
import unittest
from pathlib import Path
import sys
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lead_api"))

import handler
from validation import MAX_PAYLOAD_BYTES


class Context:
    aws_request_id = "request-123"


class FakeTable:
    def __init__(self, *, should_fail=False):
        self.should_fail = should_fail
        self.items = []
        self.conditions = []

    def put_item(self, **kwargs):
        if self.should_fail:
            raise RuntimeError("dynamodb unavailable")
        self.items.append(kwargs["Item"])
        self.conditions.append(kwargs.get("ConditionExpression"))
        return {"ResponseMetadata": {"HTTPStatusCode": 200}}


def event_for(payload, method="POST"):
    return {
        "requestContext": {"http": {"method": method}},
        "headers": {"origin": "https://jonathanvaldes.com", "content-type": "application/json"},
        "body": json.dumps(payload),
        "isBase64Encoded": False,
    }


VALID_PAYLOAD = {
    "action": "createLead",
    "name": "Juan Pérez",
    "company": "Empresa ABC",
    "email": "juan@empresa.cl",
    "phone": "+56 9 1234 5678",
    "problemType": "Automatizar un proceso",
    "message": "Hoy realizamos un proceso manual que queremos mejorar.",
    "privacyAccepted": True,
    "source": "website",
    "sourceContext": "form",
    "website": "",
}


class HandlerTests(unittest.TestCase):
    def setUp(self):
        handler._table = None

    def test_valid_request_persists_and_returns_201(self):
        table = FakeTable()
        handler._table = table

        with patch.dict("os.environ", {"LEADS_TABLE_NAME": "jonathanvaldes-leads", "ALLOWED_ORIGINS": "https://jonathanvaldes.com"}):
            response = handler.lambda_handler(event_for(VALID_PAYLOAD), Context())

        body = json.loads(response["body"])
        self.assertEqual(response["statusCode"], 201)
        self.assertTrue(body["ok"])
        self.assertEqual(body["status"], "NEW")
        self.assertEqual(len(table.items), 1)
        self.assertEqual(table.conditions[0], "attribute_not_exists(leadId)")
        self.assertNotIn("website", table.items[0])
        self.assertEqual(table.items[0]["status"], "NEW")

    def test_method_not_allowed(self):
        response = handler.lambda_handler(event_for(VALID_PAYLOAD, method="GET"), Context())

        self.assertEqual(response["statusCode"], 405)
        self.assertEqual(json.loads(response["body"])["error"], "method_not_allowed")

    def test_oversized_payload_returns_413(self):
        response = handler.lambda_handler(
            {
                "requestContext": {"http": {"method": "POST"}},
                "headers": {"origin": "https://jonathanvaldes.com", "content-type": "application/json"},
                "body": "x" * (MAX_PAYLOAD_BYTES + 1),
                "isBase64Encoded": False,
            },
            Context(),
        )

        self.assertEqual(response["statusCode"], 413)

    def test_invalid_payload_returns_400(self):
        payload = dict(VALID_PAYLOAD, privacyAccepted=False)
        response = handler.lambda_handler(event_for(payload), Context())

        self.assertEqual(response["statusCode"], 400)
        self.assertEqual(json.loads(response["body"])["error"], "invalid_request")

    def test_dynamodb_failure_returns_500(self):
        handler._table = FakeTable(should_fail=True)

        with patch.dict("os.environ", {"LEADS_TABLE_NAME": "jonathanvaldes-leads"}):
            response = handler.lambda_handler(event_for(VALID_PAYLOAD), Context())

        self.assertEqual(response["statusCode"], 500)
        self.assertEqual(json.loads(response["body"])["error"], "internal_error")


if __name__ == "__main__":
    unittest.main()