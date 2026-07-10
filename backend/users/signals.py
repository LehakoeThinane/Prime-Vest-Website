from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import InvestorProfile, User


@receiver(post_save, sender=User)
def create_investor_profile(sender, instance, created, **kwargs):
    if created:
        InvestorProfile.objects.get_or_create(user=instance)
