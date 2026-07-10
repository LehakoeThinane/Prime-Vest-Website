from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User


class AdminStatsTests(APITestCase):
    def test_non_staff_cannot_access_stats(self):
        user = User.objects.create_user(email="investor@example.com", password="supersecret123")
        self.client.force_authenticate(user)
        response = self.client.get(reverse("admin-stats"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_access_stats(self):
        staff = User.objects.create_user(
            email="staff@example.com", password="supersecret123", is_staff=True
        )
        self.client.force_authenticate(staff)
        response = self.client.get(reverse("admin-stats"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total_users", response.data)
