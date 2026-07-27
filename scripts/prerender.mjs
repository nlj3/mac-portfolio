// Give every route its own <head>, plus a sitemap and a robots.txt.
//
// The problem this solves: the built index.html ships `<div id="root"></div>`
// and nothing else, and React fills it in afterwards. Google runs JS so it
// eventually sees the page, but the crawlers that matter most for a portfolio
// link do NOT: Slack, LinkedIn, Discord and iMessage fetch the HTML, read the
// meta tags, and never execute a line of script. Every link to /work/kedge or
// to an article was therefore unfurling with the homepage title, the homepage
// description and the homepage image.
//
// This is not server-side rendering and does not pretend to be. It writes one
// static HTML file per route, cloned from the built shell with the head
// rewritten, so a fetcher gets the right card and a reader still gets the same
// React app. Cloudflare Pages serves an existing file before falling back to
// the SPA rule in _redirects, so dist/work/kedge/index.html wins for
// /work/kedge and the `/* -> /index.html` line only catches genuine misses.
//
// Full SSR would be better. It is also a framework migration, and this is
// twenty lines of head-rewriting that fixes the part anyone actually sees.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { PROJECTS } from '../src/content/projects.js'
import { POSTS } from '../src/content/posts.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const ORIGIN = 'https://nlj.dev'

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Meta descriptions get truncated by every consumer; do it here, on a word. */
const clamp = (s, n = 300) => {
  const t = String(s).replace(/\s+/g, ' ').trim()
  if (t.length <= n) return t
  return t.slice(0, t.lastIndexOf(' ', n)) + '…'
}

/** Every route that should have its own card. */
function routes() {
  const out = [
    {
      path: '/',
      // The head was already correct here, so this was originally `skip: true`
      // and the body never got written. That left the single most-shared URL on
      // the site as `<div id="root"></div>` to anything that does not run JS,
      // while every deeper route had a readable fallback. Exactly backwards.
      title: 'Noel Jackson · Systems & AI Infrastructure Engineer',
      description:
        'Noel Jackson builds deterministic Rust runtimes, WASM execution engines and AI agent infrastructure. Kedge, a deterministic agent harness; Foreguard, a dry-run trust layer for MCP agents; WorldFrame, a local-first desktop app.',
      body:
        `<h1>Noel Jackson</h1><p>Systems &amp; AI Infrastructure Engineer</p>` +
        `<p>Building deterministic Rust runtimes, WASM execution engines and low-level AI infrastructure.</p>` +
        `<ul>${PROJECTS.map(
          (p) => `<li><a href="/work/${p.slug}">${esc(p.name)}</a> (${esc(p.kicker)}): ${esc(p.tagline)}</li>`,
        ).join('')}</ul>` +
        `<p><a href="/work">Work</a> · <a href="/blog">Writing</a> · ` +
        `<a href="https://github.com/nlj3">GitHub</a> · ` +
        `<a href="mailto:noel@nlj.dev">noel@nlj.dev</a></p>`,
    },
    {
      path: '/work',
      title: 'Work · Noel Jackson',
      description:
        'Rust runtimes, agent-safety layers and shipped desktop software. Each project page states the claim, the threshold for calling it a failure written before the measurement, and the number that came back.',
      body: `<h1>Work</h1><ul>${PROJECTS.map(
        (p) => `<li><a href="/work/${p.slug}">${esc(p.name)}</a>: ${esc(p.tagline)}</li>`,
      ).join('')}</ul>`,
    },
    {
      path: '/blog',
      title: 'Writing · Noel Jackson',
      description:
        'Design notes on deterministic agent runtimes, capability enforcement and context compaction. Arguments about how something works and why it was built that way, not measurements.',
      body: `<h1>Writing</h1><ul>${POSTS.map(
        (p) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a>: ${esc(p.tldr)}</li>`,
      ).join('')}</ul>`,
    },
  ]

  for (const p of PROJECTS) {
    out.push({
      path: `/work/${p.slug}`,
      title: `${p.name} · ${p.kicker} · Noel Jackson`,
      description: clamp(p.lede || p.tagline),
      body: `<h1>${esc(p.name)}</h1><p>${esc(p.tagline)}</p><p>${esc(p.lede)}</p>`,
    })
  }

  for (const p of POSTS) {
    out.push({
      path: `/blog/${p.slug}`,
      // Articles are articles, not the site. The type matters to the card.
      ogType: 'article',
      title: `${p.title} · Noel Jackson`,
      description: clamp(p.tldr),
      body:
        `<h1>${esc(p.title)}</h1><p>${esc(p.tldr)}</p>` +
        (p.body || [])
          .map((s) => `<h2>${esc(s.h)}</h2><p>${esc(s.p)}</p>`)
          .join(''),
    })
  }

  return out
}

/**
 * Swap the head tags that differ per route. Everything else in the shell
 * (favicons, theme colour, the image dimensions) is already correct, so this
 * replaces rather than appends: appending would leave two `<title>` elements
 * and let the consumer pick.
 */
function rewriteHead(html, r) {
  const title = esc(r.title)
  const desc = esc(r.description)
  const url = ORIGIN + r.path

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${desc}" />`,
    )
    .replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${url}" />`)
    .replace(
      /<meta property="og:type"[^>]*\/>/,
      `<meta property="og:type" content="${r.ogType || 'website'}" />`,
    )
    .replace(
      /<meta property="og:title"[^>]*\/>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${desc}" />`,
    )
    .replace(/<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${url}" />`)
    .replace(
      /<meta name="twitter:title"[^>]*\/>/,
      `<meta name="twitter:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${desc}" />`,
    )
}

/**
 * A readable fallback for anything that will not run JS.
 *
 * Inside `<noscript>` rather than inside `#root`: React's `createRoot().render`
 * wipes the container, so content placed there would flash and vanish on every
 * load for every real visitor, to serve a crawler.
 */
function injectNoscript(html, r) {
  return html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <noscript>\n      <main>${r.body}<p><a href="/">nlj.dev</a></p></main>\n    </noscript>`,
  )
}

async function main() {
  const shell = await readFile(join(DIST, 'index.html'), 'utf8')

  // If the shell stops matching what rewriteHead expects, every generated page
  // silently keeps the homepage card. Fail instead.
  for (const probe of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:title"']) {
    if (!shell.includes(probe)) {
      throw new Error(`dist/index.html has no ${probe}; prerender would emit wrong metadata`)
    }
  }

  const all = routes()
  let written = 0
  for (const r of all) {
    let html = rewriteHead(shell, r)
    html = injectNoscript(html, r)
    if (html === shell) throw new Error(`${r.path}: nothing was rewritten`)
    const dir = join(DIST, r.path)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'index.html'), html)
    written++
  }

  // Generated from the same list, so a new project or article cannot be in the
  // site and missing from the sitemap.
  const urls = all
    .map(
      (r) =>
        `  <url><loc>${ORIGIN}${r.path}</loc><changefreq>${
          r.path === '/' ? 'weekly' : 'monthly'
        }</changefreq><priority>${r.path === '/' ? '1.0' : '0.8'}</priority></url>`,
    )
    .join('\n')
  await writeFile(
    join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )

  await writeFile(
    join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
  )

  console.log(`prerender: ${written} routes, ${all.length} sitemap entries, robots.txt`)
}

main().catch((e) => {
  console.error('prerender failed:', e.message)
  process.exit(1)
})
