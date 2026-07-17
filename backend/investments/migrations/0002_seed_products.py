from django.db import migrations

PRODUCTS = [
    {
        "category": "property",
        "name": "Prime Property Fund",
        "slug": "prime-property-fund",
        "summary": "Diversified exposure to income-generating residential and commercial property.",
        "description": (
            "The Prime Property Fund pools investor capital into a diversified portfolio of "
            "vetted residential and commercial developments, delivering rental income and "
            "capital growth over the medium term."
        ),
        "min_amount": "5000.00",
        "expected_return_rate": "9.50",
        "term_months": 24,
    },
    {
        "category": "portfolio",
        "name": "Managed Growth Portfolio",
        "slug": "managed-growth-portfolio",
        "summary": "A professionally managed, diversified portfolio tailored to your risk profile.",
        "description": (
            "Our investment team actively manages a diversified mix of equities, bonds, and "
            "alternative assets on your behalf, rebalanced regularly to match your goals."
        ),
        "min_amount": "2000.00",
        "expected_return_rate": "8.00",
        "term_months": 12,
    },
    {
        "category": "wealth",
        "name": "Wealth Builder Plan",
        "slug": "wealth-builder-plan",
        "summary": "A long-term compounding plan designed to steadily build lasting wealth.",
        "description": (
            "A disciplined, long-horizon investment plan combining recurring contributions "
            "with compounding returns to build sustainable long-term wealth."
        ),
        "min_amount": "1000.00",
        "expected_return_rate": "7.50",
        "term_months": 36,
    },
    {
        "category": "advisory",
        "name": "Investment Advisory Retainer",
        "slug": "investment-advisory-retainer",
        "summary": "One-on-one advisory to help you plan, structure, and optimize your investments.",
        "description": (
            "Work directly with a dedicated investment advisor for personalized portfolio "
            "planning, tax-efficient structuring, and ongoing performance reviews."
        ),
        "min_amount": "500.00",
        "expected_return_rate": "6.00",
        "term_months": 12,
    },
    {
        "category": "business_funding",
        "name": "Business Growth Funding",
        "slug": "business-growth-funding",
        "summary": "Debt and equity funding solutions for growing businesses.",
        "description": (
            "Flexible funding - from working capital to growth equity - for established "
            "businesses looking to expand, paired with investor returns tied to performance."
        ),
        "min_amount": "10000.00",
        "expected_return_rate": "11.00",
        "term_months": 18,
    },
    {
        "category": "future",
        "name": "Future Opportunities Fund",
        "slug": "future-opportunities-fund",
        "summary": "Early access to upcoming investment opportunities as they launch.",
        "description": (
            "Register your interest to get priority access to new investment products - "
            "renewable energy, private equity, and international markets - as they open."
        ),
        "min_amount": "1000.00",
        "expected_return_rate": "0.00",
        "term_months": 1,
    },
]


def seed_products(apps, schema_editor):
    InvestmentProduct = apps.get_model("investments", "InvestmentProduct")
    for product in PRODUCTS:
        InvestmentProduct.objects.update_or_create(slug=product["slug"], defaults=product)


def unseed_products(apps, schema_editor):
    InvestmentProduct = apps.get_model("investments", "InvestmentProduct")
    InvestmentProduct.objects.filter(slug__in=[p["slug"] for p in PRODUCTS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("investments", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_products, unseed_products),
    ]
