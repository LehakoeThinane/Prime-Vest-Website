from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User

from .models import ChatMessage


class ChatThreadTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="investor@example.com", password="supersecret123")
        self.client.force_authenticate(self.user)

    def test_get_creates_thread_and_post_adds_message(self):
        get_response = self.client.get(reverse("chat-thread"))
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)

        post_response = self.client.post(reverse("chat-thread"), {"body": "Hello, I need help"})
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ChatMessage.objects.get().sender_role, ChatMessage.Sender.INVESTOR)
