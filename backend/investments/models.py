from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.db import models
from django.utils import timezone


class InvestmentProduct(models.Model):
    class Category(models.TextChoices):
        PROPERTY = "property", "Property Investments"
        FOREX = "forex", "Forex Trading Accounts"
        PORTFOLIO = "portfolio", "Portfolio Management"
        WEALTH = "wealth", "Wealth Building"
        ADVISORY = "advisory", "Investment Advisory"
        BUSINESS_FUNDING = "business_funding", "Business Funding Solutions"
        FUTURE = "future", "Future Investment Opportunities"

    category = models.CharField(max_length=32, choices=Category.choices)
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True)
    summary = models.CharField(max_length=255)
    description = models.TextField()
    min_amount = models.DecimalField(max_digits=12, decimal_places=2)
    expected_return_rate = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Expected annual return, percent"
    )
    term_months = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "name"]

    def __str__(self):
        return self.name


class Investment(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        MATURED = "matured", "Matured"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="investments"
    )
    product = models.ForeignKey(
        InvestmentProduct, on_delete=models.PROTECT, related_name="investments"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.ACTIVE)
    start_date = models.DateField(default=timezone.localdate)
    maturity_date = models.DateField(editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.maturity_date:
            self.maturity_date = self.start_date + relativedelta(months=self.product.term_months)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} -> {self.product.name} ({self.amount})"


class PortfolioSnapshot(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="portfolio_snapshots"
    )
    date = models.DateField(default=timezone.localdate)
    total_value = models.DecimalField(max_digits=14, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date"]
        unique_together = ["user", "date"]

    def __str__(self):
        return f"{self.user.email} @ {self.date}: {self.total_value}"
