# Handoff: business-os-dev (grover-splash)

## Plan 005 (splash half)

Plan: `docs/plans/2026-07-23-005-feat-owned-forms-and-landing-page-publishing-plan.md`
Units executed here: U2, U3, U5 (grover-chat's U1/U4/U6 are a separate agent's work).

### What was built

**U2 - owned signup component**
- `public/js/signup.js` (deployed copy) and `js/signup.js` (root editing mirror,
  matching this repo's existing convention of keeping root and `public/`
  copies of shared static assets in sync - see `main.css`, `img/`, `fonts/`).
- Dependency-free vanilla JS: finds every `[data-grover-signup]` element on the
  page, mounts an email input + submit button + status message into it, and
  POSTs JSON to the subscribe endpoint on submit.
- Honeypot field (`name="company"`, visually hidden, `tabindex="-1"`): if
  filled in, the script fakes a success message and never sends a request.
- Double-submit guard via an in-closure `submitting` flag; submit button is
  disabled while a request is in flight.
- Endpoint is configurable per-instance via `data-endpoint`, defaulting to
  the production grover-chat URL (see "Endpoint" below).
- Styling uses the site's existing CSS custom properties from `main.css`
  (`--primary-color` teal, `--yellow-accent-color` cream) with inline
  fallback values, so no gradients and no new color tokens. Success/error
  messages render as a small opaque pill (`rgba(255,255,255,0.92)` background)
  so they stay readable regardless of whether the form sits on a teal
  (`bg-primary`) or cream (`bg-yellow-accent`) section.

**U3 - HubSpot removal**
- Replaced every `hs-form-frame` embed with the new fragment, in both the
  root working copy and the `public/` deploy mirror of each file:
  - `blog/index.html` / `public/blog/index.html` (newsletter signup)
  - `blog/vanlife-toilets-complete-guide-expert-knowledge/index.html` /
    `public/.../index.html` (newsletter signup)
  - `tutorials.html` / `public/tutorials.html` (partner/brand-interest form)
- Removed the `js.hsforms.net` script loader tags alongside each embed.
- Deleted `scripts/render-hubspot-fragment.ts` and its `package.json`
  script entry (`render-hubspot-fragment`) - it rendered email fragments
  for HubSpot's custom HTML module, superseded by plan 004's `send_campaign`.
- `grep -ri "hs-form-frame|hsforms|48485789"` across the repo now returns
  only a historical plan doc (`docs/plans/2026-04-21-...-plan.md`), nothing
  live.

**Repo pipeline note (investigated before touching anything):** root-level
`blog/`, `tutorials.html`, `partner-marketing.html` are hand-maintained
editing copies; `public/` holds the copies that actually ship (Vite's build
only processes root `index.html` as the SPA entry and passes `public/`
through untouched into `dist/`, per `vite.config.ts` + `.github/workflows/deploy-site.yml`).
The two trees are normally identical and committed together, though
`tutorials.html` had pre-existing drift from `public/tutorials.html` before
this work (different spacer height/copy in a couple of spots) - that drift
is unrelated to this plan and was left alone; the HubSpot edit was applied
correctly to each file's own content rather than blindly diffing.

**U5 - landing-page template**
- `templates/landing-page.html`: nav/footer chrome matching existing blog
  posts (teal `bg-primary` header with logo + "Back to Home" link, teal
  footer with logo + copyright), with `{{title}}`, `{{description}}`,
  `{{content}}`, `{{form}}` slots for the future `publish_landing_page` /
  `update_landing_page` MCP tools.
- Pages render at `public/lp/<slug>/index.html` (two levels below site root,
  matching blog-post depth), so the template uses `../../` for `main.css`/
  favicons and an absolute `/js/signup.js` script path (works at any depth).
- The `{{form}}` slot is the *entire* signup section including its own
  `<section>` wrapper (not just the inner fragment), so that omitting the
  form (`includeForm: false`) removes the whole block cleanly rather than
  leaving an empty teal band behind. The template's leading comment documents
  the default form markup a publish tool should substitute in, described in
  prose (not literal `{{form}}` syntax) specifically so a naive whole-file
  string-replace by the renderer doesn't mangle its own documentation - this
  was caught and fixed during a hand-rendered smoke test (see below).
- `public/lp/README.md`: notes the directory is MCP-managed, hand edits
  don't stick (the next `update_landing_page` call overwrites them), and
  points chrome changes back to the template.
- Verified: hand-rendered the template via a whole-file `str.replace()` per
  slot (matching how a real renderer would work), confirmed no leftover
  `{{...}}` tokens, then ran `npm run build` and confirmed the rendered page
  came through untouched at `dist/lp/<slug>/index.html`. The test render was
  deleted afterward so `public/lp/` stays empty except for the README, per
  its own "MCP-managed, don't hand-edit" guidance.

