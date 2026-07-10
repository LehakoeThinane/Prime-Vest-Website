from django.conf import settings
from django.db import models


class ChatThread(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chat_thread"
    )
    is_closed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Thread<{self.user.email}>"


class ChatMessage(models.Model):
    class Sender(models.TextChoices):
        INVESTOR = "investor", "Investor"
        ADMIN = "admin", "Admin"

    thread = models.ForeignKey(ChatThread, on_delete=models.CASCADE, related_name="messages")
    sender_role = models.CharField(max_length=10, choices=Sender.choices)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="chat_messages"
    )
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender_role}: {self.body[:30]}"
