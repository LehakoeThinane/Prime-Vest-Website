from rest_framework import serializers

from .models import ChatMessage, ChatThread


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "sender_role", "body", "is_read", "created_at"]
        read_only_fields = ["sender_role", "is_read", "created_at"]


class ChatThreadSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatThread
        fields = ["id", "is_closed", "created_at", "messages"]
