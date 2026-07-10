from django.db import migrations
from django.utils import timezone

FAQS = [
    {
        "category": "investments",
        "question": "What is the minimum amount I can invest?",
        "answer": "Minimums vary by product, starting from R500 for advisory services up to R10,000 for business funding. Each product page shows its minimum investment.",
        "order": 1,
    },
    {
        "category": "investments",
        "question": "How are returns calculated?",
        "answer": "Each product has an expected annual return rate shown on its detail page. Actual returns are credited to your account as earnings and reflected in your portfolio performance.",
        "order": 2,
    },
    {
        "category": "registration",
        "question": "How do I create an account?",
        "answer": "Click Register, provide your email and a password, then verify your investor profile from your dashboard before you can invest.",
        "order": 1,
    },
    {
        "category": "registration",
        "question": "Why do I need to verify my account?",
        "answer": "Verification (KYC) protects you and Prime Vest from fraud and is required by financial regulations before you can deposit or invest funds.",
        "order": 2,
    },
    {
        "category": "security",
        "question": "How is my data protected?",
        "answer": "All traffic is encrypted with SSL/TLS, passwords are hashed, and sensitive actions require authentication. We never store your card details.",
        "order": 1,
    },
    {
        "category": "security",
        "question": "Is my money safe with Prime Vest?",
        "answer": "Investor funds are allocated to vetted, diversified products and all transactions are logged and auditable through your dashboard.",
        "order": 2,
    },
    {
        "category": "withdrawals",
        "question": "How long do withdrawals take?",
        "answer": "Withdrawal requests are reviewed and processed by our team, typically within 3-5 business days after approval.",
        "order": 1,
    },
    {
        "category": "withdrawals",
        "question": "Are there withdrawal fees?",
        "answer": "Standard bank transfer withdrawals are free. Any product-specific early-withdrawal terms are disclosed on that product's page.",
        "order": 2,
    },
    {
        "category": "support",
        "question": "How can I contact support?",
        "answer": "Use the live chat in your dashboard, WhatsApp us directly from the Contact page, or email our support team — we usually respond within a business day.",
        "order": 1,
    },
]

TEAM = [
    {
        "name": "Thandiwe Mokoena",
        "role": "Chief Executive Officer",
        "bio": "20+ years leading investment management across African markets, focused on building sustainable wealth for everyday investors.",
        "order": 1,
    },
    {
        "name": "David Nkosi",
        "role": "Chief Investment Officer",
        "bio": "Oversees Prime Vest's investment strategy across property, portfolio management, and business funding products.",
        "order": 2,
    },
    {
        "name": "Amara Chikwanda",
        "role": "Head of Investor Relations",
        "bio": "Leads investor onboarding, verification, and support to ensure every client has a seamless investing experience.",
        "order": 3,
    },
    {
        "name": "Sipho Dlamini",
        "role": "Head of Compliance & Risk",
        "bio": "Ensures Prime Vest operates to the highest regulatory and risk-management standards across all products.",
        "order": 4,
    },
]

MILESTONES = [
    {"year": 2018, "title": "Prime Vest founded", "description": "Started with a single property fund and a handful of early investors.", "order": 1},
    {"year": 2020, "title": "Portfolio management launched", "description": "Introduced professionally managed, diversified portfolios for retail investors.", "order": 2},
    {"year": 2022, "title": "R500M+ in assets managed", "description": "Crossed half a billion in cumulative investor assets under management.", "order": 3},
    {"year": 2024, "title": "Business funding division launched", "description": "Began offering growth funding solutions to established businesses.", "order": 4},
    {"year": 2026, "title": "Online investor platform launched", "description": "Launched a fully digital dashboard for registration, investing, and portfolio tracking.", "order": 5},
]

