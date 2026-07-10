from django.urls import path

from . import views

urlpatterns = [
    path("thread/", views.MyChatThreadView.as_view(), name="chat-thread"),
]
