---
title: "feat: Unify Grova assistant, fix analytics and CSP, and introduce blog build tooling"
type: feat
status: active
date: 2026-04-21
---

# feat: Unify Grova assistant, fix analytics and CSP, and introduce blog build tooling

## Overview

The getgrover.ai static site has accumulated several structural problems: two different chat assistant IDs (one retired S.A.M. configuration still live on `build/`), a chat init script placed in an event listener instead of `<head>`, a GA4 loader with a double-fire bug, a Content-Security-Policy that blocks the majority of the actual third-party scripts in use, an incomplete `build/` page with a dead script reference, and 26 blog files with no shared templating. This plan resolves all of those systematically: unify the Grova assistant across all pages, move chat init to `<head>`, fix analytics, fix CSP, finish `build/`, and introduce a minimal blog stamp script so `<head>` consistency can be maintained without editing 26 files by hand.

## Problem Frame

The site is a rich marketing splash for the Grover van life app. App download (Apple App Store) is the primary hero conversion goal; the Grover Chat widget is passive/supporting. The site has grown in an ad-hoc way with no build tooling, resulting in:

- **Retired S.A.M. assistant** still active on `build/index.html` with a different `assistantId` (`8c7b77ac-...`) than the Grova assistant used on the home page (`3eb69271-...`). S.A.M. is retired — every page should use Grova.
- **Chat init in wrong location:** `index.html` initializes the Grover Chat widget inside a `window.load` listener; `build/index.html` initializes it in `<head>` without the wrapper. The user wants `<head>` placement uniformly.
- **GA4 double-fire risk:** `loadGA()` in `index.html` has no idempotency guard — four event types plus a `setTimeout` can all invoke it, appending the GTM script tag multiple times.
- **CSP blocks everything it should allow:** `ops.getgrover.ai`, HubSpot (`js.hsforms.net`), Vivus (`cdnjs.cloudflare.com`), and Tailwind CDN (`cdn.tailwindcss.com`) are all absent from `script-src`. There is no `frame-src` directive, so HubSpot form iframes default to `default-src 'self'` and are blocked.
- **`build/` is structurally incomplete:** dead `../script.js` reference, placeholder header/footer comments, no GA, no OG tags, wrong page title ("Grover Splash").
- **Blog files are all self-contained islands:** no shared partials, so any `<head>` change requires editing all 26 files.

## Requirements Trace

- R1. Grova assistant (`3eb69271-d883-440b-944c-c40afa7725df`) is the only chat assistant in use across every page; S.A.M. assistant ID and all S.A.M. copy are removed.
- R2. Grover Chat init script is placed in `<head>` on all pages, not in a deferred event listener.
- R3. `loadGA()` on `index.html` cannot fire more than once (idempotency guard added).
- R4. GA4 coverage is explicitly decided for every HTML page in the repo (either included or annotated as intentional exclusion).
- R5. The `.htaccess` CSP allows all third-party origins actually in use; no legitimate script or iframe is blocked by CSP in the browser console.
- R6. `build/index.html` has a proper header, footer, GA, OG/Twitter meta, canonical URL, correct title, and no dead script references.
- R7. Blog files use a shared `<head>` GA snippet that can be updated via a single build script run rather than 26 hand-edits.
- R8. Blog files have consistent canonical tags, OG meta, and footer year.
- R9. `index.html` HTML quality fixes: `</br >` → `<br>`, duplicate preconnect removed, footer updated to © 2026 with links to Terms and blog.
- R10. Service worker `CACHE_NAME` is bumped after CSS/JS changes land.

## Scope Boundaries

- This plan does not redesign visual layout or reduce scroll effects/decorative sections on `index.html` (that is a future UX simplification decision).
- Partner grid reduction or "Partners" subpage is out of scope.
- Blog editorial review (accuracy of quantitative claims, freshness of dated content) is out of scope — this plan fixes structural/template consistency only.
- This plan does not add Android/Google Play CTA (no such link exists today; that is a product decision).
- No new marketing copy is written beyond removing S.A.M. references.

