---
title: "feat: Invite + signup contact sync — wire existing flows into the contacts system (grover-chat)"
type: feat
status: planned
date: 2026-07-23
origin: docs/plans/2026-07-23-001-feat-business-os-context-plan.md
series: business-os (2 of 5)
depends-on: docs/plans/2026-07-23-002-feat-contacts-data-foundation-plan.md
target-repo: grover-chat
---

# feat: Invite + signup contact sync — wire existing flows into the contacts system

## Summary

Close the original gap ("invited emails aren't a list anywhere"): every existing flow that captures an email in grover-chat now also calls `ContactsService`, and existing rows in `company_invites`, `app_invites`, `app_users`, and `admin_permissions` get a one-time backfill into `contacts`. Lowest-risk slice of the series — no new public surface, all hooks ride inside already-authenticated flows, and every hook is non-fatal so contact sync can never break an invite or signup.

## Problem Frame

Grounding facts from the current codebase (verified 2026-07-23):

- **Company invites:** `CompanyInviteModel.create()` (`src/lib/models/companyInvite/index.ts`) inserts the row, calls `groverApi.createInvite`, sends the invite email, and — critically — **hard-deletes the invite and rethrows on any error**. A contact-sync call inside it must never be able to trigger that rollback.
- **Invite acceptance:** there is no acceptance page anymore. `src/routes/invite/[slug]/+server.ts` GET just redirects to `getgrover.ai/join/<subdomain>`; actual acceptance (status → `accepted`) happens via `CompanyInviteModel.accept()`/`updateStatus()` from the onboarding resolve flow (`getFirstPendingByEmail`). The context doc's pointer to `+page.server.ts` is stale — hook the model, not a page.
- **App invites:** `AppInviteModel` (`src/lib/models/appInvite/index.ts`) is all `// TODO` stubs with **no live caller**. `app_invites` is a migrated/legacy table. Sync = one-time backfill of existing rows; wiring `AppInviteModel.create` is done in passing since the method is being touched anyway.
- **App signup:** `src/routes/api/app/users/+server.ts` POST **throws `'Needs implemented'`** — it is a stub, not a live signup path. Real mobile users land in `app_users` (Auth0-keyed, `auth0Id` unique). The live creation path for `app_users` rows must be located during implementation (likely an Auth0 post-login/registration handler or the onboarding flow) and hooked there; the stub route is not the hook point the consolidation plan assumed.
- **Admin accounts:** magic links only send for emails that already exist in `admin_permissions` (`AdminPermissionModel.getByEmail` in `api/admin/auth/magic/+server.ts`). So "admin account creation" is really **`admin_permissions` row creation**, which is deterministic and a better hook than "first successful magic-link verify."

## Requirements

