from django.urls import path

from . import views

urlpatterns = [
    path("products/", views.InvestmentProductListView.as_view(), name="investment-products"),
    path("", views.InvestmentListCreateView.as_view(), name="investment-list-create"),
    path("portfolio/summary/", views.PortfolioSummaryView.as_view(), name="portfolio-summary"),
]
