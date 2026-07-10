from rest_framework import serializers

from .models import (
    FAQ,
    BlogPost,
    ContactMessage,
    Milestone,
    SiteSetting,
    TeamMember,
    Testimonial,
)


class BlogPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ["id", "title", "slug", "excerpt", "cover_image", "author_name", "category", "published_at"]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "body",
            "cover_image",
            "author_name",
            "category",
            "published_at",
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "name", "role", "quote", "avatar", "rating"]


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ["id", "name", "role", "bio", "photo", "order"]


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ["id", "year", "title", "description"]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "category"]


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = [
            "hero_headline",
            "company_intro",
            "phone",
            "email",
            "whatsapp_number",
            "address",
            "bank_name",
            "bank_account_name",
            "bank_account_number",
            "bank_branch_code",
            "google_maps_embed_url",
            "facebook_url",
            "twitter_url",
            "linkedin_url",
            "instagram_url",
        ]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "phone", "subject", "message"]


class NewsletterSubscriberSerializer(serializers.Serializer):
    email = serializers.EmailField()
