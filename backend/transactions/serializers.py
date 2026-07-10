from rest_framework import serializers

from .models import Deposit, Earning, Withdrawal


class DepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deposit
        fields = ["id", "amount", "method", "status", "reference", "notes", "created_at"]
        read_only_fields = ["status", "reference", "created_at"]


class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawal
        fields = [
            "id",
            "amount",
            "method",
            "status",
            "bank_details",
            "admin_notes",
            "created_at",
            "processed_at",
        ]
        read_only_fields = ["status", "admin_notes", "created_at", "processed_at"]


class EarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Earning
        fields = ["id", "amount", "description", "investment", "created_at"]
