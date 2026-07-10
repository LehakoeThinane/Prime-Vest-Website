from django.contrib import admin

from core.admin import export_as_csv

from .models import (
    FAQ,
    BlogPost,
    ContactMessage,
    Milestone,
    NewsletterSubscriber,
    SiteSetting,
    TeamMember,
    Testimonial,
)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "author_name", "is_published", "published_at"]
    list_filter = ["category", "is_published"]
    search_fields = ["title", "excerpt", "body"]
    prepopulated_fields = {"slug": ("title",)}
    actions = ["publish_selected", "unpublish_selected"]

    @admin.action(description="Publish selected posts")
    def publish_selected(self, request, queryset):
        queryset.update(is_published=True)

    @admin.action(description="Unpublish selected posts")
    def unpublish_selected(self, request, queryset):
        queryset.update(is_published=False)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["name", "role", "rating", "is_featured", "created_at"]
    list_filter = ["is_featured", "rating"]
    search_fields = ["name", "quote"]


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ["name", "role", "order"]
    search_fields = ["name", "role"]


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ["year", "title", "order"]
    list_filter = ["year"]


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ["question", "category", "order"]
    list_filter = ["category"]
    search_fields = ["question", "answer"]


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not SiteSetting.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "subject", "is_read", "created_at"]
    list_filter = ["is_read"]
    search_fields = ["name", "email", "subject", "message"]
    actions = ["mark_read", export_as_csv]

    @admin.action(description="Mark selected messages as read")
    def mark_read(self, request, queryset):
        queryset.update(is_read=True)


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ["email", "subscribed_at"]
    search_fields = ["email"]
    actions = [export_as_csv]
