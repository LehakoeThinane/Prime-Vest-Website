from django.contrib import admin

from .models import Investment, InvestmentProduct, PortfolioSnapshot


@admin.register(InvestmentProduct)
class InvestmentProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "min_amount", "expected_return_rate", "term_months", "is_active"]
    list_filter = ["category", "is_active"]
    search_fields = ["name", "summary"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ["user", "product", "amount", "status", "start_date", "maturity_date"]
    list_filter = ["status", "product__category"]
    search_fields = ["user__email", "product__name"]


@admin.register(PortfolioSnapshot)
class PortfolioSnapshotAdmin(admin.ModelAdmin):
    list_display = ["user", "date", "total_value"]
    list_filter = ["date"]
    search_fields = ["user__email"]
