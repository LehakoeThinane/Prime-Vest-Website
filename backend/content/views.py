from django.conf import settings
from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from core.email import send_email

from .models import FAQ, BlogPost, ContactMessage, Milestone, NewsletterSubscriber, SiteSetting, TeamMember, Testimonial
from .serializers import (
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    ContactMessageSerializer,
    FAQSerializer,
    MilestoneSerializer,
    NewsletterSubscriberSerializer,
    SiteSettingSerializer,
    TeamMemberSerializer,
    TestimonialSerializer,
)


class BlogPostListView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = BlogPost.objects.filter(is_published=True)
        category = self.request.query_params.get("category")
        search = self.request.query_params.get("q")
        if category:
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(excerpt__icontains=search) | Q(body__icontains=search))
        return qs


class BlogPostDetailView(generics.RetrieveAPIView):
    serializer_class = BlogPostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    queryset = BlogPost.objects.filter(is_published=True)


class TestimonialListView(generics.ListAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Testimonial.objects.filter(is_featured=True)


class TeamMemberListView(generics.ListAPIView):
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.AllowAny]
    queryset = TeamMember.objects.all()


class MilestoneListView(generics.ListAPIView):
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Milestone.objects.all()


class FAQListView(generics.ListAPIView):
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = FAQ.objects.all()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs


class SiteSettingView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request: Request):
        return Response(SiteSettingSerializer(SiteSetting.load()).data)


class ContactMessageCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        message: ContactMessage = serializer.save()
        settings_obj = SiteSetting.load()
        send_email(
            subject=f"New contact enquiry: {message.subject}",
            to=settings_obj.email,
            body=f"From: {message.name} <{message.email}>\nPhone: {message.phone}\n\n{message.message}",
        )
        send_email(
            subject="We received your message — Prime Vest",
            to=message.email,
            body=f"Hi {message.name},\n\nThanks for reaching out. Our team will respond shortly.\n\nThe Prime Vest Team",
        )


class NewsletterSubscribeView(generics.CreateAPIView):
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        email = request.data.get("email", "").strip().lower()
        serializer = self.get_serializer(data={"email": email})
        serializer.is_valid(raise_exception=True)
        _, created = NewsletterSubscriber.objects.get_or_create(email=email)
        if created:
            send_email(
                subject="You're subscribed to Prime Vest insights",
                to=email,
                body="Thanks for subscribing — you'll now receive our investing and market insight updates.",
            )
        return Response({"email": email, "subscribed": True}, status=201)


class SearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request: Request):
        from investments.models import InvestmentProduct

        query = request.query_params.get("q", "").strip()
        if not query:
            return Response({"blog_posts": [], "faqs": [], "products": []})

        posts = BlogPost.objects.filter(is_published=True).filter(
            Q(title__icontains=query) | Q(excerpt__icontains=query)
        )[:10]
        faqs = FAQ.objects.filter(Q(question__icontains=query) | Q(answer__icontains=query))[:10]
        products = InvestmentProduct.objects.filter(is_active=True).filter(
            Q(name__icontains=query) | Q(summary__icontains=query)
        )[:10]

        return Response(
            {
                "blog_posts": BlogPostListSerializer(posts, many=True).data,
                "faqs": FAQSerializer(faqs, many=True).data,
                "products": [{"id": p.id, "name": p.name, "slug": p.slug} for p in products],
            }
        )