### Deferred to Separate Tasks

- Notion-style page simplification (fewer decorative sections, single hero visual): future UX iteration.
- Blog tone standardization (playful emoji vs. Notion-doc style): editorial decision for a separate pass.
- HubSpot form replacement or removal: product decision outside this scope.

## Context & Research

### Relevant Code and Patterns

- `index.html` lines 13–42: `loadGA()` function + four `{ once: true }` event listeners + `setTimeout(loadGA, 1000)`. No `let gaLoaded` guard.
- `index.html` lines 43–129: Grover Chat init is inside `window.addEventListener('load', function() { ... })`. The `<grover-chat-widget>` is injected by the `GroverChat.init()` call inside this listener.
- `build/index.html` `<head>`: Grover Chat init is a direct inline `<script>` block — no event listener wrapper. This is the pattern the user wants everywhere.
- `build/index.html`: references `../script.js` (does not exist) and `../main.js` (exists). The `script.js` reference must be removed; `waitForChatWidget()` in the inline script already handles the button without needing an external file.
- `.htaccess` line 89: CSP header with gaps (see Problem Frame above for full list).
- `sw.js`: `CACHE_NAME = 'grover-v2'`, precaches 8 assets using cache-first strategy.
- `blog/blog.css` + `../main.css`: standard blog CSS references. All 26 blog files use the immediate-load GA4 snippet (no delayed loader) — this is the correct pattern per `GA4_TRACKING_SETUP.md` and should be preserved.
- `main.js`: handles scroll effects, floating CTA, cycling text, Vivus SVG animation. Loaded at bottom of `<body>` via `<script src="main.js">`.
- `GA4_TRACKING_SETUP.md`: prescribes immediate-load GA pattern for all pages except `index.html` (which predates the doc and uses the delayed approach).

### Institutional Learnings

No `docs/solutions/` directory exists yet. Key learnings to capture as part of this work:
- CSP `frame-src` must be explicitly set; without it, iframes fall through to `default-src 'self'` and HubSpot forms are blocked.
- Vivus is loaded dynamically by `main.js` via `requestIdleCallback`; its CDN origin must be in both `script-src` and `connect-src`.
- `ops.getgrover.ai` needs to be in `script-src` (not just `connect-src`) because the embed init creates a `<script>` tag pointing to that origin.

### External References

- None required — all patterns are derivable from existing code.

## Key Technical Decisions

- **App Store stays primary CTA; chat is passive/supporting.** No new chat launch button is added to the hero. The Grover Chat widget floats passively as it does today.
- **Grova assistant only (`3eb69271-d883-440b-944c-c40afa7725df`).** S.A.M. (`8c7b77ac-...`) is retired everywhere. All pages use the same ID.
- **Chat init in `<head>` without event listener wrapper.** This matches the `build/index.html` pattern the user confirmed is correct. The embed script and `GroverChat.init()` call sit in an inline `<script>` block in `<head>` on every page, not inside `window.load`. This means the chat widget begins loading with the page rather than after load fires — acceptable trade-off per user direction.
- **GA4: keep delayed-load approach on `index.html`, fix idempotency.** The delayed pattern is intentional for home page performance; standardizing blogs to the immediate pattern per `GA4_TRACKING_SETUP.md` is correct. The fix is narrowly adding a `let gaLoaded = false` guard inside `loadGA()`, not changing the broader loading strategy.
- **`tutorials.html` and `partner-marketing.html`: explicitly exclude from GA with a comment.** These pages are intentionally excluded per the GA4 setup doc; add an HTML comment so the next developer knows this is deliberate, not an oversight.
- **Blog build step: single Node.js script, no framework.** A minimal `scripts/stamp-blog.js` reads each `blog/*.html` file, identifies the GA snippet block by comment markers, and replaces it with the canonical snippet. A minimal `package.json` is introduced to register the `npm run stamp-blog` command. This is the only build tooling added — no bundler, no templating engine.
- **CSP: add all missing origins; keep `form-action 'self'` under review.** HubSpot form submissions may post to `https://forms.hsforms.com` — if that turns out to block submissions, `form-action` will need to be updated (deferred to implementation verification).

