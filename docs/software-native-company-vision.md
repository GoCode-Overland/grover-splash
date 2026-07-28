# Grover as a Software-Native Company

A dreaming doc. Not a commitment, not a sprint plan — a sketch of what "we own the whole stack instead of renting SaaS blocks" looks like once the email-list consolidation work (`docs/email-list-consolidation-plan.md`) is done. That plan is actually step one of this: once `contacts` is a real table in grover-chat instead of a HubSpot list, everything below becomes possible because there's a spine to hang it on.

The throughline: **HubSpot, DocuSign, and a dozen other tools are UIs on top of a database and a few webhooks.** Grover already has the database (Postgres via grover-chat/Drizzle) and the webhook infra (QStash). What's missing is code where there's currently a no-code block.

---

## 1. Marketing site becomes the CMS, not a shell around HubSpot

Today: blog posts embed HubSpot forms, HubSpot owns some DNS, HubSpot's editor owns some content.

Native version:
- Landing pages, forms, and content live in grover-splash's own repo — versioned, reviewable in PRs, deployable in seconds. No "which HubSpot module has the bug" archaeology.
- Forms POST to grover-chat (per the consolidation plan), which is also where UTM/referral/campaign attribution gets recorded against the `contacts` row, instead of trusting HubSpot's black-box attribution model.
- A/B testing on landing pages is a git branch + a feature flag, not a HubSpot experiment config.
- Content can be dynamic (render blog posts from the DB, pull live pricing, show personalized CTAs based on `contacts.source`) instead of static HTML per page.

## 2. Automations as code, not drag-and-drop blocks

Today's alternative (HubSpot workflows, Zapier) is: a visual canvas of if/then blocks that's slow to debug and impossible to unit test.

Native version: an **event-driven pipeline in grover-chat**, built on the QStash infra that's already there for reliable delivery:
- Domain events (`user.signed_up`, `invite.accepted`, `contract.signed`, `payment.succeeded`) get published to a queue.
- Each automation is a small, named, testable handler function subscribed to an event — e.g. `onInviteAccepted → sendWelcomeEmail, addToAudience, createStripeCustomer`.
- Because it's code: you can write a test for "if payment fails, does the account get suspended," something you'd never trust a HubSpot workflow screenshot to prove.
- Retries, dead-letter handling, and audit logs (who/what/when) come for free from the same QStash + Postgres pattern already used for emails.

## 3. Contracts and e-signature, in-house

Today: presumably DocuSign/HelloSign/manual PDF, if anything formal exists at all.

Native version:
- Contract *templates* as code (React/HTML templates, same pattern as the React Email templates already in grover-splash's `scripts/emails/`) with variables filled from the `contacts`/`companies` tables.
- Signature capture: either a lightweight in-house flow (render PDF, capture a typed/drawn signature + IP + timestamp, store the signed artifact) or lean on Google Docs API / a signature API for the actual legal-grade e-sign primitive rather than reinventing that specific wheel — the legal weight of an esignature is a place "buy, don't build" still applies.
- Either way, the *record* of a contract (status: draft/sent/signed/expired) lives in grover-chat's own DB, joined to the same company/contact records everything else uses, instead of siloed in a third-party portal you have to log into separately.

## 4. Payments and billing via Stripe, wired into the same spine

Stripe is the one place "buy, don't build" is obviously correct — nobody should hand-roll PCI compliance. But *around* Stripe:
- Stripe customer ID lives on the `companies`/`contacts` row, not in a separate system you have to cross-reference.
- Stripe webhooks (`invoice.paid`, `subscription.canceled`) feed the same event pipeline as everything else in #2 — a failed payment can trigger the same kind of automation as an accepted invite, using the same code, same retry logic, same audit trail.
- Invoicing, dunning emails, and "your subscription is expiring" nudges become just another Resend template + `ContactsService` combo, not a separate billing-tool UI to configure.

## 5. One data model instead of five disconnected tools

The actual unlock isn't any single replacement, it's that **contacts, companies, invites, contracts, and payments become foreign keys into the same Postgres database** instead of four SaaS accounts that don't know about each other. Once that's true:
- "Show me everyone who signed a contract but hasn't paid" is a SQL query, not a manual cross-reference between DocuSign and Stripe dashboards.
- "Show me every admin account created from a company that churned" is a join, not an export-and-vlookup exercise.
- Every automation, every report, every dashboard gets simpler because there's one source of truth instead of N systems each holding a partial, slightly-stale copy of the truth.

## 6. Where "buy, don't build" still wins

Dreaming doesn't mean rebuilding everything:
- **Stripe** for payment processing and PCI compliance — non-negotiable buy.
- **Resend** for email deliverability/inbox reputation — already the right call, keep it.
- **A real e-signature primitive** (Google/DocuSign API) for the specific legal-grade "this signature is binding" guarantee, even if everything around it is home-grown.
- **QStash** for reliable async delivery — already in use, no reason to hand-roll a queue.

The pattern across all of these: buy the narrow, hard-to-get-right primitive (payment rails, deliverability, legal e-sign, durable queues), build the business logic and data model around it in code you own and can actually query, test, and change in a PR.

## 7. Rough sequencing, if this ever becomes real

1. Ship the email-list consolidation plan first — it's the `contacts` table this whole vision depends on.
2. Add a `companies`/deal-adjacent event bus (`user.signed_up`, `invite.accepted`, etc.) in grover-chat, even before anything consumes it, so instrumentation exists from day one of every new feature.
3. Migrate one HubSpot form (the easiest one) to a Grover-owned page + endpoint, prove the pattern works end to end.
4. Add Stripe customer/webhook wiring once there's a real product moment that needs billing.
5. Contracts/e-sign last, since it's the highest legal-risk piece and benefits most from the data model already being solid underneath it.

Building is cheap. The expensive part was always “which system holds the truth” — fix that first, and everything downstream (forms, automations, contracts, payments) gets easier, not harder, to add.
