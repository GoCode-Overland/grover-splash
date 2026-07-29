# Handoff: site migration (grover-splash)

## Plan

Plan: `docs/plans/2026-07-26-001-feat-finish-site-migration-plan.md`
Units executed here: U1, U2 (as U2a/U2b/U2c), U3 (decision only), U4 (partial —
see "Blocked on Will"), U5. Everything is committed and pushed to main; the
GitHub Pages deploy workflow ran green on every commit.

Commits (in order): `4dbefcb` (pre-existing SEO pass, committed as found),
`90741fb` (U1), `e0a0b97` (U4 partial), `e37055a` (U2a), `0b2842d` (U2b),
`a037886` (U2c).

### What was built

**U1 - the dual root/`public/` mirror is gone**
- Deleted every root-level file the Vite build never read: `tutorials.html`,
  `terms/`, `pages/`, `partner-marketing.html`, `build/`, `main.css`,
  `main.js`, `img/`, `fonts/`, `favicon.ico`, `js/`, `sitemap.xml`, `sw.js`,
  `.htaccess`, `googlefc0ff7fc8f2aadae.html`. Every pair was diffed against
  its `public/` counterpart first; the only non-identical pairs were stale
  root drift (`build/index.html` was the old pre-redirect page; root `img/`
  lacked 11 newer photos), so `public/` won each time.
- `sw.js`/`main.js` confirmed dead by repo-wide grep (no service-worker
  registration anywhere) before deletion.
- `llms.txt` was root-only and therefore **never actually deployed** before;
  it moved into `public/` and now ships.
- `GA4_TRACKING_SETUP.md` and `IMAGE_OPTIMIZATION_TODO.md` moved to `docs/`.
- New `docs/site-structure.md` documents the convention: everything under
  `public/` is the real site, edit it directly, there is no root mirror.
  Root `index.html` is the sole Vite SPA entry. `public/lp/` stays
  MCP-managed (untouched by all of this work, verified per-unit).

**U2 - markdown blog pipeline**
- Source of truth is now `content/blog/<slug>.md` (36 posts — the plan said
  35; `grover-fire-smoke-map-layers` was published after planning).
  `content/blog/_template.md` documents the frontmatter contract.
- `scripts/build-blog.js` (Node ESM, uses `marked` — the one new dependency,
  a devDependency) renders each post into `public/blog/<slug>/index.html`
  via `scripts/blog-post-template.html`, regenerates the blog index card
  grid (`--index`) and `public/sitemap.xml` (`--sitemap`). It fails loudly
  (non-zero exit, clear message) on missing frontmatter, slug/filename
  mismatch, slug collisions, bad dates, or an empty `content/blog/`.
