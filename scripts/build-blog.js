#!/usr/bin/env node
/**
 * build-blog.js — renders content/blog/*.md into public/blog/<slug>/index.html
 * using the shared template in scripts/blog-post-template.html.
 *
 * Usage:
 *   node scripts/build-blog.js             # render posts only
 *   node scripts/build-blog.js --index     # also regenerate public/blog/index.html
 *   node scripts/build-blog.js --sitemap   # also regenerate public/sitemap.xml
 *
 * NOTE (migration phase / U2a): --index and --sitemap are gated behind flags
 * because only a subset of posts has been converted to markdown so far.
 * Running them before ALL posts live in content/blog/ would drop the
 * unconverted posts from the index/sitemap. Do not wire them into the
 * default run (or npm run build) until the batch conversion (U2b) is done.
 *
 * Frontmatter contract: see content/blog/_template.md
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

// Fidelity tweaks for migrated hand-written HTML:
// - html: return token.raw so blank lines between raw HTML blocks survive.
// - text: don't entity-escape prose (source is trusted, hand-authored; any
//   entities must be written literally in the markdown, as in the originals).
marked.use({
  renderer: {
    html(token) {
      return token.raw;
    },
    space(token) {
      return token.raw;
    },
    paragraph(token) {
      return `<p>${this.parser.parseInline(token.tokens)}</p>`;
    },
    heading(token) {
      return `<h${token.depth}>${this.parser.parseInline(token.tokens)}</h${token.depth}>`;
    },
    text(token) {
      return token.tokens ? this.parser.parseInline(token.tokens) : token.text;
    },
  },
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const OUT_DIR = path.join(ROOT, 'public', 'blog');
const TEMPLATE_PATH = path.join(__dirname, 'blog-post-template.html');

const SITE = 'https://getgrover.ai';
const DEFAULT_OG_IMAGE = `${SITE}/img/og.png`;
const DEFAULT_BODY_CLASS = 'font-body text-gray-800 leading-relaxed m-0 p-0';
const DEFAULT_SIGNUP_HEADING = 'Stay Updated on Grover and Everything Van Life';
const DEFAULT_SIGNUP_TEXT =
  'Get the latest Grover updates, stories, and tips delivered straight to your inbox.';

// Non-blog routes carried into the generated sitemap (--sitemap).
// Derived from the hand-maintained public/sitemap.xml as of U2a.
const STATIC_ROUTES = [
  { loc: `${SITE}/`, changefreq: 'weekly', priority: '1.00' },
  { loc: `${SITE}/download`, changefreq: 'monthly', priority: '0.80' },
  { loc: `${SITE}/for-builders`, changefreq: 'monthly', priority: '0.70' },
  { loc: `${SITE}/for-oems`, changefreq: 'monthly', priority: '0.70' },
  { loc: `${SITE}/tutorials.html`, changefreq: 'monthly', priority: '0.50' },
  { loc: `${SITE}/blog/`, changefreq: 'daily', priority: '0.80' },
];

const REQUIRED_FIELDS = [
  'slug',
  'title',
  'og_title',
  'description',
  'keywords',
  'date',
  'date_modified',
  'jsonld',
];

function fail(msg) {
  console.error(`\nbuild-blog: ERROR: ${msg}\n`);
  process.exit(1);
}

/**
 * Minimal YAML-subset frontmatter parser. Supports exactly:
 *   key: scalar value          (booleans true/false recognized; rest strings)
 *   key: |                     (literal block; following lines indented by
 *                               two spaces, indent stripped, verbatim)
 * No nesting, no arrays, no quoting semantics (quotes kept literally
 * only when not wrapping the whole value).
 */
function parseFrontmatter(raw, file) {
  if (!raw.startsWith('---\n')) fail(`${file}: missing frontmatter (must start with ---)`);
  const end = raw.indexOf('\n---\n', 4);
  if (end === -1) fail(`${file}: unterminated frontmatter`);
  const fmLines = raw.slice(4, end).split('\n');
  const body = raw.slice(end + 5);
  const data = {};
  for (let i = 0; i < fmLines.length; i++) {
    const line = fmLines[i];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const m = line.match(/^([A-Za-z0-9_]+):(.*)$/);
    if (!m) fail(`${file}: cannot parse frontmatter line: "${line}"`);
    const key = m[1];
    let value = m[2].trim();
    if (value === '|') {
      const block = [];
      while (i + 1 < fmLines.length && (fmLines[i + 1].startsWith('  ') || fmLines[i + 1] === '')) {
        block.push(fmLines[i + 1].startsWith('  ') ? fmLines[i + 1].slice(2) : '');
        i++;
      }
      while (block.length && block[block.length - 1] === '') block.pop();
      value = block.join('\n');
    } else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (/^"(.*)"$/.test(value)) value = value.replace(/^"(.*)"$/, '$1');
    if (key in data) fail(`${file}: duplicate frontmatter key "${key}"`);
    data[key] = value;
  }
  return { data, body };
}