## Open Questions

### Resolved During Planning

- **Which assistant ID to use everywhere?** `3eb69271-d883-440b-944c-c40afa7725df` (Grova). S.A.M. is retired.
- **Primary hero CTA: chat or app store?** App Store remains primary. Chat is passive/supporting.
- **Blog build tooling or hand-edit?** Introduce minimal Node.js build script.
- **Chat init location?** `<head>` inline script, no event listener wrapper — per user direction.

### Deferred to Implementation

- **HubSpot `form-action`:** Whether HubSpot form submission endpoint (`forms.hsforms.com`) requires `form-action` update can only be confirmed by submitting the form in a CSP-enforcing browser context after the fix lands.
- **Exact S.A.M. copy locations in blog posts:** The implementer should `grep -r "S.A.M\|SAM assistant\|sam assistant" blog/` and `grep -rli "sam" blog/` to find all occurrences before editing. Some blog posts reference S.A.M. as a product feature to be described; those need editorial judgment about replacement copy.
- **GA on `pages/account-delete/index.html`:** This is a legal compliance page. Whether GA should be added is a privacy/legal judgment — implementer should treat it as an intentional exclusion until the user decides otherwise.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

### Blog stamp script flow

```
npm run stamp-blog
  → scripts/stamp-blog.js
    → reads each blog/*.html file
    → identifies GA block between
        <!-- Google tag (gtag.js) --> ... gtag('config', 'G-LN0EK30SS7');</script>
        (anchor end on the config call line, not by counting </script> tags)
    → replaces it with the canonical snippet (defined as a constant in the script)
    → writes file back in-place
    → reports: "Updated N files"
```

The canonical snippet the script stamps is the same immediate-load pattern already in use:

```
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LN0EK30SS7"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-LN0EK30SS7');
</script>
```

### CSP allowlist additions (`.htaccess`)

| Directive | Origins to add |
|-----------|----------------|
| `script-src` | `https://ops.getgrover.ai` `https://js.hsforms.net` `https://cdnjs.cloudflare.com` `https://cdn.tailwindcss.com` |
| `connect-src` | `https://js.hsforms.net` `https://forms.hsforms.com` `https://cdnjs.cloudflare.com` `https://region1.google-analytics.com` `https://stats.g.doubleclick.net` |
| `frame-src` (new directive) | `https://js.hsforms.net` `https://forms.hsforms.com` |
| `style-src` | `https://cdn.tailwindcss.com` (for Tailwind CDN on tutorials.html) |

## Implementation Units

---

- [ ] **Unit 1: Retire S.A.M. and unify Grova assistant init in `<head>`**

**Goal:** Remove the retired S.A.M. assistant from `build/index.html`, make both `index.html` and `build/index.html` init the Grova assistant (`3eb69271-d883-440b-944c-c40afa7725df`) in `<head>` without any event listener wrapper, and purge all S.A.M. mentions site-wide.

**Requirements:** R1, R2

**Dependencies:** None

**Files:**
- Modify: `index.html`
- Modify: `build/index.html`
- Delete: `blog/how-to-create-custom-ai-assistant.html` (contains ~15 S.A.M. references as core product narrative; deletion is the chosen approach over rewrite)
- Modify: `blog/index.html` — remove the listing entry for `how-to-create-custom-ai-assistant.html` after deletion
- Modify: any other blog posts that mention S.A.M. (use `grep -ri "s\.a\.m\|sam assistant\|sam\b" blog/` to find them before editing; most are passing mentions suitable for find-replace)

