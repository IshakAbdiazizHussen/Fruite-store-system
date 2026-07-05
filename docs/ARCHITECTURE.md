# Architecture

## Current Architecture

The project is split into two applications at the repository root:

- `frontend/` for the Next.js App Router admin interface
- `backend/` for the Node.js, Express, and MongoDB API

The backend follows an MVC-style structure inside `backend/src`. The frontend is route-driven and organized around dashboard and admin feature areas.

## Backend Structure

Current backend folders:

- `backend/src/config` for database, auth, and CORS configuration
- `backend/src/controllers` for request handlers
- `backend/src/data` for static or seed-related data support
- `backend/src/middleware` for authentication, cache rules, uploads, and error handling
- `backend/src/models` for MongoDB schemas
- `backend/src/routes` for API route definitions
- `backend/src/services` for business logic
- `backend/src/utils` for reusable helpers
- `backend/src/app.js` for Express app setup
- `backend/src/server.js` for environment loading, database startup, seed execution, and server boot

## Frontend Structure

Current frontend folders:

- `frontend/src/app` for App Router pages and layouts
- `frontend/src/app/admin` for admin-facing routes and components
- `frontend/src/app/dashboard` for dashboard-facing routes and components
- `frontend/src/hooks` for reusable feature hooks
- `frontend/src/components` for shared UI pieces
- `frontend/src/lib` for API clients, auth helpers, caching helpers, theme helpers, and utilities

The frontend currently contains both `admin` and `dashboard` route groups. Both use authenticated layouts and shared API access patterns.

## MVC Flow

The backend request flow should remain:

1. Route receives the HTTP request.
2. Middleware applies authentication, caching, upload handling, and shared protections.
3. Controller validates request shape and delegates work.
4. Service contains business rules and data operations.
5. Model reads or writes MongoDB documents.
6. Controller returns the final API response.

This separation should stay in place. Controllers should remain thin, and business logic should stay in services.

## API Flow

The API is mounted under `/api`.

- Public routes include `/api`, `/api/health`, and `/api/frontend-content`
- Authentication starts at `/api/auth/login`
- Protected routes are added through a router guarded by authentication middleware
- Feature endpoints include inventory, orders, purchases, sales, settings, suppliers, and user profile image actions

The frontend talks to the backend through `frontend/src/lib/apiClient.js`, which resolves the backend base URL from environment variables and sends credentials for authenticated requests.

## Authentication Flow

The current authentication flow is:

1. User submits credentials from the login page.
2. Frontend calls `POST /api/auth/login`.
3. Backend verifies the admin user and password.
4. Backend returns a signed auth token and safe user payload.
5. Backend also sets an HTTP-only auth cookie.
6. Frontend stores the token and user in local storage.
7. Protected frontend layouts call `/api/auth/me` to confirm the active session.
8. Backend authentication middleware accepts either the bearer token or the auth cookie.

The current token is a custom signed token shaped like a JWT. Future changes should preserve compatibility unless there is a strong reason and a migration plan.

## Database Model Responsibility

Current model responsibilities:

- `AdminUser` stores administrator identity, role, status, login state, and profile image
- `InventoryItem` stores stock, category, unit, price, expiry, and item status
- `Order` stores customer orders and fulfillment status
- `Purchase` stores supplier purchases and purchase amounts
- `Sale` stores sales records
- `SalesAnalytics` stores reporting snapshots
- `Supplier` stores supplier profiles and supplier-related business details
- `Settings` stores profile, notification, regional, and security settings
- `FrontendContent` stores editable branding and content shown in the frontend

## Folder Responsibility

Keep responsibilities clear:

- `config` defines how the system connects and behaves
- `routes` maps endpoints to controllers
- `controllers` translate HTTP requests into application actions
- `services` own business rules and data workflows
- `models` define persistence rules
- `middleware` enforces cross-cutting concerns
- `utils` provides low-level reusable helpers
- `hooks` encapsulate frontend data-fetching and UI logic
- `components` and route components render user-facing screens
- `lib` centralizes frontend integration helpers

## How New Features Should Be Added

New features should be added by feature, not by shortcut.

1. Add or update the MongoDB model only if the business data changes.
2. Add service logic for the new business rules.
3. Add controller methods for request and response handling.
4. Add or extend API routes under the existing `/api` structure.
5. Add or extend frontend hooks for backend communication.
6. Add route pages and UI components inside the correct frontend feature area.
7. Keep naming aligned with existing modules such as inventory, suppliers, purchases, or reports.

## Architecture Decisions That Must Not Change Without Reason

- Do not remove the `frontend/` and `backend/` workspace split
- Do not bypass the backend by placing business logic directly in the frontend
- Do not move business logic from services into controllers
- Do not collapse all routes into a single large file
- Do not rename or restructure the MVC folders without a clear migration reason
- Do not replace MongoDB models with ad hoc data handling
- Do not break the existing authenticated API contract without versioning or migration planning
