# public/lp/

This directory is MCP-managed. Pages under `public/lp/<slug>/` are published
and updated by the `publish_landing_page` and `update_landing_page` MCP tools
(grover-chat, `grover_owner`-gated), which render `templates/landing-page.html`
and commit the result here via the GitHub Contents API.

Do not hand-edit files in this directory:

- Content changes don't stick. The next `update_landing_page` call re-renders
  from the template and overwrites manual edits.
- Chrome/structure changes (nav, footer, slots) belong in
  `templates/landing-page.html`, one level up, so every page picks them up
  the next time it's published or updated.

To see what's live, ask Claude to run `list_landing_pages`, or check
`https://getgrover.ai/lp/<slug>/` directly. Deploys land ~2-3 minutes after
a publish/update commit (GitHub Actions -> GitHub Pages).

This README itself is a static file, not MCP-managed; edit it directly if the
process above changes.