function loadPosts() {
  if (!fs.existsSync(CONTENT_DIR)) fail(`content directory not found: ${CONTENT_DIR}`);
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .sort();
  if (files.length === 0) fail(`no posts found in ${CONTENT_DIR} (empty content/blog/)`);

  const posts = [];
  const slugs = new Set();
  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const { data, body } = parseFrontmatter(raw, file);
    for (const field of REQUIRED_FIELDS) {
      if (!(field in data) || data[field] === '' || data[field] == null) {
        fail(`${file}: missing required frontmatter field "${field}"`);
      }
    }
    if (data.slug !== path.basename(file, '.md')) {
      fail(`${file}: slug "${data.slug}" must match the filename`);
    }
    if (slugs.has(data.slug)) fail(`slug collision: "${data.slug}"`);
    slugs.add(data.slug);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      fail(`${file}: date must be YYYY-MM-DD (got "${data.date}")`);
    }
    posts.push({ ...data, draft: data.draft === true, body, file });
  }
  return posts;
}

/** Toggle an optional {{#NAME}}...{{/NAME}} section in the template. */
function section(tpl, name, keep) {
  const re = new RegExp(`\\{\\{#${name}\\}\\}\\n([\\s\\S]*?)\\{\\{/${name}\\}\\}\\n`, 'g');
  return tpl.replace(re, (_, inner) => (keep ? inner : ''));
}

function renderPost(post, template) {
  let html = template;
  html = section(html, 'STYLES', Boolean(post.styles));
  html = section(html, 'SITE_HEADER', post.site_header !== false);
  html = section(html, 'NAV_SCRIPT', post.nav_script === true);

  const content = marked.parse(post.body).replace(/\n+$/, '');

  const replacements = {
    TITLE: post.title,
    OG_TITLE: post.og_title,
    DESCRIPTION: post.description,
    OG_DESCRIPTION: post.og_description || post.description,
    KEYWORDS: post.keywords,
    SLUG: post.slug,
    OG_IMAGE: post.og_image || DEFAULT_OG_IMAGE,
    JSONLD: post.jsonld,
    STYLES: post.styles || '',
    BODY_CLASS: post.body_class || DEFAULT_BODY_CLASS,
    SIGNUP_HEADING: post.signup_heading || DEFAULT_SIGNUP_HEADING,
    SIGNUP_TEXT: post.signup_text || DEFAULT_SIGNUP_TEXT,
    CONTENT: content,
  };
  // {{HEAD_EXTRAS}} sits on its own line; drop the line entirely when unset.
  html = post.head_extras
    ? html.replace('{{HEAD_EXTRAS}}', post.head_extras)
    : html.replace('{{HEAD_EXTRAS}}', '');
  html = html.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) => {
    if (!(key in replacements)) fail(`template placeholder {{${key}}} has no value`);
    return replacements[key];
  });
  return html;
}

function formatDisplayDate(iso) {
  const [y, mo, d] = iso.split('-').map(Number);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[mo - 1]} ${d}, ${y}`;
}

function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateSitemap(posts) {
  const urls = STATIC_ROUTES.map(
    (r) =>
      `<url>\n  <loc>${r.loc}</loc>\n  <changefreq>${r.changefreq}</changefreq>\n  <priority>${r.priority}</priority>\n</url>`
  );
  for (const post of posts.filter((p) => !p.draft)) {
    urls.push(
      `<url>\n  <loc>${SITE}/blog/${xmlEscape(post.slug)}</loc>\n  <lastmod>${post.date_modified}</lastmod>\n  <changefreq>monthly</changefreq>\n  <priority>0.60</priority>\n</url>`
    );
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset\n      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n${urls.join('\n')}\n\n</urlset>\n`;
}

function blogCard(post) {
  return `          <a href="${post.slug}" class="blog-card bg-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-yellow-accent no-underline group">
            <div class="blog-card-content">
              <div class="blog-card-date text-sm text-gray-500">${formatDisplayDate(post.date)}</div>
              <div class="blog-card-text">
                <h3 class="font-heading text-xl font-bold leading-tight text-gray-900 group-hover:text-primary transition-colors mb-2">
                  ${post.card_title || post.og_title}
                </h3>
                <p class="text-gray-700 text-base leading-relaxed">${post.card_excerpt}</p>
              </div>
            </div>
          </a>`;
}

