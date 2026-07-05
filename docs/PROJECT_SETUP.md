# Project Setup

## Install Dependencies

Install dependencies from the repository root:

```bash
npm install
```

This project uses npm workspaces for:

- `frontend/`
- `backend/`

You can also install dependencies per app if needed:

```bash
cd frontend && npm install
cd backend && npm install
```

## Run Frontend

From the repository root:

```bash
npm run dev:frontend
```

Or from the frontend folder:

```bash
cd frontend
npm run dev
```

Default local frontend URL:

- `http://127.0.0.1:3001`

## Run Backend

From the repository root:

```bash
npm run dev:backend
```

Or from the backend folder:

```bash
cd backend
npm run dev
```

Default local backend URL:

- `http://127.0.0.1:4000`

Health check:

- `http://127.0.0.1:4000/api/health`

## Required Environment Variables

Frontend example file:

- `frontend/.env.example`

Recommended frontend variables:

```env
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:4000
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3001
```

Backend example file:

- `backend/.env.example`

Recommended backend variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority&appName=<app-name>
MONGODB_DB_NAME=fruit-store
MONGODB_ENABLE_LOCAL_FALLBACK=true
MONGODB_FALLBACK_URI=mongodb://127.0.0.1:27017/fruit-store
BACKEND_PORT=4000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001
AUTH_SECRET=replace-with-a-long-random-secret
AUTH_COOKIE_NAME=fruit_store_auth
AUTH_TOKEN_TTL_SECONDS=604800
ADMIN_NAME=Fruit Store Admin
ADMIN_EMAIL=admin@fruitstore.com
ADMIN_PASSWORD=admin12345
```

## MongoDB Setup

The backend requires `MONGODB_URI`.

You can use:

- MongoDB Atlas
- Local MongoDB
- Docker Compose local MongoDB

To start local MongoDB with Docker:

```bash
docker compose up -d mongo
```

This uses the `mongo` service in the root `docker-compose.yml` and exposes MongoDB on port `27017`.

The backend supports development fallback from Atlas to a local MongoDB URI when configured to do so.

## JWT Setup

The current authentication flow uses a signed token with JWT-style structure plus an HTTP-only auth cookie.

Required backend auth settings:

- `AUTH_SECRET`
- `AUTH_COOKIE_NAME`
- `AUTH_TOKEN_TTL_SECONDS`

The default seeded admin credentials come from:

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Change these values for real deployments.

## Development Workflow

Recommended local workflow:

1. Start MongoDB.
2. Configure `backend/.env`.
3. Configure `frontend/.env.local` or equivalent local frontend env file.
4. Run `npm run dev:backend`.
5. Run `npm run dev:frontend`.
6. Sign in through the login page.
7. Verify backend health and key module flows before feature work.

## Common Troubleshooting

### Frontend Cannot Reach Backend

- Confirm backend is running on port `4000`
- Confirm `NEXT_PUBLIC_BACKEND_URL` points to the backend origin
- Confirm CORS includes the active frontend origin

### MongoDB Connection Fails

- Confirm `MONGODB_URI` is correct
- If using Atlas, confirm your IP is allowed
- If using local Docker, run `docker compose up -d mongo`
- Confirm `MONGODB_DB_NAME` matches the intended database

### Authentication Fails

- Confirm seeded admin values in `backend/.env`
- Confirm `AUTH_SECRET` is set
- Confirm browser cookies are not blocked for the local environment
- Confirm the frontend and backend URLs match allowed CORS origins

### Protected Pages Redirect To Login

- Confirm login completed successfully
- Confirm `/api/auth/me` returns the authenticated user
- Confirm local storage and auth cookie were created

## Folder Locations

- Root workspace scripts: `package.json`
- Frontend app: `frontend/`
- Backend app: `backend/`
- Backend entry files: `backend/src/app.js`, `backend/src/server.js`
- Backend API routes: `backend/src/routes/api.js`
- Frontend App Router pages: `frontend/src/app`
- Shared frontend helpers: `frontend/src/lib`
- Shared frontend hooks: `frontend/src/hooks`

## Basic Deployment Notes

Deploy frontend and backend as separate applications.

Frontend:

- Root directory: `frontend`
- Build command: `npm run build`
- Runtime: Next.js

Backend:

- Root directory: `backend`
- Start command: `npm run start`
- Runtime: Node.js / Express

Deployment reminders:

- Set all production environment variables
- Use a strong production `AUTH_SECRET`
- Configure production CORS origins explicitly
- Use a production MongoDB deployment
- Replace default admin credentials
