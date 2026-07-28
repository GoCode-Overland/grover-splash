---
title: Grover Business OS - Plan
type: feat
date: 2026-07-23
topic: business-os-context-handoff
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
---

# Grover Business OS - Plan

This doc is a full-context handoff for building out Grover's internal "business OS": the replacement for HubSpot (and eventually other SaaS tools) with Grover-owned data, code-driven automations, and a set of MCP tools instead of a rented no-code UI. It's written so a fresh agent with zero prior context on this thread can pick it up and produce an implementation plan (or series of plans) without re-deriving decisions already made.

---

## Goal Capsule

**Objective:** Give Will (solo operator, Grover's founder/ops person) a fast, code-first way to manage contacts, email automation, and landing pages/forms — replacing HubSpot for those functions — built as MCP tools on top of grover-chat's API, gated to Will only. grover-chat stays a pure API/data layer; no new UI gets added to it.

**Product authority:** Will. This is an internal tool for a company of effectively one operator today; there is no external user or customer-facing surface in scope.

**Open blockers:** None that block starting. The two "Call outs" in Outstanding Questions below are worth a decision before the auth/gating code is written, but don't block scaffolding the data layer.

---

## Background: how we got here

Three prior artifacts (all in `grover-splash/docs/`) build up to this plan, in order:

1. **`docs/email-list-consolidation-plan.md`** — the tactical starting point. Documents that grover-chat already has a Resend wrapper (`src/lib/services/resend/index.ts`) for transactional email, and a separate `grover-splash-marketing` Resend key used by local CLI scripts for the Joyride Journal newsletter. Proposes: a new `contacts` table in grover-chat as source of truth (independent of Resend), a `ContactsService` that's the only thing allowed to write to Resend, four Resend audiences (Grover Marketing, App Signups, Admin Accounts, Invited Pending), and a new rate-limited public endpoint for website opt-ins. **This is the foundational data-layer work everything below depends on** — read it first.

2. **`docs/software-native-company-vision.md`** — the strategic dream. Argues HubSpot/DocuSign/etc. are UIs on top of a database and some webhooks, and Grover already has the database (Postgres via grover-chat/Drizzle) and the webhook infra (QStash) to own the whole stack: marketing pages as code, automations as event handlers instead of drag-and-drop workflow builders, contracts/e-signature, Stripe billing — all joined to one data model instead of five disconnected SaaS accounts. Lays out where "buy don't build" still applies (Stripe for payment rails, Resend for deliverability, a real e-sign API for the legal-binding guarantee, QStash for durable queues).

3. **This brainstorm (2026-07-21 through 2026-07-23)** — narrowed the vision down to a concrete first move: replace HubSpot's marketing/CRM function specifically, and settle the repo-structure question the vision doc left open. That dialogue is what the rest of this doc captures.

---

## Current infrastructure inventory (as researched during this thread)

**grover-chat** — SvelteKit + Drizzle + Neon Postgres, deployed on Vercel (bun-based build, `vercel:build` runs `db:migrate`, `db:seed`, and the full test suite on every deploy). This is the shared backend behind grover-admin, the mobile apps, and (via `.mcp` tooling) an existing MCP server.
- Resend wrapper: `src/lib/services/resend/index.ts` — `Email` enum with addresses under `hello.getgrover.ai` (welcome, invite, support, alerts, login).
- `company_invites` table (`src/db/schema/companies.ts`) and `app_invites` table (`src/db/schema/appInvites.ts`) — real Postgres tables tracking invited-but-not-joined emails, but never synced to anything marketable (Resend, a CRM view). This is the "we're not tracking that as a list anywhere" gap from the original ask.
- App user signup (`src/routes/api/app/users/+server.ts`) sends no welcome email today; `Email.WELCOME` exists but is unused there (only used in `api/reports/subscribe`).
- Admin accounts have no dedicated creation flow — auth is 100% delegated to grover-chat's OAuth/magic-link (`api/admin/auth/magic/+server.ts`).
- grover-chat currently mixes API routes (`+server.ts`) and rendered pages (`+page.server.ts`, e.g. `src/routes/invite/[slug]/+page.server.ts` for invite acceptance, plus login/magic-link pages). **Strategic direction (confirmed this thread): grover-chat should eventually become a pure API layer.** Deprecating those existing pages is explicitly a separate future cleanup, not part of this plan — but nothing in this plan should add new pages there.
- An MCP server already exists exposing grover-chat admin actions as tools (`mcp__plugin_grover_grover__*`): `create_company_invite`, `list_companies`, `get_company`, `list_circles`, `create_notification`, etc. This is the validated, already-shipped pattern this plan builds on — "code instead of UI blocks" isn't hypothetical, it's already how Will works day to day.
- **Important scoping fact:** the existing MCP server's tools appear to be reachable by anyone with grover-admin access — and grover-admin's "Admin" role is a customer-side role (company admins hold it), not an internal-only Grover-staff role. Any new MCP tools for business-OS actions (send campaign, manage contacts, publish landing page) must NOT ride on that same role check, or customer-side company admins could reach them.

**grover-splash** — this repo. Static Vite site (no SvelteKit, no server). Holds:
- A second, separate Resend key (`grover-splash-marketing`) used only by local CLI scripts (`scripts/create-mobile-audience.ts`, `scripts/send-broadcast-draft.ts`, etc.), documented in `docs/resend.md`. Run manually by Will, not called from any deployed server — not a client-side key leak, but a second Resend write path that should eventually collapse into the grover-chat-owned `ContactsService`.
- The Joyride Journal newsletter workflow (React Email templates in `scripts/emails/`, rendered and pushed to Resend as broadcast drafts).
- No live, Grover-owned email capture form. Blog posts embed a HubSpot form (`hs-form-frame`, portal `48485789`) — this is the thing being replaced.

**grover-admin** — customer/company-facing admin dashboard. No email-sending logic of its own; auth delegates entirely to grover-chat. Explicitly NOT the place for internal ops tooling (see the role-scoping note above) — bolting solo-ops features onto it risks exposing internal views to actual Grover customers.

**Other tools currently in real use** (confirmed this thread, not guesses): HubSpot (being migrated away from), Slack, GitHub, Vercel, Neon (Postgres), Cloudflare (just starting, for map-tile processing), ClickUp + monday.com (both used for project tracking — redundant, candidate for consolidation or dropping one), Pylon (support), Gmail (comms), Canva (design), Google Drive/Calendar/Docs/Sheets (general workspace — there's a dedicated shared Grover folder in Drive housing most documents). Several other MCP-connected services visible in the tool list (Kiwi.com, lastminute.com, Heyreach, Prospeo, Clay, etc.) are personal/trial connections, not real Grover business tools — don't design around them.

---

## Resolved decisions (Product Contract)

### Summary

Build Grover's HubSpot-replacement marketing/CRM capability — contacts, email automation, and owned landing pages/forms — as new tools on the existing Grover MCP server, gated to Will's account only, backed entirely by grover-chat's data layer. No new UI gets added to grover-chat itself; a thin dashboard remains a deferred option for anything genuinely better browsed visually than asked for in conversation.

### Key Decisions

- **Speed of building custom workflows is the primary driver**, not cost or data-ownership per se (those are real secondary benefits, but the thing to optimize for is how fast Will can stand up or change an automation). This is why MCP tools (cheap to add, one function each) are prioritized over a dashboard (a whole UI surface to build and maintain).
- **Solo operator, not a team tool.** Will is the only user today. Every gating/auth decision should default to the simplest thing that works for exactly one person, not a role/permission system sized for a team that doesn't exist yet.
- **Success bar for "HubSpot is dead" (marketing/CRM scope):** contacts + email automation (sequences, triggered sends) + owned landing pages/forms. Explicitly NOT a full CRM with deal/pipeline stages — that's a different, larger scope not asked for here.
- **Gate new MCP tools by hardcoding to Will's user ID**, not a new role or a second MCP server. Simplest possible mechanism for a single operator; the tradeoff (see Outstanding Questions) is that every gated tool needs revisiting if a second internal hire is ever added.
- **grover-chat remains the sole owner of data and business logic.** Any new client surface (MCP tools now, a possible dashboard later) is a thin caller of grover-chat's API — this mirrors the "everything flows through grover-chat" security principle already established in the email-list consolidation plan. No new grover-chat pages; that repo is moving toward pure-API-layer over time (though migrating its *existing* pages is explicitly out of scope for this effort).
- **A dashboard is not ruled out, just deferred.** Build it only for things that are genuinely easier to see than to ask an agent for (e.g., a contacts table, a campaign performance chart) — and only once MCP-tool-driven usage actually proves insufficient for those cases. Don't build it speculatively.

### Scope Boundaries

**In scope:**
- Contacts as a real, queryable data model in grover-chat (this is the email-list consolidation plan's `contacts` table — treat that plan as a dependency/prerequisite, not a duplicate task).
- MCP tools for the actions a marketing/CRM operator actually takes: add/tag a contact, send or schedule a campaign/sequence, publish or edit a landing page or form, view/query contacts (even if "view" surfaces as Claude reading back a query result rather than a UI table).
- Syncing existing invite tables (`company_invites`, `app_invites`) into this same contacts system, closing the original "invited emails aren't a list anywhere" gap.
- Gating all of the above to Will's account only.

**Deferred for later (not v1):**
- Deal/pipeline tracking (a full CRM sales pipeline) — out of scope, not asked for.
- Multi-user permissions or a real internal-staff role system — no second internal user exists yet to design for.
- Deprecating grover-chat's existing rendered pages (invite acceptance, login/magic-link) — a separate, later cleanup effort. Don't block this work on it, and don't let this work add to the pile that eventually needs migrating.
- A dashboard/visual UI — deferred until MCP-tool usage proves insufficient for something specifically visual.
- Consolidating ClickUp/monday, replacing Pylon, or any of the other tools in the inventory above — this plan's scope is marketing/CRM only. The vision doc (`docs/software-native-company-vision.md`) covers the larger ambition; treat other tool replacements as separate future plans, not bundled into this one.

---

## Addendum (2026-07-23, post-planning)

The detailed plan series now exists as `docs/plans/2026-07-23-002` through `-006`. Decisions Will made during that planning session, superseding or resolving items below:

- **Gating: a new `grover_owner` dashboard role, NOT a hardcoded user ID.** Supersedes the "hardcode to Will's user ID" decision above; see plan 004 for rationale and the shared `denyNonOwner` helper. This also settles the future-dashboard gate shape (same role check), resolving the first Outstanding Question.
- **Landing pages: the MCP publish tool IS v1 scope** (plan 005), not just forms-as-code.
- **Admin Accounts audience DOES receive marketing-style sends** (admins should see what their users get); it stays a separate audience so sends are deliberate.
- **HubSpot contact backfill is already complete** — no import task anywhere in the series.
- **No new repo** — data layer/MCP tools in grover-chat, forms/pages in grover-splash; grover-data-jobs (Python geospatial pipelines) is unrelated.

## Outstanding Questions

**Resolve before planning the gating mechanism:**
- If a dashboard does eventually get built, it needs its own solo-only auth gate (a simple check that the caller is Will, not the customer OAuth/company-admin flow grover-admin uses). Worth deciding the shape of that gate now even if the dashboard itself is deferred, so the pattern is consistent with the MCP tool gate rather than invented fresh later.
- Hardcoding to Will's user ID is the chosen approach, but it means every gated tool call site will need a manual pass if a second internal hire ever joins. Not a blocker, but worth a code comment or a single shared gate-check helper (rather than the ID check copy-pasted per tool) so that future revisit is a one-place change, not a many-places hunt.

---

## Suggested plan series (a starting point, not a mandate)

This is offered as an anchor for sequencing, not a prescriptive breakdown — whoever plans this in detail should feel free to reshape it:

1. **Data foundation** — implement the `contacts` table + `ContactsService` from `docs/email-list-consolidation-plan.md` in grover-chat. Everything else depends on this existing first.
2. **Invite sync** — wire `company_invites` and `app_invites` into the new contacts system. Lowest-risk slice, no new public surface, directly closes the original ask about invited emails not being tracked as a list.
3. **MCP tool gate + first tools** — build the single-user auth-gate pattern, then add the first 2-3 MCP tools (e.g., add/tag contact, list contacts, send a one-off campaign) on top of it.
4. **Owned landing pages/forms** — replace the HubSpot embed on grover-splash with a Grover-native form + a new (rate-limited, public) grover-chat endpoint for website opt-ins, per the consolidation plan's design.
5. **Email automation/sequences** — the more complex piece (multi-step triggered sends), likely warrants its own dedicated plan once 1-4 are live and the data model has been proven under real usage.
6. **(Deferred, own future plan) Dashboard** — only once a concrete "this is easier to see than to ask for" need shows up.

---

## Pointers for the next agent

- Read `docs/email-list-consolidation-plan.md` and `docs/software-native-company-vision.md` in full before planning — this doc summarizes them but doesn't replace them.
- grover-chat lives at `/Users/williamtrapp/Developer/grover_dev/grover-chat` (sibling repo, not inside grover-splash).
- The existing MCP server's tool source is grover-chat's `src/lib/public-mcp/tools/` directory (confirmed location of `create_company_invite.ts`); new business-OS tools likely belong alongside those.
- Do not assume any of the "personal/trial" MCP connections (travel sites, cold-outreach tools) are relevant to this work — they were explicitly ruled out as noise during this brainstorm.
