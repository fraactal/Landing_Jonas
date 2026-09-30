import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lead_api"))

from validation import ValidationError, validate_lead_payload


VALID_PAYLOAD = {
    "action": "createLead",
    "name": " Juan Pérez ",
    "company": " Empresa ABC ",
    "email": " juan@empresa.cl ",
    "phone": " +56 9 1234 5678 ",
    "problemType": "Automatizar un proceso",
    "message": "Hoy realizamos un proceso manual que queremos mejorar.",
    "privacyAccepted": True,
    "source": "website",
    "sourceContext": "final-cta",
    "website": "",
}


class LeadValidationTests(unittest.TestCase):
    def test_valid_payload_is_normalized(self):
        normalized = validate_lead_payload(VALID_PAYLOAD)

        self.assertEqual(normalized["name"], "Juan Pérez")
        self.assertEqual(normalized["company"], "Empresa ABC")
        self.assertEqual(normalized["email"], "juan@empresa.cl")
        self.assertEqual(normalized["phone"], "+56 9 1234 5678")
        self.assertEqual(normalized["status"] if "status" in normalized else "NEW", "NEW")
        self.assertNotIn("website", normalized)

    def test_missing_required_field_is_rejected(self):
        payload = dict(VALID_PAYLOAD)
        del payload["name"]

        with self.assertRaises(ValidationError):
            validate_lead_payload(payload)

    def test_invalid_problem_type_is_rejected(self):
        payload = dict(VALID_PAYLOAD, problemType="Algo no permitido")

        with self.assertRaises(ValidationError):
            validate_lead_payload(payload)

    def test_unexpected_field_is_rejected(self):
        payload = dict(VALID_PAYLOAD, budget="1000")

        with self.assertRaises(ValidationError):
            validate_lead_payload(payload)

    def test_privacy_string_true_is_rejected(self):
        payload = dict(VALID_PAYLOAD, privacyAccepted="true")

        with self.assertRaises(ValidationError):
            validate_lead_payload(payload)

    def test_honeypot_populated_is_rejected(self):
        payload = dict(VALID_PAYLOAD, website="https://example.com")

        with self.assertRaises(ValidationError):
            validate_lead_payload(payload)

    def test_empty_optional_fields_are_omitted(self):
        payload = dict(VALID_PAYLOAD, company="   ", phone="")
        normalized = validate_lead_payload(payload)

        self.assertNotIn("company", normalized)
        self.assertNotIn("phone", normalized)


if __name__ == "__main__":
    unittest.main()