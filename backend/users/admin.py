from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import InvestorProfile, User
from .services import approve_investor, reject_investor


class UserAdmin(BaseUserAdmin):
    ordering = ["email"]
    list_display = ["email", "first_name", "last_name", "is_staff", "is_active"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name")}),
        (
            "Permissions",
            {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    search_fields = ["email"]
    readonly_fields = ["date_joined"]


@admin.register(InvestorProfile)
class InvestorProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "verification_status", "risk_profile", "phone", "created_at"]
    list_filter = ["verification_status", "risk_profile"]
    search_fields = ["user__email", "phone", "id_number"]
    actions = ["approve_selected", "reject_selected"]

    @admin.action(description="Approve selected investors")
    def approve_selected(self, request, queryset):
        for profile in queryset:
            approve_investor(profile)
        self.message_user(request, f"Approved {queryset.count()} investor(s).")

    @admin.action(description="Reject selected investors")
    def reject_selected(self, request, queryset):
        for profile in queryset:
            reject_investor(profile, notes="Verification documents did not pass review.")
        self.message_user(request, f"Rejected {queryset.count()} investor(s).")


admin.site.register(User, UserAdmin)
