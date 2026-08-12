# Grover Blog Writing Guide

**Audience:** Agents (Claude Code, subagents, future sessions) writing or updating posts for the Joy Ride Journal — Grover's blog on `getgrover.ai`.

Read this before creating, editing, or publishing any blog content. Update it when you discover something new or a practice changes.

---

## 1. What the Blog Is

**Blog name:** The Joy Ride Journal  
**URL base:** `https://getgrover.ai/blog/`  
**Purpose:** Inspire and inform vanlifers; showcase new Grover features; drive app downloads; rank in search.

The blog is **markdown-sourced, build-generated static HTML** (since July 2026). Posts are authored as one file each in `content/blog/[slug].md` (frontmatter + markdown body, inline HTML allowed); `scripts/build-blog.js` renders them into `public/blog/` at build time via the shared template `scripts/blog-post-template.html`. Never hand-edit `public/blog/**` — it is gitignored generated output, overwritten on every build (see §8).

Posts use **clean URLs**: each post lives at `blog/[slug]/index.html` (a directory, not a flat `blog/[slug].html` file), so links omit the `.html` extension (e.g. `href="grover-campflare-campgrounds"`). Head/CSS asset paths from a post use `../../` (one level for the slug directory, one for `blog/`) instead of `../`.

---

## 2. Brand Voice

Read `content/blog/vanlife-app-features-that-matter.md` and `content/blog/getting-started-with-grover-guide.md` as canonical voice examples before writing.

**Tone rules:**
- Warm, first-person plural ("we", "our community", "vanlifers like us")
- Excitement and joy first — this is a lifestyle brand, not a tech manual
- Never explain implementation details or architecture (users don't care how it's built)
- Short, punchy sentences. No corporate filler.
- One clear idea per paragraph
- Use "vanlife" (one word, lowercase unless starting a sentence)
- Grover is always capitalized; "the app" is fine for short-form refs

**What to avoid:**
- "Server-driven", "API", "endpoint", or any technical backend terms
- Passive voice
- Hedging ("may", "might", "could potentially")
- Summarizing what you just said at section ends
- Starting consecutive sentences with "We"

---

## 3. Post Structure (HTML Template)

Every post follows this exact structure. Copy from a recent post (e.g., `content/blog/grover-bucket-list-pin-creation.md`) rather than writing from scratch.

**Since the July 2026 markdown migration, everything in the `<head>` checklist below is produced by the build** — GA, favicons, stylesheets, canonical/OG/Twitter tags come from `scripts/blog-post-template.html`, and per-post values (title, description, keywords, JSON-LD, styles) come from the post's frontmatter (see `content/blog/_template.md`). The checklist remains as the contract for what a rendered post must contain; you satisfy it by filling frontmatter, not by writing head HTML.

### `<head>` checklist
```
[ ] Google Analytics tag (G-LN0EK30SS7) — copy verbatim from any existing post
[ ] <meta charset>, <meta viewport>
[ ] <title>: "Post Title - Grover" (max 60 chars)
[ ] <meta name="description"> (max 160 chars, include primary keyword)
[ ] <meta name="keywords"> (5–10 comma-separated phrases)
[ ] <link rel="stylesheet" href="../main.css">
[ ] <link rel="stylesheet" href="blog.css">
[ ] Favicon links (32x32 and 16x16 from ../img/)
[ ] <link rel="canonical" href="https://getgrover.ai/blog/[slug]"> (no .html, no trailing slash — generated from frontmatter slug)
[ ] Open Graph tags: og:type, og:title, og:description, og:image, og:url
[ ] Twitter card tags: twitter:card, twitter:title, twitter:description, twitter:image
[ ] Schema.org JSON-LD (Article type — see §3a)
[ ] Inline <style> block with standard blog CSS classes (copy from existing post)
```

### 3a. Schema.org JSON-LD
Required fields: `@context`, `@type` (Article), `headline`, `description`, `datePublished`, `dateModified`, `author` (Organization: Grover), `publisher` (with logo ImageObject), `mainEntityOfPage`, `articleSection`, `keywords`.

Use `https://getgrover.ai/img/og.png` for all OG images unless a post-specific image is prepared and uploaded.

### Page body structure (in order)
1. `<header class="bg-primary">` — Grover logo + nav links (← All Posts · Home)
2. `<nav class="nav-menu">` — sticky jump-link bar (2–5 section anchors)
3. `<main class="blog-container">` — all post content
   - `<header class="blog-header">` — H1, meta line (date · read time), tags
   - Hero image (see §5)
   - `<div class="blog-content">` — body sections with H2/H3
   - CTA box (see §6)
   - Related articles section (see §7)
4. Site footer (copy from existing post)

---

## 4. SEO Requirements

- **Slug:** lowercase kebab-case, descriptive, under 60 chars  
  Pattern: `grover-[feature-name]` for feature posts, `vanlife-[topic]` for guides (the slug is the `.md` filename; no `.html` anywhere)
