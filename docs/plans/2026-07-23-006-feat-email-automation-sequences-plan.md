---
title: "feat: Email automation — domain events + code-defined sequences on QStash/Upstash Workflow (grover-chat)"
type: feat
status: planned
date: 2026-07-23
origin: docs/plans/2026-07-23-001-feat-business-os-context-plan.md
series: business-os (5 of 5)
depends-on:
  - docs/plans/2026-07-23-002-feat-contacts-data-foundation-plan.md
  - docs/plans/2026-07-23-003-feat-invite-and-signup-contact-sync-plan.md
  - docs/plans/2026-07-23-004-feat-grover-owner-gate-and-mcp-tools-plan.md
target-repo: grover-chat
---

# feat: Email automation — domain events + code-defined sequences

## Summary

Replace HubSpot workflows with automations-as-code in grover-chat: a small domain-event emitter, sequences defined as TypeScript modules (steps + delays), executed durably via Upstash Workflow (already a dependency, pattern already live in `api/workflows/score-photos`), enrollment tracked in an `automation_enrollments` table, and `grover_owner`-gated MCP tools to inspect/enroll/pause. Every step re-checks contact status before sending, so an unsubscribe mid-sequence always wins. This is the vision doc's "automations as code" section made concrete for the marketing/CRM scope — testable handlers instead of drag-and-drop blocks.

The context plan hedged that this phase "likely warrants its own dedicated plan once 1–4 are live." This plan is written now (per Will, 5 plans up front) but is intentionally the most revisit-able: validate its assumptions against real plan 002–005 usage before executing, and expect to adjust step content.

## Problem Frame

Grounding facts (verified 2026-07-23):

