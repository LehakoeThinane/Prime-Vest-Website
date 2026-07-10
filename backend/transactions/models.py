import uuid

from django.conf import settings
from django.db import models


class Deposit(models.Model):
    class Method(models.TextChoices):
        PAYSTACK = "paystack", "Card / Paystack"
        BANK_TRANSFER = "bank_transfer", "Bank Transfer"
        CRYPTO = "crypto", "Cryptocurrency"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="deposits"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=20, choices=Method.choices)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    reference = models.CharField(max_length=64, unique=True, default=uuid.uuid4)
    notes = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Deposit<{self.reference}> {self.user.email} {self.amount}"


class Withdrawal(models.Model):
    class Method(models.TextChoices):
        BANK_TRANSFER = "bank_transfer", "Bank Transfer"
        CRYPTO = "crypto", "Cryptocurrency"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        PAID = "paid", "Paid"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="withdrawals"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=20, choices=Method.choices, default=Method.BANK_TRANSFER)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    bank_details = models.CharField(max_length=255, blank=True)
    admin_notes = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Withdrawal<{self.pk}> {self.user.email} {self.amount}"


class Earning(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="earnings"
    )
    investment = models.ForeignKey(
        "investments.Investment", on_delete=models.SET_NULL, null=True, blank=True, related_name="earnings"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Earning<{self.pk}> {self.user.email} {self.amount}"
