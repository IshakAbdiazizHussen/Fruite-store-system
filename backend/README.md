# Backend Setup (Node.js + Express)

## 1) Install dependencies

Run from the backend folder:

```bash
cd backend
npm install
```

## 2) Configure environment

Copy:

```bash
cp .env.example .env
```

Edit `.env` if needed:

- `BACKEND_PORT=4000`
- `CORS_ORIGINS=https://localhost:3000,http://localhost:3000`
- `MONGODB_URI=your-mongodb-atlas-connection-string`
- `MONGODB_DB_NAME=fruit-store`
- `AUTH_SECRET=your-long-random-secret`
- `ADMIN_EMAIL=admin@fruitstore.com`
- `ADMIN_PASSWORD=admin12345`

Example Atlas URI shape:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority&appName=<app-name>
```

If your Atlas user password contains special characters, URL-encode it before placing it in the connection string.

## 3) Run backend

```bash
npm run dev
```

Server starts at:

- `http://localhost:4000`
- Health check: `http://localhost:4000/api/health`

The backend now waits for MongoDB to connect before it starts accepting requests.

## 4) Authentication

Login:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fruitstore.com","password":"admin12345"}'
```

The protected CMS routes now require authentication through:

- Bearer token: `Authorization: Bearer <token>`
- Or the auth cookie returned by `/api/auth/login`
