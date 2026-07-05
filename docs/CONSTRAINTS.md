# Constraints

## Technical Constraints

- Preserve the current workspace split: `frontend/` and `backend/`
- Preserve the backend MVC-style structure inside `backend/src`
- Keep the frontend on the Next.js App Router structure already in use
- Keep React, JavaScript, Tailwind CSS, and existing reusable component patterns consistent
- Treat Shadcn-style component expansion as incremental, not a full UI rewrite
- Do not redesign or replace the existing architecture without clear business need

## Security Rules

- All protected backend routes must stay behind authentication middleware
- Never expose secrets in frontend code
- Keep `AUTH_SECRET` strong and environment-based
- Keep auth cookies HTTP-only
- Validate user input before database writes
- Sanitize uploaded files and restrict accepted upload types and size
- Do not trust local storage alone for backend authorization
- Avoid logging sensitive data such as tokens, passwords, or raw secrets

## Code Quality Rules

- Keep controllers thin
- Keep business logic inside services
- Keep models focused on data structure and persistence
- Reuse helpers instead of duplicating request logic
- Prefer small, clear functions over large mixed-responsibility files
- Follow current naming and folder conventions
- Do not introduce hidden side effects in shared utilities

## UI and UX Rules

- Keep the UI clean, professional, and business-focused
- Maintain consistency across dashboard and admin flows
- Use readable layouts, clear spacing, and obvious action states
- Add loading, empty, success, and error states for user actions
- Avoid visual redesigns that break current navigation patterns without approval
- Keep mobile and desktop behavior usable

## API Rules

- Keep the API rooted at `/api`
- Use clear resource-based endpoints
- Return consistent JSON responses
- Use proper HTTP methods for create, read, update, and delete behavior
- Protect non-public routes by default
- Avoid silent breaking changes to existing endpoint contracts

## Database Rules

- Use MongoDB models for persistent business data
- Keep required fields explicit
- Keep identifiers unique where the business process depends on uniqueness
- Avoid schema changes without reviewing seed logic, frontend forms, and API consumers
- Do not store plaintext passwords
- Preserve data integrity between inventory, sales, purchases, suppliers, and orders

## Performance Rules

- Avoid unnecessary duplicate fetches from the frontend
- Keep dashboard screens responsive under normal business data volumes
- Use caching only where it fits the data freshness requirement
- Be careful with large payloads and unbounded list responses
- Avoid blocking startup or request flow with unnecessary heavy work

## Testing Rules

- Every business-critical feature should have a test plan before release
- Backend changes should include API-level validation coverage
- Frontend changes should be checked for loading, error, and empty states
- Regression checks should cover authentication and core business modules
- Because the current repo does not yet contain automated tests, every new feature should include a practical path toward adding them

## What Developers Must Avoid

- Do not modify application logic when only documentation is required
- Do not rename folders casually
- Do not move files without architectural reason
- Do not place backend secrets in frontend environment variables
- Do not bypass services to write database logic directly in routes or UI code
- Do not add fragile one-off patterns that future developers cannot reuse

## Rules For Future Codex Changes

- Codex should inspect the current structure before making changes
- Codex should preserve the existing architecture unless explicitly asked to change it
- Codex should add new work in the correct module and folder
- Codex should not rewrite stable areas just to match preference
- Codex should keep documentation, setup notes, and environment expectations aligned with real code
- Codex should include validation, error handling, loading states, security, and scalability considerations in future feature work
