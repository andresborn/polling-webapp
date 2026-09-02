## Paths

- /dashboard (private): View the polls you own.
- /dashboard/poll/[id] (private): Edit poll; add/delete options, publish poll, delete, edit name.
- /poll/[id] (public): View a published poll with real-time data of voting, vote.

## TODOs

- [x] Refactor /dashboard and /dashboard/poll/[id] to Server Components for the initial data load (call `service/*.ts` directly instead of client-fetching our own API routes). Keep mutations as client-side fetches for now — not going the Server Actions route.

- [ ] Create main page.

- Add authentication to pages.
  - [x] /dashboard
  - [x] /dashboard/poll/[id]

- [x] Dashboard page: Button that creates polls. List of polls gets refreshed after submission.
  - Components: Button, list.
  - Endpoints: GET polls, POST poll, DELETE poll

- [x] Dashboard/poll/[id]: Fields with options. Add option, text field.
  - Components: Text field, add button, table of options.
  - Endpoints: GET poll (with options), POST option, DELETE option
  - [ ] PUT option (edit label)

- [ ] poll/[id]: Vote and view results in real time
  - [x] Add "published" (bool), "authenticated_voting" (bool) and "expires_at" (timestamp) to poll table.
  - Data: dedicated `vote` table (poll_id, option_id, user_id?, created_at).
    - Authenticated voting: one vote per (poll_id, user_id).
    - Anonymous voting: uuid stored in localStorage.
  - Endpoints: GET results for a poll, POST vote.
  - Components: Vote button adds to an option's count. Chart/table of live results connected via websocket.
  - Realtime: separate Node service (own docker-compose entry), not inside the Next.js process.
    - `POST vote` writes to the DB first, then notifies the service.
    — Service keeps counts in memory, reconciles from the DB on startup/periodically so it stays a cache; DB remains SSoT.
    - Clients connect over websocket and get a snapshot + live `{ optionId, count }` deltas.
    - Can't live in the same process as Next.js: `output: "standalone"` and a custom server are mutually exclusive (see `node_modules/next/dist/docs/01-app/02-guides/custom-server.md`).
