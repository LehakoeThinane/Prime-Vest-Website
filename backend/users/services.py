from core.email import send_email

from .models import InvestorProfile


def send_welcome_email(user):
    send_email(
        subject="Welcome to Prime Vest",
        to=user.email,
        body=(
            f"Hi {user.first_name or user.email},\n\n"
            "Welcome to Prime Vest. Your account has been created - verify your "
            "profile from your dashboard to start investing.\n\n"
            "The Prime Vest Team"
        ),
    )


def approve_investor(profile: InvestorProfile):
    profile.verification_status = InvestorProfile.VerificationStatus.VERIFIED
    profile.save(update_fields=["verification_status", "updated_at"])

    from notifications.services import notify_user

    notify_user(
        profile.user,
        title="Account verified",
        body="Your investor profile has been verified. You can now invest.",
        notif_type="account",
    )
    send_email(
        subject="Your Prime Vest account is verified",
        to=profile.user.email,
        body="Your investor profile has been verified. You can now start investing.",
    )


def reject_investor(profile: InvestorProfile, notes: str = ""):
    profile.verification_status = InvestorProfile.VerificationStatus.REJECTED
    profile.verification_notes = notes
    profile.save(update_fields=["verification_status", "verification_notes", "updated_at"])

    from notifications.services import notify_user

    notify_user(
        profile.user,
        title="Account verification unsuccessful",
        body=notes or "We couldn't verify your investor profile. Please contact support.",
        notif_type="account",
    )
    send_email(
        subject="Prime Vest account verification update",
        to=profile.user.email,
        body=notes or "We couldn't verify your investor profile. Please contact support.",
    )
