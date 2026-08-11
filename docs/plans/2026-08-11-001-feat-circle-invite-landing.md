---
title: "feat: Circle invite landing page + app links (grover-splash)"
type: feat
status: planned
date: 2026-08-11
origin: grover-chat/docs/plans/2026-08-11-001-feat-circles-membership-model-master-plan.md
epic: B7
depends-on:
  - grover-chat/docs/plans/2026-08-11-002-feat-circles-membership-backend.md (B6 — bounded links + code column)
target-repo: grover-splash
---

# feat: Circle invite landing page + app links

## Summary

Two things B7 bundles together, and this plan keeps them structurally separate
because D2 (open decision, master plan §7) can land either way:

1. **The `/c/:circleRef` landing page** — a new route, structurally copied from
   `JoinCircle.tsx`'s state machine, consuming the already-shipped
   `GET /api/public/circle-preview/{id}` (unauthenticated, circle name/avatar/
   description/isPublic) plus the invite token/code carried in the URL. This
   part is needed **regardless of D2** — it's the page a link points to.
2. **App-links infrastructure** — `.well-known/apple-app-site-association` and
   `.well-known/assetlinks.json`, served correctly from GitHub Pages. This part
   is **only needed if D2 resolves to "full fidelity."** Under "code-first" it
   is skipped entirely; under the phone-style server-side-match alternative
   D2 also floats, it may never be needed at all.

**Bottom line up front, because the survey demands honesty here: full-fidelity
link-preview unfurls (a shared `/c/:circleRef` link showing the circle's name
and avatar in iMessage/Slack/WhatsApp preview) are close to unachievable on
GitHub Pages as currently deployed, without either (a) a rebuild-and-commit
step per circle — real, buildable, and there is working prior art for it in
this exact repo — or (b) moving unfurl-serving off GitHub Pages onto something
with a request-time code path.** Tapping-opens-the-app (universal links) is a
separate, independently achievable problem — GitHub Pages can serve static
files including AASA/assetlinks correctly, that part is just plumbing. See
§"The unfurl problem" for the full breakdown and the recommendation.

## Problem Frame

Grounding facts, verified against this repo directly:

