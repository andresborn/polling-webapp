# Code review guide: post-MVP cleanup

## Overview

The core functionality — creating polls, publishing them, voting (authenticated and anonymous), and now closing polls — works. This is a snapshot review of the codebase as it stands, meant to inform cleanup before the next round of features rather than to block anything.

Three themes came up repeatedly while reading through the code:

1. **The service layer doesn't have one consistent return contract.** Some functions return `{success, result, error}`, some return the bare value or `null`, one lets exceptions propagate uncaught. Callers (API routes, pages, components) end up handling three or four different shapes for what is conceptually the same kind of call.
2. **Logging is ad hoc.** It's all raw `console.log`/`console.error` calls, several error paths are silently swallowed with no logging at all, and there's no structured or leveled logging, no error boundary, and no observability tooling.
3. **There is no test coverage at all** — no framework installed, no test files anywhere in the repo.

Along the way, one real correctness bug turned up: **closed polls can still be voted on** if the `/api/vote` endpoint is hit directly. The "closed" rule is enforced in the UI (`voting-card.tsx`) and in `updatePoll`'s one-way guard, but `service/vote.ts`'s `createVote` never checks `poll.closed` before inserting a vote. This is called out again in the testing section, since a regression test would have caught it.

The rest of this document goes through each theme in more detail, with file references, followed by a short list of smaller findings.

---

## 1. Standardize service-layer return patterns

All business/data-access logic lives in `service/poll.ts`, `service/options.ts`, and `service/vote.ts`. Across the 11 exported functions in these files, there are **four different return patterns**:

**Pattern A — `{success, result, error}` envelope** (the majority: `getUserPolls`, `createPoll`, `updatePoll`, `deleteUserPoll`, `deletePoll`, `createOption`, `deleteUserOption`, `deleteOption`, `createVote`, `insertAuthenticatedVote`, `insertAnonVote`)

```ts
// service/poll.ts:74-75 — success
const result = await db.insert(poll).values({ userId, label }).returning();
return { success: true, result, error: null };

// service/poll.ts:160-167 — failure, caught exception
export const deletePoll = async (id: string) => {
  try {
    const result = await db.delete(poll).where(eq(poll.id, id)).returning();
    return { success: true, result, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, result: null, error: e };
  }
};
```

**Pattern B — bare value or `null`, exceptions swallowed** (`getPoll`, `hasUserVotedOnPoll`)

```ts
// service/poll.ts:43-56
export const getPoll = async (pollId: string) => {
  try {
    return await db.query.poll.findFirst({ where: { id: pollId }, with: { options: true, votes: true } });
  } catch (e) {
    console.log(e); // note: console.log, not console.error — see logging section
    return null;
  }
};
```
"Not found" and "the DB threw" are indistinguishable here — both just return `null`.

**Pattern C — no try/catch, exceptions propagate** (`getUserPollWithOptions`, `service/poll.ts:11-23`)

The only function in the service layer with no error handling at all. A DB exception here propagates straight out of the Server Component that calls it (`app/dashboard/poll/[id]/page.tsx:18`).

**Pattern D — truthy-check private helper** (`isPollOwnedByUser`, `service/poll.ts:170-173`)

```ts
const isPollOwnedByUser = async (pollId: string, userId: string) => {
  const result = await db.query.poll.findFirst({ where: { id: pollId } });
  return result && result.userId === userId;
};
```
Returns `Poll | false | undefined`, not a clean `boolean`, even though every call site only uses it in a truthy `if`.

### The sharpest inconsistencies

- **`deleteUserPoll` returns `error: null` on failure** (`service/poll.ts:152-158`) — when the poll isn't owned by the user, it returns `{success: false, result: null, error: null}`. Any caller that branches on `error` rather than `success` would misread this as "no error."
- **The `error` payload's type varies even within Pattern A**: sometimes `z.treeifyError(...)` (a structured Zod tree), sometimes a raw un-treeified Zod error, sometimes a hand-built `new Error("...")` used purely as a data value (never thrown), sometimes the raw caught `unknown`/`any` from a `catch` block.
- **Three different client-visible error JSON shapes** across the API routes for the same underlying service contract:
  - `app/api/poll/route.ts` `POST`/`DELETE`: `JSON.stringify(error)` — serializes whatever the error happens to be.
  - `app/api/poll/route.ts` `PUT` and `app/api/vote/route.ts`: `error instanceof Error ? {name, message} : {}` — silently drops non-`Error` errors (e.g. Zod trees) to `{}`.
  - `app/api/poll/route.ts` `GET`'s `?id=` branch: no success/error handling at all — the raw result (possibly `undefined`) is returned with a 200 status regardless of what happened.
