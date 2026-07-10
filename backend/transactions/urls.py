from django.urls import path

from . import views

urlpatterns = [
    path("deposits/", views.DepositListCreateView.as_view(), name="deposit-list-create"),
    path("withdrawals/", views.WithdrawalListCreateView.as_view(), name="withdrawal-list-create"),
    path("earnings/", views.EarningsSummaryView.as_view(), name="earnings-summary"),
]
