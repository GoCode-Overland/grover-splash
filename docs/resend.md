# Resend Setup

Grover uses Resend for all outbound email. There are two separate integrations with distinct keys, domains, and purposes.

---

## API Keys

| Key name | Repo | Purpose |
|---|---|---|
| `grover-chat` (existing) | `grover-chat` | Transactional emails (auth, support, invites, welcome) |
| `grover-splash-marketing` | `grover-splash` | Marketing broadcasts (Joyride Journal newsletter) |

Never use the marketing key for transactional sends or vice versa. Keeping them separate isolates deliverability — a spam complaint on a broadcast won't affect login emails.

---

## Domains

| Domain | Status | Used for |
|---|---|---|
| `hello.getgrover.ai` | Verified | Transactional (grover-chat) |
| `news.getgrover.ai` | Not verified in Resend | Joyride Journal broadcasts |

### Migrating `news.getgrover.ai` to Resend

HubSpot currently holds the DNS records for `news.getgrover.ai`. To move it to Resend:

1. In Resend: Domains → Add Domain → `news.getgrover.ai`
2. Resend will provide 3 DNS records (SPF, DKIM ×2)
3. Remove the HubSpot DNS records for this subdomain
4. Add the Resend records in your DNS provider
5. Resend auto-verifies once propagated (usually under 5 min on Cloudflare)

Until this is done, the newsletter sends from `will@hello.getgrover.ai` as a temporary stand-in. Once verified, update `.env` in `grover-splash`:

```
RESEND_FROM=will@news.getgrover.ai
```

---

## Audiences

| Audience name | ID | Used for |
|---|---|---|
| Grover Marketing | `3da28087-f849-4cd9-82ec-bf5243db054e` | Joyride Journal broadcast list |
| General | `fd639019-3fd0-4bf0-bc50-95b07f934499` | (legacy, unused) |

Contacts for the Joyride Journal live in the **Grover Marketing** audience. Import contacts via CSV in the Resend dashboard or via the Contacts API.

Note: the original Grover Marketing audience (`ed4ed314-...`) was deleted from the Resend account at some point after this doc was first written. It was recreated on 2026-07-16 with the ID above, empty, contacts need to be re-imported. If the ID above stops matching what's in the Resend dashboard, treat this doc as stale and check the dashboard directly rather than trusting the ID blindly.

---

## Joyride Journal workflow

The newsletter (formerly "Grover Joyride" on HubSpot, issues #1 through #11) is built and sent from `grover-splash`. As of 2026-07, it runs on a **weekly or biweekly** cadence rather than monthly, so issues are named by send date, not by month.

**Files:**
- `scripts/emails/grover-update-[YYYY-MM-DD].tsx` — React Email template, one file per issue, named for the date it's drafted/sent. Exports a default component (full `<Html>` document, for Resend) and a named `EmailContent` component (just the inner content, for the HubSpot fragment path below)
- `scripts/send-broadcast-draft.ts` — renders template, creates or updates a Resend broadcast
- `scripts/render-hubspot-fragment.ts` — renders a HubSpot-safe fragment (see below)
- `scripts/emails/STYLE_GUIDE.md` — voice, copy rules, color palette, image guidelines
- `.env` — credentials (not committed)

**Env vars required:**

```
RESEND_API_KEY=re_...                  # grover-splash-marketing key
RESEND_AUDIENCE_ID=3da28087-...        # Grover Marketing audience
RESEND_FROM=will@news.getgrover.ai     # use will@hello.getgrover.ai until domain is verified
RESEND_BROADCAST_ID=...                # optional — set to update an existing draft in place
```

**To send a new issue:**

1. Duplicate the most recent `scripts/emails/grover-update-[YYYY-MM-DD].tsx` file, rename it for today's date, and rename its exported default function to match (e.g. `GroverUpdate20260723`). Keep the named `EmailContent` export.
2. Update the import, subject line, and broadcast `name` in `scripts/send-broadcast-draft.ts`. Broadcast name format: `Joyride Journal - Mon DD, YYYY`.
3. If a HubSpot fragment might be needed too, update the import in `scripts/render-hubspot-fragment.ts` to match.
4. Clear `RESEND_BROADCAST_ID` in `.env` if this is a new issue, not an edit to one already drafted.

```bash
npm run draft-email   # creates draft in Resend, prints broadcast ID
```

Set `RESEND_BROADCAST_ID` in `.env` to the printed ID. All subsequent `npm run draft-email` runs will update that draft instead of creating a new one. Clear it when starting a new issue.

Go to resend.com/broadcasts to review, schedule, or send.

---

## HubSpot fallback (pasting the newsletter into a HubSpot custom HTML module)

HubSpot's marketing email API is not available on the current plan (`MARKETING_EMAIL` write scope reports `NOT_AVAILABLE` even when reauthorized), so there's no way to create a HubSpot marketing email programmatically. If a HubSpot send is ever needed instead of (or in addition to) Resend, use the custom HTML module and paste in a generated fragment rather than the raw Resend HTML.

**Why not just paste the Resend HTML:** HubSpot's custom HTML module rejects `<html>`, `<head>`, and `<body>` tags (it injects your markup into its own template) and doesn't support `<style>` blocks in the body, everything has to be inline. Pasting the full Resend output produces confusing "missing closing tag" errors, that's actually just a symptom of HubSpot's parser choking on the disallowed wrapper tags mid-document, not a real markup bug.

```bash
npm run render-hubspot-fragment
```

This writes a pure HTML fragment (fully inlined styles, no wrapper tags, no `<style>` block, no Resend unsubscribe merge tag since HubSpot injects its own compliance footer) to `~/Desktop/hubspot-email-fragment.html`. Open that file, copy its contents, and paste into the HubSpot custom HTML module.

Tradeoff: the HubSpot version has no dark-mode support, since that relies on the `<style>` media query block this path can't include.

---

## grover-chat transactional setup

Handled separately in `grover-chat/src/lib/services/resend/index.ts`. Sends from the `@hello.getgrover.ai` subdomain:

| Address | Purpose |
|---|---|
| `hello@hello.getgrover.ai` | Default from |
| `welcome@hello.getgrover.ai` | Welcome emails |
| `invite@hello.getgrover.ai` | Circle invites |
| `support@hello.getgrover.ai` | Support notifications |
| `alerts@hello.getgrover.ai` | System alerts |
| `login@hello.getgrover.ai` | Magic link / auth |
