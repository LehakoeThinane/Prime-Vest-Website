from django.utils import timezone

from core.email import send_email
from investments.services import record_snapshot
from notifications.services import notify_user

from .models import Deposit, Earning, Withdrawal


def complete_deposit(deposit: Deposit) -> Deposit:
    if deposit.status != Deposit.Status.COMPLETED:
        deposit.status = Deposit.Status.COMPLETED
        deposit.save(update_fields=["status", "updated_at"])
        record_snapshot(deposit.user)
        notify_user(
            deposit.user,
            title="Deposit confirmed",
            body=f"Your deposit of {deposit.amount} has been confirmed.",
            notif_type="deposit",
        )
        send_email(
            subject="Deposit confirmed",
            to=deposit.user.email,
            body=f"Your deposit of {deposit.amount} ({deposit.reference}) has been confirmed.",
        )
    return deposit


def fail_deposit(deposit: Deposit) -> Deposit:
    deposit.status = Deposit.Status.FAILED
    deposit.save(update_fields=["status", "updated_at"])
    return deposit


def mark_withdrawal(withdrawal: Withdrawal, status: str, admin_notes: str = "") -> Withdrawal:
    withdrawal.status = status
    if admin_notes:
        withdrawal.admin_notes = admin_notes
    if status in {Withdrawal.Status.PAID, Withdrawal.Status.REJECTED}:
        withdrawal.processed_at = timezone.now()
    withdrawal.save(update_fields=["status", "admin_notes", "processed_at"])

    if status == Withdrawal.Status.PAID:
        record_snapshot(withdrawal.user)

    notify_user(
        withdrawal.user,
        title=f"Withdrawal {status}",
        body=f"Your withdrawal request of {withdrawal.amount} is now {status}.",
        notif_type="withdrawal",
    )
    send_email(
        subject=f"Withdrawal {status}",
        to=withdrawal.user.email,
        body=f"Your withdrawal request of {withdrawal.amount} is now {status}."
        + (f"\n\nNote: {admin_notes}" if admin_notes else ""),
    )
    return withdrawal


def apply_earning_side_effects(earning: Earning) -> None:
    record_snapshot(earning.user)
    notify_user(
        earning.user,
        title="Investment return received",
        body=f"You've earned {earning.amount}{': ' + earning.description if earning.description else ''}.",
        notif_type="earning",
    )
    send_email(
        subject="You've received an investment return",
        to=earning.user.email,
        body=f"You've earned {earning.amount}{': ' + earning.description if earning.description else ''}.",
    )


def record_earning(user, amount, description="", investment=None) -> Earning:
    earning = Earning.objects.create(
        user=user, amount=amount, description=description, investment=investment
    )
    apply_earning_side_effects(earning)
    return earning
