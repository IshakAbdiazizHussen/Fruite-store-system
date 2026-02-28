# Backend Setup (Node.js + Express)

## 1) Install dependencies

Run from project root:

```bash
npm install
```

## 2) Configure environment

Copy:

```bash
cp backend/.env.example .env
```

Edit `.env` if needed:

- `BACKEND_PORT=4000`
- `CORS_ORIGINS=https://localhost:3000,http://localhost:3000`

## 3) Run backend

```bash
npm run backend:dev
```

Server starts at:

- `http://localhost:4000`
- Health check: `http://localhost:4000/api/health`
