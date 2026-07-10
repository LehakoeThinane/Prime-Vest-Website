from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User

from .models import Deposit, Withdrawal
from .services import complete_deposit, record_earning


class DepositTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="investor@example.com", password="supersecret123")
        self.client.force_authenticate(self.user)

    def test_create_bank_transfer_deposit(self):
        response = self.client.post(
            reverse("deposit-list-create"), {"amount": "1000.00", "method": "bank_transfer"}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Deposit.objects.get().status, Deposit.Status.PENDING)

    def test_cannot_create_paystack_deposit_directly(self):
        response = self.client.post(
            reverse("deposit-list-create"), {"amount": "1000.00", "method": "paystack"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_complete_deposit_records_snapshot_and_notification(self):
        deposit = Deposit.objects.create(user=self.user, amount="500.00", method=Deposit.Method.BANK_TRANSFER)
        complete_deposit(deposit)

        deposit.refresh_from_db()
        self.assertEqual(deposit.status, Deposit.Status.COMPLETED)
        self.assertTrue(self.user.portfolio_snapshots.exists())
        self.assertTrue(self.user.notifications.filter(notif_type="deposit").exists())


class WithdrawalTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="investor@example.com", password="supersecret123")
        self.client.force_authenticate(self.user)

    def test_withdrawal_rejected_when_exceeding_balance(self):
        response = self.client.post(
            reverse("withdrawal-list-create"), {"amount": "1000.00", "method": "bank_transfer"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_withdrawal_allowed_within_balance(self):
        deposit = Deposit.objects.create(user=self.user, amount="1000.00", method=Deposit.Method.BANK_TRANSFER)
        complete_deposit(deposit)

        response = self.client.post(
            reverse("withdrawal-list-create"), {"amount": "500.00", "method": "bank_transfer"}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Withdrawal.objects.get().status, Withdrawal.Status.PENDING)


class EarningsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="investor@example.com", password="supersecret123")
        self.client.force_authenticate(self.user)

    def test_earnings_summary(self):
        record_earning(self.user, amount="150.00", description="Q1 return")

        response = self.client.get(reverse("earnings-summary"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(str(response.data["total_earnings"]), "150.00")
        self.assertEqual(len(response.data["earnings"]), 1)
