from django.core import mail
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import BlogPost, ContactMessage, NewsletterSubscriber


class BlogVisibilityTests(APITestCase):
    def setUp(self):
        BlogPost.objects.create(
            title="Published post",
            slug="published-post",
            excerpt="excerpt",
            body="body",
            is_published=True,
            published_at=timezone.now(),
        )
        BlogPost.objects.create(
            title="Draft post",
            slug="draft-post",
            excerpt="excerpt",
            body="body",
            is_published=False,
            published_at=timezone.now(),
        )

    def test_only_published_posts_are_listed(self):
        response = self.client.get(reverse("blog-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        slugs = [post["slug"] for post in response.data]
        self.assertIn("published-post", slugs)
        self.assertNotIn("draft-post", slugs)

    def test_draft_post_detail_is_not_accessible(self):
        response = self.client.get(reverse("blog-detail", kwargs={"slug": "draft-post"}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ContactFormTests(APITestCase):
    def test_contact_form_creates_message_and_sends_emails(self):
        response = self.client.post(
            reverse("contact-create"),
            {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "phone": "+27821234567",
                "subject": "Question about investing",
                "message": "How do I get started?",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 2)  # admin notification + investor confirmation


class NewsletterTests(APITestCase):
    def test_subscribe_creates_subscriber(self):
        response = self.client.post(reverse("newsletter-subscribe"), {"email": "reader@example.com"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(NewsletterSubscriber.objects.filter(email="reader@example.com").exists())

    def test_duplicate_subscribe_is_idempotent(self):
        self.client.post(reverse("newsletter-subscribe"), {"email": "reader@example.com"})
        response = self.client.post(reverse("newsletter-subscribe"), {"email": "reader@example.com"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(NewsletterSubscriber.objects.filter(email="reader@example.com").count(), 1)


class SearchTests(APITestCase):
    def test_search_across_blog_and_faq(self):
        BlogPost.objects.create(
            title="Property investing guide",
            slug="property-investing-guide",
            excerpt="excerpt",
            body="body",
            is_published=True,
            published_at=timezone.now(),
        )
        response = self.client.get(reverse("search"), {"q": "property"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any("Property" in p["title"] for p in response.data["blog_posts"]))