TESTIMONIALS = [
    {"name": "Nomvula Khumalo", "role": "Property Investor", "quote": "Prime Vest made property investing accessible — clear returns, transparent reporting, and real support when I needed it.", "rating": 5},
    {"name": "James Botha", "role": "Portfolio Client", "quote": "The managed portfolio has consistently outperformed my expectations. My advisor actually knows my goals.", "rating": 5},
    {"name": "Lerato Mahlangu", "role": "Business Owner", "quote": "The business funding solution helped us scale without giving up control of our company.", "rating": 5},
]

BLOG_POSTS = [
    {
        "title": "5 Fundamentals of Smart Property Investing",
        "slug": "5-fundamentals-of-smart-property-investing",
        "excerpt": "What separates a good property investment from a great one — and how Prime Vest evaluates every deal.",
        "body": "Property remains one of the most reliable wealth-building tools available to investors. In this article we break down the five fundamentals our team evaluates on every deal: location, cash flow, tenant quality, exit liquidity, and macro timing.\n\nLocation continues to dominate long-term appreciation, but cash flow discipline is what protects investors during downturns. We also look closely at tenant quality and lease structure, since consistent rental income is the backbone of any property fund's returns.",
        "category": "property_markets",
        "author_name": "Prime Vest Research Team",
    },
    {
        "title": "How to Build a Diversified Investment Portfolio",
        "slug": "how-to-build-a-diversified-investment-portfolio",
        "excerpt": "Diversification is the closest thing investing has to a free lunch. Here's how to apply it practically.",
        "body": "A diversified portfolio spreads risk across asset classes, sectors, and geographies so that no single event can derail your long-term goals. This article walks through how Prime Vest's Managed Growth Portfolio balances equities, fixed income, and alternative assets based on an investor's risk profile.",
        "category": "investing",
        "author_name": "Prime Vest Research Team",
    },
    {
        "title": "Understanding Investment Risk Profiles",
        "slug": "understanding-investment-risk-profiles",
        "excerpt": "Conservative, balanced, or aggressive — what these risk profiles actually mean for your returns.",
        "body": "Every investor has a different tolerance for volatility. This guide explains the difference between conservative, balanced, and aggressive risk profiles, and how to choose the one that matches your financial goals and time horizon.",
        "category": "financial_education",
        "author_name": "Prime Vest Research Team",
    },
    {
        "title": "Prime Vest Market Outlook: What to Watch This Quarter",
        "slug": "prime-vest-market-outlook-this-quarter",
        "excerpt": "Our investment team's take on interest rates, property markets, and where opportunity is emerging.",
        "body": "Interest rate movements continue to shape both property and equity markets this quarter. Our investment committee shares its outlook on where we see resilience — and where investors should stay cautious — across the products on our platform.",
        "category": "market_insight",
        "author_name": "Prime Vest Investment Committee",
    },
]


def seed_content(apps, schema_editor):
    FAQ = apps.get_model("content", "FAQ")
    TeamMember = apps.get_model("content", "TeamMember")
    Milestone = apps.get_model("content", "Milestone")
    Testimonial = apps.get_model("content", "Testimonial")
    BlogPost = apps.get_model("content", "BlogPost")
    SiteSetting = apps.get_model("content", "SiteSetting")

    for faq in FAQS:
        FAQ.objects.update_or_create(question=faq["question"], defaults=faq)

    for member in TEAM:
        TeamMember.objects.update_or_create(name=member["name"], defaults=member)

    for milestone in MILESTONES:
        Milestone.objects.update_or_create(
            year=milestone["year"], title=milestone["title"], defaults=milestone
        )

    for testimonial in TESTIMONIALS:
        Testimonial.objects.update_or_create(name=testimonial["name"], defaults=testimonial)

    for post in BLOG_POSTS:
        BlogPost.objects.update_or_create(
            slug=post["slug"], defaults={**post, "published_at": timezone.now(), "is_published": True}
        )

    SiteSetting.objects.get_or_create(pk=1)


def unseed_content(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_content, unseed_content),
    ]