- **The service-layer error detail mostly never reaches the user anyway.** Client components (`poll-config.tsx`, `poll-config-dialog.tsx`, `polls-table.tsx`, `voting-card.tsx`) only check `res.ok` and, at best, `console.error` the parsed body — none of them read `body.error` to show anything to the user.

### Recommendation

Introduce a single discriminated union — there's currently no `Result<T, E>` type or custom `Error` subclass anywhere in the codebase to build on, so this would be new, not a refactor of something existing:

```ts
type Result<T, E = AppError> = { ok: true; data: T } | { ok: false; error: E };
```

Paired with a small set of typed error variants (e.g. `NotFoundError`, `ValidationError`, `ForbiddenError`, `DatabaseError`) instead of the current mix of `Error`/`unknown`/Zod-tree. This gives callers a single, `instanceof`-checkable contract and gives API routes one place to map error kind → HTTP status, instead of three different ad hoc serializations.

**Files that would need to change**, roughly in this order: `service/poll.ts`, `service/options.ts`, `service/vote.ts` first, then the three route handlers that destructure the current envelope (`app/api/poll/route.ts`, `app/api/options/route.ts`, `app/api/vote/route.ts`), then — lower priority, since they mostly discard error detail today anyway — the client components that call these routes.

---

## 2. Improve logging

**Current baseline:** no logging library is installed (`package.json` has no pino/winston/etc.), no custom logger utility exists, and every log call is a raw `console.log`/`console.error`. There's no structured or leveled logging, no request correlation, nothing persisted or shipped anywhere (it's all Docker stdout via `Dockerfile` + `compose.yaml`), and no observability tooling (no Sentry, no `@vercel/analytics`, no OpenTelemetry). There's also no `app/error.tsx` or `app/global-error.tsx`, so an uncaught render/server error has no app-level logging hook at all.

### Concrete problems

- **Inconsistent level**: `service/poll.ts:53` uses `console.log(e)` in `getPoll`'s catch, while every other catch block in the service layer uses `console.error(e)`.
- **Silently swallowed errors with zero logging:**
  - `service/vote.ts:89-91` and `service/vote.ts:107-109` (`insertAuthenticatedVote`, `insertAnonVote`) — catch DB errors but don't log them at all, unlike every other service catch block.
  - `components/signin-card.tsx:15-24` and `components/signup-card.tsx:16-23` — the error branch after a failed sign-in/sign-up literally does nothing (a `// set error` comment is left where handling should be).
  - The repeated `if (!res.ok) return;` pattern with no logging in `components/poll-config-dialog.tsx:33` (delete poll), `components/polls-table.tsx:41` (create poll), and `components/poll-config.tsx:46,66` (add/delete option).
- **Leftover debug logs**: `components/bar-chart.tsx:47` (`console.log(props.chartData)`, runs every render) and `components/voting-card.tsx:33` (`console.log(vs)`).
- **Unguarded paths with no logging at all if they fail**: `request.json()` in the API route handlers isn't wrapped in a try/catch, and `getUserPollWithOptions`'s uncaught throw (Pattern C above) means both paths fail with no app-level log line, just Next's default error handling.

### Recommendation

- Add one small shared server-side logger utility (e.g. `lib/logger.ts`) with levels, used consistently from `service/*.ts` and route handlers instead of raw `console.*`. At minimum: level, message, the error itself, and a request-scoped correlation id. Sized for the current stdout/Docker deployment model — this doesn't need a hosted APM, just consistency.
- Add `app/error.tsx` / `app/global-error.tsx` so uncaught errors get routed through that same logger instead of disappearing into Next's default handling.
- On the client side, the immediate fix is smaller: stop swallowing errors silently. At minimum log them, and store visible error state so the UI can eventually surface something to the user — right now several user-facing actions (sign-in, sign-up, delete poll, add/delete option) fail completely silently from the user's perspective.