- **Primary keyword** in: title, H1, meta description, first paragraph, at least one H2
- **Internal links:** minimum 2–3 links to other blog posts using `class="cta-link"`
- **Read time** in meta line: estimate 200 words/min (a 1,000-word post = ~5 min)
- **Tags line** under the date: comma-separated phrases in brand teal (`color: #66AEC0`)
- **Canonical URL** must exactly match the deployed URL

### Broadening beyond vans: siblings, not duplicates

Vans remain the primary SEO play and `van-build-specs-what-to-know` is the pillar of the
rig-specs series. When covering a new rig type, **never rewrite the van post with the noun
swapped.** Near-duplicate posts compete with each other, Google picks one, and the pillar
loses authority it already earned.

A sibling post earns its own slot only when the *questions are genuinely different*:
- `truck-camper-specs-what-to-know` leads on payload and wet weight, which the van post never covers
- `class-c-rv-specs-what-to-know` leads on cargo carrying capacity and the cutaway chassis

Each sibling links back to the pillar and across to the others. `article_section: Rig Guides`
groups the series. Towables were deliberately skipped: one owner, no examples to draw on, and
the material is well covered elsewhere.

---

## 5. Images

### Available image assets

**In `public/img/`** (linked from blog as `../img/[name]`):
- `img/og.png` — default OG image for all posts
- `img/grover-combomark-white.svg` — header logo
- `img/favicon-32x32.png`, `img/favicon-16x16.png`
- Various app screenshots and lifestyle photos (see `public/img/` for full list)

**In `public/img/blog-photos/`** (linked as `../img/blog-photos/[name]`):
- `Image 1.png` — Grover app UI screenshot
- `Image 2.png` — general app screenshot
- `image 3.1.png` — trip planning / itinerary view
- `Image 3.png` — general
- `image 4.png` — US map with community pins
- `IMG_4663.jpg` — vans parked at night under stars (lifestyle)
- `grover team hiking.jpg` — team/community photo
- `ChatGPT Image Jul 2, 2025, 12_34_11 PM.png` — AI-generated scene

### Choosing an image for a post
Match thematically:
- Map / location features → `image 4.png` (pin map)
- Trip planning / routes → `image 3.1.png`
- Community / social → `IMG_4663.jpg`
- App UI / onboarding → `Image 1.png`
- Default if nothing fits → skip hero image or use `og.png`

### Image HTML pattern

For wide/landscape lifestyle photos (vans, scenery, community shots):
```html
<img src="../img/blog-photos/[name]" 
     alt="[descriptive alt text]" 
     style="width: 100%; border-radius: 12px; margin: 20px 0; max-height: 400px; object-fit: cover;">
```

For actual in-app phone screenshots (portrait, e.g. `1170x2532`) — do NOT use the pattern above, it crops the screen content badly. Use the device-frame treatment instead (see `content/blog/grover-in-app-tutorial-system.md` for the original, or any of the July 2026 iOS-1.2.8 posts for a copy-paste example):
```html
<div class="screenshot-frame">
    <img src="../../img/blog-photos/[name]" alt="[descriptive alt text]" loading="lazy">
</div>
<p class="screenshot-caption">[one-line caption]</p>
```
Add the `.screenshot-frame`, `.screenshot-frame img`, `.screenshot-caption` (and `.screenshot-group` for a side-by-side pair) CSS rules to the post's `<style>` block — copy verbatim from an existing post that uses them.

### ⚠️ Requesting new images from the Director

**When to ask:** Any time a post would benefit from a fresh screenshot, a real in-app UI capture, a lifestyle photo, or a feature-specific image that doesn't exist in `public/img/blog-photos/`.

**How to ask (always do this before publishing):**

> "Before I finalize this post, I'd recommend a new image here. Specifically: [describe exactly what would make the best image — e.g., 'a screenshot of the LandTrust property detail card in the Grover app', 'a lifestyle photo of a van at a dispersed campsite in Colorado', 'a map screenshot showing the filter panel open']. Would you be able to grab one? If so, drop it in `public/img/blog-photos/` and let me know the filename."

**Never:**
- Invent a fake image path or reference an image that doesn't exist
- Use an image that doesn't thematically fit just to have something
- Skip the image request if a post would clearly benefit from a real screenshot

---

## 6. CTA Pattern — Both Platforms, Always

Every post must have at least one download CTA box with **both** iOS and Android buttons. Never single-platform.

### Standard CTA box
```html
<div class="cta-box">
    <h3>Ready to [action]?</h3>
    <p>[1–2 sentences of motivation tied to post topic]</p>
    <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 20px;">
        <a href="https://apps.apple.com/app/id6742468326" 
           class="cta-button" style="margin-top: 0;">Download on the App Store</a>
        <a href="https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app" 
           class="cta-button" style="margin-top: 0;">Get it on Google Play</a>
    </div>
</div>
```

**URLs (do not change these):**
- iOS: `https://apps.apple.com/app/id6742468326`
- Android: `https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app`

The iOS link is the **bare app ID**, with no name slug. Apple's slug URLs embed the app's
name (`/grover-van-life/`), which went stale when the app was renamed to
**Grover: Camping and Community**. The bare ID never goes stale. Posts written before
August 2026 still carry the old slug form; both resolve, so it is not a bug, but new
posts use the bare ID.

