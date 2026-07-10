import hashlib
import hmac

import requests
from django.conf import settings

PAYSTACK_BASE_URL = "https://api.paystack.co"


class PaystackError(Exception):
    pass


def initialize_transaction(email: str, amount: float, reference: str, callback_url: str) -> dict:
    if not settings.PAYSTACK_SECRET_KEY:
        raise PaystackError("Paystack is not configured. Set PAYSTACK_SECRET_KEY.")

    response = requests.post(
        f"{PAYSTACK_BASE_URL}/transaction/initialize",
        headers={"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"},
        json={
            "email": email,
            "amount": int(amount * 100),  # kobo/cents
            "reference": reference,
            "callback_url": callback_url,
        },
        timeout=15,
    )
    data = response.json()
    if not data.get("status"):
        raise PaystackError(data.get("message", "Failed to initialize Paystack transaction."))
    return data["data"]


def verify_transaction(reference: str) -> dict:
    if not settings.PAYSTACK_SECRET_KEY:
        raise PaystackError("Paystack is not configured. Set PAYSTACK_SECRET_KEY.")

    response = requests.get(
        f"{PAYSTACK_BASE_URL}/transaction/verify/{reference}",
        headers={"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"},
        timeout=15,
    )
    data = response.json()
    if not data.get("status"):
        raise PaystackError(data.get("message", "Failed to verify Paystack transaction."))
    return data["data"]


def verify_webhook_signature(payload_body: bytes, signature: str) -> bool:
    if not settings.PAYSTACK_SECRET_KEY or not signature:
        return False
    computed = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode("utf-8"), payload_body, hashlib.sha512
    ).hexdigest()
    return hmac.compare_digest(computed, signature)
