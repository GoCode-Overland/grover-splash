# Joyride Journal Email Style Guide

The newsletter was previously called **Grover Joyride** (sent via HubSpot, issues dated #1 through 11/11, monthly cadence).
It is now called the **Joyride Journal**, sent via Resend from `will@news.getgrover.ai`, on a **weekly or biweekly** cadence. Issues are identified by send date, not by issue number or month.

---

## Color palette

Sourced directly from previous Grover Joyride sends. Use these — not generic greys.

| Token | Hex | Use |
|---|---|---|
| Warm cream | `#f8e5c1` | Page/email background |
| Dark navy | `#23496d` | Header, footer, callout box |
| Main teal | `#62aebf` | Primary CTA button, "Read more" links, accent bar |
| Bright teal | `#00a4bd` | Inline links, hover states |
| Orange | `#ee8141` | Accent (top border strip, callout border) |
| Body text | `#1e1e1e` | All paragraph text |
| Dark text | `#000000` | Headings, titles |
| Container bg | `#ffffff` | Email card background |

**Dark mode equivalents** (applied via CSS class overrides):

| Light | Dark |
|---|---|
| `#f8e5c1` page bg | `#1a1008` |
| `#ffffff` container | `#1e1e1e` |
| `#1e1e1e` body text | `#d4c5a9` |
| `#000000` headings | `#f0e6d0` |
| `#e5d5b0` dividers | `#2e2010` |

---

## Voice and tone

Write like you're texting a friend who vanlifes and actually uses the app. Direct. Specific. No corporate distance.

The old Grover Joyride emails nailed this: "I'm not going to overhype this." "Don't have a blank map!" Short, punchy, personal. That's the baseline.

- Say what the thing does, then why it matters. Not the other way around.
- Use "you" and "your" constantly. This is their app, their adventure, their pins.
- Contractions are fine. First person ("I uploaded a photo...") is fine and encouraged.
- Short sentences over long ones. A sentence that ends is stronger than one that keeps going.
- Never write "excited to announce" or "we are pleased to share." Just tell them what happened.

---

## Subject lines

- Under 50 characters. Count them.
- Be specific. "3 new things in Grover this week" beats "What's new."
- Say "this week," not "this month." The newsletter runs weekly or biweekly now, "this month" overpromises volume and undersells cadence.
- No punctuation at the end unless it genuinely helps (a question mark is fine, exclamation points are not).
- Don't repeat the subject line in the preview text.
- Avoid clickbait. If the subject promises something, the email delivers it immediately.

Good: `3 new things in Grover this week`
Good: `Your vanlife stats are live`
Good: `Plan this weekend instantly`
Bad: `Big news from the Grover team!`
Bad: `You won't believe what we just shipped`

---

## Preview text

- Expands on the subject, never repeats it.
- Under 90 characters or it gets cut.
- Treat it as a second subject line, not a description of the email.

---

## Structure

Every Joyride Journal follows this order:

1. **Header** — Grover wordmark + "Joyride Journal" tag. Always on dark navy.
2. **Intro line** — one sentence max. Sets the frame without explaining everything.
3. **Sections** — each item gets: title, optional image, 2-4 sentences of body, "Read more" link.
4. **Callouts** — use the dark navy/teal-border callout box for brand or partnership notes. Max one per email.
5. **CTAs** — iOS + Android, always together, always at the bottom.
6. **Footer** — dark navy to bookend the header. Unsubscribe link. Copyright. Nothing else.

Keep the total to 5 items or fewer, and expect fewer on a weekly cadence, 1 to 3 items is normal for a single week. Don't pad a thin week with filler just to hit a count. If there's more to say than fits, send a second email rather than cramming it in.

---

## Images

Use images selectively. Not every section needs one.

**When to include an image:**
- The feature is visual and a screenshot communicates it instantly (Circles UI, new map layer, stats screen)
- You have a strong real-world photo (event, van, landscape)

**When to skip an image:**
- The feature is explained well in text (tutorial steps, flow descriptions, bucket list logic)
- You'd be adding a screenshot just for visual weight — don't

**Formatting rules:**
- App screenshots: show two side by side at ~224px each for phone UI. Use `Row`/`Column` layout.
- Single images: centered at ~260px wide for portrait screenshots; full 480px width for landscape/scenic.
- `borderRadius: '8px'` on all images. No drop shadows.
- Always include descriptive `alt` text.
- Image filenames with spaces must be URL-encoded (`space = %20`) in the src.
- Hosted at `https://getgrover.ai/img/blog-photos/` — use images already published to the site.

---

## Copy rules

**No em dashes or en dashes.** Restructure the sentence entirely.
Instead of: "Miles traveled, pins created, nights on the road — all in one place."
Write: "See miles traveled, pins created, and nights on the road. All in one place."

**No semicolons.** Use a period.

**No passive voice.** "Grover kicks off pin creation" not "pin creation is kicked off."

**No hedging.** "You can now do X" not "we've made it possible to do X."

**Links as text, not CTAs.** In section body, "Read more →" as a simple link. Reserve button styling for the download CTAs only.

**Alt text on every image.** Describe what's in the screenshot, not what the feature does.

---

## CTAs

- One primary (solid teal fill), one secondary (teal outline). Always iOS + Android as the pair.
- Never use more than two buttons in a single email.
- Button text: "Download on iOS" and "Get it on Android." No variations.
- Place at the bottom, after all content sections.

---

## Dark mode

All templates must support dark mode via CSS media queries in the `<Head>` component.

Key class names wired to dark mode overrides:
- `.email-bg` — page background
- `.email-card` — email container
- `.intro-text` — intro paragraph
- `.item-title` — section headings
- `.item-body` — section body copy
- `.email-hr` — divider lines
- `.callout-bg` — brand callout box background
- `.callout-sub` — callout body copy
- `.email-footer` — footer background
- `.footer-copy` — footer text and links

Design notes:
- The header and footer are already dark navy — they look correct in dark mode without changes.
- The `borderTop: '4px solid #66aec0'` on the container stays visible in dark mode.
- Clients covered by the media query: Apple Mail, iOS Mail, Outlook for Mac.
- Gmail forces its own dark mode inversion — avoid pure white text on pure white backgrounds; use off-whites like `#f1f5f9`.

---

## Technical notes

**Template location:** `scripts/emails/`
**Script to create Resend draft:** `npm run draft-email`
**Env vars required:** `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `RESEND_FROM` (see `.env`)
**From address:** `Will @ Grover <will@news.getgrover.ai>` (swap `.env` once domain is verified in Resend)
**Reply-to:** `will@getgrover.ai`

When creating a new issue:
1. Duplicate the most recent template file.
2. Rename it: `grover-update-[YYYY-MM-DD].tsx`, using the date this issue is drafted or sent (e.g. `grover-update-2026-07-23.tsx`). Cadence is weekly or biweekly, so the date is what disambiguates issues, not a month or an issue number.
3. Rename the exported function to match the date (e.g. `GroverUpdate20260723`).
4. Update the import, subject line, preview text, and broadcast `name` in `send-broadcast-draft.ts`. Broadcast name format: `Joyride Journal - Mon DD, YYYY`.
5. Clear `RESEND_BROADCAST_ID` in `.env` if this is a new issue rather than an edit to a draft already in progress.
6. Run `npm run draft-email` to push a draft to Resend.
7. Go to resend.com/broadcasts to review, schedule, or send.