function stateCard(post) {
  const c = post.card_color || 'green';
  return `            <a href="${post.slug}" class="blog-card bg-gradient-to-br from-${c}-50 to-${c}-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-${c}-200 hover:border-${c}-300 no-underline group">
              <div class="blog-card-content">
                <div class="blog-card-date text-sm text-${c}-600">${formatDisplayDate(post.date)}</div>
                <div class="blog-card-text">
                  <h3 class="font-heading text-lg font-bold leading-tight text-gray-900 group-hover:text-primary transition-colors mb-2">
                    ${post.card_title || post.og_title}
                  </h3>
                  <p class="text-gray-700 text-sm leading-relaxed">${post.card_excerpt}</p>
                </div>
              </div>
            </a>`;
}

function generateIndex(posts) {
  const published = posts.filter((p) => !p.draft);
  for (const p of published) {
    if (!p.card_excerpt) fail(`${p.file}: card_excerpt is required to generate the blog index`);
  }
  const featured = published.find((p) => p.featured === true);
  if (!featured) fail('no post has featured: true — the blog index needs a featured post');
  const byDateDesc = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug));
  const latest = published.filter((p) => p.card_section !== 'state').sort(byDateDesc);
  const states = published.filter((p) => p.card_section === 'state').sort((a, b) => a.slug.localeCompare(b.slug));

  const featuredBlock = `      <section class="mb-16">
        <div class="bg-yellow-accent rounded-[45px] px-12 py-8 sm:px-16 sm:py-10 md:px-20 md:py-12 lg:px-24 lg:py-16 mb-12 relative overflow-hidden">
          <div class="max-w-4xl pl-12 sm:pl-8 md:pl-0">
            <span class="text-primary font-heading text-sm uppercase tracking-wide mb-4 inline-block">Featured</span>
            <h2 class="font-heading text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-[1.2]">
              <a href="${featured.slug}" class="hover:underline">${featured.card_title || featured.og_title}</a>
            </h2>
            <p class="text-sm md:text-base leading-relaxed mb-6 text-gray-800 max-w-3xl">
              ${featured.featured_excerpt || featured.card_excerpt}
            </p>
            <div class="flex items-center gap-4 mb-6">
              <span class="text-sm text-gray-600">${formatDisplayDate(featured.date)}${featured.read_time ? ` • ${featured.read_time}` : ''}</span>
            </div>
            <a href="${featured.slug}" class="text-primary font-heading font-semibold hover:underline">
              Read the Post
            </a>
          </div>
          <div class="absolute -right-4 -top-4 w-32 h-32 bg-primary rounded-full rotate-12 opacity-20"></div>
        </div>
      </section>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-LN0EK30SS7"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
      gtag('js', new Date());
      gtag('config', 'G-LN0EK30SS7');
    </script>
    <script src="/js/consent.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog - Grover</title>
  <link rel="stylesheet" href="../main.css">
  <link rel="stylesheet" href="blog.css">
  <link rel="icon" type="image/png" sizes="32x32" href="../img/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../img/favicon-16x16.png">
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Blog - Grover">
  <meta property="og:description" content="Expert insights, tips, and guides for vanlife planning and apps. Discover the best tools and strategies for your van adventures with Grover's blog.">
  <meta property="og:image" content="https://getgrover.ai/img/og.png">
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="Blog - Grover">
  <meta property="twitter:description" content="Expert insights, tips, and guides for vanlife planning and apps. Discover the best tools and strategies for your van adventures with Grover's blog.">
  <meta property="twitter:image" content="https://getgrover.ai/img/og.png">
  <link rel="canonical" href="https://getgrover.ai/blog/">
  <!-- General SEO -->
  <meta name="description" content="Expert insights, tips, and guides for vanlife planning and apps. Discover the best tools and strategies for your van adventures with Grover's blog.">
</head>
<body class="font-body text-gray-800 leading-relaxed m-0 p-0 overflow-x-hidden">
  <header class="bg-primary py-8">
    <div class="container mx-auto px-4 max-w-6xl lg:max-w-[1400px]">
      <nav class="flex items-center justify-between mb-8">
        <a href="/">
          <img src="../img/grover-combomark-white.svg" alt="grover logo" class="h-10 md:h-14">
        </a>
        <a href="/" class="text-white hover:underline font-heading text-base">← Back to Home</a>
      </nav>
      <h1 class="text-white font-heading text-3xl md:text-4xl font-bold mb-6 leading-[1.1]">
        The Joy Ride Journal
      </h1>
      <p class="text-white text-xl md:text-2xl leading-[1.3] max-w-2xl">
        Stories, insights, and tips from the road ahead.
      </p>
    </div>
  </header>

  <main class="py-16">
    <div class="container mx-auto px-4 max-w-6xl lg:max-w-[1400px]">
      <!-- Featured Article -->
${featuredBlock}

      <!-- Latest Articles -->
      <section>
        <h2 class="font-heading text-2xl md:text-3xl font-bold mb-10 text-center">Latest Stories</h2>
        <div class="blog-cards-container mb-16">
${latest.map(blogCard).join('\n')}
        </div>

        <!-- Vanlife Community Guides Section -->
        <section class="mb-16">
          <h2 class="font-heading text-2xl md:text-3xl font-bold mb-4 text-center">State-by-State Vanlife Community Guides</h2>
          <p class="text-center text-gray-600 mb-10 max-w-3xl mx-auto">Discover the unique vanlife communities, resources, and opportunities in America's top vanlife destinations. Each guide provides local insights, community connections, and expert tips for that state.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
${states.map(stateCard).join('\n')}
          </div>
        </section>
        <!-- Call to Action -->
        <div class="text-center py-12 px-8">
          <div class="max-w-2xl mx-auto">
            <div class="bg-primary rounded-xl p-16 mb-8 flex flex-col items-center">
              <h3 class="font-heading text-2xl md:text-3xl font-bold mb-4 text-white">
                Ready to Start Your Van Adventure?
              </h3>
              <p class="text-white text-base md:text-lg leading-relaxed mb-6 opacity-90 text-center">
                Join thousands of vanlifers who use Grover for expert trip planning, camping spots, and community support. Start planning your perfect van journey today.
              </p>
              <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 8px;">
                <a href="https://apps.apple.com/us/app/grover-van-life/id6742468326" class="inline-block bg-yellow-accent text-primary font-heading font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors" style="min-width: 180px; text-align: center;">
                  Download on the App Store
                </a>
                <a href="https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app" class="inline-block bg-yellow-accent text-primary font-heading font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors" style="min-width: 180px; text-align: center;">
                  Get it on Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <!-- Newsletter Signup -->
  <section class="bg-primary py-16">
    <div class="container mx-auto px-4 max-w-6xl lg:max-w-[1400px] text-center">
      <h2 class="text-white font-heading text-2xl md:text-3xl font-bold mb-4">
        Stay Updated on Grover and Everything Van Life
      </h2>
      <p class="text-white text-base mb-8 max-w-2xl mx-auto">
        Get the latest Grover updates, stories, and tips delivered straight to your inbox.
      </p>
      <div class="max-w-md mx-auto">
        <div class="grover-signup" data-grover-signup data-endpoint="https://ops.getgrover.ai/api/public/contacts/subscribe"></div>
        <script src="/js/signup.js" defer></script>
      </div>
    </div>
  </section>

  <footer class="py-16 text-center text-white bg-primary">
    <div class="flex flex-col items-center">
      <img src="../img/grover-combomark-white.svg" alt="grover logo" class="h-8 mb-4 mx-auto">
      <div class="flex items-center justify-center gap-4 mb-4">
        <a href="https://www.instagram.com/getgrover.ai" target="_blank" rel="noopener noreferrer" class="text-white hover:text-yellow-accent transition-colors">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </div>
      <p class="text-sm">&copy; 2026 grover. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
`;
}

function main() {
  const args = process.argv.slice(2);
  const doIndex = args.includes('--index');
  const doSitemap = args.includes('--sitemap');
  const unknown = args.filter((a) => !['--index', '--sitemap'].includes(a));
  if (unknown.length) fail(`unknown argument(s): ${unknown.join(' ')}`);

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const posts = loadPosts();

  for (const post of posts) {
    const outDir = path.join(OUT_DIR, post.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), renderPost(post, template));
    console.log(`build-blog: wrote public/blog/${post.slug}/index.html${post.draft ? ' (draft)' : ''}`);
  }

  if (doIndex) {
    fs.writeFileSync(path.join(OUT_DIR, 'index.html'), generateIndex(posts));
    console.log('build-blog: wrote public/blog/index.html');
  }
  if (doSitemap) {
    fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), generateSitemap(posts));
    console.log('build-blog: wrote public/sitemap.xml');
  }
  console.log(`build-blog: done (${posts.length} post${posts.length === 1 ? '' : 's'})`);
}

main();
