from .dev import *  # noqa: F401,F403

REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    "DEFAULT_THROTTLE_CLASSES": [],
    "DEFAULT_THROTTLE_RATES": {"anon": "1000/minute", "user": "1000/minute"},
}
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
PAYSTACK_SECRET_KEY = "test_secret_key"
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
