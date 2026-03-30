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
- The frontend calls the backend API at `http://localhost:4000/api` by default.
- Backend environment values live in `backend/.env`.
- Protected CMS routes require backend authentication.
