# Implementation Notes

## What was built

A Next.js 16 (App Router, TypeScript, Tailwind v4) frontend for the
email-broadcasting platform, scaffolded with `create-next-app` and built out
against `docs/architecture.md` and `docs/api-contract.md`. No backend was
running during development — everything here is built strictly against the
documented contract and has not been integration-tested against a live API.

### Structure

- `src/lib/types.ts` — TypeScript types mirroring every shape in
  `api-contract.md` (`AuthResponse`, `ClientSummary`, `UserSummary`,
  `UploadBatchSummary`, `EmailRecordResponse`, `CampaignSummary`, `Page<T>`,
  etc.).
- `src/lib/api.ts` — single `apiFetch<T>()` fetch wrapper. Reads
  `NEXT_PUBLIC_API_BASE_URL`, attaches `Authorization: Bearer <jwt>`,
  serializes JSON bodies (or passes `FormData` through untouched for
  multipart uploads), and throws a typed `ApiError` carrying
  `errorCode` / `message` from the contract's `{errorCode, message,
  timestamp}` error shape so pages can branch on specific codes (e.g.
  `ORG_NOT_IN_CLIENT_LIST`, `ACCOUNT_PENDING_APPROVAL`).
- `src/lib/auth.ts` — `setSession`, `getToken`, `getRole`, `getUsername`,
  `getUserId`, `logout`, plus `roleHomePath`/`roleLoginPath` helpers. Stores
  the JWT and role in cookies via `js-cookie` (`eb_token`, `eb_role`, plus
  `eb_username`/`eb_userid` for UI convenience). **Not httpOnly** — see the
  comment in the file: production should move login behind a Next.js Route
  Handler (BFF) that sets an httpOnly, Secure cookie instead of exposing the
  JWT to client-side JS.
- `src/proxy.ts` — the auth guard (see "Contract deviations" below for why
  it's `proxy.ts` and not `middleware.ts`). Reads the `eb_role` cookie,
  redirects unauthenticated users to the correct role's login page, redirects
  users with the wrong role to their own dashboard, and redirects
  already-logged-in users away from `/login/**` and `/register/**`.
- `src/components/` — `AppShell` (sidebar + topbar layout, one per role),
  `StatTile`, `StatusBadge`, `Pagination`, `FormError`/`FormSuccess`.

### Pages

- `/` — landing page with the three login buttons + register links.
- `(auth)/login/super-admin`, `/login/client`, `/login/user` — credential
  forms. Client login surfaces `ACCOUNT_PENDING_APPROVAL` /
  `ACCOUNT_DISABLED` / `ACCOUNT_REJECTED` with the specific copy requested.
- `(auth)/register/client` — client-side password-match check, then POSTs to
  `/auth/register/client`; on success auto-logs the new `ACTIVE`
  organization-backed client in. Handles `ORG_NOT_IN_CLIENT_LIST`,
  `USERNAME_TAKEN`, and `EMAIL_TAKEN` distinctly (none swallowed).
- `(auth)/register/freelancer` — multipart form (`addressProof` file input,
  `accept=".pdf,image/*"`). Does **not** auto-login (freelancers can't log in
  until approved); shows the "submitted, awaiting approval" message and a
  link to Client Login.
- `/super-admin/dashboard`, `/organizations`, `/clients`, `/clients/[id]`,
  `/clients/[id]/users`, `/users/[userId]/uploads`,
  `/uploads/[batchId]/records` — organization whitelist management, client
  approve/reject with status/type filters, and the record-level drill-down
  (email, status badge, invalid reason, validated-at) the spec calls out
  explicitly.
- `/client/dashboard`, `/users`, `/users/new`, `/users/[userId]` — client's
  aggregate stats, user list, user creation (shows the one-time
  `tempPassword` prominently), and per-user upload/campaign progress.
- `/user/dashboard`, `/uploads`, `/uploads/new`, `/uploads/[batchId]`,
  `/campaigns`, `/campaigns/new`, `/campaigns/[id]` — stat tiles including
  the explicit pending state, drag-and-drop upload, paginated/filterable
  record table, campaign creation restricted to batches with
  `validCount > 0`, and the campaign detail tiles
  (recipients/sent/opened/not-opened + status).

## Build / typecheck result

Both are clean:

```
npx tsc --noEmit          -> no output, exit 0
npm run build              -> "Compiled successfully", all 24 routes generated
npm run lint (eslint)      -> no errors, no warnings
```

`npm run build` output confirms the proxy (middleware) and all static/dynamic
routes registered correctly, including `ƒ Proxy (Middleware)`.

## Contract deviations / limitations (please read)

1. **`middleware.ts` → `proxy.ts`.** This `create-next-app` install pulled
   Next.js **16.2.11**, which is newer than my training data and ships with
   `AGENTS.md` telling agents to read `node_modules/next/dist/docs` before
   writing code. Next 16 deprecated the `middleware.ts` file convention in
   favor of `proxy.ts` (same runtime/semantics, renamed to avoid confusion
   with Express middleware — `middleware.ts` still works but is deprecated
   and the codemod migrates it to `proxy.ts`). The task spec asked for
   `src/middleware.ts`; I implemented the equivalent auth guard at
   `src/proxy.ts` instead, per the framework's current convention.

2. **Route groups can't share a URL.** The spec's page list implies
   `(super-admin)/dashboard`, `(client)/dashboard`, and `(user)/dashboard`
   all live under the literal path `/dashboard`. Next.js route groups
   (`(name)`) don't appear in the URL, so three different pages can't all
   resolve to the same `/dashboard` path — that's a build-time routing
   conflict, not something middleware can resolve (middleware only redirects
   between already-distinct routes). Each role instead gets its own
   top-level URL prefix: `/super-admin/**`, `/client/**`, `/user/**` (each
   with its own `layout.tsx` providing the role's `AppShell`). The auth
   groups (`/login/super-admin`, `/login/client`, `/register/client`, etc.)
   *do* use a literal `(auth)` route group since those paths are already
   distinct and don't collide.

3. **No cross-user aggregate endpoint.** `/client/dashboard` needs
   totals across all of a client's users' uploads. The contract only
   exposes `GET /client/users` and `GET /client/users/{userId}/uploads`
   (per-user), so the dashboard fetches every user's upload list and sums
   `totalRecords` / `validCount` / `invalidCount` / `softBounceCount`
   client-side. This is O(n) requests for n users — fine for a scaffold,
   but a real deployment with many users per client should add a dedicated
   backend aggregate endpoint.

4. **`CreateUserResponse.tempPassword`.** The contract's reusable "Shapes"
   section only defines `UserSummary` (no `tempPassword` field), but the
   `POST /client/users` endpoint description explicitly says the response
   includes a one-time `tempPassword`. Modeled as
   `CreateUserResponse extends UserSummary { tempPassword?: string }` rather
   than inventing a new shape — it's the documented endpoint behavior, just
   not listed in the shared type table.

5. **`mustResetPassword` is not actionable.** `AuthResponse` and the
   freelancer/user flows mention `mustResetPassword`, but the contract has
   no reset-password endpoint. The flag is captured in the auth response
   type but there's no UI to act on it (no endpoint to call) — noting this
   rather than inventing one.

6. **No password-reset / "forgot password" flow** exists anywhere in the
   contract, so none was built.

## Running it

```powershell
cd frontend
npm install
npm run dev
```

- Needs the backend reachable at `http://localhost:8080` (see
  `.env.local` → `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api`).
  Nothing will actually load data until that backend (being built in
  parallel in `../backend`) is running and its CORS config allows
  `http://localhost:3000` (per the contract, it already should).
- `npm run build` / `npx tsc --noEmit` / `npm run lint` all pass cleanly as
  of this writing, with no live backend involved (they only check the
  frontend compiles and types correctly — they cannot verify the API calls
  actually work end-to-end).
