# Grover Blog Writing Guide

**Audience:** Agents (Claude Code, subagents, future sessions) writing or updating posts for the Joy Ride Journal — Grover's blog on `getgrover.ai`.

Read this before creating, editing, or publishing any blog content. Update it when you discover something new or a practice changes.

---

## 1. What the Blog Is

**Blog name:** The Joy Ride Journal  
**URL base:** `https://getgrover.ai/blog/`  
**Purpose:** Inspire and inform vanlifers; showcase new Grover features; drive app downloads; rank in search.

The blog is **static HTML** — no build step, no SSG, no framework. Files are authored in `blog/` and deployed as-is. Always keep `public/blog/` in sync (see §8).

---

## 2. Brand Voice

Read `blog/vanlife-app-features-that-matter.html` and `blog/getting-started-with-grover-guide.html` as canonical voice examples before writing.

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

Every post follows this exact structure. Copy from a recent post (e.g., `blog/grover-bucket-list-pin-creation.html`) rather than writing from scratch.

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
[ ] <link rel="canonical" href="https://getgrover.ai/blog/[slug].html">
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
  Pattern: `grover-[feature-name].html` for feature posts, `vanlife-[topic].html` for guides
- **Primary keyword** in: title, H1, meta description, first paragraph, at least one H2
- **Internal links:** minimum 2–3 links to other blog posts using `class="cta-link"`
- **Read time** in meta line: estimate 200 words/min (a 1,000-word post = ~5 min)
- **Tags line** under the date: comma-separated phrases in brand teal (`color: #66AEC0`)
- **Canonical URL** must exactly match the deployed URL

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
```html
<img src="../img/blog-photos/[name]" 
     alt="[descriptive alt text]" 
     style="width: 100%; border-radius: 12px; margin: 20px 0; max-height: 400px; object-fit: cover;">
```

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
        <a href="https://apps.apple.com/us/app/grover-van-life/id6742468326" 
           class="cta-button" style="margin-top: 0;">Download on the App Store</a>
        <a href="https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app" 
           class="cta-button" style="margin-top: 0;">Get it on Google Play</a>
    </div>
</div>
```

**URLs (do not change these):**
- iOS: `https://apps.apple.com/us/app/grover-van-life/id6742468326`
- Android: `https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app`

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

The blog has **two copies that must always stay in sync:**

| Location | Purpose |
|---|---|
| `blog/[slug].html` | Source of truth, version-controlled |
| `public/blog/[slug].html` | Deployed copy served by the site |

After editing any blog file, **always** copy it to `public/blog/`:
```bash
cp blog/[slug].html public/blog/[slug].html
# or sync everything:
cp -r blog/. public/blog/
```

When adding a new post, **also** add a card to both `blog/index.html` and `public/blog/index.html`.

---

## 9. Blog Index Card Pattern

New posts go at the **top** of the `blog-cards-container` div in `blog/index.html`.

```html
<!-- Blog Card - [Title] -->
<a href="[slug].html" class="blog-card-link">
  <div class="blog-card">
    <div class="blog-card-image">
      <img src="../img/blog-photos/[image]" alt="[alt text]" style="width:100%;height:200px;object-fit:cover;">
    </div>
    <div class="blog-card-content">
      <div class="blog-card-meta">[Month Day, Year]</div>
      <h3 class="blog-card-title">[Post Title]</h3>
      <p class="blog-card-excerpt">[2-sentence hook]</p>
      <div class="blog-card-tags">
        <span class="blog-tag">[tag1]</span>
        <span class="blog-tag">[tag2]</span>
        <span class="blog-tag">[tag3]</span>
      </div>
    </div>
  </div>
</a>
```

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
[ ] Card added to blog/index.html and public/blog/index.html
[ ] Both blog/[slug].html and public/blog/[slug].html written
[ ] Committed and pushed to remote
```

---

## 12. Commit Convention

Blog commits follow this pattern:
```
feat: add [post title] blog post
fix: correct [what] in [slug]
feat: update [feature] across all blog posts
```

Always commit `blog/` and `public/blog/` together in one commit.

---

## 13. Key Constants

| Item | Value |
|---|---|
| GA4 Property | `G-LN0EK30SS7` |
| Brand teal | `#66AEC0` |
| Gradient (CTA box) | `linear-gradient(135deg, #66AEC0, #8B5CF6)` |
| Body font | `'Plantin', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |
| iOS App Store | `https://apps.apple.com/us/app/grover-van-life/id6742468326` |
| Google Play | `https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app` |
| OG image | `https://getgrover.ai/img/og.png` |
| Blog base URL | `https://getgrover.ai/blog/` |
| Blog name | The Joy Ride Journal |
