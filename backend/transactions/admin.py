from django.contrib import admin

from core.admin import export_as_csv

from .models import Deposit, Earning, Withdrawal
from .services import apply_earning_side_effects, complete_deposit, fail_deposit, mark_withdrawal


@admin.register(Deposit)
class DepositAdmin(admin.ModelAdmin):
    list_display = ["reference", "user", "amount", "method", "status", "created_at"]
    list_filter = ["method", "status"]
    search_fields = ["reference", "user__email"]
    actions = ["mark_completed", "mark_failed", export_as_csv]

    @admin.action(description="Mark selected deposits as completed")
    def mark_completed(self, request, queryset):
        for deposit in queryset:
            complete_deposit(deposit)
        self.message_user(request, f"Completed {queryset.count()} deposit(s).")

    @admin.action(description="Mark selected deposits as failed")
    def mark_failed(self, request, queryset):
        for deposit in queryset:
            fail_deposit(deposit)
        self.message_user(request, f"Failed {queryset.count()} deposit(s).")


@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "amount", "method", "status", "created_at", "processed_at"]
    list_filter = ["method", "status"]
    search_fields = ["user__email"]
    actions = ["mark_approved", "mark_rejected", "mark_paid", export_as_csv]

    @admin.action(description="Approve selected withdrawals")
    def mark_approved(self, request, queryset):
        for withdrawal in queryset:
            mark_withdrawal(withdrawal, Withdrawal.Status.APPROVED)
        self.message_user(request, f"Approved {queryset.count()} withdrawal(s).")

    @admin.action(description="Reject selected withdrawals")
    def mark_rejected(self, request, queryset):
        for withdrawal in queryset:
            mark_withdrawal(withdrawal, Withdrawal.Status.REJECTED, admin_notes="Rejected by admin.")
        self.message_user(request, f"Rejected {queryset.count()} withdrawal(s).")

    @admin.action(description="Mark selected withdrawals as paid")
    def mark_paid(self, request, queryset):
        for withdrawal in queryset:
            mark_withdrawal(withdrawal, Withdrawal.Status.PAID)
        self.message_user(request, f"Marked {queryset.count()} withdrawal(s) as paid.")


@admin.register(Earning)
class EarningAdmin(admin.ModelAdmin):
    list_display = ["user", "amount", "investment", "description", "created_at"]
    search_fields = ["user__email", "description"]
    actions = [export_as_csv]

    def save_model(self, request, obj, form, change):
        is_new = obj.pk is None
        super().save_model(request, obj, form, change)
        if is_new:
            apply_earning_side_effects(obj)
