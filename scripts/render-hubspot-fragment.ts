import { renderToStaticMarkup } from 'react-dom/server';
import * as React from 'react';
import { EmailContent } from './emails/grover-update-2026-07-16.js';
import { writeFileSync } from 'fs';
import os from 'os';
import path from 'path';

// HubSpot's custom HTML module rejects <html>/<head>/<body>/<style> tags (it injects
// your markup into its own template) and doesn't support <style> blocks in the body,
// so this renders a pure fragment: fully inlined styles, no wrapper tags, no <style>
// block (which also means no dark-mode support in the HubSpot version), and no Resend
// unsubscribe merge tag (HubSpot injects its own compliance footer).

const bodyWrapperStyle: React.CSSProperties = {
  backgroundColor: '#f8e5c1',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  margin: 0,
  padding: '32px 16px',
};

const html = renderToStaticMarkup(
  React.createElement(
    'div',
    { style: bodyWrapperStyle },
    React.createElement(EmailContent, { includeUnsubscribe: false })
  )
);

const outPath = path.join(os.homedir(), 'Desktop', 'hubspot-email-fragment.html');
writeFileSync(outPath, html);
console.log(`Wrote ${Buffer.byteLength(html)} bytes to ${outPath}`);
console.log('Paste its contents into a HubSpot custom HTML module.');