- **Durable execution exists:** `@upstash/workflow` is a dependency with a live route (`src/routes/api/workflows/score-photos/+server.ts`); QStash client (`src/lib/services/qstash/index.ts`) exposes `publish`/`queueMessage` with retries, and `publishUrl` handles dev (ngrok) vs prod URLs. Vercel Cron (`vercel.json`) covers scheduled work. Nothing needs inventing at the infrastructure layer.
- **No event bus exists.** Flows call side effects inline (plan 003's hooks call ContactsService directly). Sequences need a trigger point that doesn't couple every model to every automation.
- **Templates live in the wrong repo for this:** marketing React Email templates are in grover-splash `scripts/emails/`, rendered by local CLI scripts. Sequence sends fire server-side from grover-chat, which has its own email composition pattern (`src/lib/modules/emails/`, e.g. `groverAppInvite.ts`).
- **Suppression primitive exists:** `contacts.status = unsubscribed` (plan 002) plus `ContactsService.unsubscribe`. Resend handles list-unsubscribe for broadcasts; sequence sends are individual `sendEmail` calls and need their own unsubscribe link.

## Requirements

- R1. Domain-event emitter: `emitEvent(name, payload)` publishing to QStash; initial events `contact.created`, `contact.promoted`, `contact.unsubscribed`, `invite.accepted` — emitted from the plan-003 hook sites via the same non-fatal wrapper.
- R2. Sequences as code: each sequence is a TS module declaring `{ id, trigger, steps: [{ id, delay, send | action }] }`; registry maps events → sequences. Unit-testable without network.
- R3. Durable execution: a triggered enrollment runs as an Upstash Workflow (`context.sleep` between steps, QStash retries per step); a redeploy or transient failure never drops or duplicates a step.
- R4. `automation_enrollments` table tracking (contactId, sequenceId, currentStep, status: active/completed/cancelled/suppressed) — idempotency (one active enrollment per contact+sequence) and observability.
- R5. Suppression: before every send, re-read the contact; `unsubscribed` (or enrollment cancelled) skips the send and marks the enrollment `suppressed`. `contact.unsubscribed` event also cancels active enrollments eagerly.
- R6. Unsubscribe link in every sequence email: signed one-click URL hitting a public grover-chat endpoint that calls `ContactsService.unsubscribe` + sets `List-Unsubscribe` headers.
- R7. MCP tools (all `denyNonOwner`): `list_sequences`, `list_enrollments` (by contact or sequence), `enroll_contact`, `cancel_enrollment`.
- R8. First real sequence shipped end-to-end as proof: **website opt-in welcome** (`contact.created` where `source = website_optin` → immediate welcome → 3-day follow-up), content TBD with Will at implementation time.

## Key Technical Decisions

- **Upstash Workflow over hand-rolled QStash delay chains.** Multi-step-with-delays is exactly what Workflow's `context.sleep`/`context.run` gives (checkpointed steps, automatic retries, no self-scheduling bookkeeping). It's already in the repo; a hand-rolled chain would reimplement its ledger badly. Events themselves go over plain QStash publish to a dispatcher route that starts workflows — keeps triggering decoupled from execution.
- **Sequences are code, not DB rows.** Definitions live in `src/lib/automations/sequences/*.ts`, versioned and reviewed like everything else. Changing a sequence is a PR, not an MCP call. An in-flight enrollment resolves its next step by `(sequenceId, stepId)` at runtime, so edited definitions apply to future steps with explicit, code-reviewed semantics. (A `create_sequence` MCP tool would reintroduce the no-code editor we're escaping; declined.)
- **Delays live in the definition, capped generously** (e.g. max 30 days per step) as a sanity bound; Upstash Workflow supports long sleeps natively.
- **Templates for sequences live in grover-chat** (`src/lib/modules/emails/` pattern extended, or React Email added to grover-chat if richer layout is wanted — decide at implementation; start with the existing composition pattern to avoid a new toolchain). grover-splash's newsletter scripts stay untouched; one-off broadcasts remain plan 004's `send_campaign`.
- **Sequence sends use the transactional `RESEND_API_KEY`** via the existing `sendEmail` — they are individual, contact-triggered emails, exactly what that key is for. Marketing/broadcast stays on the audience-scoped key. A `marketing@hello.getgrover.ai` address gets added to the `Email` enum for sequence sends.
- **Unsubscribe tokens are signed (HMAC over email + purpose), not DB-stored** — stateless, no table, verified server-side; endpoint is rate-limited like plan 005's subscribe.
- **Enrollment idempotency at the dispatcher:** the event dispatcher checks for an existing active enrollment before starting a workflow, so double-emitted events (QStash at-least-once) can't double-enroll.

## Technical Design

```
plan-003 hook sites ──emitEvent()──▶ QStash publish
                                        │
                                        ▼
                    POST /api/automations/dispatch  (QStash-signed)
                      · match event → sequence registry
                      · suppression + idempotency checks
                      · create enrollment row
                      · trigger workflow
                                        │
                                        ▼
                    POST /api/workflows/automation   (Upstash Workflow route)
                      for each step:
                        context.sleep(step.delay)
                        context.run: re-read contact → suppressed? mark & stop
                                     render template → sendEmail → advance enrollment
                      mark enrollment completed
```

New surface: `src/lib/automations/` (emitter, registry, sequence defs, step runner), `src/db/schema/automationEnrollments.ts`, `src/routes/api/automations/dispatch/+server.ts`, `src/routes/api/workflows/automation/+server.ts`, `src/routes/api/public/contacts/unsubscribe/+server.ts`, four MCP tools.

## Implementation Units

### U1. Event emitter + dispatcher
`emitEvent` (QStash publish to `publishUrl`-resolved dispatch route, non-fatal via `syncContactSafe`-style wrapper); dispatch route verifies QStash signature (match existing QStash-consumer routes), matches registry, enforces idempotency/suppression, creates enrollment, starts workflow. Wire emits into the plan-003 hook sites.
**Accept:** tests: event → enrollment created once (duplicate event no-ops); unsubscribed contact never enrolls; hook sites emit without coupling to registry contents.

### U2. Enrollment schema + model
`automation_enrollments` with `...createBaseFields()`, contactId FK, sequenceId, currentStep, status, partial unique index on active (contactId, sequenceId). `AutomationEnrollmentModel` per BaseModel conventions.
**Accept:** migration valid; model tests for idempotent enroll + status transitions.

### U3. Sequence registry + workflow runner
Registry + step-runner executing definitions inside the Upstash Workflow route; per-step suppression re-check; enrollment advanced per step.
**Accept:** unit tests drive a fake sequence through the runner with mocked sleep/send: happy path completes; mid-sequence unsubscribe suppresses remaining steps; step retry doesn't double-send (send recorded before advance, checked on re-entry).

### U4. Unsubscribe endpoint + email footer helper
Signed-token one-click unsubscribe under `api/public/`, `List-Unsubscribe`/`List-Unsubscribe-Post` headers via `sendEmail`'s existing `headers` option, shared footer helper for sequence templates.
**Accept:** token round-trip tests (valid, tampered, expired); unsubscribing cancels active enrollments and sets contact status.

### U5. MCP tools
`list_sequences` (from registry), `list_enrollments`, `enroll_contact`, `cancel_enrollment` — thin, gated, registered.
**Accept:** per-tool tests incl. gate-first; manual enroll respects suppression/idempotency.

### U6. First sequence: website opt-in welcome
Two-step sequence on `contact.created`/`website_optin`; template content drafted with Will (honor the no-em-dash and email-tone guides in grover-splash memory/docs). Ship behind a registry flag, verify with a real opt-in through the plan-005 form, then enable.
**Accept:** real end-to-end pass on prod with Will's test email: opt in → welcome arrives → unsubscribe link works → follow-up suppressed.

## Scope Boundaries

- No visual sequence builder, no DB-defined sequences — code only, by design.
- No behavioral triggers beyond the initial event set (no "opened email" / "visited page" events; Resend webhook ingestion for opens/clicks is a natural later extension, not v1).
- Stripe/contract events from the vision doc: the emitter is built so they can plug in later, but no such events are emitted here.
- Migrating the Joyride Journal newsletter authoring flow: untouched.
- No dashboard views of enrollments; `list_enrollments` via MCP is the v1 window.

## Risks

- **At-least-once delivery everywhere** (QStash events, workflow step retries) makes duplicate sends the top failure mode. Defense in depth: dispatcher idempotency (U1), active-enrollment unique index (U2), record-before-advance send ledger semantics in the runner (U3). The U3 retry test is the load-bearing one.
- **Sequence definition edits vs in-flight enrollments:** resolving steps by ID at runtime means a removed step should cause a defined outcome (skip + log, not crash). Covered in U3 tests.
- **Dev-loop friction:** QStash/Workflow callbacks need a public URL locally (the repo's ngrok `publishUrl` pattern). Document the local setup in the automations module README.
- **This plan is furthest from validated usage.** Re-read after plans 002–005 ship; the architecture should hold, but the first-sequence content and event list are expected to change.

## Open Questions

- React Email in grover-chat vs the existing `modules/emails` composition style for sequence templates — decide at U3/U6 time based on how rich the welcome sequence needs to be.
- Whether `invite.accepted` should trigger any sequence in v1 (the transactional invite emails already exist) — default no; the event is emitted for future use.
