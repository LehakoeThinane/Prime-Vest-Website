from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatMessage, ChatThread
from .serializers import ChatMessageSerializer, ChatThreadSerializer


class MyChatThreadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request):
        thread, _ = ChatThread.objects.get_or_create(user=request.user)
        return Response(ChatThreadSerializer(thread).data)

    def post(self, request: Request):
        thread, _ = ChatThread.objects.get_or_create(user=request.user)
        body = request.data.get("body", "").strip()
        if not body:
            return Response({"detail": "Message body is required."}, status=400)
        message = ChatMessage.objects.create(
            thread=thread, sender_role=ChatMessage.Sender.INVESTOR, sender=request.user, body=body
        )
        return Response(ChatMessageSerializer(message).data, status=201)
