from django.urls import path

from . import views

urlpatterns = [
    path("blog/", views.BlogPostListView.as_view(), name="blog-list"),
    path("blog/<slug:slug>/", views.BlogPostDetailView.as_view(), name="blog-detail"),
    path("testimonials/", views.TestimonialListView.as_view(), name="testimonial-list"),
    path("team/", views.TeamMemberListView.as_view(), name="team-list"),
    path("milestones/", views.MilestoneListView.as_view(), name="milestone-list"),
    path("faqs/", views.FAQListView.as_view(), name="faq-list"),
    path("site-settings/", views.SiteSettingView.as_view(), name="site-settings"),
    path("contact/", views.ContactMessageCreateView.as_view(), name="contact-create"),
    path("newsletter/subscribe/", views.NewsletterSubscribeView.as_view(), name="newsletter-subscribe"),
    path("search/", views.SearchView.as_view(), name="search"),
]
