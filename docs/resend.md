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
| Grover Marketing | `ed4ed314-a7bd-4e1e-9b84-d4ff0fb15ebc` | Joyride Journal broadcast list |
| General | `fd639019-3fd0-4bf0-bc50-95b07f934499` | (legacy, unused) |

Contacts for the Joyride Journal live in the **Grover Marketing** audience. Import contacts via CSV in the Resend dashboard or via the Contacts API.

---

## Joyride Journal workflow

The newsletter (formerly "Grover Joyride" on HubSpot) is built and sent from `grover-splash`.

**Files:**
- `scripts/emails/grover-update-[month]-[year].tsx` — React Email template
- `scripts/send-broadcast-draft.ts` — renders template, creates or updates a Resend broadcast
- `scripts/emails/STYLE_GUIDE.md` — voice, copy rules, color palette, image guidelines
- `.env` — credentials (not committed)

**Env vars required:**

```
RESEND_API_KEY=re_...                  # grover-splash-marketing key
RESEND_AUDIENCE_ID=ed4ed314-...        # Grover Marketing audience
RESEND_FROM=will@news.getgrover.ai     # use will@hello.getgrover.ai until domain is verified
RESEND_BROADCAST_ID=...                # optional — set to update an existing draft in place
```

**To send a new issue:**

```bash
npm run draft-email   # creates draft in Resend, prints broadcast ID
```

Set `RESEND_BROADCAST_ID` in `.env` to the printed ID. All subsequent `npm run draft-email` runs will update that draft instead of creating a new one. Clear it when starting a new issue.

Go to resend.com/broadcasts to review, schedule, or send.

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
