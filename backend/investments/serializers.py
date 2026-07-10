from rest_framework import serializers

from .models import Investment, InvestmentProduct, PortfolioSnapshot


class InvestmentProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentProduct
        fields = [
            "id",
            "category",
            "name",
            "slug",
            "summary",
            "description",
            "min_amount",
            "expected_return_rate",
            "term_months",
            "is_active",
        ]


class InvestmentSerializer(serializers.ModelSerializer):
    product = InvestmentProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source="product", queryset=InvestmentProduct.objects.filter(is_active=True), write_only=True
    )

    class Meta:
        model = Investment
        fields = [
            "id",
            "product",
            "product_id",
            "amount",
            "status",
            "start_date",
            "maturity_date",
            "created_at",
        ]
        read_only_fields = ["status", "maturity_date", "created_at"]

    def validate(self, attrs):
        product = attrs["product"]
        if attrs["amount"] < product.min_amount:
            raise serializers.ValidationError(
                f"Minimum investment for {product.name} is {product.min_amount}."
            )
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class PortfolioSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioSnapshot
        fields = ["date", "total_value"]
