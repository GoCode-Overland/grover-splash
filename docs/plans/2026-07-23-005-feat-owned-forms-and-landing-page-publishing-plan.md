---
title: "feat: Owned opt-in forms + MCP landing-page publishing (grover-chat + grover-splash)"
type: feat
status: planned
date: 2026-07-23
origin: docs/plans/2026-07-23-001-feat-business-os-context-plan.md
series: business-os (4 of 5)
depends-on:
  - docs/plans/2026-07-23-002-feat-contacts-data-foundation-plan.md
  - docs/plans/2026-07-23-004-feat-grover-owner-gate-and-mcp-tools-plan.md
target-repo: grover-chat + grover-splash
---

# feat: Owned opt-in forms + MCP landing-page publishing

## Summary

Kill the last HubSpot dependency on the website and make landing pages an MCP action. Two halves:

1. **Owned forms:** a rate-limited public endpoint in grover-chat (`POST /api/public/contacts/subscribe`) feeding `ContactsService`, and a small vanilla-JS signup component in grover-splash that replaces every `hs-form-frame` embed (blog index, tutorials, blog posts).
2. **Landing-page publishing:** `grover_owner`-gated MCP tools (`publish_landing_page`, `update_landing_page`, `list_landing_pages`) that commit templated pages into grover-splash's `public/lp/<slug>/` via the GitHub Contents API — the existing push-to-main → Actions → GitHub Pages pipeline does the deploy. Per Will (2026-07-23), the publish tool IS in v1 scope, not just forms-as-code.

## Problem Frame

Grounding facts (verified 2026-07-23):

- **grover-splash deploy:** `.github/workflows/deploy-site.yml` — push to `main` → `npm run build` (Vite, output `dist/`) → GitHub Pages, `CNAME` = getgrover.ai. Repo: `GoCode-Overland/grover-splash`. Anything under `public/` passes through Vite untouched into `dist/`. Deploy latency is one Actions run (~2–3 min).
- **HubSpot embeds:** `hs-form-frame` (portal `48485789`) appears in `blog/index.html`, `tutorials.html`, and at least one blog post (`blog/vanlife-toilets-complete-guide-expert-knowledge/`); `public/` copies mirror them. `scripts/render-hubspot-fragment.ts` renders email fragments for HubSpot modules — obsolete once HubSpot email sends stop (plan 004's `send_campaign` replaces those).
- **grover-chat public surface:** no `src/routes/api/public/` exists yet. Building blocks all exist: `PostHandler` with opt-in `rateLimiter: true` (`@upstash/ratelimit` sliding window over shared Redis, `src/lib/modules/api/rateLimit.ts`), `addCorsHeaders` + reusable `OPTIONS` (`src/lib/modules/api/index.ts`), and a CSRF caveat: `src/hooks.server.ts`'s `csrfGuard` re-implements the cross-origin form-POST guard (SvelteKit's own is disabled) with an explicit exemption list — the new endpoint must either be exempted or accept JSON only (the guard targets form content types).

## Requirements