- **No SSR.** `index.html` ships a single `<div id="root">`; all content,
  including per-route `og:`/`twitter:` meta, is written by React after mount
  via `src/hooks/use-seo.ts`, which does `document.head.querySelector` /
  `appendChild` / `setAttribute`. A crawler that doesn't execute JS — which is
  most link-preview bots (iMessage's LinkPresentation, many chat apps) —
  fetches `index.html` and unfurls with whatever static `<meta>` tags are
  already in the file: the generic "Grover – Adventure Confidently" card and
  `og.png`, not the circle's name/avatar. This is precisely the gap
  `GET /api/public/circle-preview/{id}` was built to close, and the SPA as
  architected cannot close it without an additional piece (see below).
- **No AASA, no assetlinks, no smart banner.** Confirmed: no
  `.well-known/` directory anywhere in `public/`. Confirmed on the app sides
  too — grover-android-app's `AndroidManifest.xml` has only a `grover://`
  custom-scheme intent-filter (`android:scheme="grover"`, no
  `android:autoVerify="true"` https intent-filter); grover-ios-app has no
  `.entitlements` file with `com.apple.developer.associated-domains`. Tapping
  any `getgrover.ai` link today always opens the browser.
- **404-based SPA fallback.** `public/404.html` GitHub-Pages-redirects unknown
  paths by encoding them into a query string (`/?/c/abc123`); `index.html`'s
  inline script decodes it back via `history.replaceState` once JS runs. A
  crawler requesting `/c/abc123` directly gets a literal HTTP 404 response
  before any of that fires — bad for the "does this link even resolve" signal
  some unfurl services check, though most (iMessage, Slack) don't `curl`-verify
  status codes strictly and will still render whatever `<meta>` tags are in the
  404-served body (which is `index.html`'s generic ones, once decoded — but see
  below, the crawler already gave up by then in most implementations that
  don't run JS at all).
- **`/join/:slug` already exists for a different concept.** `src/pages/
  JoinCircle.tsx`, routed at `/join/:slug` in `src/App.tsx`, hits
  `GET https://ops.getgrover.ai/api/join/{slug}` — this is the **B2B company
  builder-code flow** (a company's builder codes + logo + branding theme, no
  auth, no membership token). It is the best structural template available
  (load-state machine, dark/light branding-theme handling, retry-on-error,
  clipboard-copy UI, UTM-tagged store badges) but it is **not** the same
  feature. A new personal-circle invite page must not be named or routed as a
  variant of "join" — that collision is exactly the trap the survey flagged.
  This plan's route is `/c/:circleRef`, matching the URL shape grover-chat's
  own schema comment already commits to:
  `circleInviteTokens.ts`: `// URL-safe unique token used in
  https://getgrover.ai/c/<circleIdOrSlug>?t=<token>`.
- **The public preview endpoint takes a circle id, not a token.**
  `grover-chat`'s `GET /api/public/circle-preview/{circle}`
  (`src/routes/api/public/circle-preview/[circle]/+server.ts`) looks up by
  `circles.id` and returns `{ id, name, avatarUrl, description, isPublic }` —
  no token validation, no `grovenorHandle` yet (that's A6 §10, not yet landed
  as of the master-plan's verification commit). The **token preview** endpoint
  that does exist, `GET /api/grover/circle-invites/{token}`, calls
  `requireUser(locals.user)` — it 401s without a signed-in session. That's the
  A6 §9 handoff item the master plan calls out as "defeats invite links" and
  explicitly punts to B7. **Consequence for this plan:** the landing page can
  show circle name/avatar (via the id) but cannot validate the token itself
  before redemption — it can only carry the token through to the app/signup
  flow, where `POST /api/grover/circle-invites/{token}/accept` does the real
  validation (and is authenticated by design — invariant 7, "nobody joins
  without an account"). A bad/expired/revoked token surfaces only after the
  user has an account and tries to redeem, not on the landing page itself,
  unless a future chat-side change adds an unauthenticated token-status check.
  That's a real UX gap worth flagging to the chat plan, not something this
  plan can fix unilaterally.
- **Deploy pipeline is static-file passthrough, not Jekyll.**
  `.github/workflows/deploy-site.yml`: `npm run build` (Vite) →
  `actions/upload-pages-artifact` → `actions/deploy-pages`. This is the
  "Actions" GitHub Pages deployment method, which uploads the built artifact
  verbatim — there is **no Jekyll processing step** to worry about excluding
  dotfiles from (the classic branch-based Pages deploy method runs Jekyll by
  default, which ignores dotfiles/`_`-prefixed paths unless a `.nojekyll`
  marker is present; this workflow bypasses that entirely). What still needs
  verifying empirically (see U2) is whether **Vite's `publicDir` copy** carries
  a dotfile directory (`.well-known/`) from `public/` into `dist/` — Vite's
  public-dir copy has had inconsistent dotfile handling across major versions,
  and this repo has never had a dotfile under `public/` to prove it works.
  Don't assume either way; U2 includes a local `npm run build && ls -la
  dist/.well-known/` check before relying on it.
- **GitHub Pages cannot set custom response headers.** There is no `_headers`
  file support (that's a Netlify/Cloudflare Pages feature) and no server
  config surface at all — whatever `Content-Type` GitHub Pages' edge infers
  for a given file (by extension, since this is a static file server) is what
  ships, with no override available from this repo. This matters specifically
  for the extension-less `apple-app-site-association` file — see U2.

## The `/c/:circleRef` landing page

### Route and naming

Add to `src/App.tsx`, above the catch-all:

```tsx
import CircleInvite from "./pages/CircleInvite";
// ...
<Route path="/c/:circleRef" element={<CircleInvite />} />
```

`circleRef` (not `slug` or `circleId`) because grover-chat's own comment says
"circleIdOrSlug" — the param may end up being either a UUID or a future
human-readable slug, and the component shouldn't assume which. Component file:
`src/pages/CircleInvite.tsx`. Naming it `CircleInvite` (not `JoinCircleV2` or
similar) keeps the B2B/personal-circle distinction unambiguous at a glance in
the routes table and in `git log`.

### Component shape (copied structure, different contract)

State machine, copied 1:1 from `JoinCircle.tsx`'s pattern (`loading` /
`success` / `not-found` / `rate-limited` / `error`), against a different
response shape:

```tsx
interface CirclePreview {
  id: string;
  name: string;
  avatarUrl: string | null;
  description: string | null;
  isPublic: boolean;
}

type LoadState =
  | { status: "loading" }
  | { status: "success"; data: CirclePreview }
  | { status: "not-found" }
  | { status: "rate-limited" }
  | { status: "error" };
```

Fetch: `GET ${API_BASE_URL}/api/public/circle-preview/${encodeURIComponent(circleRef)}`
(same `API_BASE_URL = "https://ops.getgrover.ai"` constant `JoinCircle.tsx`
already defines — factor it into a shared `src/lib/api.ts` constant while
touching this, so both pages import one source instead of two copies drifting).
Same 404 / 429 / other-non-ok / network-catch branching as `JoinCircle.tsx`
lines 96–115.

The invite token travels as a query param, read via `useSearchParams` (already
imported in `JoinCircle.tsx` for UTM params) — `?t=<token>`, matching the
schema comment's URL shape exactly. It is **never sent to the preview
endpoint** (which doesn't accept it) — it's stashed only to:
- pass through into the store-badge URLs the same way `JoinCircle.tsx` passes
  UTM params, so `useAppUniversalLinks`-less installs still get **some**
  continuity (Android's Play referrer trick, see below);
  and
- surface as copy-this-code UI, once B6 adds `circle_invite_tokens.code` as a
  human-typeable sibling of the token — the code, not the raw token, is what
  survives an App Store round-trip per the master plan's B6 rationale
  ("deferred deep linking without an SDK"). Until B6 ships the `code` column,
  this page has nothing human-typeable to show and should say "open this link
  on your phone to continue" rather than inventing a fake code UI — see U3's
  two variants.

Branding: **no branding theme** on the public circle-preview response (unlike
`JoinCompany.brandingTheme` in the B2B flow) — circles don't carry a
`primaryHex`/`secondaryHex` today. Render with the site's default theme
tokens; if/when circle branding ships, this is an additive change to the same
component, not a rewrite.

`useSEO` call:

```tsx
useSEO({
  title: company ? `Join ${data.name} on Grover` : "Join a Circle on Grover",
  description: data?.description ?? "Download Grover and join this community.",
  path: `/c/${circleRef}`,
  image: data?.avatarUrl ?? undefined,
});
```

— structurally identical to `JoinCircle.tsx`'s call, and **subject to the same
limitation**: this only helps crawlers that execute JS. See "The unfurl
problem" below for what (if anything) closes that gap.

**Noindex.** Unlike marketing pages, add a `robots` meta tag
(`noindex, nofollow`) via a small addition to `useSEO` (a new optional
`noindex?: boolean` field, defaulting false everywhere else) — these are
ephemeral, personal invite pages, not content meant to rank, and letting
thousands of them into Google's index with generic bot-served titles (per the
unfurl problem) is a self-inflicted spam-look. `JoinCircle.tsx`'s `/join/:slug`
pages arguably have the same issue and are out of scope to retrofit here, but
worth flagging in the PR description as a follow-up.

### Redemption is authenticated — the page never redeems anything itself

The landing page's job is preview + funnel to the app, **not** calling
`/accept`. That endpoint requires a session (`requireUser`), which a bare
mobile browser tab never has. The page's only actions are:
- iOS store badge (with the token/code appended however the app is set up to
  consume it post-install — see "App-links infrastructure" for the
  install-time continuity options, and accept that without one, the token is
  simply lost across the App Store round-trip today, same as it already is for
  `/join/:slug`'s builder codes, which solve this by making the human re-type
  a short code inside the app after install).
- Android store badge with `&referrer=` set to the token/code, mirroring
  `JoinCircle.tsx`'s existing `company_code=${trackingCode}` pattern
  (`ANDROID_BASE_URL...&referrer=...`) — Play Install Referrer API **does**
  survive the Play Store round-trip today, no new infrastructure needed, and
  grover-android-app already has to read *some* referrer value for the B2B
  flow, so extending it to also carry a circle token is a small, precedented
  addition on the Android side (out of scope for this repo, noted for the
  Android plan).
- A "already have Grover?" affordance is **not buildable without app links**
  (there is no way to hand off to an already-installed app from a plain `<a>`
  tag pointing at `getgrover.ai` without either a universal link or the
  `grover://` custom scheme — and per the master plan survey, custom schemes
  "don't survive being tapped in most messengers," so a `grover://` link
  embedded in *this* already-in-a-browser context is more viable than one
  embedded in the original shared message, worth a `grover://circles/<id>/
  invite` attempt-then-fallback button here regardless of D2).

### Error-state copy

Reuse `JoinCircle.tsx`'s not-found/rate-limited/error copy verbatim in tone,
adjusted for "circle" vs "community":
- **not-found** (404 from the preview endpoint — covers a bad id, a
  soft-deleted circle, or a private circle with `isPublic: false` where the
  endpoint chooses not to distinguish "doesn't exist" from "exists but is
  private" — confirm this is the desired behavior with grover-chat since a
  private circle returning full preview data by id alone is itself a mild
  discoverability leak; the endpoint's `and(eq(circles.id, circleId),
  eq(circles.isDeleted, false))` where-clause currently has **no `isPublic`
  filter**, meaning `/c/<any-private-circle-id>` today would 200 with the
  circle's real name/avatar/description if this plan ships against the
  endpoint as it exists right now. Flag this explicitly to whoever owns the
  chat-side plan — it's a one-line fix there, not something splash can patch).
- **rate-limited** (429).
- **error** (network/5xx), with the same retry button.

## App-links infrastructure

Two static files, both scoped by D2:

### `public/.well-known/apple-app-site-association`

No file extension (Apple's convention). Content shape (values to be supplied
by the iOS plan — `H2X8728634` is the Team ID confirmed in this survey via
`grover-mobile-app.xcodeproj/project.pbxproj`; the exact bundle id needs
confirming against whichever scheme actually ships, since the pbxproj shows
`ai.getgrover.grover-mobile-app-local` for local builds and CLAUDE.md names
`ai.getgrover.grover-mobile-app` / `-dev` for the two Xcode Cloud targets —
likely both prod and dev bundle ids need an entry, matching Android's two
`applicationId`s below):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": ["H2X8728634.ai.getgrover.grover-mobile-app"],
        "components": [
          { "/": "/c/*", "comment": "Circle invite links" }
        ]
      }
    ]
  }
}
```

### `public/.well-known/assetlinks.json`

Confirmed via `grover-android-app/app/build.gradle`: `applicationId =
"ai.getgrover.grover_mobile_app"` (prod) / `"ai.getgrover.grover_mobile_app.dev"`
(dev). SHA-256 signing cert fingerprints must come from the Android plan (they
live in the Play Console / release keystore, not in this repo):

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "ai.getgrover.grover_mobile_app",
      "sha256_cert_fingerprints": ["<FROM ANDROID PLAN>"]
    }
  }
]
```

Both are plain JSON with no templating and no build-time data — they can be
hand-authored and committed once the exact bundle ids / fingerprints are
confirmed by the iOS and Android plans respectively. **This part of B7 has no
soft dependency on D2's unfurl question** — it's needed for "tapping the link
opens the app" regardless of whether unfurl fidelity is ever solved, and it's
needed for D2's "full fidelity" option specifically, so it's worth building
even if D2 lands on "code-first," as a cheap independent win for the
already-installed case. (It does nothing for the never-installed case that
"code-first" is scoped around, which is why it's listed here as effectively
D2-agnostic rather than D2-gated.)

## The unfurl problem

This is the part of B7 that doesn't have a clean answer, and the plan needs to
say that plainly rather than pick an option and pretend it's free.

**Why per-route `og:` tags injected by `useSEO` don't solve it:** they run
after React mounts and runs an effect. iMessage's link previewer,
Slack's unfurl bot, WhatsApp's, and most others fetch the URL with a
non-browser HTTP client and parse the static HTML — no JS execution budget at
all in the common case. (Facebook's crawler and a few others do run some JS,
but treating "most don't" as the working assumption, per the survey's framing,
is the correct posture — building for the exception and shipping degraded for
the common case would be backwards.) So today, a shared `/c/:circleRef` link
unfurls with `index.html`'s static tags: generic Grover branding, not the
circle's.

### Option A — Prerender/SSG a static file per circle

The strongest version of this, grounded in **prior art already built and
tested in this exact repo pair**: `grover-chat` already has a working
`GitHubService` (`src/lib/services/github/index.ts`, with
`src/tests/github-service.test.ts` passing) that commits files straight to
`grover-splash`'s `main` via the GitHub Contents API — built for
`publish_landing_page`/`update_landing_page` (plan
`2026-07-23-005-feat-owned-forms-and-landing-page-publishing-plan.md`), which
writes `public/lp/<slug>/index.html` and lets the existing
`deploy-site.yml` pipeline pick it up (~2–3 min latency, already accepted
elsewhere in this repo).

The same mechanism could commit `public/c/<circleId>/index.html` — a static
HTML file with correct `<meta>` og/twitter tags baked in at commit time,
falling back to a client-mount that redirects to the real
`/c/:circleRef?t=...` React route for the actual interactive page (same
technique `build-blog.js` already uses for blog posts: pre-rendered static
shell, hydrated/enhanced by the SPA). The natural trigger point is
**grover-chat's invite-link/token creation** (`CircleModel.createInviteLink`,
confirmed present at `src/lib/models/circle/index.ts:1180`, backing B6) —
minting a link would also commit its static preview page.

**Honest tradeoffs:**
- This requires a **grover-chat change**, even though the master plan's B7 row
  lists only `splash, ios, android` as owning repos. That's worth surfacing
  back to the master plan/D2 discussion explicitly — "full fidelity" via this
  route is not splash-only work, unlike the AASA/assetlinks half.
  - This plan's units below account for that by proposing this only as a
    **recommended cross-repo option**, not something splash can complete
    alone — see Units U5a/U5b.
- ~2–3 min propagation lag between minting a link and its preview being
  correct — acceptable for invite links (they're not shared the instant
  they're created, typically), unlikely to be acceptable if this pattern were
  ever reused for something time-sensitive.
- Committing one file per circle to `main` means `public/c/` grows without
  bound and every commit triggers a full site rebuild+deploy
  (`deploy-site.yml` runs on every push to `main`) — fine at dozens/hundreds of
  circles, worth revisiting at scale (thousands), and **every invite-link mint
  becomes a deploy**, which is a real operational change to "pushing to main"
  no one has reckoned with yet.
- Requires `GITHUB_SPLASH_TOKEN` (already provisioned per plan 005) to have
  write access exercised far more often, and by an automated path (invite
  creation) rather than an explicitly gated MCP tool call — worth a second
  look at whether that token's scope/blast-radius is still appropriate once
  it's invoked by ordinary app usage instead of only by Will/Claude publishing
  a page.

### Option B — Edge/serverless proxy on another host

A tiny function (Cloudflare Worker, Vercel Edge Function, or a Fastly Compute
service — anything with a request-time code path) sits in front of just the
`/c/*` path: detects known bot user-agents (or just always does this — it's
cheap), calls `GET /api/public/circle-preview/{id}` itself, and returns a
minimal HTML document with the right `<meta>` tags server-rendered, then either
redirects browsers to the real SPA or serves the same shell to everyone.

**Honest tradeoffs:**
- **This is the only option that gives correct unfurls with zero propagation
  lag** — it's computed at request time, so a link minted one second ago
  unfurls correctly.
- It requires **moving `/c/*` off GitHub Pages** onto a different host/DNS
  entry (a subdomain like `links.getgrover.ai`, or a path-based split via
  Cloudflare in front of the existing domain if Cloudflare is already the
  DNS/CDN layer for `getgrover.ai` — **unconfirmed in this survey; check DNS
  before assuming this is available for free**). That's a genuine
  architecture change for a domain that's currently "just GitHub Pages," with
  its own cost/ops surface (a new deploy target, a new set of secrets, a new
  thing that can go down independently of GitHub Pages' uptime).
- Once you have a request-time host in front of `/c/*` anyway, it can also
  become the redemption point for universal links / the app's Associated
  Domains handler, superseding some of the AASA-file-only approach — but that
  broadens this option well past "just fix unfurls."

### Option C — Accept degraded unfurls (= D2 "code-first")

Ship the `/c/:circleRef` page as described above with client-side-only meta
tags, accept that shared links unfurl with generic Grover branding, and lean
on the invite **code** (once B6 lands it) as the thing that actually carries
identity across the gap — "someone sent you a Grover invite, tap it, then
enter code ABCD1234 once you're in the app," which is exactly the pattern
`/join/:slug` already ships successfully for the B2B flow today (its unfurl is
generic too, and nobody has treated that as a blocker).

**Honest tradeoffs:**
- Zero new infrastructure, ships as soon as the landing page itself (Unit U1)
  is done.
- The circle's name/avatar never appears in the sharing surface itself (only
  after tapping through) — measurably worse social proof / lower click-through
  than a rich preview, but not a broken product.
- This is the **only option that requires no cross-repo work beyond this
  plan** — A and B both need grover-chat or a new host respectively.

### Option D — Move the whole route off GitHub Pages

Full SSR (Next.js/Remix/Astro-SSR/SvelteKit-on-a-server) for at least the `/c/`
subtree, hosted somewhere with a Node runtime. Solves unfurls **and** could
absorb Option B's request-time universal-link handling in the same place.

**Honest tradeoffs:**
- Correct by construction — no propagation lag, no per-circle commit, real
  server-rendered tags for every request.
- By far the largest change: either splits the site across two hosting
  platforms (GitHub Pages for the marketing SPA, something else for `/c/`) or
  migrates the **entire** grover-splash site off GitHub Pages, which is a
  decision far bigger than B7 and shouldn't be smuggled in under it. Not
  recommended as part of this epic; recommended as its own explicit decision
  if the business ever wants it, unrelated to circles.

### Recommendation

**Ship Option C (accept degraded unfurls) as the baseline the landing page
(U1) works correctly under regardless of D2, and treat Option A as the
concrete "full fidelity" path if D2 explicitly asks for it** — not Option B or
D, both of which are disproportionate to what B7 is trying to do (get a
working invite link, not re-architect hosting). Option A has the advantage
that its two building blocks (`GitHubService`, the build-time-rendered-static-
file pattern in `build-blog.js`) already exist and are tested in this repo
family; it is real, scoped, cross-repo-but-small work, not a research
project. Option B/D are the right call only if this pattern generalizes far
beyond circle invites (e.g., a general need for dynamic OG images site-wide) —
not established by anything in this survey.

If D1's "third option" (server-side pending-invite matching, keyed by
phone/email, no token continuity needed at all) is adopted instead of relying
on link continuity, **the unfurl problem's stakes drop significantly**: the
link becomes a nice-to-have notification/preview surface rather than the
actual mechanism that connects a person to a circle, since the real match
happens server-side at signup regardless of what the link looked like when
shared. Worth costing D2 against D1's resolution before committing engineering
time to Option A.

## What changes if D2 lands on "code-first" instead of "full fidelity"

Units are separated below specifically so this isn't a rewrite either way:

| If D2 = full fidelity | If D2 = code-first |
|---|---|
| U1 (landing page) — ship as-is | U1 (landing page) — ship as-is, identical |
| U2 (AASA + assetlinks files) — ship | U2 — **skip entirely** |
| U3 (code display UI) — ship once B6's `code` column lands | U3 — ship, this becomes the primary redemption path, not a fallback |
| U4 (Android referrer passthrough note to Android plan) — ship | U4 — ship, same |
| U5a/U5b (Option A prerender-per-circle, cross-repo) — ship | U5a/U5b — **skip entirely** |

Nothing in U1, U3, or U4 needs to be written differently depending on D2 — the
landing page always shows the preview and always offers the code as a
fallback path; U2/U5 are the only D2-gated units, and they're independently
skippable without touching anything else.

## Implementation Units

### U1. `/c/:circleRef` landing page
Add `src/pages/CircleInvite.tsx` (structure copied from `JoinCircle.tsx`'s
state machine — loading/success/not-found/rate-limited/error, retry-on-error,
UTM-tagged store badges) against the `circle-preview` contract described
above. Register the route in `src/App.tsx` above the catch-all. Extract the
shared `API_BASE_URL`, `IOS_APP_URL`, `ANDROID_BASE_URL` constants (currently
duplicated verbatim in `JoinCircle.tsx` and `Download.tsx`) into
`src/lib/constants.ts` while touching this, so this file doesn't add a third
copy. Add `noindex?: boolean` to `useSEO`'s options (defaults to unset →
current behavior unchanged for every existing caller) and pass `noindex: true`
here.
**Accept:** navigating to `/c/<real-circle-id>` shows the circle's name and
avatar (falls back to the default Grover logo per `hasCompanyLogo`'s pattern
on `onError`); `/c/<garbage>` shows the not-found state; store badges carry
`utm_*` and the token/code through to `trackDownload`'s `gtag` call and to the
Android referrer string. `robots` meta is `noindex, nofollow` on this route
and unchanged (absent) on every other route.

### U2. Verify GitHub Pages can actually serve `.well-known/*` correctly — D2 "full fidelity" only
Before writing a single byte of AASA/assetlinks content: `npm run build`
locally with a placeholder `public/.well-known/apple-app-site-association`
(any valid JSON, no extension) and `public/.well-known/assetlinks.json`
committed, confirm both land in `dist/.well-known/` untouched (Vite's
`publicDir` copy has had inconsistent dotfile handling across versions —
don't assume). Deploy to a throwaway branch/Pages preview if available, or to
`main` behind nothing (these files are inert until an app entitlement points
at them) and `curl -sI https://getgrover.ai/.well-known/apple-app-site-association`
to see the actual `Content-Type` GitHub Pages' edge serves for an
extension-less file — there's no way to override it from this repo (no
`_headers` equivalent), so if it comes back wrong (e.g.
`application/octet-stream` when a strict reading of Apple's docs wants
`application/json`), the fallback is serving a second copy at
`.well-known/apple-app-site-association.json` (Apple's fetcher has
historically probed both paths) rather than anything requiring infra changes.
Validate the real files, once authored, with Apple's AASA validator and a
real-device test, not just a JSON linter — syntactically valid AASA that
Apple's swcd rejects for a structural reason is a common failure mode.
**Accept:** written verification (a short note in the PR, not a test file —
there's no CI step that can assert an external CDN's header behavior) that
both files survive the build+deploy pipeline with usable content types, or a
documented fallback in place if not.

### U3. AASA + assetlinks content — D2 "full fidelity" only
Author `public/.well-known/apple-app-site-association` and
`public/.well-known/assetlinks.json` with real values once the iOS plan
confirms which bundle id(s)/Team ID combination ships (prod vs dev — likely
both need `appIDs` entries) and the Android plan supplies the release
keystore's SHA-256 cert fingerprint(s). No templating needed — these are
static, hand-edited JSON, committed once and updated only when a signing
identity changes.
**Accept:** both files present, valid per U2's validator step, `components`
scoped to `/c/*` only (not the whole domain — no reason for `/for-builders` to
open the app).

### U4. Invite-code display on the landing page
Once grover-chat's B6 ships `circle_invite_tokens.code`, extend U1's
`CircleInvite.tsx` with the same tap-to-copy code UI `JoinCircle.tsx` already
has (`copyCode`, `copiedCode` state, `Check`/`Copy` icon swap) — this is a
straight port of that existing block, keyed off the circle-preview response
plus a `?code=` (or wherever the accept flow decides the code should travel —
confirm exact param name against the chat plan once it exists) query param
rather than `slug.toUpperCase()`. If B6 hasn't shipped yet when U1 ships, U1
should render a "open this link on your phone" message instead of a fake
code, per the Problem Frame's note above — do not fabricate a code UI against
data that doesn't exist yet.
**Accept:** code (once present) renders and copies exactly like
`JoinCircle.tsx`'s existing block; absent a code, the page degrades to a
plain "continue in the app" message with no broken/empty code callout.

### U5a. (Cross-repo, not splash-only) Prerender-per-circle commit path — D2 "full fidelity," Option A only
**This unit lives primarily in grover-chat, not here** — flagged in this plan
because it's the concrete mechanism behind the unfurl recommendation and
splash needs to know the shape of what lands in its own tree as a result.
grover-chat's invite-link creation path (`CircleModel.createInviteLink`) calls
`GitHubService.putFile` (already built, tested, used by
`publish_landing_page`) to commit `public/c/<circleId>/index.html` — a static
shell with the circle's real `<meta>` tags baked in, plus a client-side
redirect (or `<meta http-equiv="refresh">`) to the real interactive
`/c/:circleRef?t=...` SPA route once a browser (not a bot) actually loads it.
**Accept (chat-side):** minting an invite link results in a commit to
grover-splash within one deploy cycle; the committed file's `og:` tags match
the circle at mint time. **Accept (splash-side, this repo):** confirm the
committed file's redirect script correctly hands off to `CircleInvite.tsx`
without a redirect loop, and that `public/c/` being populated by an external
committer doesn't collide with the `/c/:circleRef` React route registered in
U1 (the static file wins for the exact path a bot requests; the SPA route
still needs to work for anyone who lands on `/c/<id>` without the static file
present yet, e.g. a very old cached link, or a circle whose invite-link commit
failed silently).

### U5b. Operational guardrails for U5a — D2 "full fidelity," Option A only
If U5a ships: cap `public/c/` growth (revisit at scale — hundreds of files is
fine, thousands warrants either a cleanup job for expired-token circles or
moving to Option B/D), and re-examine `GITHUB_SPLASH_TOKEN`'s scope now that
it's invoked by ordinary invite-link creation rather than only by an
explicitly-gated MCP publish call — the blast radius of a compromised token
that can write anywhere in `grover-splash` is different when the write is
triggered by "a grovenor tapped 'create invite link'" versus "Will asked
Claude to publish a landing page."
**Accept:** a documented decision (even if "no change needed, current scope is
fine") rather than silence on this specific point, since it's a real change in
who/what can trigger a write to `main`.

## Scope Boundaries

- **Redemption logic, token validation, and the `code` column itself are
  grover-chat's B6, not this plan's.** This plan only consumes what B6
  produces.
- **The AASA `appIDs`/Team ID exactness and the Associated Domains
  entitlement are the iOS plan's.** This plan ships the file; iOS ships the
  entitlement and the `NSUserActivity`/`onOpenURL` handling that makes a tap
  actually route to the right in-app screen.
- **The `assetlinks.json` fingerprints and the `<intent-filter
  android:autoVerify="true">` are the Android plan's.** Same split as iOS.
- **No branding theme for circles** — if/when circles get a `brandingTheme`
  like companies have, that's an additive change to `CircleInvite.tsx`, not
  scoped here.
- **Option B/D (edge proxy, full SSR/hosting migration) are not being
  built in this plan** — they're documented as real options because the task
  demanded an honest accounting, but the recommendation is Option A or
  "accept degraded," not a hosting migration smuggled in under B7.
- **The private-circle-preview-leak note in the Problem Frame is a bug report
  to the chat plan, not something fixed here** — splash has no ability to add
  an `isPublic` filter to a grover-chat endpoint.

## Risks

- **D2 not resolving before U1 ships** is fine — U1 is D2-agnostic by design.
  D2 not resolving before someone starts U2/U3/U5 would be wasted work in the
  full-fidelity direction if D2 (or D1's alternative) later moots it.
- **The private-circle preview leak** (no `isPublic` filter on
  `circle-preview`) means this plan, if shipped naively today, would make
  every private circle's name/avatar/description fetchable by anyone who has
  or guesses its id. Not a new vulnerability introduced by this plan (the
  endpoint already exists and is already public), but shipping a UI that
  actively invites people to hit that endpoint with arbitrary ids (crawlers,
  scanners) raises its exposure. Flag loudly before U1 ships.
- **GitHub Pages dotfile-copy behavior (U2) is unverified** — if Vite's
  `publicDir` copy silently drops `.well-known/`, the entire "full fidelity"
  branch of this plan is dead until worked around (e.g. a small
  `vite-plugin-static-copy` addition, or a post-build `cp` step in
  `deploy-site.yml`), and that would need to be caught before anyone hands
  Apple/Google real fingerprints to put in a file that never deploys.
- **Every invite-link mint becoming a `main`-triggered deploy (U5a)** is an
  operational shift nobody has sized yet — worth a explicit go/no-go with
  whoever owns CI cost and the "is a broken deploy pipeline block feature
  work" risk, before wiring it up.

## Open Questions

- Does `circleRef` in the URL end up being the raw circle UUID, a short slug,
  or the invite token itself doing double duty as the identifier? The schema
  comment says "circleIdOrSlug" but no slug column exists on `circles` today —
  confirm with the chat plan before U1 locks in `encodeURIComponent(circleRef)`
  as a UUID-shaped path segment forever.
  - Update if resolved: if grover-chat's B6/B7 slice adds a slug, `CircleInvite.tsx`
    needs no changes (it already treats `circleRef` opaquely) but the "not-found
    vs private" ambiguity in the Problem Frame gets worse (slugs are guessable
    in a way random UUIDs aren't).
- Exact query-param name for the code (`?t=`, `?code=`, something else) —
  currently only the raw token's URL shape is confirmed in the schema comment;
  the code's hasn't been decided anywhere yet. Pin down with the chat plan
  before U4.
- Whether Cloudflare or another CDN already sits in front of `getgrover.ai`
  (would make Option B far cheaper than a from-scratch analysis assumes) —
  unconfirmed in this survey; check DNS/registrar before ruling Option B out
  on cost grounds alone.
