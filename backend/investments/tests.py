from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from transactions.models import Deposit
from transactions.services import complete_deposit
from users.models import InvestorProfile, User
from users.services import approve_investor

from .models import Investment, InvestmentProduct


class InvestmentProductTests(APITestCase):
    def test_product_list_is_public_and_seeded(self):
        response = self.client.get(reverse("investment-products"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 7)


class InvestmentCreationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="investor@example.com", password="supersecret123")
        self.client.force_authenticate(self.user)
        self.product = InvestmentProduct.objects.first()

    def test_unverified_investor_cannot_invest(self):
        response = self.client.post(
            reverse("investment-list-create"),
            {"product_id": self.product.id, "amount": str(self.product.min_amount)},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_verified_investor_can_invest_deposited_cash(self):
        approve_investor(self.user.investor_profile)
        deposit = Deposit.objects.create(
            user=self.user, amount=self.product.min_amount, method=Deposit.Method.BANK_TRANSFER
        )
        complete_deposit(deposit)

        response = self.client.post(
            reverse("investment-list-create"),
            {"product_id": self.product.id, "amount": str(self.product.min_amount)},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Investment.objects.filter(user=self.user).count(), 1)

        summary = self.client.get(reverse("portfolio-summary"))
        self.assertEqual(summary.status_code, status.HTTP_200_OK)
        # Equity is unchanged by investing (cash just moved into the product)...
        self.assertEqual(str(summary.data["total_value"]), str(self.product.min_amount))
        # ...but available (uninvested) cash drops to zero.
        self.assertEqual(str(summary.data["available_cash"]), "0.00")

    def test_investing_without_deposited_cash_is_rejected(self):
        approve_investor(self.user.investor_profile)
        response = self.client.post(
            reverse("investment-list-create"),
            {"product_id": self.product.id, "amount": str(self.product.min_amount)},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_amount_below_minimum_is_rejected(self):
        approve_investor(self.user.investor_profile)
        response = self.client.post(
            reverse("investment-list-create"),
            {"product_id": self.product.id, "amount": "1.00"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
