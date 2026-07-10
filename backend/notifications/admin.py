from django import forms
from django.contrib import admin, messages
from django.shortcuts import redirect, render
from django.urls import path

from .models import Notification
from .services import broadcast_announcement


class AnnouncementForm(forms.Form):
    title = forms.CharField(max_length=150)
    body = forms.CharField(widget=forms.Textarea)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "notif_type", "is_read", "created_at"]
    list_filter = ["notif_type", "is_read"]
    search_fields = ["title", "user__email"]
    change_list_template = "admin/notifications/notification/change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path("send-announcement/", self.admin_site.admin_view(self.send_announcement), name="send-announcement"),
        ]
        return custom + urls

    def send_announcement(self, request):
        if request.method == "POST":
            form = AnnouncementForm(request.POST)
            if form.is_valid():
                count = broadcast_announcement(form.cleaned_data["title"], form.cleaned_data["body"])
                messages.success(request, f"Announcement sent to {count} user(s).")
                return redirect("..")
        else:
            form = AnnouncementForm()
        return render(
            request,
            "admin/notifications/notification/send_announcement.html",
            {"form": form, "opts": self.model._meta, "title": "Send announcement"},
        )