**Never use a gradient on `.cta-box`.** Use the solid warm cream (`#f8e5c1` background,
`#66AEC0` text) that current posts use. A gradient CTA reads as an "AI tell" and was
deliberately removed sitewide in July 2026. Copy the `.cta-box` rules from a recent post.

### Inline prose links
Use `class="cta-link"` for in-paragraph references to the app or to other blog posts. These remain single links — do not turn them into dual buttons.

---

## 7. Related Articles Section

Every post ends with a "Related Articles" block before the footer. Include 3–4 links to thematically relevant posts.

```html
<section class="related-articles" style="margin: 40px 0; padding: 30px; background: #f8f9fa; border-radius: 15px; border-left: 4px solid #66AEC0;">
    <h3 style="color: #2c3e50; margin-bottom: 20px;">Related Articles</h3>
    <div style="display: grid; gap: 15px;">
        <div>
            <h4 style="margin-bottom: 5px;"><a href="[slug].html" class="cta-link">[Title]</a></h4>
            <p style="color: #7f8c8d; font-size: 0.9rem; margin: 0;">[One-sentence description]</p>
        </div>
        <!-- repeat for 3–4 articles -->
    </div>
</section>
```

---

## 8. File Deployment

**Single source of truth: `content/blog/[slug].md`.** One file per post. Copy `content/blog/_template.md` to start — it documents every frontmatter field (title, og_title, description, keywords, date, jsonld, styles, card fields, draft, etc.).

```bash
# after writing/editing content/blog/[slug].md:
npm run build          # regenerates public/blog/** + sitemap + builds dist/
# or, generation only:
node scripts/build-blog.js --index --sitemap
```

`public/blog/**` (except `blog.css`) and `public/sitemap.xml` are **generated and gitignored** — never hand-edit them; changes there are silently lost on the next build. `npm run dev` regenerates automatically (predev hook). Template/chrome changes go in `scripts/blog-post-template.html`; index chrome lives in `scripts/build-blog.js`.

---

## 9. Blog Index Card Pattern

The index card grid is generated — cards come from each post's frontmatter (`card_excerpt`, `card_tags`, `card_image`, etc. — see `_template.md`), sorted by `date` descending. State-guide posts use `card_section: state` + `card_color`. The featured hero is the post with `featured: true` (plus `read_time` and `featured_excerpt`). No HTML to write.

---

## 10. Truthfulness & Accuracy Protocol

Before publishing any post, verify every factual claim. The cost of a false claim in a published post is high.

**Always ask the Director (the human) before publishing when:**
- The post mentions a specific partner, integration, or third-party service (e.g., LandTrust)
- The post describes a specific UX flow or app behavior (exact steps, distances, triggers)
- The post names specific features, trophies, or other content that lives in code or the database
- The post makes quantitative claims ("thousands of spots", "25 trophies")

**Where to find ground truth in the codebase:**
- Trophy names and triggers: `grover-chat/src/db/seed/trophies.ts`
- Android app features: `grover-android-app/` repo
- iOS app features: `grover-ios-app/` repo
- App Store URLs: `grover-splash/src/components/Hero.tsx` (ANDROID_APP_URL constant)

**Never invent or assume:**
- UI copy, button labels, or screen names — find them in the code
- Partnership status — ask the Director
- Feature behavior details — ask the Director or read the code

---

## 11. Pre-Publish Checklist

```
[ ] Brand voice matches §2 — warm, joyful, no tech jargon
[ ] All factual claims verified (§10)
[ ] Image: existing asset used or new image requested from Director (§5)
[ ] GA4 tag present (G-LN0EK30SS7)
[ ] Schema.org JSON-LD complete (§3a)
[ ] OG + Twitter card meta tags complete
[ ] Canonical URL correct
[ ] Sticky nav jump links all resolve to real section IDs
[ ] Dual CTA buttons (iOS + Android) present (§6)
[ ] At least 2–3 internal cta-link backlinks to related posts
[ ] Related articles section present (§7)
[ ] Slug is descriptive kebab-case
[ ] Card frontmatter fields filled (card_excerpt, card_tags, card_image)
[ ] `npm run build` passes locally (build-blog fails loudly on bad frontmatter)
[ ] Committed and pushed to remote (content/blog/[slug].md only — generated files are gitignored)
```

---

## 12. Commit Convention

Blog commits follow this pattern:
```
feat: add [post title] blog post
fix: correct [what] in [slug]
feat: update [feature] across all blog posts
```

A post is one commit touching one file: `content/blog/[slug].md` (plus any new images under `public/img/blog-photos/`).

---

## 13. Key Constants

| Item | Value |
|---|---|
| GA4 Property | `G-LN0EK30SS7` |
| Brand teal | `#66AEC0` |
| CTA box background | `#f8e5c1` solid warm cream. Never a gradient (see §6) |
| Body font | `'Plantin', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |
| iOS App Store | `https://apps.apple.com/app/id6742468326` |
| Google Play | `https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app` |
| OG image | `https://getgrover.ai/img/og.png` |
| Blog base URL | `https://getgrover.ai/blog/` |
| Blog name | The Joy Ride Journal |
