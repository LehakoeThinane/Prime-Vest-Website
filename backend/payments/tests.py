import hashlib
import hmac
import json
from unittest.mock import patch

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from transactions.models import Deposit
from users.models import User


class PaystackInitializeTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="investor@example.com", password="supersecret123")
        self.client.force_authenticate(self.user)

    @patch("payments.views.initialize_transaction")
    def test_initialize_creates_pending_deposit(self, mock_init):
        mock_init.return_value = {"authorization_url": "https://paystack.test/pay/abc", "reference": "pv_abc"}

        response = self.client.post(reverse("paystack-initialize"), {"amount": "1000"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("authorization_url", response.data)
        deposit = Deposit.objects.get()
        self.assertEqual(deposit.status, Deposit.Status.PENDING)
        self.assertEqual(deposit.method, Deposit.Method.PAYSTACK)

    def test_initialize_rejects_invalid_amount(self):
        response = self.client.post(reverse("paystack-initialize"), {"amount": "-5"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PaystackWebhookTests(APITestCase):
    def test_webhook_completes_deposit_on_valid_signature(self):
        user = User.objects.create_user(email="investor@example.com", password="supersecret123")
        deposit = Deposit.objects.create(user=user, amount="1000.00", method=Deposit.Method.PAYSTACK, reference="pv_test123")

        payload = {"event": "charge.success", "data": {"reference": "pv_test123"}}
        body = json.dumps(payload).encode("utf-8")
        from django.conf import settings

        signature = hmac.new(settings.PAYSTACK_SECRET_KEY.encode(), body, hashlib.sha512).hexdigest()

        response = self.client.post(
            reverse("paystack-webhook"),
            data=body,
            content_type="application/json",
            HTTP_X_PAYSTACK_SIGNATURE=signature,
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        deposit.refresh_from_db()
        self.assertEqual(deposit.status, Deposit.Status.COMPLETED)

    def test_webhook_rejects_invalid_signature(self):
        User.objects.create_user(email="investor@example.com", password="supersecret123")
        payload = {"event": "charge.success", "data": {"reference": "pv_doesnotexist"}}

        response = self.client.post(
            reverse("paystack-webhook"),
            data=payload,
            format="json",
            HTTP_X_PAYSTACK_SIGNATURE="bad-signature",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
