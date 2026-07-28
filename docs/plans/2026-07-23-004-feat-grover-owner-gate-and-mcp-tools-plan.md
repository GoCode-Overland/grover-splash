---
title: "feat: grover_owner role gate + first business-OS MCP tools (grover-chat)"
type: feat
status: planned
date: 2026-07-23
origin: docs/plans/2026-07-23-001-feat-business-os-context-plan.md
series: business-os (3 of 5)
depends-on: docs/plans/2026-07-23-002-feat-contacts-data-foundation-plan.md
supersedes-decision: "context plan's 'hardcode Will's user ID' gating choice — Will chose a new grover_owner role instead (2026-07-23)"
target-repo: grover-chat
---

# feat: grover_owner role gate + first business-OS MCP tools

## Summary

Add a `grover_owner` role at the top of grover-chat's dashboard role system, a single shared `denyNonOwner(ctx)` gate helper in the public MCP server, and the first business-OS MCP tools behind it: `add_contact`, `list_contacts`, `tag_contact`, `unsubscribe_contact`, and `send_campaign` (one-off broadcast to an audience, with a `campaigns` audit table). This is the moment the Business OS becomes usable day-to-day: Will manages contacts and sends campaigns by talking to Claude, with every call audit-logged for free by the existing MCP logging wrapper.

**Decision note:** the context plan (001) resolved on hardcoding Will's user ID. Will overrode that on 2026-07-23: gate via a new **`grover_owner` role** in the existing `DASHBOARD_ROLES` system instead. Rationale: no code change when a second internal hire joins (flip a DB row), and it reuses the RBAC machinery the MCP server already runs on. The context doc's underlying concern (one-place change, not a many-places hunt) is satisfied by the single shared helper.

## Problem Frame

Grounding facts (verified 2026-07-23):

- The public MCP server (`src/lib/public-mcp/`, routed at `/mcp` via `src/routes/mcp/+server.ts`) authenticates in `src/hooks.server.ts`: Bearer JWT → `verifyMcpAccessToken` → fresh `admin_permissions` lookup by email → `event.locals.mcpUser` (`McpUserContext { id, email, role, companyIds, allCompanies }`).
- Roles live in `src/lib/modules/admin/roles.ts`: `DASHBOARD_ROLES = ['company_viewer','company_admin','company_owner','grover_admin']`, ordered viewer < admin < owner, with `grover_admin` orthogonal.
- **The scoping hazard from the context plan is real:** `WRITE_ADMIN_ROLES` includes `company_admin` — a customer-side role. Business-OS tools (send campaign, manage contacts) must not ride on those checks or customer company admins could reach them.
- Tool pattern to copy: `src/lib/public-mcp/tools/create_company_invite.ts` — `registerXTool(server, ctx)` calling `server.registerTool(name, { description, inputSchema: zod fields }, handler)`, with `denyCompanyWrite(ctx, ...)` returning an MCP error result or `null` at the top of the handler. Audit logging to `admin_mcp_logs` is automatic via `installMcpAuditLogging`.
- Seed admins are `system@getgrover.ai` and `will@getgrover.ai` (`src/db/seed/`).

## Requirements

- R1. New `grover_owner` role: superset of `grover_admin` everywhere existing checks run (dashboard route guards, `WRITE_ADMIN_ROLES`/`WRITE_OWNER_ROLES`, `hasCompanyAccess` semantics), so promoting Will to it loses zero existing access.
- R2. Single shared `denyNonOwner(ctx)` helper in `src/lib/public-mcp/server.ts` next to `denyCompanyWrite`; every business-OS tool starts with it. No per-tool role logic.
- R3. Will's `admin_permissions` row set to `grover_owner` (seed update + prod data change); confirm the operative email is `will@getgrover.ai` before flipping.
- R4. MCP tools: `add_contact`, `list_contacts`, `tag_contact`, `unsubscribe_contact`, `send_campaign` — thin wrappers over `ContactsService`/`ContactModel` (plan 002), zero business logic in tool handlers.
- R5. `send_campaign` creates a Resend broadcast against a named audience from provided subject/html (or a stored template name), supports `scheduledAt`, and records a row in a new `campaigns` table.
- R6. The same role check is the documented gate for any future dashboard (the context plan's "decide the gate shape now" ask): a dashboard route would use `DashboardGet/Post({ roles: ['grover_owner'] }, ...)` — same role, same table, no new mechanism.

## Key Technical Decisions

- **`grover_owner` sits above `grover_admin`** in `DASHBOARD_ROLES`; every existing role-spec check that accepts `grover_admin` must accept `grover_owner`. Implement as a small `roleSatisfies(actual, required)` (or extend the existing ordering helper) rather than appending `'grover_owner'` to every array literal — then audit all literal `WRITE_ADMIN_ROLES`/`WRITE_OWNER_ROLES`/route-spec usages once.
- **Owner still gets `allCompanies: true`** on the admin_permissions row — `grover_owner` gates business-OS tools; company access continues to flow through the existing `companyIds/allCompanies` mechanism untouched.
- **Broadcast sending uses the plan-002 `RESEND_AUDIENCE_API_KEY`** via a new `CampaignsService` (`src/lib/services/campaigns/`) wrapping Resend's Broadcasts API (`resend.broadcasts.create/send`). Keeps transactional key isolation intact. (If the scoped key can't create broadcasts, widen its scope to marketing-only in the Resend dashboard — still never the transactional key.)
- **`campaigns` table is an audit ledger, not a scheduler:** `...createBaseFields()`, `name`, `audienceId`, `subject`, `resendBroadcastId`, `status` (draft/scheduled/sent/failed), `scheduledAt`, `sentAt`, `metadata jsonb`. Resend does the actual scheduling/sending; the row is Grover's record.
- **`send_campaign` is two-step by default:** `send_campaign` with `dryRun: true` (default) creates the broadcast as a **draft** in Resend and returns a summary + broadcast ID; a second call with `confirm: true` (or `send_campaign_confirm`) actually sends. An MCP tool that mass-emails an audience in one shot from a chat message is too sharp; this mirrors the existing draft-first habit from grover-splash's broadcast scripts.
- **`list_contacts` returns JSON text content** (the established tool output shape), capped (default 50, max 200) with `source`/`status`/`tag`/`search` filters — "view = Claude reads back a query result" per the product contract.

