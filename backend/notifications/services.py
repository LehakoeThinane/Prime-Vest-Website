from .models import Notification


def notify_user(user, title: str, body: str, notif_type: str = Notification.Type.ACCOUNT) -> Notification:
    return Notification.objects.create(user=user, title=title, body=body, notif_type=notif_type)


def broadcast_announcement(title: str, body: str) -> int:
    from django.contrib.auth import get_user_model

    User = get_user_model()
    users = User.objects.filter(is_active=True)
    Notification.objects.bulk_create(
        [
            Notification(user=user, title=title, body=body, notif_type=Notification.Type.ANNOUNCEMENT)
            for user in users
        ]
    )
    return users.count()
