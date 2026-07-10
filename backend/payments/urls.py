from django.urls import path

from . import views

urlpatterns = [
    path("paystack/initialize/", views.PaystackInitializeView.as_view(), name="paystack-initialize"),
    path("paystack/verify/<str:reference>/", views.PaystackVerifyView.as_view(), name="paystack-verify"),
    path("paystack/webhook/", views.PaystackWebhookView.as_view(), name="paystack-webhook"),
]
