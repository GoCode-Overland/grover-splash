---
title: "feat: Contacts data foundation — contacts table, ContactModel, ContactsService (grover-chat)"
type: feat
status: planned
date: 2026-07-23
origin: docs/plans/2026-07-23-001-feat-business-os-context-plan.md
series: business-os (1 of 5)
depends-on: none
target-repo: grover-chat
---

# feat: Contacts data foundation — contacts table, ContactModel, ContactsService

## Summary

Build the spine of the Business OS in **grover-chat**: a `contacts` table as Grover-owned source of truth for every collected email, a `ContactModel` following the repo's BaseModel pattern, and a `ContactsService` that is the only code allowed to write to the Resend Contacts/Audiences API. Resend sync is a best-effort side effect: the Postgres row is the record; `syncedAt` tracks whether Resend has caught up, and a cron retry closes the gap. Everything in plans 003–006 depends on this existing first.

This implements the design in `grover-splash/docs/email-list-consolidation-plan.md`, adapted to grover-chat's actual conventions as they exist today.

## Problem Frame

grover-chat's Resend integration (`src/lib/services/resend/index.ts`) is send-only — no audience or contact API usage exists anywhere in the codebase. Emails Grover collects live scattered across `company_invites`, `app_invites`, `app_users`, and a HubSpot portal being retired. Nobody can query "everyone who has ever given us an email, and why," and no marketing send can target a Grover-owned list. The consolidation plan's design is agreed; this plan turns it into implementation units grounded in grover-chat's real schema/model/service conventions.

## Requirements

- R1. `contacts` table in grover-chat with source, status, tags, Resend sync bookkeeping; unique per `(email, source)`; idempotent upserts.
- R2. `ContactModel` (Drizzle/BaseModel) owning all DB reads/writes for contacts.
- R3. `ContactsService` owning all Resend Contacts/Audiences API calls, using a **new, contacts-scoped Resend key** (`RESEND_AUDIENCE_API_KEY`), never the transactional `RESEND_API_KEY`.
- R4. Four Resend audiences mapped by source: Grover Marketing (existing), App Signups (new), Admin Accounts (new), Invited Pending (new). Real IDs documented in `grover-splash/docs/resend.md`.
- R5. DB write always succeeds independently of Resend; failed syncs leave `syncedAt = null` and a cron retry re-syncs.
- R6. `add`, `promote`, `unsubscribe`, and `retryUnsynced` operations, all idempotent.
- R7. Tests following the repo's Vitest `vi.mock` pattern; suite must pass since `vercel:build` gates deploys on `test:ci`.

**Decisions from Will (2026-07-23):**
- The **Admin Accounts audience DOES receive marketing-style sends** — admins should see what their customers/users are getting. It stays a separate audience (so sends are deliberate per-audience choices), but it is not suppressed.
- HubSpot backfill is **already complete** — no import task in this series.

## Key Technical Decisions

- **Follow repo enum convention, not pg enums.** grover-chat enums are `as const` objects in `src/db/schema/enums.ts` with `text('col').$type<...>()` columns. Add `ContactSource` and `ContactStatus` there; do not introduce `pgEnum`.
- **Follow the `appInvites` email-uniqueness pattern**, not citext: `text('email')` plus a `LOWER(email)` composite unique index with the standard `isDeleted = false` partial-index convention from `src/db/schema/base.ts`. Normalize to lowercase in `ContactModel` before write.
- **Model vs service split per repo convention:** `ContactModel` (`src/lib/models/contact/`) = Postgres. `ContactsService` (`src/lib/services/contacts/`) = Resend API wrapper + orchestration (write row via model, then best-effort sync). Application code calls the service, never the Resend SDK directly.
- **Separate Resend key** (`RESEND_AUDIENCE_API_KEY`) scoped in the Resend dashboard to audiences/contacts only. A bug in sync code can't send transactional mail, and vice versa. Existing `RESEND_API_KEY` untouched.
- **`tags text[]` column now**, even though tagging tools land in plan 004 — avoids a second migration and the "add/tag a contact" operator action from the product contract needs it.
- **Audience IDs via env vars**, not DB config: `RESEND_AUDIENCE_MARKETING`, `RESEND_AUDIENCE_APP_SIGNUPS`, `RESEND_AUDIENCE_ADMIN_ACCOUNTS`, `RESEND_AUDIENCE_INVITED_PENDING`. Matches how the repo handles external-service identifiers; documented in both `env.example` and `grover-splash/docs/resend.md`.

## Technical Design

### Schema — `src/db/schema/contacts.ts`

```ts
export const contacts = pgTable(
  'contacts',
  {
    ...createBaseFields(),
    email: text('email').notNull(),
    source: text('source').notNull().$type<ContactSourceType>(),
    status: text('status').notNull().default(ContactStatus.active).$type<ContactStatusType>(),
    tags: text('tags').array().notNull().default(sql`'{}'`),
    resendAudienceId: text('resend_audience_id'),
    resendContactId: text('resend_contact_id'),
    metadata: jsonb('metadata'),
    syncedAt: timestamp('synced_at')
  },
  (table) => [
    uniqueIndex('contacts_email_source_unq')
      .on(sql`LOWER(${table.email})`, table.source)
      .where(sql`${table.isDeleted} = false`),
    index('contacts_source_idx').on(table.source),
    index('contacts_status_idx').on(table.status),
    index('contacts_unsynced_idx').on(table.syncedAt).where(sql`${table.syncedAt} IS NULL`)
  ]
);
```