**Approach:**
- On `index.html`: extract the `GroverChat.init({ assistantId: '3eb69271-...' })` call and the surrounding embed script tag out of the `window.addEventListener('load', ...)` block and place it as a direct inline `<script>` in `<head>`. Remove the now-empty `window.load` wrapper.
- On `build/index.html`: replace `assistantId: '8c7b77ac-5b4c-4c8d-95c6-4702c3997a1a'` with `3eb69271-d883-440b-944c-c40afa7725df`. The `<head>` placement is already correct. Remove the `../script.js` script tag (the file does not exist; `waitForChatWidget()` already handles the button inline). Keep the `../main.css` link.
- Delete `blog/how-to-create-custom-ai-assistant.html` outright — do not attempt to rewrite it. Remove the corresponding `<li>` entry in `blog/index.html` so no broken link remains.
- Search remaining HTML files for S.A.M. references and update copy. "S.A.M." as a proper noun should be replaced with "Grova" or removed depending on sentence context. The build/ page title can change to "Build Your Adventure Van — Grover" (remove "Splash" suffix).
- Do not change the `waitForChatWidget()` polling function in `build/index.html` — it correctly wires the "Start Building Now" button to the chat toggle regardless of assistant ID.

**Test scenarios:**
- Happy path: After change, open `index.html` in browser — Grova chat widget appears and is functional in `<head>` timing (no `window.load` delay).
- Happy path: Open `build/index.html` — chat widget uses the Grova assistant, "Start Building Now" still triggers the chat panel.
- Integration: Grep confirms zero occurrences of `8c7b77ac` and zero occurrences of `S.A.M.` (as proper noun) across all HTML files.
- Integration: `blog/how-to-create-custom-ai-assistant.html` is absent from the repo; `blog/index.html` contains no link to it.
- Edge case: `build/index.html` with `script.js` removed — verify no console 404 errors for `script.js`.

**Verification:**
- Browser DevTools Network tab shows only one Grover Chat embed request, pointing to `ops.getgrover.ai`, on both pages.
- No `window.load` wrapper remains around the chat init in `index.html`.
- Zero occurrences of `8c7b77ac-5b4c-4c8d-95c6-4702c3997a1a` anywhere in the repo.
- `blog/how-to-create-custom-ai-assistant.html` deleted; `blog/index.html` updated.

---

- [ ] **Unit 2: Complete `build/index.html` page structure**

**Goal:** Make `build/index.html` a structurally complete page with proper header, footer, meta tags, GA, and canonical URL — consistent with the rest of the site.

**Requirements:** R4, R6

**Dependencies:** Unit 1 (chat init and assistantId changes must be in place first to avoid re-touching the same file)

**Files:**
- Modify: `build/index.html`

**Approach:**
- Add `<meta charset="UTF-8">` as the first tag inside `<head>` (before any scripts).
- Add OG and Twitter Card meta tags (title, description, url, image pointing to `../img/og.png`); include `og:url` set to `https://getgrover.ai/build/`.
- Add `<link rel="canonical" href="https://getgrover.ai/build/">`.
- Add GA4 immediate-load snippet (same pattern as blog pages) — `G-LN0EK30SS7`.
- Replace the placeholder header comment with a minimal header: site wordmark (`img/grover-combomark-white.svg` or dark variant) + a "← Back" link to `/`.
- Replace the placeholder footer comment with the same footer markup as `index.html` (logo + "© 2026 grover. All rights reserved.").
- Update `<title>` from "Build Your Adventure Van - Grover Splash" to "Build Your Adventure Van — Grover".
- Ensure `<link rel="stylesheet" href="../main.css">` is present (it already is); verify `../blog/blog.css` is NOT referenced (build/ is not a blog page).

**Test scenarios:**
- Happy path: Page renders with header (wordmark) and footer (copyright) visible.
- Happy path: OG tags appear correctly when the URL is shared (use a meta tag inspector tool or view page source).
- Happy path: GA4 snippet fires in browser DevTools Network tab — a request to `googletagmanager.com`.
- Edge case: Canonical URL matches the live URL (`https://getgrover.ai/build/`) — verify no trailing slash mismatch.