- R1. `POST /api/public/contacts/subscribe` — body `{ email }`, server-side format validation, writes via `ContactsService.add(email, 'website_optin')` → Grover Marketing audience. No client-supplied audience, source, tags, or metadata.
- R2. Guardrails: CORS locked to `https://getgrover.ai` / `https://www.getgrover.ai` (+ localhost in dev), per-IP rate limit (10/min via the existing `rateLimit` util), JSON-only body, uniform success response (no email-exists enumeration).
- R3. grover-splash signup component: dependency-free JS + HTML fragment matching site styling, inline success/error states, honeypot field. Replaces every HubSpot form embed; HubSpot script tags removed site-wide.
- R4. `publish_landing_page` MCP tool: takes slug, title, meta description, and body content; renders it into the site's landing-page template; commits `public/lp/<slug>/index.html` to `main` via GitHub Contents API; returns the eventual URL (`https://getgrover.ai/lp/<slug>/`).
- R5. `update_landing_page` (same mechanics, requires page exists) and `list_landing_pages` (Contents API directory listing).
- R6. Path jail: tools can only ever write under `public/lp/`; slug strictly validated (`[a-z0-9-]{1,64}`, no traversal). All three tools behind `denyNonOwner`.
- R7. Landing-page template includes the R3 signup form by default (that's what a marketing landing page is for) with an option to omit it.

## Key Technical Decisions

- **Pages as committed files, not DB rows.** Keeps grover-chat page-free (the pure-API direction), keeps pages versioned/reviewable in git, and reuses the existing deploy pipeline. Tradeoff accepted: ~2–3 min publish latency and grover-chat holding a GitHub token.
- **GitHub Contents API from a service, not a git clone.** New `GitHubService` (`src/lib/services/github/`) wrapping create/update-file and list-directory against `GoCode-Overland/grover-splash`, authenticated by a new **fine-grained PAT scoped to that single repo, contents read/write only** (`GITHUB_SPLASH_TOKEN` env). A serverless function can't shell out to git; the Contents API is one HTTPS call per file.
- **Direct commits to `main`, no PR flow.** Matches Will's no-feature-branches convention and the tool's purpose (conversation-speed publishing). Every commit message is stamped `via publish_landing_page MCP tool` for auditability; MCP audit logging captures the full input anyway.
- **Template lives in grover-splash** (`templates/landing-page.html` with `{{title}}`/`{{description}}`/`{{content}}`/`{{form}}` slots). grover-chat fetches it at publish time via the same Contents API rather than vendoring a copy — one source of truth for site chrome. Body content is provided as HTML by the caller (it's Will + Claude authoring; no sanitization theater for a single-operator tool, but the template hard-codes nav/footer/CSP-compatible structure).
- **Form component is vanilla JS**, not React: the embeds live in plain HTML pages (blog posts, tutorials) outside the React app. One `<div data-grover-signup>` + one small script (`public/js/signup.js`) auto-mounting into it works in both worlds.
- **CSRF handling: JSON-only endpoint.** `Content-Type: application/json` keeps it outside the form-POST guard's target set; verify against `csrfGuard`'s actual matcher during implementation and add an explicit exemption only if needed.
- **Homepage/blog-footer placement** of the form follows the existing HubSpot embed locations 1:1 in this plan; net-new placements are editorial follow-up, not scope here.

## Implementation Units

### U1. Public subscribe endpoint (grover-chat)
`src/routes/api/public/contacts/subscribe/+server.ts`: `PostHandler` with `rateLimiter: true` (tightened to ~10/min via the util's params), origin-allowlisted CORS + `OPTIONS`, zod email validation, `ContactsService.add`, uniform `{ ok: true }` response. Confirm csrfGuard behavior for JSON POSTs.
**Accept:** tests cover valid subscribe (contact upserted), invalid email 400, rate-limit 429, disallowed-origin CORS failure, and that a duplicate email returns the same `{ ok: true }`.

### U2. Signup component (grover-splash)
`public/js/signup.js` + a documented HTML fragment; styling consistent with site tokens. Honeypot + double-submit guard. Endpoint URL configurable via `data-` attribute (defaults to prod grover-chat).
**Accept:** form on a local page successfully creates a contact against a dev grover-chat; error and success states render; no external script requests.

### U3. HubSpot removal (grover-splash)
Replace `hs-form-frame` embeds in `blog/index.html`, `tutorials.html`, affected blog posts, and their `public/` mirrors with the U2 fragment; strip HubSpot script loaders; delete `scripts/render-hubspot-fragment.ts` and its package.json script (superseded by plan 004 `send_campaign`).
**Accept:** `grep -ri "hs-form-frame\|hsforms\|48485789"` across the repo returns only docs/plans mentions; deployed pages show the Grover form.

### U4. GitHubService (grover-chat)
`src/lib/services/github/index.ts`: `getFile`, `putFile` (create/update with SHA handling), `listDir`, pinned to `GoCode-Overland/grover-splash`, token from `GITHUB_SPLASH_TOKEN`. Typed errors per the services AGENTS.md pattern.
**Accept:** tests mock fetch; SHA-conflict retry covered; env documented in `env.example`.

### U5. Landing-page template (grover-splash)
`templates/landing-page.html`: site nav/footer chrome, OG tags, slots, optional signup-form block. A `public/lp/` README noting the directory is MCP-managed.
**Accept:** a hand-rendered page from the template looks correct locally and builds into `dist/lp/` untouched.

### U6. Publishing MCP tools (grover-chat)
`tools/publish_landing_page.ts`, `update_landing_page.ts`, `list_landing_pages.ts` — `denyNonOwner` first, slug validation/path jail, fetch template → interpolate → `putFile` → return `{ url, commitSha, note: 'live in ~3 min after Actions deploy' }`. Register in `tools/index.ts`.
**Accept:** tests cover the path jail (traversal/absolute/uppercase slugs rejected), publish vs update existence semantics, and gate-first ordering. End-to-end smoke: publish a test page via Will's MCP connection, verify it deploys, then remove it.

## Scope Boundaries

- No dashboard or visual page editor; authoring happens in conversation.
- No A/B testing, UTM attribution capture, or analytics on landing pages (vision-doc material, own future plan; the `metadata jsonb` on contacts leaves room for attribution later).
- No migration of existing marketing pages into `/lp/` — this creates the net-new pipeline only.
- No sitemap/SEO automation for `/lp/` pages in v1 (they're campaign pages; add to sitemap tooling later if they become durable content).
- Deleting the HubSpot portal/account itself is Will's manual follow-up once forms are verified live. That follow-up includes DNS cleanup (verified via dig 2026-07-23): remove `include:_spf.hubspotmail.net` from the SPF records on BOTH `getgrover.ai` and `hello.getgrover.ai` once no HubSpot sends remain (i.e., after plan 004's `send_campaign` has replaced HubSpot email), and then tighten DMARC from the current `p=none` to `p=quarantine` (Resend is the only remaining sender). No HubSpot DKIM CNAMEs (`hs1/hs2-48485789._domainkey`) exist, so SPF is the only HubSpot DNS remnant. **No new DNS records need provisioning anywhere in this series** — Resend's DKIM on `hello.getgrover.ai` is live, plan 006's `marketing@hello.getgrover.ai` uses that same verified domain, landing pages ride the existing getgrover.ai GitHub Pages setup, and grover-chat's public URL already serves MCP/admin traffic.

## Risks

- **grover-chat holds write access to the website repo.** Contained by: fine-grained single-repo contents-only PAT, the `public/lp/` path jail, `denyNonOwner`, and MCP audit logs. A leaked token can deface `lp/` pages but not touch workflows (Actions files need `workflow` scope) or other repos.
- **Rate limiting is per-IP sliding window** — a determined bot can still pollute the Grover Marketing audience with real-looking emails. Honeypot + uniform responses cover the casual case; if pollution shows up in practice, add Resend double-opt-in (audience-level setting) as the escalation, not CAPTCHA.
- **Publish latency confusion:** the tool returns success minutes before the page is live. Mitigated by the explicit note in the tool response; a later nicety could poll the Actions run.
- **Template drift:** pages are rendered at publish time, so a template change doesn't retroactively update old pages. Acceptable for campaign pages; `update_landing_page` re-renders on edit.

## Open Questions

- None blocking. (Will confirmed the MCP publish tool is v1 scope, 2026-07-23.)
