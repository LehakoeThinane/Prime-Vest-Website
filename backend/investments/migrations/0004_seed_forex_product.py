from django.db import migrations

PRODUCT = {
    "category": "forex",
    "name": "Forex Trading Account",
    "slug": "forex-trading-account",
    "summary": "A managed forex trading account with a low R100 entry point and profit-split returns.",
    "description": (
        "Trade global currency markets through a Prime Vest managed forex account. Instead of "
        "a fixed promise, you earn a share of realized trading profits - the better the trading "
        "performance, the more you earn, and in a losing month you earn less (or nothing). "
        "Higher account tiers unlock a larger share of profits. Forex trading carries a high "
        "level of risk and returns are not guaranteed; you could lose some or all of your "
        "capital."
    ),
    "min_amount": "100.00",
    "expected_return_rate": "0.00",
    "term_months": 1,
}


def seed_product(apps, schema_editor):
    InvestmentProduct = apps.get_model("investments", "InvestmentProduct")
    InvestmentProduct.objects.update_or_create(slug=PRODUCT["slug"], defaults=PRODUCT)


def unseed_product(apps, schema_editor):
    InvestmentProduct = apps.get_model("investments", "InvestmentProduct")
    InvestmentProduct.objects.filter(slug=PRODUCT["slug"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("investments", "0003_alter_investmentproduct_category"),
    ]

    operations = [
        migrations.RunPython(seed_product, unseed_product),
    ]