**Verification:**
- `build/index.html` passes an HTML validator with no errors.
- Page has a visible branded header and footer matching site style.
- Network tab confirms GA fires on page load.

---

- [ ] **Unit 3: Fix GA4 `loadGA()` idempotency and add missing coverage decisions**

**Goal:** Add a one-time-execution guard to `loadGA()` so the GA script tag is never appended more than once, and annotate pages explicitly excluded from GA tracking.

**Requirements:** R3, R4

**Dependencies:** None (independent of Units 1 and 2)

**Files:**
- Modify: `index.html`
- Modify: `tutorials.html`
- Modify: `partner-marketing.html`

**Approach:**
- In `index.html`, add `let gaLoaded = false;` immediately before the `loadGA()` function definition. At the top of `loadGA()`, add an early return if `gaLoaded` is `true`, then set `gaLoaded = true` as the first statement in the function body.
- In `tutorials.html`: add an HTML comment `<!-- GA intentionally excluded: utility/reference page, not a conversion surface -->` at the location where a GA snippet would normally go (after `<meta charset>`). Do not add GA.
- In `partner-marketing.html`: same comment pattern as `tutorials.html`.
- In `pages/account-delete/index.html`: add the same intentional-exclusion comment. (GA on a legal compliance/deletion page is a privacy judgment — leave it excluded.)
- Do not change the loading strategy on `index.html` (delayed load) or on blog files (immediate load). The two patterns co-existing is acceptable and documented.

**Test scenarios:**
- Edge case: simulate rapid multi-event scenario on `index.html` — verify via DevTools Network tab that only one request to `googletagmanager.com/gtag/js` is made, even if scroll + mousedown + touchstart all fire quickly.
- Happy path: GA fires normally on `index.html` with a single `page_view` event in GA4 DebugView.
- Integration: confirm `tutorials.html`, `partner-marketing.html`, `pages/account-delete/index.html` have no GA network requests.

**Verification:**
- `loadGA()` contains `let gaLoaded = false` guard (or equivalent flag).
- No duplicate GTM script tags in DevTools Elements panel after interacting with `index.html`.
- Three non-GA pages have explicit exclusion comments.

---

- [ ] **Unit 4: Reconcile Content-Security-Policy with actual third-party origins**

**Goal:** Update `.htaccess` CSP header so that every third-party script, style, and iframe actually in use is explicitly allowed — eliminating the gap between what the site loads and what CSP permits.

**Requirements:** R5

**Dependencies:** Unit 1 (confirms the final set of embed origins in use; `ops.getgrover.ai` is now in `script-src` too)

**Files:**
- Modify: `.htaccess`

**Approach:**

Update the `Content-Security-Policy` header to:
- `script-src`: add `https://ops.getgrover.ai` (Grover Chat embed creates a `<script>` tag), `https://js.hsforms.net` (HubSpot), `https://cdnjs.cloudflare.com` (Vivus loaded by `main.js`), `https://cdn.tailwindcss.com` (tutorials.html only).
- `style-src`: add `https://cdn.tailwindcss.com` (Tailwind CDN styles on tutorials.html).
- `connect-src`: add `https://js.hsforms.net`, `https://forms.hsforms.com`, `https://cdnjs.cloudflare.com`, `https://region1.google-analytics.com`, `https://stats.g.doubleclick.net`.
- Add new `frame-src` directive: `'self' https://js.hsforms.net https://forms.hsforms.com` (HubSpot form iframe requires this; without it, falls through to `default-src 'self'` which blocks it). **Before finalizing these origins:** inspect the HubSpot embed in browser DevTools — the actual `<iframe src="">` may point to `share.hsforms.com` or similar rather than `js.hsforms.net`; use the actual observed origin, not the script-loader domain.
- Remove the separate `X-Frame-Options DENY` header: add `Header unset X-Frame-Options` immediately after the existing `Header always set X-Frame-Options DENY` line (line 82). Browsers evaluate `X-Frame-Options` independently of CSP `frame-src` — leaving `DENY` in place would block all iframes regardless of the frame-src fix above.
- Leave `form-action 'self'` for now; if HubSpot submission testing shows it needs `https://forms.hsforms.com`, add it then (see Deferred Questions).
- Do not remove `'unsafe-inline'` or `'unsafe-eval'` from `script-src` — these are already present and removing them would break inline scripts; that hardening is out of scope.

