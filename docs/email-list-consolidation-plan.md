# Email List Consolidation Plan

Goal: every email address Grover collects (app sign ups, admin account creations, website opt-ins, and invited-but-not-yet-joined users) ends up in a clean, queryable Resend audience, and no client ever holds a Resend key directly. All writes to Resend go through grover-chat.

This is a planning doc only. Nothing here has been implemented yet.

---

## Current state (as of 2026-07-20)

- **grover-chat** already owns the only real Resend integration: `src/lib/services/resend/index.ts` sends transactional email (magic link, invites, reports) using the `grover-chat` key. It does not touch Resend *audiences/contacts* today, only one-off sends.
- **grover-splash** holds a second, separate Resend key (`grover-splash-marketing`, documented in `docs/resend.md`) used only by local CLI scripts (`scripts/create-mobile-audience.ts`, `scripts/send-broadcast-draft.ts`, etc.) to manage the Joyride Journal broadcast audience. This is run manually by Will, not called from any deployed server, so it isn't a client-side key leak, but it's a second place Resend contacts get written from.
- **App sign up** (`grover-chat/src/routes/api/app/users/+server.ts`): creates a user, sends no email, adds nobody to any audience.
- **Admin accounts**: no separate creation flow. Admins authenticate through grover-chat's OAuth/magic-link (`api/admin/auth/magic/+server.ts`); the first time someone completes that flow for a new email, that's effectively "admin account creation." No audience sync happens.
- **Website opt-ins**: there is no live email-capture form on grover-splash today. Blog posts embed a HubSpot form (`hs-form-frame`, portal `48485789`). That means "anyone who enters their email on our website" currently means "anyone who enters their email into HubSpot," not Grover-owned infrastructure.
- **Invites**: two Postgres tables already exist in grover-chat and are the closest thing to an invite "list" today:
  - `company_invites` (`src/db/schema/companies.ts`) — email, status (`pending` by default), created via `CompanyInviteModel.create()` and the `create_company_invite` MCP tool. Already sends an invite email but does not sync to any audience.
  - `app_invites` (`src/db/schema/appInvites.ts`) — email + inviting company, migrated from the old GROVER-API DB.
  Both are real DB tables, so they're technically "tracked," but nobody can open Resend and see or broadcast to "everyone we've invited." That's the gap Will is pointing at.

---

## Design

### 1. One place Resend gets written to: grover-chat

Add a small `ContactsService` in grover-chat (`src/lib/services/contacts/`) that wraps the Resend Contacts API. All four flows below call this service instead of touching Resend directly. grover-splash's marketing scripts keep using the Joyride Journal audience for now (broadcast authoring is a separate concern), but stop being the only integration that manages contacts — new sign-up-driven contacts flow exclusively through grover-chat.

### 2. New `contacts` table in grover-chat (source of truth, independent of Resend)

Even if Resend is down or an audience gets deleted again (as `docs/resend.md` notes already happened once), Grover shouldn't lose the record of who signed up and why. Add:

```
contacts
  id
  email            (citext, unique per source — same email can appear once per source)
  source           enum: app_signup | admin_signup | website_optin | company_invite | app_invite
  status           enum: active | pending | unsubscribed
  resend_audience_id
  resend_contact_id  (nullable until synced)
  metadata          jsonb (companyId for invites, etc.)
  created_at, synced_at
```

Writes to this table are idempotent (upsert on `email + source`). The Resend sync is a best-effort side effect — if the Resend API call fails, the row is still written with `synced_at = null`, and a retry job (or manual re-run) can catch up later. This decouples "did we capture the signup" from "did Resend accept it."

### 3. Resend audience mapping

Reuse the existing audience where the purpose already matches; create new ones where it doesn't.

| Source | Audience | Notes |
|---|---|---|
| Website opt-in | **Grover Marketing** (existing, `docs/resend.md`) | Same audience the Joyride Journal already sends to. |
| App sign up | **App Signups** (new) | |
| Admin account creation | **Admin Accounts** (new) | Internal/company-side, not a marketing list — keep separate so a broadcast never accidentally reaches it. |
| Company invite / app invite | **Invited (Pending)** (new) | On invite acceptance, move the contact from this audience to App Signups or Admin Accounts and mark `status = active` in the `contacts` table. |

Document the real audience IDs in `docs/resend.md` once created, same table format already used there.

### 4. Hook points

- **App sign up** — `grover-chat/src/routes/api/app/users/+server.ts` POST handler: after user creation, call `ContactsService.add(email, 'app_signup')`. This also finally uses the existing-but-unused `Email.WELCOME` template for a real welcome send.
- **Admin account creation** — the first successful admin magic-link completion for a new email (`api/admin/auth/magic/+server.ts` / `src/lib/modules/admin/magic.ts`): call `ContactsService.add(email, 'admin_signup')`.
- **Company invites** — `CompanyInviteModel.create()`: after the invite row and email are created, call `ContactsService.add(email, 'company_invite')`. On acceptance (`src/routes/invite/[slug]/+page.server.ts`), call `ContactsService.promote(email, 'company_invite' → 'admin_signup')`.
- **App invites** — wherever `app_invites` rows are created: same pattern, promote to `app_signup` on the invited user's actual sign up.
- **Website opt-in** — new public endpoint (see below), since there's no live form to hook into yet.

### 5. New public endpoint for website opt-ins

grover-splash needs a real, Grover-owned signup form instead of the HubSpot embed if this is to be "our" list. Add:

```
POST grover-chat: /api/public/contacts/subscribe
Body: { email, source: "website" }
```

This is the one endpoint here that's genuinely public and unauthenticated (unlike the others, which ride along inside already-authenticated flows), so it needs its own guardrails:
- CORS restricted to `getgrover.ai` / `www.getgrover.ai` origins
- Basic rate limiting per IP (grover-chat already has QStash/cron infra to lean on)
- Server-side email format validation, no client-supplied audience or metadata beyond email

grover-splash then adds a small signup component (blog footer, homepage) that POSTs here instead of loading the HubSpot script. Migrating the *existing* HubSpot-collected list into Resend is a separate, one-time export/import task, not part of this endpoint's job.

### 6. Resend key scoping

Resend API keys can be restricted to specific permissions/domains. Recommend two keys living in grover-chat's env once this ships:
- `RESEND_API_KEY` (existing, transactional) — unchanged.
- `RESEND_AUDIENCE_API_KEY` — scoped to contacts/audiences only, used exclusively by `ContactsService`. Keeps a bug in audience-sync code from being able to send arbitrary transactional email and vice versa.

grover-splash's local marketing scripts keep their own key for broadcast authoring; that's a separate concern from contact ingestion and doesn't need to move.

---

## Rollout order

1. `contacts` table + migration in grover-chat.
2. `ContactsService` (add/promote/unsubscribe) + new Resend audiences created in dashboard, IDs documented in `docs/resend.md`.
3. Wire in company_invites and app_invites sync (lowest risk, no new public surface, closes the "invited emails aren't a list" gap directly).
4. Wire in app sign up + admin account creation.
5. Build the public `/api/public/contacts/subscribe` endpoint with rate limiting, then swap grover-splash's HubSpot embed for the new form.
6. (Optional, separate task) export existing HubSpot contacts and backfill into the Grover Marketing audience.

## Open questions for Will

- Should `admin_signup` really stay out of any marketing audience permanently, or does Grover ever want to email admins non-transactionally (product updates)? Affects whether "Admin Accounts" is truly isolated or just default-suppressed.
- Backfilling the HubSpot list: worth doing, or is website opt-in only meant to start clean going forward?
