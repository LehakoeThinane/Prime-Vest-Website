from django.contrib import admin

from .models import ChatMessage, ChatThread


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 1
    fields = ["sender_role", "body", "is_read", "created_at"]
    readonly_fields = ["created_at"]

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        formset.form.base_fields["sender_role"].initial = ChatMessage.Sender.ADMIN
        return formset


@admin.register(ChatThread)
class ChatThreadAdmin(admin.ModelAdmin):
    list_display = ["user", "is_closed", "created_at"]
    search_fields = ["user__email"]
    inlines = [ChatMessageInline]

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            if isinstance(instance, ChatMessage) and instance.sender_role == ChatMessage.Sender.ADMIN:
                instance.sender = request.user
            instance.save()
        formset.save_m2m()
