from decimal import Decimal

from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Deposit, Earning, Withdrawal
from .serializers import DepositSerializer, EarningSerializer, WithdrawalSerializer


class DepositListCreateView(generics.ListCreateAPIView):
    serializer_class = DepositSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Deposit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if serializer.validated_data.get("method") == Deposit.Method.PAYSTACK:
            raise ValidationError(
                "Use /api/payments/paystack/initialize/ to start a card deposit."
            )
        serializer.save(user=self.request.user)


class WithdrawalListCreateView(generics.ListCreateAPIView):
    serializer_class = WithdrawalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Withdrawal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        from investments.services import compute_available_cash

        amount = serializer.validated_data["amount"]
        available = compute_available_cash(self.request.user)
        if amount > available:
            raise ValidationError("Withdrawal amount exceeds your available balance.")
        serializer.save(user=self.request.user)


class EarningsSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request):
        earnings = Earning.objects.filter(user=request.user)
        total = sum((e.amount for e in earnings), Decimal("0"))
        return Response(
            {
                "total_earnings": total,
                "earnings": EarningSerializer(earnings, many=True).data,
            }
        )
