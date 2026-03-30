You are generating production-ready frontend scaffolding for a Next.js App Router project.

Project constraints:
- Framework: Next.js + React + TypeScript
- Existing app style: dark surfaces, rounded cards, clean data-dense layout
- Backend API base URL: http://localhost:8080
- Protected routes require: Authorization: Bearer <token>
- Dates in requests and responses are RFC3339
- Some backend errors are plain text instead of JSON

Use these local files as source of truth:
- openapi/backend-api.yaml
- lib/api/types.ts
- lib/api/client.ts

Goals:
1. Build reusable hooks for API operations by feature.
2. Keep token handling centralized.
3. Add robust loading and error states.
4. Wire pages to real backend data without changing overall design language.

Implement the following:

1. API hooks
- Create hooks folder structure:
  - app/hooks/api/useAuth.ts
  - app/hooks/api/usePortfolios.ts
  - app/hooks/api/usePositions.ts
  - app/hooks/api/useTransactions.ts
  - app/hooks/api/useTax.ts
  - app/hooks/api/useAnalytics.ts
  - app/hooks/api/useMarketData.ts
- Each hook should expose:
  - loading state
  - error state
  - action functions (fetch/create/update/delete)
- Parse errors defensively:
  - if API error has message, show it
  - fallback to generic message

2. Auth state
- Create a lightweight auth store/context with:
  - token
  - user
  - login/logout/register actions
- Persist token in localStorage.
- Restore session on client load.
- Redirect to login when token is missing for protected mainApp pages.

3. Data integration targets
- Wire these pages/components first:
  - app/(pages)/auth/login/page.tsx
  - app/(pages)/auth/register/page.tsx
  - app/(pages)/mainApp/portfolios/page.tsx
  - app/(pages)/mainApp/portfolio/page.tsx
  - app/components/mainApp/positions/positionsView.tsx
  - app/(pages)/mainApp/transactions/page.tsx
  - app/(pages)/mainApp/tax/page.tsx
  - app/(pages)/mainApp/analytics/performance/page.tsx
  - app/(pages)/mainApp/analytics/benchmarks/page.tsx

4. UX requirements
- Skeletons or loading placeholders for initial fetches.
- Inline, human-friendly error banners with retry actions.
- Empty states with clear call-to-action.
- Confirm dialog before destructive deletes.

5. Request behavior
- For analytics endpoints, pass optional from/to RFC3339 filters.
- For benchmark comparison, default benchmark to SPY when none is selected.
- For tax report, default year to current year on frontend if user did not choose one.

6. Output rules
- Create or edit files directly in the repo.
- Keep code strongly typed with existing interfaces.
- Do not add new dependencies unless strictly needed.
- Keep components modular and avoid very large files.

Success criteria:
- User can login/register and remain authenticated.
- User can list/create/update/delete portfolios.
- User can list/add/update/delete positions.
- User can list/add transactions.
- User can view tax report, unrealized gains, and harvesting opportunities.
- User can view snapshots, performance metrics, and benchmark comparison.
