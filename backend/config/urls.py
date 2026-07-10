from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from core.views import AdminStatsView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", include("core.urls")),
    path("api/auth/", include("users.urls")),
    path("api/investments/", include("investments.urls")),
    path("api/transactions/", include("transactions.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/content/", include("content.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/chat/", include("chat.urls")),
    path("api/admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
