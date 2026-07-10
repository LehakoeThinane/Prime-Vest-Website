from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok"})


class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request: Request):
        from content.models import ContactMessage, NewsletterSubscriber
        from investments.models import Investment
        from transactions.models import Deposit, Withdrawal
        from users.models import InvestorProfile

        User = get_user_model()

        completed_deposits = Deposit.objects.filter(status=Deposit.Status.COMPLETED)
        pending_withdrawals = Withdrawal.objects.filter(status=Withdrawal.Status.PENDING)

        return Response(
            {
                "total_users": User.objects.count(),
                "pending_verifications": InvestorProfile.objects.filter(
                    verification_status=InvestorProfile.VerificationStatus.PENDING
                ).count(),
                "total_deposits_amount": sum(
                    (d.amount for d in completed_deposits), Decimal("0")
                ),
                "pending_withdrawals_count": pending_withdrawals.count(),
                "pending_withdrawals_amount": sum(
                    (w.amount for w in pending_withdrawals), Decimal("0")
                ),
                "active_investments": Investment.objects.filter(
                    status=Investment.Status.ACTIVE
                ).count(),
                "unread_contact_messages": ContactMessage.objects.filter(is_read=False).count(),
                "newsletter_subscribers": NewsletterSubscriber.objects.count(),
            }
        )
