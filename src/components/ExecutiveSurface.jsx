import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOS } from '../store.js'
import { downloadResume } from '../apps/hire/resume.js'
import { PROJECTS, SITE_STATS, allFindings } from '../content/projects.js'
import { POSTS } from '../content/posts.js'
import './surface.css'

// ── Layer 1: the landing page ──
//
// It used to carry nine sections: hero, live compactor, crate graph, OS
// trigger, three project cards, four essays, the findings, and a telemetry
// strip. Everything the site had, stacked. A reader had to scroll past all of
// it to find the one thing they came for, and nothing was allowed to be the
// most important.
//
// Now it does one job — say who this is, prove it once, and offer two doors:
// the work, and the writing. Both are real pages with their own URLs. The
// demos moved to the project they demonstrate.

const STACK = ['Rust', 'WebAssembly', 'Systems', 'TypeScript', 'Cloudflare']

const FOREGUARD = {
  cmd: 'foreguard proxy --taint -- <mcp-server>',
  transcript: `⛔  RULE-OF-TWO VIOLATION — this mutation carries
    untrusted data (\`attacker@evil.com\`);
    forcing human approval.
⚠  \`send_email\` (high risk) · sends to attacker@evil.com
    Execute this for real? [y/N]
    ✗ denied — dry-run, nothing executed`,
}

export default function ExecutiveSurface() {
  const launchOS = useOS((s) => s.enterOS)
  const openPalette = useOS((s) => s.togglePalette)
  const [busy, setBusy] = useState(false)

  async function resume() {
    setBusy(true)
    try { await downloadResume() } finally { setBusy(false) }
  }

  const findingCount = allFindings().length

  return (
    <div className="xs">
      <div className="xs-grid-bg" aria-hidden="true" />

      <header className="xs-nav">
        <div className="xs-nav-inner">
          <span className="xs-logo">nlj<span className="xs-logo-dot">.dev</span></span>
          <nav className="xs-nav-links">
            <Link to="/work">Work</Link>
            <Link to="/blog">Writing</Link>
            <button className="xs-kbd-hint" onClick={openPalette}>
              <span>⌘</span>K
            </button>
          </nav>
        </div>
      </header>

      <main className="xs-main">
        {/* ── hero ── */}
        <section className="xs-hero">
          <div className="xs-hero-grid">
            <div className="xs-hero-copy">
              <div className="xs-eyebrow">
                <span className="xs-avail" />Available for Staff &amp; Principal roles
              </div>
              <h1 className="xs-h1">
                Noel Jackson <span className="xs-h1-iii">III</span>
                <span className="xs-h1-sub">Systems &amp; AI Infrastructure Engineer</span>
              </h1>
              <p className="xs-lead">
                Building <b>deterministic Rust runtimes</b>, WASM execution engines, and low-level
                AI infrastructure, from the kernel to the edge.
              </p>
              <div className="xs-pills">
                {STACK.map((s) => <span className="xs-pill" key={s}>{s}</span>)}
              </div>
              <div className="xs-cta-row">
                <a className="xs-btn primary" href="mailto:noel@nlj.dev">Contact: noel@nlj.dev</a>
                <button className="xs-btn" onClick={resume} disabled={busy}>
                  {busy ? 'Building…' : 'Download Résumé (PDF)'}
                </button>
              </div>
            </div>

            {/* Real captured output. The one proof the landing page keeps, because
                it shows the work doing something rather than describing it. */}
            <aside
              className="xs-proof"
              aria-label="Real output from Foreguard blocking a prompt injection"
            >
              <div className="xs-proof-bar">
                <span className="xs-dot r" /><span className="xs-dot y" /><span className="xs-dot g" />
                <span className="xs-proof-title">{FOREGUARD.cmd}</span>
              </div>
              <pre className="xs-proof-body"><code>{FOREGUARD.transcript}</code></pre>
              <div className="xs-proof-foot">
                A fetched page told the agent to mail everything to an attacker.
                It was caught the moment that address reached a mutating tool.
              </div>
            </aside>
          </div>

          <div className="xs-statstrip">
            {SITE_STATS.map((s) => (
              <div className="xs-stat" key={s.label}>
                <div className="xs-stat-n">{s.n}<span className="xs-stat-u">{s.unit}</span></div>
                <div className="xs-stat-l">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── three doors ──
            The OS used to sit below the two text cards. It is a whole retro
            desktop running real Rust compiled to WASM — the most distinctive
            thing on the site — and burying the best asset under two paragraphs
            was the clearest mistake in the previous layout.

            Each door also carries its own contents rather than a description of
            them. Three identical blocks of prose is not a choice a reader can
            make; three lists of real things is. */}
        <section className="xs-doors">
          <Link className="xs-door" to="/work">
            <span className="u-kicker">Portfolio</span>
            <span className="xs-door-h">The work</span>
            <span className="xs-door-p">
              Running software. Each project states its claim, the threshold for
              failure written before the measurement, and the command that
              regenerates the number.
            </span>
            <ul className="xs-door-list">
              {PROJECTS.map((p) => (
                <li key={p.slug}>
                  <span className="xs-door-li-n">{p.name}</span>
                  <span className="xs-door-li-t">{p.kicker}</span>
                </li>
              ))}
            </ul>
            <span className="xs-door-go">
              {findingCount} measured results <span aria-hidden="true">→</span>
            </span>
          </Link>

          <Link className="xs-door" to="/blog">
            <span className="u-kicker">Writing</span>
            <span className="xs-door-h">The thinking</span>
            <span className="xs-door-p">
              Design notes on agent runtimes, isolation boundaries and
              prompt-injection defence — including where each guarantee actually
              ends.
            </span>
            <ul className="xs-door-list">
              {POSTS.slice(0, 3).map((p) => (
                <li key={p.slug}>
                  <span className="xs-door-li-n">{p.title}</span>
                  <span className="xs-door-li-t">{p.tag}</span>
                </li>
              ))}
            </ul>
            <span className="xs-door-go">
              {POSTS.length} essays <span aria-hidden="true">→</span>
            </span>
          </Link>

          <button className="xs-door xs-door-os" onClick={launchOS}>
            <span className="u-kicker">Interactive</span>
            <span className="xs-door-h">The workstation</span>
            <span className="xs-door-p">
              A retro desktop I built, running in this tab. Its terminal executes
              <code> kedge_core::classify</code> — real Rust, compiled to
              WebAssembly, not a mock.
            </span>
            <div className="xs-door-term" aria-hidden="true">
              <div className="xs-door-term-bar">
                <span className="xs-dot r" /><span className="xs-dot y" /><span className="xs-dot g" />
                <span className="xs-door-term-t">nlj-os · substrate</span>
              </div>
              <pre className="xs-door-term-body">{`$ classify delete_file
  MUTATING (high) · intercepted
$ classify read_file
  read-only · would run`}<span className="xs-caret" /></pre>
            </div>
            <span className="xs-door-go">
              Boot NLJ OS <span aria-hidden="true">→</span>
            </span>
          </button>
        </section>

        <footer className="xs-footer">
          <div className="xs-footer-l">
            <span className="xs-logo">nlj<span className="xs-logo-dot">.dev</span></span>
            <span className="xs-muted">Noel Jackson III · Systems &amp; AI Infrastructure Engineer</span>
          </div>
          <div className="xs-footer-links">
            <a href="mailto:noel@nlj.dev">noel@nlj.dev</a>
            <a href="https://github.com/nlj3" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <button className="xs-link-btn" onClick={launchOS}>Launch NLJ OS →</button>
          </div>
        </footer>
      </main>
    </div>
  )
}
