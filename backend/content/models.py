from django.db import models
from django.utils import timezone


class BlogPost(models.Model):
    class Category(models.TextChoices):
        INVESTING = "investing", "Investing"
        FINANCIAL_EDUCATION = "financial_education", "Financial Education"
        PROPERTY_MARKETS = "property_markets", "Property Markets"
        COMPANY_NEWS = "company_news", "Company Updates"
        MARKET_INSIGHT = "market_insight", "Market Insight"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    excerpt = models.CharField(max_length=300)
    body = models.TextField()
    cover_image = models.ImageField(upload_to="blog/", blank=True, null=True)
    author_name = models.CharField(max_length=120, default="Prime Vest Team")
    category = models.CharField(max_length=32, choices=Category.choices, default=Category.INVESTING)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at"]

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=150, blank=True)
    quote = models.TextField()
    avatar = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    rating = models.PositiveSmallIntegerField(default=5)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.rating}★)"


class TeamMember(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to="team/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Milestone(models.Model):
    year = models.PositiveIntegerField()
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["year", "order"]

    def __str__(self):
        return f"{self.year} - {self.title}"


class FAQ(models.Model):
    class Category(models.TextChoices):
        INVESTMENTS = "investments", "Investments"
        REGISTRATION = "registration", "Registration"
        SECURITY = "security", "Security"
        WITHDRAWALS = "withdrawals", "Withdrawals"
        SUPPORT = "support", "Support"

    question = models.CharField(max_length=255)
    answer = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.INVESTMENTS)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["category", "order"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question


class SiteSetting(models.Model):
    hero_headline = models.CharField(
        max_length=200, default="Building Wealth Through Smart Investments."
    )
    company_intro = models.TextField(
        default=(
            "Prime Vest is a trusted investment partner helping individuals and businesses "
            "grow wealth through property, portfolio management, and business funding solutions."
        )
    )
    phone = models.CharField(max_length=32, default="+27 11 000 0000")
    email = models.EmailField(default="info@primevest.com")
    whatsapp_number = models.CharField(max_length=32, default="27110000000")
    address = models.CharField(max_length=255, default="1 Investment Way, Sandton, Johannesburg")
    bank_name = models.CharField(max_length=120, default="Prime Bank")
    bank_account_name = models.CharField(max_length=120, default="Prime Vest (Pty) Ltd")
    bank_account_number = models.CharField(max_length=64, default="0000000000")
    bank_branch_code = models.CharField(max_length=32, default="000000")
    google_maps_embed_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Site settings"


class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name}: {self.subject}"


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
