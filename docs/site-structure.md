# Site structure: where the real files live

Everything under `public/` is the real site. Edit it directly. There is no
root-level mirror anymore: the old duplicated root copies (`tutorials.html`,
`terms/`, `pages/`, `build/`, `img/`, `fonts/`, `js/`, `main.css`,
`sitemap.xml`, etc.) were deleted in July 2026 because the Vite build never
read them — only `public/` is copied through to `dist/`.

Conventions:

- **`public/**`** — hand-maintained static pages and assets (tutorials, terms,
  account-delete, redirect stubs, `js/signup.js`, `img/`, `fonts/`,
  `main.css`, `sitemap.xml`, `llms.txt`, Google site verification). Edit these
  in place; `npm run dev` serves them live and `npm run build` passes them
  through unchanged into `dist/`.
- **Root `index.html`** — the one legitimate root-level file the build reads;
  it is the sole Vite SPA entry point for the React routes in `src/pages/`.
- **`public/lp/`** — MCP-managed landing pages, written by grover-chat's
  `publish_landing_page`/`update_landing_page` tools. Never hand-edit
  (same for `templates/landing-page.html`, their template).
- **`blog/` (root) and `public/blog/`** — still duplicated for now; the blog
  is moving to markdown source in `content/blog/` with `public/blog/` as
  generated build output (migration plan U2). Until then, `public/blog/` is
  the deployed copy.
