---
# content/blog/_template.md — frontmatter reference for blog posts.
# Files starting with "_" are ignored by scripts/build-blog.js.
#
# Format: minimal YAML subset parsed by scripts/build-blog.js.
#   key: value            scalar (no quoting needed; colons in values are fine)
#   key: |                literal block; every following line indented by TWO
#                         spaces (indent is stripped, content kept verbatim)
#   booleans: true/false
# No arrays, no nesting, no duplicate keys (duplicates fail the build).
#
# ---------- REQUIRED ----------
# slug — must equal the filename (content/blog/<slug>.md) and the live URL
#        path https://getgrover.ai/blog/<slug>  (no trailing slash)
slug: example-post-slug
# title — full contents of the <title> tag, INCLUDING any " - Grover" /
#         " | Grover" suffix (the suffix varies across legacy posts, so it is
#         captured verbatim rather than derived)
title: Example Post Title - Grover
# og_title — og:title / twitter:title (usually title without the suffix)
og_title: Example Post Title
# description — meta description, og:description, twitter:description
description: One or two sentences used for meta/OG/twitter description.
# keywords — meta keywords, comma-separated string, verbatim
keywords: keyword one, keyword two, keyword three
# date — datePublished (YYYY-MM-DD); drives sorting and display dates
date: 2026-01-01
# date_modified — dateModified (YYYY-MM-DD); used as sitemap lastmod
date_modified: 2026-01-01
# jsonld — the complete <script type="application/ld+json">...</script>
#          block(s), VERBATIM (may contain several script tags; keep the
#          Article datePublished/dateModified in sync with date/date_modified)
jsonld: |
  <script type="application/ld+json">
  {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Example Post Title",
      "description": "Same as description above.",
      "datePublished": "2026-01-01",
      "dateModified": "2026-01-01",
      "author": {"@type": "Organization", "name": "Grover", "url": "https://getgrover.ai"},
      "publisher": {"@type": "Organization", "name": "Grover", "logo": {"@type": "ImageObject", "url": "https://getgrover.ai/img/grover-combomark-white.svg"}},
      "mainEntityOfPage": {"@type": "WebPage", "@id": "https://getgrover.ai/blog/example-post-slug"},
      "articleSection": "App Features",
      "keywords": ["keyword one", "keyword two"]
  }
  </script>
#
# ---------- OPTIONAL ----------
# draft — true excludes the post from the generated index and sitemap
#         (the post page itself is still rendered); default false
draft: false
# og_image — og:image / twitter:image; default https://getgrover.ai/img/og.png
# article_section — informational mirror of JSON-LD articleSection
article_section: App Features
# styles — the per-post <style> block CONTENTS (without the <style> tags),
#          verbatim. Legacy posts each carry a near-copy of the same
#          .blog-container CSS with small per-post additions, so it is kept
#          per-post rather than shared. Omit for posts with no style block.
# site_header — false suppresses the shared dark site header (nav with
#               "← All Posts / Home"); the body must then start with the
#               post's own <header> HTML. Default true.
# nav_script — true appends the shared sticky jump-nav <script> after the
#              footer; set it for posts whose body contains
#              <nav class="nav-menu"> ... Default false.
nav_script: true
# body_class — override the <body> class attribute; default
#              "font-body text-gray-800 leading-relaxed m-0 p-0"
# head_extras — raw extra <head> lines (e.g. dns-prefetch links), verbatim
# signup_heading / signup_text — override the copy of the shared newsletter
#              signup section that every post gets before the footer
#
# ---------- BLOG INDEX CARD (used by `node scripts/build-blog.js --index`) ----------
# card_excerpt — card paragraph text on /blog/ (REQUIRED for index generation;
#                often differs slightly from description — keep verbatim)
card_excerpt: Card text shown on the blog index.
# card_section — "latest" (default) or "state" (state-by-state guide grid)
card_section: latest
# card_title — card heading if it differs from og_title (state guides use
#              short titles like "Texas Vanlife Community")
# card_color — tailwind color name for state cards (green, orange, blue,
#              purple, teal, red); state cards only
# featured — true marks the post as the featured hero on /blog/ (exactly one
#            post must have it when generating the index)
# featured_excerpt — hero paragraph if it differs from card_excerpt
# read_time — display string like "5 min read" (featured hero meta line)
---

Body goes here. Markdown is rendered with `marked`, and raw HTML passes
through VERBATIM, so keep anything markdown cannot express (classed divs,
sections with ids, figures, tables, inline styles) as HTML.

Rules that keep `marked` from mangling the HTML:

1. Every line of raw HTML must start at column 0 (no leading indentation on
   lines that open a block after a blank line — 4+ leading spaces would be
   parsed as an indented code block). Simplest: left-align all body HTML.
2. Plain prose may be written as markdown paragraphs / ## headings; they
   must be separated from surrounding HTML by blank lines.
3. Prose is NOT entity-escaped by the renderer — write literal text exactly
   as it should appear in the HTML (use &amp; etc. yourself where needed).
