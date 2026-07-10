from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import InvestorProfile

from .models import Investment, InvestmentProduct, PortfolioSnapshot
from .serializers import InvestmentProductSerializer, InvestmentSerializer, PortfolioSnapshotSerializer
from .services import compute_available_cash, compute_equity


class InvestmentProductListView(generics.ListAPIView):
    serializer_class = InvestmentProductSerializer
    permission_classes = [permissions.AllowAny]
    queryset = InvestmentProduct.objects.filter(is_active=True)


class InvestmentListCreateView(generics.ListCreateAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Investment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        profile = self.request.user.investor_profile
        if profile.verification_status != InvestorProfile.VerificationStatus.VERIFIED:
            raise PermissionDenied("Your investor profile must be verified before you can invest.")

        amount = serializer.validated_data["amount"]
        if amount > compute_available_cash(self.request.user):
            raise ValidationError("Amount exceeds your available (uninvested) balance. Deposit funds first.")

        return serializer.save()


class PortfolioSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request):
        snapshots = PortfolioSnapshot.objects.filter(user=request.user)
        active_investments = Investment.objects.filter(
            user=request.user, status=Investment.Status.ACTIVE
        )
        return Response(
            {
                "total_value": compute_equity(request.user),
                "available_cash": compute_available_cash(request.user),
                "active_investment_count": active_investments.count(),
                "snapshots": PortfolioSnapshotSerializer(snapshots, many=True).data,
            }
        )
