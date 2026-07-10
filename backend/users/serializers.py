from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers

from .models import InvestorProfile
from .services import send_welcome_email

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "is_staff", "date_joined"]
        read_only_fields = ["id", "is_staff", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        send_welcome_email(user)
        return user


class InvestorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorProfile
        fields = [
            "phone",
            "date_of_birth",
            "address",
            "id_number",
            "risk_profile",
            "verification_status",
            "verification_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["verification_status", "verification_notes", "created_at", "updated_at"]


class ProfileSerializer(serializers.ModelSerializer):
    profile = InvestorProfileSerializer(source="investor_profile")

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "date_joined", "profile"]
        read_only_fields = ["id", "email", "date_joined"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("investor_profile", {})
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.save(update_fields=["first_name", "last_name"])

        profile = instance.investor_profile
        for field, value in profile_data.items():
            setattr(profile, field, value)
        profile.save()
        return instance


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(min_length=8)

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs["uid"]))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            raise serializers.ValidationError("Invalid reset link.")

        if not default_token_generator.check_token(user, attrs["token"]):
            raise serializers.ValidationError("Invalid or expired reset link.")

        attrs["user"] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["password"])
        user.save(update_fields=["password"])
        return user


def make_reset_link(user, site_url: str) -> str:
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    return f"{site_url}/reset-password?uid={uid}&token={token}"
