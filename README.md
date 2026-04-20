# Fruit Store System

This repository is now separated into two clear applications:

- `frontend/`: Next.js admin frontend
- `backend/`: Express + MongoDB API and CMS backend

## Folder Structure

```text
.
├── frontend
│   ├── src
│   ├── public
│   └── package.json
├── backend
│   ├── src
│   ├── .env
│   └── package.json
└── package.json
```

## Run From Root

Install workspace dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev:frontend
```

Start the backend:

```bash
npm run dev:backend
```

## Run Per App

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## Notes

- The frontend runs on `http://localhost:3001` by default.
- The frontend uses `NEXT_PUBLIC_BACKEND_URL` and calls `${NEXT_PUBLIC_BACKEND_URL}/api`.
- If `NEXT_PUBLIC_BACKEND_URL` is not set locally, the frontend falls back to `http://localhost:4000/api`.
- Backend environment values live in `backend/.env`.
- Protected CMS routes require backend authentication.

## Vercel Deploy

Configure two separate Vercel projects:

Frontend project:

- Framework: Next.js
- Root Directory: `frontend`
- Build Command: `npm run build`
- Environment variables:
  - `NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain`
  - `NEXT_PUBLIC_SITE_URL=https://your-frontend-domain`

Backend project:

- Framework: Other / Node.js / Express
- Root Directory: `backend`
- Environment variables:
  - `MONGODB_URI`
  - `MONGODB_DB_NAME`
  - `BACKEND_PORT`
  - `CORS_ORIGINS`
  - `AUTH_SECRET`
  - `AUTH_COOKIE_NAME`
  - `AUTH_TOKEN_TTL_SECONDS`
  - `ADMIN_NAME`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

Legacy alias:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url/api
```

`NEXT_PUBLIC_API_URL` is still accepted for backward compatibility, but `NEXT_PUBLIC_BACKEND_URL` is the primary frontend variable.