---

## 3. Add tests, and where

**Current baseline:** zero test infrastructure. No test framework in `package.json`, no config files (`jest.config`, `vitest.config`, `playwright.config`), no test files anywhere in the repo.

**Suggested stack:** Vitest for unit/service/component tests (with `@testing-library/react` for components), Playwright for end-to-end. This fits the Next.js App Router + Drizzle + Zod stack without much ceremony.

One thing to decide early: `service/*.ts` talks to Drizzle/Postgres directly (`db/drizzle.ts`), with no repository interface in between. Service-layer tests will need either a real test database (e.g. a dockerized test schema, reusing `compose.yaml`) or mocking the `db` object — worth picking one approach up front rather than mixing both.

### Where to start, roughly in order of value vs. cost

1. **Pure logic, no DB or DOM needed** — cheapest tests to write, good first PR:
   - Zod schema validation in `db/schema/*.ts` (valid/invalid payloads for `pollInsertSchema`, `pollUpdateSchema`, `voteInsertSchema`, etc.)
   - The pct/`isLeading` math in `components/results-bars.tsx` — check the 0-vote case and tie case, both currently unverified
   - `lib/utils.ts`'s `cn()` (low value, but trivial)

2. **`lib/with-auth.ts`** — one HOF that every protected route depends on. Mock `auth.api.getSession` and cover both the 401 path and the pass-through-with-user path. High coverage payoff for one small test file.

3. **Service-layer business rules**, against a test DB — this is the most business-critical logic in the app:
   - `updatePoll`'s one-way "can't reopen a closed poll" guard, and the ownership checks in `poll.ts`/`options.ts`
   - `vote.ts`'s eligibility rules: poll must be published, must not be expired, authenticated-voting polls require a `userId`, anonymous polls require an `anonId`, duplicate votes are prevented via the unique constraints
   - This is exactly where the missing `poll.closed` check in `createVote` (mentioned in the overview) should be fixed and then locked in with a regression test — "voting on a closed poll should fail" isn't covered anywhere today.

4. **Component tests:**
   - `components/badges/closed-badge.tsx`, `published-badge.tsx`, `auth-badge.tsx` — trivial, good starter set
   - `components/voting-card.tsx` — the closed/localStorage/`hasVoted` logic; verify vote buttons disable and `submitVote` no-ops when `pollClosed` is true
   - `components/poll-config-dialog.tsx` — verify the "Close" button disables once `poll.closed` is true and never re-enables

5. **One end-to-end flow** tying it all together: create → publish → vote → close → verify voting is now blocked → verify results still render. The closed-poll feature is a good walking skeleton for this since it's already fully mapped end to end (schema → service → API → two UI surfaces): `db/schema/poll.ts`, `service/poll.ts`, `app/api/poll/route.ts`, `components/badges/closed-badge.tsx`, `components/poll-config-dialog.tsx`, `components/poll-config.tsx`, `app/poll/[id]/page.tsx`, `components/results-bars.tsx`, `components/voting-card.tsx`, `components/live-voting-indicator.tsx`.

### One extraction worth doing for testability

The vote-tallying logic (building a vote-count map per option, computing chart data) is currently inlined directly in `app/poll/[id]/page.tsx`, a Server Component. As written, it can only be exercised via a full render/e2e test. Pulling it out into a plain function (e.g. alongside `service/poll.ts` or a new `lib/tally.ts`) would make it unit-testable in isolation — worth doing before or alongside adding tests for that page.

---

## 4. Smaller findings

- `components/bar-chart.tsx` looks like a superseded results view — it's commented out at its only call site in `app/poll/[id]/page.tsx`. Worth removing or reviving deliberately.
- `app/api/test/route.ts` (returns a trivial `{hello: "world"}`) looks like leftover scaffolding.
- `db/columns.helpers.ts` defines a `deleted_at` timestamp column, but nothing in the service layer implements soft-delete — all deletes today are hard deletes. Worth a deliberate decision either way rather than leaving an unused column.
- `db/codecs.ts`'s `isoDatetimeToDate` codec doesn't appear to be used anywhere.
- `isPollOwnedByUser` (`service/poll.ts:170`) returns `Poll | false | undefined` rather than a real `boolean`, due to relying on `&&` truthiness instead of an explicit comparison.
