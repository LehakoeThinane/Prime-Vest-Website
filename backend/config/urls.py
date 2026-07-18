from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from core.views import AdminStatsView

PREFIX = settings.API_URL_PREFIX

urlpatterns = [
    # Declared before "admin/" so it isn't swallowed by admin.site.urls when PREFIX is empty.
    path(f"{PREFIX}admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("admin/", admin.site.urls),
    path(f"{PREFIX}health/", include("core.urls")),
    path(f"{PREFIX}auth/", include("users.urls")),
    path(f"{PREFIX}investments/", include("investments.urls")),
    path(f"{PREFIX}transactions/", include("transactions.urls")),
    path(f"{PREFIX}payments/", include("payments.urls")),
    path(f"{PREFIX}content/", include("content.urls")),
    path(f"{PREFIX}notifications/", include("notifications.urls")),
    path(f"{PREFIX}chat/", include("chat.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
