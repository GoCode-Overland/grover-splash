// One-time migration: convert blog/slug.html → blog/slug/index.html for clean URLs.
// Leaves a redirect stub at the old path so bookmarks and external links still work.
// Run with: node scripts/migrate-blog-to-dirs.js

import fs from 'fs';
import path from 'path';

function transformPost(content) {
    return content
        // CSS paths (one level deeper now)
        .replace(/href="\.\.\/main\.css"/g, 'href="../../main.css"')
        .replace(/href="blog\.css"/g, 'href="../blog.css"')
        // Image/icon src and href paths
        .replace(/src="\.\.\/img\//g, 'src="../../img/')
        .replace(/href="\.\.\/img\//g, 'href="../../img/')
        // Nav: main site (must match before generic ../index.html)
        .replace(/href="\.\.\/index\.html"/g, 'href="/"')
        // Nav: blog index back link
        .replace(/href="index\.html"/g, 'href="/blog/"')
        // Inter-post links: relative slug.html → ../slug (sibling directory)
        .replace(/href="([a-z0-9-]+)\.html"/g, 'href="../$1"')
        // Canonical / OG / schema absolute URLs: strip .html
        .replace(/https:\/\/getgrover\.ai\/blog\/([a-z0-9-]+)\.html/g,
                 'https://getgrover.ai/blog/$1');
}

function redirectStub(slug) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=/blog/${slug}">
<link rel="canonical" href="https://getgrover.ai/blog/${slug}">
<title>Redirecting…</title>
</head>
<body></body>
</html>`;
}

function migrateDir(dir) {
    const files = fs.readdirSync(dir)
        .filter(f => f.endsWith('.html') && f !== 'index.html');

    let count = 0;
    for (const file of files) {
        const slug = path.basename(file, '.html');
        const srcPath = path.join(dir, file);
        const newDir = path.join(dir, slug);
        const dstPath = path.join(newDir, 'index.html');

        // Skip if already migrated
        if (fs.existsSync(newDir) && fs.statSync(newDir).isDirectory()) {
            console.log(`  skip (already exists): ${slug}/`);
            continue;
        }

        const content = fs.readFileSync(srcPath, 'utf8');
        // Only migrate real posts (has <html> tag), not already-stub redirects
        if (!content.includes('<html')) {
            console.log(`  skip (not HTML): ${file}`);
            continue;
        }

        fs.mkdirSync(newDir, { recursive: true });
        fs.writeFileSync(dstPath, transformPost(content), 'utf8');
        fs.writeFileSync(srcPath, redirectStub(slug), 'utf8');
        console.log(`  ✓ ${file} → ${slug}/index.html`);
        count++;
    }

    // Update blog index: href="slug.html" → href="slug"
    const indexPath = path.join(dir, 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const updated = indexContent.replace(/href="([a-z0-9-]+)\.html"/g, 'href="$1"');
    fs.writeFileSync(indexPath, updated, 'utf8');

    console.log(`  ✓ index.html links updated`);
    console.log(`  Total migrated: ${count}`);
}

console.log('\n=== Migrating blog/ ===');
migrateDir('blog');

console.log('\n=== Migrating public/blog/ ===');
migrateDir('public/blog');

console.log('\nDone. Verify a post, then commit.');