**Test scenarios:**
- Happy path: Open `index.html` in Chrome with DevTools Console open — zero CSP violation messages.
- Happy path: HubSpot form on `index.html` renders visually (iframe appears, not blocked).
- Happy path: Submit the HubSpot form — confirm form submission succeeds (or note if `form-action` needs updating).
- Happy path: `tutorials.html` loads Tailwind styles correctly — no CSP violation for `cdn.tailwindcss.com`.
- Integration: `main.js` loads Vivus from cdnjs without CSP block — SVG hero animation still plays.
- Integration: Grover Chat widget initializes without CSP block — verify in DevTools Network that the embed script from `ops.getgrover.ai` loads without a CSP error.

**Verification:**
- Browser DevTools Console shows zero CSP violations on `index.html`, `build/index.html`, and `tutorials.html`.
- HubSpot form iframe is visible and functional on `index.html`.
- Grover Chat widget appears on all pages without errors.
- `grep -i "X-Frame-Options" .htaccess` shows `Header unset X-Frame-Options` present (DENY line replaced or followed by unset).

---

- [ ] **Unit 5: Introduce minimal blog build script**

**Goal:** Create a single Node.js script that standardizes the GA4 snippet across all 26 blog files, so future GA changes (e.g., adding a consent string, bumping the tracking ID) require editing one place and running one command.

**Requirements:** R7

**Dependencies:** None (can run independently)

**Files:**
- Create: `scripts/stamp-blog.js`
- Create: `package.json`
- Modify: `.gitignore` — add `node_modules/`

**Approach:**
- `package.json`: minimal, with `name: "grover-splash"`, `private: true`, `scripts: { "stamp-blog": "node scripts/stamp-blog.js" }`, and an `engines: { "node": ">=18" }` field. No runtime dependencies.
- `scripts/stamp-blog.js`: defines the canonical GA4 snippet as a string constant. Reads each file matching `blog/*.html`. Locates the GA block by matching from `<!-- Google tag (gtag.js) -->` to the second closing `</script>` tag that follows it (i.e., the two-script GA block). Replaces the matched block with the canonical snippet. Writes the file back in-place. Logs a summary line per file changed.
- The script should be idempotent: running it twice on a file already stamped produces no change.
- Include a `--dry-run` flag that prints diffs without writing files, so the implementer can verify before committing.

**Patterns to follow:**
- Keep the script dependency-free (Node.js built-ins only: `fs`, `path`). Discover files using `fs.readdirSync('blog').filter(f => f.endsWith('.html'))`.
- The regex/string match for the GA block should be anchored to the HTML comment `<!-- Google tag (gtag.js) -->` to avoid false matches.

**Test scenarios:**
- Happy path: `npm run stamp-blog` runs without error on all 26 blog files and reports "0 files changed" (since they already contain the correct canonical snippet).
- Edge case: Manually modify GA snippet in one blog file to an old pattern — run `stamp-blog`, verify that file is updated and reported as changed.
- Edge case: Run `stamp-blog` twice in a row — second run reports 0 changes (idempotent).
- Happy path: `npm run stamp-blog -- --dry-run` prints what would change without writing files.
- Edge case: A blog file missing the GA comment block entirely — script should log a warning and skip the file, not crash.