- Frontmatter carries the SEO surface verbatim per post: title, og_title,
  optional og_description, description, keywords, date/date_modified,
  og_image, JSON-LD blocks (stored verbatim, not regenerated), per-post
  `styles:` blocks (the 36 posts had ~20 distinct style variants, so styles
  stay per-post rather than being force-unified), draft flag, and the blog
  index card fields (card copy often differs from the meta description, so
  it's carried separately, verbatim from the old hand-written index).
- `npm run build` is now `node scripts/build-blog.js --index --sitemap &&
  vite build`; `predev` runs the same generation so `npm run dev` never
  serves a stale/empty blog. Generated output (`public/blog/*/`,
  `public/blog/index.html`, `public/sitemap.xml`) is gitignored;
  `public/blog/blog.css` stays tracked as real source.
- Retired: root `blog/` (all 36 hand-HTML posts), the git-tracked
  `public/blog/**` HTML, and `scripts/stamp-blog.js` (+ its npm script) —
  the GA snippet now lives in the one shared template.

**U2 verification performed (per post, all 36):** generated HTML was diffed
against the git-HEAD original — `<title>`, meta description, keywords,
canonical (`https://getgrover.ai/blog/<slug>`, no trailing slash), every
`og:*`/`twitter:*` tag, and deep-equal JSON-LD were **identical on all 36
posts**, verified twice (once by the converting agent, once independently by
the orchestrator with a separate script). Body text verified complete via
tag-stripped word-frequency diffs. A fresh `git clone` + `npm ci` +
`npm run build` produces the full `dist/blog/**` (37 index.html files) and
sitemap from nothing, in ~2s of build time. Preview click-through of blog
index, four posts, sitemap, and tutorials all 200.

Intentional (accepted) output changes, for the record:
- Every post now carries the newsletter signup section from the shared
  template (previously only the vanlife-toilets post had it) — the plan's
  stated intent.
- `og:url` added to 12 older posts that lacked it (always equal to
  canonical).
- The blog index gained cards for 5 posts the old hand-maintained index had
  simply never listed, is now strictly date-sorted, and 6 card dates were
  corrected to match each post's JSON-LD datePublished.
- The generated sitemap is a strict improvement: the old one pointed 25
  posts at stale `.html` URLs (404s — the real pages are directories),
  listed one dead post (`how-to-create-custom-ai-assistant`), and was
  missing 11 real posts. New sitemap: all 36 canonical post URLs + `/`,
  `/download`, `/for-builders`, `/for-oems`, `/tutorials.html`, `/blog/`.
  (Note: `/partners/copy-kit` was never in the sitemap and still isn't —
  add it to `STATIC_ROUTES` in `scripts/build-blog.js` if wanted.)
- Minor chrome normalizations documented in the U2a/U2b work: footers
  unified to the shared one, HTML comments dropped, equivalent-but-variant
  jump-nav scripts canonicalized.

**How to publish a blog post now:** add `content/blog/<slug>.md` (copy
`_template.md`), commit, push. The build regenerates everything. To edit a
post, edit its `.md`. Never hand-edit `public/blog/**` — it's overwritten
on every build.

**U3 - commit-triggered blog drafts: re-deferred (decision, no code)**
Recorded per the plan's Decision 4: the May-plan U11 cross-repo dispatch
workflow stays unbuilt. If wanted later, the more natural shape is a
`create_blog_draft` MCP tool in grover-chat (write a `content/blog/*.md`
via the GitHub Contents API, same pattern as `publish_landing_page`) —
now trivial since posts are single markdown files.

**U4 - HubSpot removal (partial — see blocked section)**
- Shipped now: `/for-builders` still had a **live HubSpot form** (the same
  `b9b0c3c9` partner-intake form previously replaced on `tutorials.html`)
  plus its `js.hsforms.net` loader — missed by the earlier HubSpot-removal
  pass because it lives in React, not static HTML. Replaced with the owned
  `[data-grover-signup]` embed (endpoint
  `https://ops.getgrover.ai/api/public/contacts/subscribe`, button "Get in
  touch", copy adjusted to email-only exactly like tutorials.html was).
  Verified rendering in a real browser on a preview build.
- Investigation found the plan undercounted the booking links:
  `HUBSPOT_BOOKING_URL` (`grover-discovery-and-demo`) lives in **four**
  files — `src/pages/ForBuilders.tsx`, `src/pages/ForOems.tsx`, and also
  `src/components/Navigation.tsx` (site-wide "Book a Demo" button) and
  `src/components/Footer.tsx`, which the plan missed. All seven usages are
  plain links. The `grover-success-with-josh` iframe is only in
  `src/components/copy-kit/GroverLinks.tsx`.

**U5 - CI verification**
No workflow change was needed (`deploy-site.yml` already just runs
`npm run build`, which now chains the blog generation). Verified by fresh
clone + `npm ci` + `npm run build` locally (complete `dist/blog/**`, no
reliance on stale local generated files) and by the actual GitHub Pages
Actions runs, which succeeded on every commit with no material latency
change. `dist/lp/` passthrough confirmed intact.

### Two decisions Will should confirm (executed per the plan's defaults)

1. **All 36 posts migrated 1:1, no tiering/archiving.** Nothing was pruned.
   If Search Console shows dead weight, pruning is now "delete one .md
   file" cheap.
2. **Commit-triggered blog drafts re-deferred** (see U3). Override = new
   plan, ideally as a grover-chat MCP tool rather than the original
   cross-repo dispatch.

### Blocked on Will: Google Calendar appointment schedules (rest of U4)

The two remaining HubSpot Meetings links can't be swapped until two
appointment schedules exist. Steps (in Google Calendar, will@getgrover.ai):

1. Create → "Appointment schedule" → **"Grover Success Call"** (add Josh as
   co-host). Open Share → "Website embed" → "Inline booking page" → copy the
   iframe URL (shape
   `https://calendar.google.com/calendar/appointments/schedules/<ID>?gv=true`).
2. Create a second schedule → **"Grover Discovery and Demo"**. Open Share →
   "Link" tab → copy the plain booking-page URL (no embed needed — all
   usages are plain links).

Then the code change is mechanical (ready to apply on request):
- `GroverLinks.tsx:82`: iframe `src` → the Success embed URL.
- `ForBuilders.tsx`, `ForOems.tsx`, `Navigation.tsx`, `Footer.tsx`: rename
  `HUBSPOT_BOOKING_URL` → `DISCOVERY_CALL_URL` with the new plain URL
  (consider hoisting to one shared `src/lib/links.ts` while at it — it's
  currently duplicated four times).
- Regression check afterward: `grep -ri hubspot src/` must return nothing.

### Other HubSpot stragglers surfaced (out of this plan's scope)

- `scripts/emails/b2b/in-the-grover-2026-07-17.tsx`, `...-07-28.tsx`, and
  `scripts/emails/b2b/STYLE_GUIDE.md` hard-code a **third** HubSpot meeting
  link (`meetings.hubspot.com/will858/grover-success`). The style guide
  means every future In the Grove issue will re-introduce it — update it
  alongside the U4 swap (probably to the Success schedule URL).
- Reminder from HANDOFF-business-os.md still standing: the HubSpot portal
  itself, SPF cleanup, and DMARC tightening wait until all of the above is
  live.
