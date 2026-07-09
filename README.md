# Prime Vest

Investment platform. Django REST Framework API (JWT auth) + Next.js/TypeScript frontend, PostgreSQL, containerized with docker-compose.

## Stack

- **Backend**: Django 5 + Django REST Framework, `djangorestframework-simplejwt` for JWT auth, PostgreSQL.
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS.
- **Local dev**: docker-compose (`db`, `backend`, `frontend` services).

## Quickstart (Docker)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Health check: http://localhost:8000/api/health/

On first run, apply migrations and create an admin user:

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

Django admin: http://localhost:8000/admin/

## Environment variables

- Root `.env` (used by `db` and `backend` services) — copy from `.env.example`.
- `frontend/.env.local` (used by the `frontend` service) — copy from `frontend/.env.local.example`.

Both already have working local-dev defaults committed as `.env`/`.env.local` is gitignored but pre-populated after scaffold setup; regenerate `DJANGO_SECRET_KEY` before deploying anywhere real.

## Auth flow

1. `POST /api/auth/register/` — create a user (`email`, `password`).
2. `POST /api/auth/login/` — returns `{ access, refresh }` JWT tokens.
3. `POST /api/auth/refresh/` — exchange a refresh token for a new access token.
4. `GET /api/auth/me/` — requires `Authorization: Bearer <access>`.

The frontend's `/login` page exercises this flow and `/dashboard` calls `/api/auth/me/` to prove the token round-trip works.

## Project layout

```
backend/    Django project (config/, users/, core/)
frontend/   Next.js app (src/app, src/lib)
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

Frontend:

```bash
cd frontend
npm install
npm run dev
```
