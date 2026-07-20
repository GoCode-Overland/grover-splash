# In the Grove — B2B Partner Newsletter Style Guide

**In the Grove** is Grover's partner-facing newsletter. It goes to van building companies, RV manufacturers, and component manufacturers who partner with Grover. It is separate from the consumer **Joyride Journal**.

Sent via Resend from `will@news.getgrover.ai`, on a **weekly** cadence, every **Tuesday**.

---

## Purpose

Joyride Journal sells the app to end users. In the Grove sells the *partnership* to the companies who build or sell the vans. The through-line for every issue: Grover doesn't stop helping your customer at the sale. We give you tools to support them after the purchase and turn that ownership experience into something delightful, tools that reflect well on your brand.

Every issue should tie back to that "after the sale" framing. Pick items from `grover-admin` and `grover-chat` (the partner dashboard and its backend) that show concrete new capability, not app-user-facing consumer features.

---

## Truthfulness protocol (read this before every issue)

This audience is business partners deciding whether to invest more in the relationship. Overclaiming erodes trust fast and is worse here than in the consumer newsletter.

Before writing about any capability:
1. Read the actual code in `grover-admin` and `grover-chat` (and `grover-ios-app`/Android app repos if the feature touches the mobile app). Don't rely on what a feature is *named* or what a prior email said.
2. Distinguish shipped vs. in-progress vs. planned. If something is only live on iOS and not Android, say so. If a UI is read-only, don't imply it's editable.
3. If a feature name suggests more than what's built (e.g., "Circles" sounds like it supports formal segmentation but the schema only has `company`/`club` types), write around the honest version rather than the aspirational one.
4. When in doubt, describe the concrete workflow a partner would actually click through, not the concept.

---

## Color palette

Same brand palette as Joyride Journal (see `../STYLE_GUIDE.md`). Consistency across both newsletters matters, this is still Grover.

| Token | Hex | Use |
|---|---|---|
| Warm cream | `#f8e5c1` | Page/email background |
| Dark navy | `#23496d` | Header, footer |
| Main teal | `#62aebf` | Primary CTA button, accent bar |
| Bright teal | `#00a4bd` | Inline links |
| Orange | `#ee8141` | Accent (top border strip) |
| Body text | `#1e1e1e` | All paragraph text |
| Container bg | `#ffffff` | Email card background |

Dark mode overrides match Joyride Journal's (see that guide's table).

---

## Voice and tone

More professional than Joyride Journal, still direct and personal, not corporate. Written as one operator to another, not a brand to a customer.

This is grounded in how Will actually writes to partners (pulled from real sent email, not guessed):

- Address the reader as a partner, not a user. "Your customers," "your team," "your dashboard."
- Lead with the outcome for their business (better post-purchase experience, fewer support burdens, brand-safe marketing assets), then the mechanism.
- No hype language. No "excited to announce." Just say what's new and what it does.
- Short paragraphs. This audience skims, especially small van-building shop owners without a marketing team reading their inbox for them.
- First person from Will is fine, this is a relationship-driven newsletter, not a brand voice.
- State enthusiasm plainly instead of performing it: "I love it," "nothing to scoff at," "keep crushing," not "we're thrilled to share."
- It's fine to sound like a real person typing quickly: contractions, the occasional "..." trailing off, a stray exclamation point in body copy (subject lines still stay exclamation-free per below).
- Bolded all-caps section labels ("PLACES:", "ADMIN:") are how Will actually structures multi-update emails to partners. Not required in the newsletter's styled item-title format, but the plain, matter-of-fact framing behind them is the model: say what's new, then one or two sentences of why it matters, done.

**Avoid these words and constructions**, they don't appear in Will's real partner emails and read as tech-vendor-speak instead of a founder writing to a partner: "shipped," "scoped," "delivery method," "leverage," "empower," "seamless," "robust," "unlock," "game-changing," "we've made it possible to." If you catch yourself writing a sentence that sounds like a changelog or a press release, rewrite it the way you'd say it out loud to the partner on a call.

---

## Subject lines

- Under 50 characters.
- Speak to partner value, not feature names alone. "Your customers now have a home base" beats "Circles update."
- No exclamation points.

## Preview text

- Expands on the subject, under 90 characters.

---

## Structure

1. **Header** — Grover wordmark + "In the Grove" tag. Dark navy.
2. **Masthead** — a small high-contrast callout ("What is In the Grove?") explaining what this newsletter is in one sentence. Dark navy with an orange left-border accent, needs to pop against the cream page background, not blend into it. This exists because new partners land in this newsletter without context, it has to read as self-explanatory in a glance, not just to repeat subscribers.
3. **Intro line** — one sentence, no throat-clearing framing device ("the sale is the start of the relationship, not the end" reads like a tagline, not something Will would actually write). Just say what's new this week and why it matters, plainly.
4. **Sections** — each item: title, 2-4 sentences of body focused on partner value, honest about what's real today vs. not.
5. **CTA** — single button: "Schedule a Success Call." Always at the bottom, after all content.
6. **Footer** — dark navy, unsubscribe link, copyright.

Keep to 3 items per issue on the weekly cadence. Don't pad. If a week is thin, hold the send rather than stretching content.

---

## CTA

- One button only: **"Schedule a Success Call"**, links to `https://meetings.hubspot.com/will858/grover-success`.
- No app store download links in this newsletter, that's Joyride Journal's CTA, not this one.
- Optionally pair with a one-line reassurance ("Takes a few minutes, pick whatever slot works.").
- Email clients can't embed live calendar availability (no iframes), so this is always a link-out button, never an embed.

---

## Salutation

- No name merge field. Generic address ("Hey partners," or no salutation, straight into the intro line), matching Joyride Journal's style. Avoids merge-tag risk while the partner audience list is still small and being built out.

---

## Copy rules

Same as Joyride Journal:
- No em dashes or en dashes. Restructure the sentence.
- No semicolons. Use a period.
- No passive voice.
- No hedging ("you can now do X," not "we've made it possible to do X").
- Links as text in body copy ("Read more →"), reserve button styling for the Success Call CTA only.

---

## Technical notes

**Template location:** `scripts/emails/b2b/`
**Script to create Resend draft:** `npm run draft-b2b-email`
**Script to create the partner audience (one-time):** `npm run create-partner-audience`
**Env vars required:** `RESEND_API_KEY`, `RESEND_B2B_AUDIENCE_ID`, `RESEND_FROM` (see `.env`)
**From address:** `Will @ Grover <will@news.getgrover.ai>` (same sender as Joyride Journal)
**Reply-to:** `will@getgrover.ai`

When creating a new issue:
1. Duplicate the most recent template file in `scripts/emails/b2b/`.
2. Rename it: `in-the-grover-[YYYY-MM-DD].tsx`, using the send date (Tuesdays).
3. Rename the exported function to match the date (e.g. `InTheGrover20260721`).
4. Update the import, subject line, preview text, and broadcast `name` in `send-b2b-broadcast-draft.ts`. Broadcast name format: `In the Grove - Mon DD, YYYY`.
5. Clear `RESEND_B2B_BROADCAST_ID` in `.env` if this is a new issue rather than an edit to a draft already in progress.
6. Run `npm run draft-b2b-email` to push a draft to Resend.
7. Go to resend.com/broadcasts to review, schedule, or send.