Enums in `src/db/schema/enums.ts`:

```ts
export const ContactSource = {
  app_signup: 'app_signup',
  admin_signup: 'admin_signup',
  website_optin: 'website_optin',
  company_invite: 'company_invite',
  app_invite: 'app_invite'
} as const;

export const ContactStatus = {
  active: 'active',
  pending: 'pending',
  unsubscribed: 'unsubscribed'
} as const;
```

Export from the `src/db/schema/index.ts` barrel; generate migration with `db:generate`.

### ContactModel — `src/lib/models/contact/index.ts`

Class extending `BaseModel` (constructor defaults to `{ id: systemUserId }`, stamps `createdBy`/`updatedBy`, soft-delete aware). Methods:

- `upsert({ email, source, status?, tags?, metadata? })` — lowercase email, insert or return existing row for `(email, source)`.
- `getByEmail(email)` — all sources for an email.
- `list({ source?, status?, tag?, limit, offset })` — powers the plan-004 `list_contacts` tool.
- `markSynced(id, { resendContactId, resendAudienceId })`, `setStatus(id, status)`, `addTags(id, tags)`.
- `getUnsynced(limit)` — rows where `syncedAt IS NULL`, for the retry cron.

### ContactsService — `src/lib/services/contacts/index.ts`

Constructs `new Resend(RESEND_AUDIENCE_API_KEY)`. Source → audience mapping is a single exported const. Operations:

- `add(email, source, opts?)` — `ContactModel.upsert` first (always). Then try `resend.contacts.create({ audienceId, email, unsubscribed: false })`; on success `markSynced`, on failure log and leave `syncedAt` null. **Never throws for Resend failures.**
- `promote(email, fromSource, toSource)` — invite acceptance path (used in plan 003): create the contact under `toSource`'s audience, remove from Invited Pending in Resend, set the old row's status to `active` with metadata noting promotion.
- `unsubscribe(email)` — set `status = unsubscribed` on all rows for the email, propagate to Resend (`unsubscribed: true`) per audience.
- `retryUnsynced(limit = 50)` — drain `getUnsynced`, attempt sync, return counts.

### Retry cron

New route `src/routes/api/cron/contacts-sync/+server.ts` calling `ContactsService.retryUnsynced()`, registered in `vercel.json` `crons[]` alongside the existing six (daily is fine; sync failures are rare and non-urgent).

### Manual setup (Will, in the Resend dashboard)

1. Create audiences: App Signups, Admin Accounts, Invited Pending (Grover Marketing exists).
2. Create the contacts-scoped `RESEND_AUDIENCE_API_KEY`.
3. Add the five new env vars to Vercel + `.env` + `env.example`.
4. Record audience IDs in `grover-splash/docs/resend.md` using its existing table format.

## Implementation Units

### U1. Schema + enums + migration
`src/db/schema/contacts.ts`, `enums.ts`, `index.ts` barrel; `bun run db:generate`; validate with `db:validate`.
**Accept:** migration applies cleanly on a branch DB; unique index rejects duplicate `(LOWER(email), source)`; second insert of same pair upserts, not errors.

### U2. ContactModel
`src/lib/models/contact/index.ts` + barrel export. Mirror `CompanyInviteModel` structure.
**Accept:** unit tests (Vitest, `vi.mock('$db')` chain pattern per `src/tests/company-invite-model-create.test.ts`) cover upsert idempotency, lowercase normalization, list filters, getUnsynced.

### U3. ContactsService
`src/lib/services/contacts/index.ts` + `src/lib/services/index.ts` barrel. Env vars added to `env.example`.
**Accept:** tests mock the Resend SDK; verify add() writes the row even when Resend throws; verify promote() moves audiences; verify retryUnsynced() marks synced on success. No import of `RESEND_API_KEY` anywhere in the service.

### U4. Retry cron route
`src/routes/api/cron/contacts-sync/+server.ts` + `vercel.json` cron entry. Follow the existing cron route auth pattern (match `api/cron/reports` et al.).
**Accept:** route callable locally, returns `{ attempted, synced, failed }` counts; cron entry present.

### U5. Dashboard setup + docs
Audiences + scoped key created; IDs documented in `grover-splash/docs/resend.md`; Vercel envs set.
**Accept:** `docs/resend.md` table lists all four audiences with IDs and the two-key split explained.

## Scope Boundaries

- No hook points wired (signups, invites, magic links) — that is plan 003.
- No MCP tools, no gating — plan 004.
- No public endpoint or splash form — plan 005.
- No changes to grover-splash's local marketing scripts or their `grover-splash-marketing` key; broadcast authoring stays put until plan 004's campaign tool proves out.
- No HubSpot import (already complete per Will).

## Risks

- **Resend audience deletion has happened before** (`docs/resend.md` in grover-splash notes a prior loss). Mitigated by design: Postgres is the source of truth; a full audience can be rebuilt by resetting `syncedAt = null` for the affected source and letting the cron drain.
- **`vercel:build` runs migrate + seed + full test suite** — a broken migration or failing test blocks every deploy of grover-chat. Land U1 behind a passing `db:validate` and run the suite locally before pushing.
- **Same email, multiple sources** is by design (one row per source). Any future "one profile per human" view is a `GROUP BY LOWER(email)` query, not a schema change.

## Open Questions

- None blocking. (Admin-audience marketing policy and backfill were resolved by Will 2026-07-23; see Requirements.)