**Verification:**
- `npm run stamp-blog` exits with code 0.
- All 26 blog files contain the identical canonical GA snippet after a run.

---

- [ ] **Unit 6: Blog template consistency pass**

**Goal:** Apply structural fixes to blog files that the stamp script cannot handle automatically: missing canonical tags, redundant preload+stylesheet duplication, OG tag consistency, and footer year.

**Requirements:** R8

**Dependencies:** Unit 5 (stamp script must exist and have been run; this unit handles what it can't)

**Files:**
- Modify: all blog files missing canonical tags — run `grep -rL 'rel="canonical"' blog/*.html` to enumerate (~13 of 26 confirmed missing by review); `blog/adding-your-first-pin-grover-guide.html` is a confirmed example
- Modify: any blog files with redundant `<link rel="preload" href="../main.css" as="style">` alongside the stylesheet link (check with grep before editing)
- Modify: all 26 blog files — update footer year from `&copy; 2025` to `&copy; 2026`

**Approach:**
- Add canonical tags to files missing them. Pattern: `<link rel="canonical" href="https://getgrover.ai/blog/[slug]/">`.
- Remove redundant `<link rel="preload" href="../main.css" as="style">` lines where `<link rel="stylesheet" href="../main.css">` is already present — the preload duplicates the browser's own prioritization and is harmless but inconsistent.
- Update any blog footer `© 2025` to `© 2026`.
- Do not change post content, titles, dates, or any editorial copy in this pass — this unit is structural only.
- Run `grep -rn "&copy; 2025" blog/` and `grep -rn 'rel="canonical"' blog/` before editing to scope the work precisely.

**Test scenarios:**
- Happy path: After changes, `grep -rn 'rel="canonical"' blog/` returns an entry for every blog file.
- Edge case: `adding-your-first-pin` canonical URL is correct slug (`/blog/adding-your-first-pin-grover-guide/`), not a generic placeholder.
- Happy path: `grep -rn "&copy; 2025" blog/` returns zero results.

**Verification:**
- All 26 blog files have a `<link rel="canonical">` tag.
- Zero files have both `rel="preload"` and `rel="stylesheet"` for the same `../main.css`.
- Zero blog files show `&copy; 2025` in source (confirmed by grep of raw HTML).

---

- [ ] **Unit 7: `index.html` quick wins and footer links**

**Goal:** Fix a cluster of small but concrete HTML quality issues in `index.html` and bump the service worker cache name.

**Requirements:** R9, R10

**Dependencies:** Units 1 and 3 (must complete those first since this unit is the last touch on `index.html` and `sw.js`)

**Files:**
- Modify: `index.html`
- Modify: `sw.js`

**Approach:**
- Fix `</br >` (invalid self-closing markup) in the hero `<h1>` — replace with `<br>` (valid in HTML5) or restructure the headline into two spans.
- Remove the duplicate `<link rel="preconnect" href="https://ops.getgrover.ai">` from `<head>` — keep one instance.
- Update footer `© 2025` → `© 2026 grover. All rights reserved.`
- Add two links to the footer alongside the copyright: one to `/terms/` ("Terms") and one to `/blog/` ("Journal"). Style them consistently with the existing footer text (small, white, text-sm).
- Fix `<link rel="canonical">` on `index.html`: change `href="https://getgrover.ai/index.html"` to `href="https://getgrover.ai/"` (root canonical, not the file path).
- In `sw.js`: bump `CACHE_NAME` from `'grover-v2'` to `'grover-v3'` to invalidate the cached `main.css` and `main.js` after the changes landed in Units 1–6.

**Test scenarios:**
- Happy path: HTML validator reports no errors on the hero `<h1>` element after fix.
- Happy path: `<head>` contains exactly one `<link rel="preconnect" href="https://ops.getgrover.ai">`.
- Happy path: Footer shows "© 2026" and renders two working links (Terms and Journal).
- Integration: After first load with `sw.js` updated, the old `grover-v2` cache is deleted and `grover-v3` is populated (verify in DevTools → Application → Cache Storage).

**Verification:**
- `grep -c 'preconnect.*ops.getgrover.ai' index.html` returns `1`.
- Footer contains `2026` and links to `/terms/` and `/blog/`.
- `sw.js` CACHE_NAME is `'grover-v3'`.
- `sw.js` retains `self.skipWaiting()` in `install` handler and `clients.claim()` in `activate` handler (immediate activation behavior preserved).
- No HTML validator errors on the hero headline.

---

## System-Wide Impact

- **Chat widget init timing change:** Moving Grover Chat from `window.load` to `<head>` means the embed script starts loading earlier. This is the user's explicit intent. Monitor for any visual flash or layout shift caused by the widget initializing before the page paint — the existing CSS for the widget likely handles this via `position: fixed`, but verify in DevTools Performance tab.
- **Service worker re-caching:** Bumping `CACHE_NAME` to `grover-v3` will cause the old cache to be deleted and a new fetch to occur on users' next visit. This is correct behavior after CSS/JS changes. All 8 precached assets should continue to resolve correctly.
- **CSP change blast radius:** Adding `'unsafe-inline'` is already present; the new origins added to `script-src` expand the allowed surface. This is a necessary trade-off for a site with multiple third-party embeds and no nonce-based inline script management.
- **Blog stamp script:** Running `npm run stamp-blog` in the future will silently overwrite any manual edits to the GA block in blog files. This is intentional — the stamp script is the source of truth for that block going forward.
- **Unchanged invariants:** `main.js` scroll effects, SVG animations, floating CTA logic, and HubSpot form embed are not modified by this plan. The Apple App Store CTA hierarchy in the hero is preserved exactly as-is.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Moving chat init to `<head>` causes a layout shift or flash on `index.html` | Test in DevTools Performance — if CLS is measurable, add `visibility: hidden` on the widget host until `DOMContentLoaded`, or keep a thin `window.load` wrapper only for that page |
| HubSpot `form-action 'self'` blocks form submission after CSP update | Test form submission in a CSP-enforcing browser; if blocked, add `https://forms.hsforms.com` to `form-action` in the same `.htaccess` edit |
| S.A.M. copy in blog posts needs editorial judgment, not just find-replace | Implementer should review each occurrence in context; "S.A.M." may appear in tutorial posts describing the product — replacement copy ("Grova") must fit sentence grammar |
| `stamp-blog.js` regex fails to match GA block in an edge-case file | Script includes a per-file warning and skip — run with `--dry-run` first and review output before committing |
| `CACHE_NAME` bump causes users on slow connections to re-download all 8 assets | Expected and acceptable; cache busting is the correct behavior after code changes |

## Documentation / Operational Notes

- After this work lands, `GA4_TRACKING_SETUP.md` should be updated to: (a) add `build/index.html` to the list of pages with GA (added in Unit 2), (b) note `tutorials.html`, `partner-marketing.html`, and `pages/account-delete/index.html` as intentional GA exclusions with rationale, (c) verify and list `blog/index.html` GA coverage status explicitly, (d) mention the `stamp-blog.js` workflow for future GA updates to blog pages.
- Consider creating `docs/solutions/csp-configuration.md` documenting the final allowlist and why each origin is included — prevents regression when the next third-party embed is added.
- The `package.json` introduction is minimal (no `node_modules`, no runtime dependencies). It does not change the deployment model; Apache still serves the repo as-is. The build script is a developer tool only.

## Sources & References

- Related code: `index.html` (lines 13–129 — GA + chat init), `build/index.html`, `.htaccess` (line 89 — CSP), `sw.js`, `main.js`, `GA4_TRACKING_SETUP.md`
- Grover Chat embed: `https://ops.getgrover.ai/embed`
- HubSpot Forms: `https://js.hsforms.net/forms/embed/48485789.js`
- GA4 property: `G-LN0EK30SS7`