- R1. Every new company invite creates/updates a `contacts` row (`source: company_invite`, `status: pending`, Invited Pending audience, `metadata.companyId`).
- R2. Invite acceptance promotes the contact: Invited Pending → the destination audience, `status: active`.
- R3. New `admin_permissions` rows create a contact (`source: admin_signup`, Admin Accounts audience — which, per Will, does receive marketing-style sends).
- R4. New `app_users` rows create a contact (`source: app_signup`, App Signups audience) and finally send the unused `Email.WELCOME` welcome email.
- R5. One-time backfill script covering existing `company_invites`, `app_invites`, `app_users`, and `admin_permissions` rows, idempotent and re-runnable.
- R6. **Every hook is non-fatal**: a ContactsService failure logs and continues; it can never fail the parent flow (especially `CompanyInviteModel.create`'s delete-on-error path).

## Key Technical Decisions

- **Hook in models, not routes.** `CompanyInviteModel.create/accept`, `AdminPermissionModel.create`, and the app-user creation model are the single chokepoints; routes and MCP tools (`create_company_invite`) inherit the behavior for free.
- **Non-fatal wrapper:** a tiny `syncContactSafe(fn)` helper (in ContactsService) that catches, logs with context, and returns — used at every hook site so the pattern can't be fat-fingered per call.
- **Promotion mapping:** company invite acceptance → `admin_signup` (company admins), app invite acceptance → `app_signup`, matching the consolidation plan.
- **Backfill as a repo script** (`scripts/backfill-contacts.ts`, run with `bun`/`tsx` like `src/db/migrate.ts`), not a migration — it calls ContactsService (network I/O to Resend) and must be re-runnable/resumable, which migrations aren't. Idempotency comes free from `ContactModel.upsert`.
- **Backfill status mapping:** `company_invites.status = pending` → contact `pending` (Invited Pending); `accepted` → `active` under `admin_signup`; `rejected` → row created with `status: unsubscribed` metadata-noted (so the email is on record but never marketed to). `app_invites` has no status column — all rows land as `pending`/`app_invite`.

## Implementation Units

### U1. `syncContactSafe` + company invite hooks
Add the safe wrapper to `src/lib/services/contacts/`. In `CompanyInviteModel.create()`, after the invite email step succeeds, call `syncContactSafe(() => contactsService.add(email, 'company_invite', { metadata: { companyId } }))`. In `accept()`/`updateStatus(accepted)`, call `syncContactSafe(() => contactsService.promote(email, 'company_invite', 'admin_signup'))`.
**Accept:** extend `src/tests/company-invite-model-create.test.ts` pattern — invite creation still succeeds (and is NOT deleted) when ContactsService throws; contact upsert called with right args; acceptance triggers promote.

### U2. Admin permission hook
Hook `AdminPermissionModel` row creation (locate the create path; grounded fact: rows are keyed by unique email in `src/db/schema/adminPermissions.ts`) → `syncContactSafe(add(email, 'admin_signup'))`.
**Accept:** creating an admin permission row upserts a contact; failure is non-fatal.

### U3. App user hook + welcome email
Locate the live `app_users` creation path (Auth0-driven; NOT the stubbed `api/app/users` POST). Hook it: `syncContactSafe(add(email, 'app_signup'))` plus a welcome send using the existing `Email.WELCOME` address via `sendEmail`/the `src/lib/modules/emails/` composition pattern. If an app_user has no email (Auth0 social edge case), skip silently.
**Accept:** new app user → contact row + welcome email; both non-fatal to signup. Document the discovered creation path in the PR description.

### U4. App invite wiring (in passing)
Implement `AppInviteModel.create` minimally (it's a TODO stub) with the contact hook included, so any future caller gets sync for free.
**Accept:** model test covering create + hook.

### U5. Backfill script
`scripts/backfill-contacts.ts`: iterate the four source tables in batches, `ContactsService.add` each (which upserts + best-effort syncs), apply the status mapping above, print counts. Safe to re-run; Resend failures just leave `syncedAt` null for the plan-002 cron.
**Accept:** dry-run mode (`--dry-run`) prints intended actions; real run on prod completes; spot-check counts against `SELECT source, status, count(*) FROM contacts GROUP BY 1,2`.

## Scope Boundaries

- Implementing a real app-signup API (the stubbed POST) is out of scope; only the hook at the actual creation path.
- No MCP tools yet (plan 004); no public opt-in endpoint (plan 005).
- No changes to the invite email content or the onboarding flow itself.
- Deprecating the legacy `invite/[slug]` route stays in the future pure-API cleanup, untouched here.

## Risks

- **`CompanyInviteModel.create`'s delete-on-error behavior** is the sharpest edge: if the contact hook can throw, a Resend blip deletes a legitimate invite. `syncContactSafe` + a dedicated test guards this specifically.
- **Backfill volume vs Resend rate limits:** batch with modest concurrency (serial or ~5 at a time); failures degrade gracefully to unsynced rows.
- **Duplicate emails across tables** (an admin who was also invited) is expected and fine — one row per source by design.

## Open Questions

- Where exactly `app_users` rows are created (Auth0 hook vs onboarding route) — resolve in U3 during implementation, not a blocker to start U1/U2/U5.
