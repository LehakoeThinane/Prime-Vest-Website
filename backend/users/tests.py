from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import status
from rest_framework.test import APITestCase

from .models import InvestorProfile, User
from .services import approve_investor


class RegisterLoginTests(APITestCase):
    def test_register_creates_user_and_profile_and_sends_welcome_email(self):
        response = self.client.post(
            reverse("auth-register"),
            {"email": "investor@example.com", "password": "supersecret123"},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(email="investor@example.com")
        self.assertTrue(InvestorProfile.objects.filter(user=user).exists())
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Welcome", mail.outbox[0].subject)

    def test_login_returns_tokens_and_me_endpoint_works(self):
        User.objects.create_user(email="investor@example.com", password="supersecret123")

        login_response = self.client.post(
            reverse("auth-login"),
            {"email": "investor@example.com", "password": "supersecret123"},
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        access = login_response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        me_response = self.client.get(reverse("auth-me"))
        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data["email"], "investor@example.com")

    def test_login_rejects_wrong_password(self):
        User.objects.create_user(email="investor@example.com", password="supersecret123")
        response = self.client.post(
            reverse("auth-login"),
            {"email": "investor@example.com", "password": "wrong"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="investor@example.com", password="supersecret123")
        self.client.force_authenticate(self.user)

    def test_get_and_update_profile(self):
        response = self.client.get(reverse("auth-profile"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["profile"]["verification_status"], "pending")

        update = self.client.patch(
            reverse("auth-profile"),
            {"first_name": "Ada", "profile": {"phone": "+27821234567"}},
            format="json",
        )
        self.assertEqual(update.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Ada")
        self.assertEqual(self.user.investor_profile.phone, "+27821234567")


class InvestorApprovalTests(APITestCase):
    def test_approve_investor_updates_status_and_notifies(self):
        user = User.objects.create_user(email="investor@example.com", password="supersecret123")
        profile = user.investor_profile

        approve_investor(profile)

        profile.refresh_from_db()
        self.assertEqual(profile.verification_status, InvestorProfile.VerificationStatus.VERIFIED)
        self.assertTrue(user.notifications.exists())
        self.assertTrue(any("verified" in m.subject.lower() for m in mail.outbox))


class PasswordResetTests(APITestCase):
    def test_password_reset_flow(self):
        user = User.objects.create_user(email="investor@example.com", password="oldpassword123")

        request_response = self.client.post(
            reverse("auth-password-reset"), {"email": "investor@example.com"}
        )
        self.assertEqual(request_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        confirm_response = self.client.post(
            reverse("auth-password-reset-confirm"),
            {"uid": uid, "token": token, "password": "newpassword456"},
        )
        self.assertEqual(confirm_response.status_code, status.HTTP_200_OK)

        login_response = self.client.post(
            reverse("auth-login"),
            {"email": "investor@example.com", "password": "newpassword456"},
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