## Implementation Units

### U1. Role system extension
`src/lib/modules/admin/roles.ts`: add `grover_owner`; introduce/extend the satisfies-helper; sweep all consumers (`server.ts` role arrays, `DashboardGet/Post` role specs, any dashboard-side checks) so `grover_owner ⊇ grover_admin`.
**Accept:** existing role tests pass plus new cases: grover_owner passes every check grover_admin passes; grover_admin FAILS `denyNonOwner`; company_admin/company_owner fail it.

### U2. `denyNonOwner` gate helper
In `src/lib/public-mcp/server.ts`: `denyNonOwner(ctx)` returns the standard MCP error result unless `ctx.role === 'grover_owner'`. Code comment pointing at this plan and noting it is THE business-OS gate (the one-place change if a hire joins).
**Accept:** unit test in the `public-mcp-*.test.ts` family; helper exported and used by every U4/U5 tool.

### U3. Promote Will
Seed (`src/db/seed/`) sets `will@getgrover.ai` → `grover_owner`, `allCompanies: true`; apply same change to the prod `admin_permissions` row. **Confirm with Will that `will@getgrover.ai` is the row his MCP token authenticates as before flipping prod.**
**Accept:** `/mcp` call authenticated as Will reaches a gated tool; a `grover_admin` test identity is denied.

### U4. Contact tools
`src/lib/public-mcp/tools/`: `add_contact.ts`, `list_contacts.ts`, `tag_contact.ts`, `unsubscribe_contact.ts`, registered in `tools/index.ts`. Each: `denyNonOwner` first, zod input schema, delegate to ContactsService/ContactModel, JSON text result.
**Accept:** per-tool tests (mock service, assert gate runs first); manual smoke via Will's real MCP connection listed in the PR.

### U5. Campaigns: table, service, tools
`src/db/schema/campaigns.ts` + migration; `CampaignsService`; `send_campaign` tool with draft-first flow (create draft → return summary → confirm to send/schedule), plus `list_campaigns`.
**Accept:** dryRun creates a Resend draft + `campaigns` row status `draft`, sends nothing; confirm transitions to `scheduled`/`sent` with `resendBroadcastId`; failure path records `failed`. Tests mock Resend.

### U6. Docs
Update the MCP tool docs surface (wherever existing tools are documented — check `grover-claude-marketplace` repo, which carries the Claude Code + Grover MCP setup) and note the new tools + the grover_owner requirement.
**Accept:** docs list the five tools and state the gate.

## Scope Boundaries

- No sequences/triggered sends — one-off broadcasts only (plan 006 owns automation).
- No landing-page tools (plan 005).
- No dashboard — but the gate shape for one is now settled (R6), which retires the context plan's first "resolve before planning" call-out.
- No multi-user permission design beyond the one new role; `grover_owner` is intentionally just "top of the existing ladder."
- Campaign content authoring (React Email templates in grover-splash `scripts/emails/`) stays where it is; `send_campaign` takes rendered HTML. Migrating template rendering into grover-chat is deliberately deferred to plan 006, which needs it anyway.

## Risks

- **Role sweep misses a check site** → grover_owner locked out of something grover_admin could do. Mitigate: grep audit of every `grover_admin` literal + role-spec test coverage in U1.
- **A gated tool forgets `denyNonOwner`** → exposed to customer-side admins (the exact hazard the context plan flagged). Mitigate: a test that introspects registered business-OS tools and asserts each denies a `grover_admin` ctx — structural, not per-tool-memory.
- **Accidental mass send** — mitigated by draft-first `send_campaign` and Resend-side scheduling (a scheduled broadcast can be cancelled in the dashboard).

## Open Questions

- None. Will confirmed (2026-07-23) his MCP token authenticates as `will@getgrover.ai`, and that is his email going forward — U3 promotes that row.
