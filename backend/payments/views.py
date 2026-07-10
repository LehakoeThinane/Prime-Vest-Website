import uuid

from django.conf import settings
from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from transactions.models import Deposit
from transactions.services import complete_deposit, fail_deposit

from .services import PaystackError, initialize_transaction, verify_transaction, verify_webhook_signature


class PaystackInitializeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request):
        try:
            amount = float(request.data.get("amount"))
        except (TypeError, ValueError):
            return Response({"detail": "A valid amount is required."}, status=400)
        if amount <= 0:
            return Response({"detail": "Amount must be greater than zero."}, status=400)

        reference = f"pv_{uuid.uuid4().hex[:20]}"
        deposit = Deposit.objects.create(
            user=request.user,
            amount=amount,
            method=Deposit.Method.PAYSTACK,
            reference=reference,
        )

        try:
            data = initialize_transaction(
                email=request.user.email,
                amount=amount,
                reference=reference,
                callback_url=f"{settings.SITE_URL}/dashboard/deposits?reference={reference}",
            )
        except PaystackError as exc:
            fail_deposit(deposit)
            return Response({"detail": str(exc)}, status=502)

        return Response(
            {
                "authorization_url": data["authorization_url"],
                "reference": reference,
            }
        )


class PaystackVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request, reference: str):
        deposit = Deposit.objects.filter(reference=reference, user=request.user).first()
        if not deposit:
            return Response({"detail": "Deposit not found."}, status=404)

        if deposit.status == Deposit.Status.PENDING:
            try:
                data = verify_transaction(reference)
            except PaystackError as exc:
                return Response({"detail": str(exc)}, status=502)

            if data.get("status") == "success":
                complete_deposit(deposit)
            elif data.get("status") in {"failed", "abandoned"}:
                fail_deposit(deposit)

        return Response({"reference": deposit.reference, "status": deposit.status, "amount": deposit.amount})


class PaystackWebhookView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request: Request):
        signature = request.headers.get("x-paystack-signature", "")
        if not verify_webhook_signature(request.body, signature):
            return Response(status=401)

        event = request.data.get("event")
        data = request.data.get("data", {})
        reference = data.get("reference")

        if event == "charge.success" and reference:
            deposit = Deposit.objects.filter(reference=reference).first()
            if deposit:
                complete_deposit(deposit)
        elif event == "charge.failed" and reference:
            deposit = Deposit.objects.filter(reference=reference).first()
            if deposit:
                fail_deposit(deposit)

        return Response(status=200)
