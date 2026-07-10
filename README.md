# Prime Vest

Investment platform. Django REST Framework API (JWT auth) + Next.js/TypeScript frontend, PostgreSQL, containerized with docker-compose.

## Stack

- **Backend**: Django 5 + Django REST Framework, `djangorestframework-simplejwt` for JWT auth, PostgreSQL, Paystack payments.
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS, Recharts for the portfolio performance chart.
- **Local dev**: docker-compose (`db`, `backend`, `frontend` services).

## What's here

**Public site**: Home, About, Investment Services (Property, Portfolio Management, Wealth Building,
Advisory, Business Funding, Future Opportunities), How It Works, Contact (form + WhatsApp + Google
Maps embed), FAQ, Blog, and site search — all served from admin-editable content in the `content` app.

**Investor dashboard** (`/dashboard`, JWT-authenticated): profile + KYC verification status, investment
portfolio with a performance chart, deposits (Paystack card/Apple Pay/Google Pay, bank transfer, or a
feature-flagged crypto placeholder), withdrawal requests, earnings summary, notifications, and an
in-house live chat widget with the support team.

**Admin**: Django Admin (`/admin/`) is the system of record — approve investors, publish blog posts,
manage investment products, review deposits/withdrawals with bulk actions, export CSV reports, and
send announcements. A staff-only `/admin` page in the Next.js app shows key stats and deep-links into
Django Admin for day-to-day management.

## Quickstart (Docker)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Health check: http://localhost:8000/api/health/

On first run, apply migrations (this also seeds investment products, FAQs, team bios, milestones, and
sample blog posts) and create an admin user:

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

Django admin: http://localhost:8000/admin/

## Environment variables

- Root `.env` (used by `db` and `backend` services) — copy from `.env.example`.
- `frontend/.env.local` (used by the `frontend` service) — copy from `frontend/.env.local.example`.

Both already have working local-dev defaults committed as `.env`/`.env.local` is gitignored but
pre-populated after scaffold setup; regenerate `DJANGO_SECRET_KEY` before deploying anywhere real.

Several features are wired to real third-party services but need credentials before they're fully
live — they degrade gracefully without them:

| Feature | Env var(s) | Without it |
|---|---|---|
| Card / Apple Pay / Google Pay deposits | `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY` | Bank transfer still works; card deposits return a clear error |
| Outbound email (welcome, password reset, deposit/withdrawal updates) | `EMAIL_BACKEND`, `EMAIL_HOST*` | Emails print to the backend container's console |
| Google Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics script simply isn't loaded |
| Google Maps embed on Contact page | set `google_maps_embed_url` in Django Admin → Site Settings | Map section is hidden |
| Cryptocurrency deposits | `CRYPTO_PAYMENTS_ENABLED` | Shown as "coming soon" in the UI (no processor is wired yet — see below) |

Newsletter subscribers and contact messages are stored in the database and manageable from Django
Admin; connecting a real email service provider (Mailchimp, etc.) is a follow-up once one is chosen.
Live chat is self-hosted (polling-based, no third-party widget).

## Auth flow

1. `POST /api/auth/register/` — create a user (`email`, `password`).
2. `POST /api/auth/login/` — returns `{ access, refresh }` JWT tokens.
3. `POST /api/auth/refresh/` — exchange a refresh token for a new access token.
4. `GET /api/auth/me/` — requires `Authorization: Bearer <access>`.
5. `GET/PATCH /api/auth/profile/` — investor profile, including KYC verification status.
6. `POST /api/auth/password-reset/` + `POST /api/auth/password-reset/confirm/` — password reset.

The frontend's `/register` and `/login` pages exercise this flow; `/dashboard` calls
`/api/auth/profile/` to prove the token round-trip works and to check verification status.

## Project layout

```
backend/    Django project
  config/         settings (base/dev/prod/test), urls
  users/          auth, investor profiles, password reset
  investments/    investment products, investments, portfolio snapshots
  transactions/   deposits, withdrawals, earnings
  payments/       Paystack integration
  content/        blog, testimonials, team, milestones, FAQ, site settings, contact, newsletter, search
  notifications/  in-app notifications & announcements
  chat/           investor <-> admin live chat
  core/           health check, admin stats, shared email helper
frontend/   Next.js app
  src/app/(marketing)/   public site + auth pages (shared Navbar/Footer layout)
  src/app/dashboard/     investor dashboard (sidebar layout, JWT-guarded)
  src/app/admin/         staff-only stats overview
  src/components/        ui primitives, marketing components, dashboard components
  src/lib/                API clients (server-side content fetchers + client-side authenticated fetchers)
```

## Running without Docker

Backend:

```bash
cd backend
python -m venv .venv && .venv/Scripts/activate  # or source .venv/bin/activate
pip install -r requirements.txt
# update DATABASE_URL in .env to point at a local/remote Postgres instance (not the "db" docker hostname)
python manage.py migrate
python manage.py runserver
```

Run the backend test suite (uses a dedicated `config.settings.test` module — no external services needed):

```bash
python manage.py test --settings=config.settings.test
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Deploying to production

- Set `DJANGO_SETTINGS_MODULE=config.settings.prod` — this enables `SECURE_SSL_REDIRECT`, HSTS, and
  secure cookies. SSL termination (the actual certificate) is handled by your hosting provider or
  reverse proxy (e.g. Let's Encrypt via nginx/Caddy) — it isn't something application code provides.
- Regenerate `DJANGO_SECRET_KEY` and set real `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY`, SMTP
  credentials, and `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- User-uploaded media (blog covers, team photos, testimonial avatars) is served from local disk in
  dev; swap `MEDIA_ROOT`/`DEFAULT_FILE_STORAGE` for cloud storage (S3, etc.) in production.
