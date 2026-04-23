#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

const CANONICAL_SNIPPET = `    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-LN0EK30SS7"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-LN0EK30SS7');
    </script>`;

// Matches the two-script GA block, anchored on the comment and the config call
const GA_BLOCK_RE = /[ \t]*<!-- Google tag \(gtag\.js\) -->[\s\S]*?gtag\('config', 'G-LN0EK30SS7'\);\s*<\/script>/;

const blogDir = path.join(__dirname, '..', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

let changed = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const original = fs.readFileSync(filePath, 'utf8');

  if (!GA_BLOCK_RE.test(original)) {
    console.warn(`SKIP  ${file} — GA block not found`);
    skipped++;
    continue;
  }

  const updated = original.replace(GA_BLOCK_RE, CANONICAL_SNIPPET);

  if (updated === original) {
    continue;
  }

  if (DRY_RUN) {
    console.log(`WOULD UPDATE  ${file}`);
  } else {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`UPDATED  ${file}`);
  }
  changed++;
}

const verb = DRY_RUN ? 'would update' : 'updated';
console.log(`\nDone: ${verb} ${changed} file(s), skipped ${skipped} (no GA block).`);
