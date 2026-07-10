from decimal import Decimal

from django.utils import timezone

from .models import Investment, PortfolioSnapshot


def compute_equity(user) -> Decimal:
    """Total account value: completed deposits + earnings, minus paid withdrawals.

    Unaffected by allocating cash into an investment — that just moves value
    from "available cash" into "invested", it doesn't create or destroy it.
    """
    from transactions.models import Deposit, Earning, Withdrawal

    deposited = sum(
        (d.amount for d in Deposit.objects.filter(user=user, status=Deposit.Status.COMPLETED)),
        Decimal("0"),
    )
    earned = sum(
        (e.amount for e in Earning.objects.filter(user=user)),
        Decimal("0"),
    )
    withdrawn = sum(
        (w.amount for w in Withdrawal.objects.filter(user=user, status=Withdrawal.Status.PAID)),
        Decimal("0"),
    )
    return deposited + earned - withdrawn


def compute_available_cash(user) -> Decimal:
    """Equity not currently locked in an active investment — usable to invest or withdraw."""
    invested = sum(
        (inv.amount for inv in Investment.objects.filter(user=user, status=Investment.Status.ACTIVE)),
        Decimal("0"),
    )
    return compute_equity(user) - invested


def record_snapshot(user) -> PortfolioSnapshot:
    snapshot, _ = PortfolioSnapshot.objects.update_or_create(
        user=user,
        date=timezone.localdate(),
        defaults={"total_value": compute_equity(user)},
    )
    return snapshot