### Exact HTML fragment for embedding the form

```html
<div
  class="grover-signup"
  data-grover-signup
  data-endpoint="https://ops.getgrover.ai/api/public/contacts/subscribe"
></div>
<script src="/js/signup.js" defer></script>
```

Optional attributes:
- `data-button-label="Get in touch"` - overrides the default "Sign up" button text
  (used on the `tutorials.html` partner form).
- Omit `data-endpoint` entirely to use the production default baked into
  `signup.js`.

### Endpoint used

`https://ops.getgrover.ai/api/public/contacts/subscribe` - found by grepping
this repo for grover-chat's known production origin (`index.html`'s Grover
Chat widget init: `apiUrl: 'https://ops.getgrover.ai'`, `s.src =
'https://ops.getgrover.ai/embed'`). This is the default baked into
`public/js/signup.js` / `js/signup.js` and used in every embed site-wide.

Contract expected of grover-chat (per plan R1/R2, for the other agent's
reference): `POST /api/public/contacts/subscribe`, JSON body `{ email }`,
uniform `{ ok: true }` response on success, CORS allowing
`https://getgrover.ai` / `https://www.getgrover.ai`. `signup.js` sends
`Content-Type: application/json` only (no form-encoded fallback), and
treats any non-2xx or a body without `ok: true` as a generic error.

### Build result

`npm ci` + `npm run build` both succeed. Confirmed in `dist/`:
- `dist/js/signup.js` present (passthrough from `public/js/`).
- `dist/lp/README.md` present; `dist/lp/` otherwise empty (no stray test page).
- `dist/blog/index.html`, `dist/tutorials.html`,
  `dist/blog/vanlife-toilets-complete-guide-expert-knowledge/index.html`
  each contain exactly one `grover-signup` mount point and zero HubSpot
  references.

### Where HubSpot references remain

None outside historical docs. `grep -ri "hs-form-frame|hsforms|48485789" .`
(excluding `node_modules`) matches only
`docs/plans/2026-04-21-001-feat-grova-unification-and-site-rework-plan.md`.

### Remaining manual steps for Will (from the plan's scope section)

These are explicitly out of scope for this agent and un-actioned here:

1. **Delete the HubSpot portal/account** once the owned forms are verified
   live (i.e. after grover-chat's `/api/public/contacts/subscribe` endpoint
   is deployed and this repo's changes have shipped through GitHub Pages).
2. **DNS SPF cleanup**: remove `include:_spf.hubspotmail.net` from the SPF
   records on both `getgrover.ai` and `hello.getgrover.ai`, but only once no
   HubSpot email sends remain (i.e. after plan 004's `send_campaign` has
   replaced HubSpot email). No HubSpot DKIM CNAMEs exist, so SPF is the only
   HubSpot DNS remnant.
3. **Tighten DMARC** from the current `p=none` to `p=quarantine` once Resend
   is confirmed the only remaining sender.
4. No new DNS records need provisioning anywhere in this plan series.

### Deviations from the plan

- **`tutorials.html` partner form copy**: the HubSpot embed there
  (`data-form-id="b9b0c3c9-..."`) was a brand-partnership form ("Fill this
  out to see your brand on Grover"), distinct from the plain newsletter
  embed used elsewhere (`data-form-id="966b5f10-..."`). It likely captured
  more than an email address in HubSpot. The new owned form is email-only
  (per R1 - no client-supplied fields beyond email), so the copy was
  adjusted to "Drop your email and we'll follow up about getting your brand
  on Grover" and the button label changed to "Get in touch" via
  `data-button-label`, rather than silently keeping copy that promises a
  richer form than what's now there. Flagging this in case Will wants a
  different follow-up flow for partner leads specifically (e.g. a distinct
  `source` value or a dedicated partner contact path) - out of scope for R1
  as written (audience/source is fixed server-side, no client override).
- **`templates/landing-page.html` comment fix**: caught during the
  hand-rendered smoke test that a naive whole-file string substitution would
  mangle the template's own documentation comment (since it originally used
  literal `{{title}}`/`{{form}}` syntax to describe the slots). Rewrote the
  comment to describe slots in prose instead. Worth telling the grover-chat
  agent building `publish_landing_page`: do a single-pass replace of each
  exact token, and don't assume the template file is otherwise free of
  brace-like text - the fixed version now is, but it's a fragile pattern in
  general for any future template edits.
- No changes made to Resend scripts, `scripts/emails/`, or anything outside
  the U2/U3/U5 scope.
