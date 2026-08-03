import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOS } from '../store.js'
import { downloadResume } from '../apps/hire/resume.js'
import { PROJECTS, allFindings } from '../content/projects.js'
import { POSTS, postsRanked } from '../content/posts.js'
import './surface.css'

// ── Layer 1: the landing page ──
//
// It used to carry nine sections: hero, live compactor, crate graph, OS
// trigger, three project cards, four essays, the findings, and a telemetry
// strip. Everything the site had, stacked. A reader had to scroll past all of
// it to find the one thing they came for, and nothing was allowed to be the
// most important.
//
// The top header came off too: a logo plus Work/Writing links, directly above
// a hero with the same name in 78px type and three doors that include Work and
// Writing. It was a second copy of the page's own navigation, spending 62px of
// the fold to repeat what was already there. Routed pages keep their own nav
// (PageShell), so this only affects the landing page.
//
// Now it does one job: say who this is, prove it once, and offer two doors:
// the work, and the writing. Both are real pages with their own URLs. The
// demos moved to the project they demonstrate.

// The stack pills and the stats strip both came off this page. Measured at
// 1440x900 the landing page ran 1316px, so the three doors were cut in half by
// the fold and a reader had to scroll to find out that any of them led
// anywhere. Everything here now has to earn its height.
//
// The pills said "Rust · WebAssembly · Systems · TypeScript · Cloudflare" one
// line under a sentence that already said Rust and WASM, above a terminal
// showing the tooling in use. The stats moved to /work, where someone is
// actually evaluating rather than deciding whether to stay.

// Six lines down to two, by deleting whole lines rather than rewording them:
// this is captured output, and a paraphrase would quietly stop being captured
// output. It also costs nothing on desktop, where the panel sits beside a
// taller column of text: hiding it entirely changes the hero's height by 0px,
// measured. On mobile it stacks, so the trim is worth ~75px there.
//
// Gone: the "RULE-OF-TWO VIOLATION" banner, which shouts a term of art at a
// reader who may not know it, and the "[y/N]" prompt, now only one of two ways
// to answer since the approval UI landed.
//
// What is left is what happened: which tool, what it would have done, and that
// it did not. The caption underneath already says why, in English.
const FOREGUARD = {
  cmd: 'foreguard proxy --taint -- <mcp-server>',
  transcript: `⚠  \`send_email\` (high risk) · sends to attacker@evil.com
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

      <main className="xs-main">
        {/* ── hero ── */}
        <section className="xs-hero">
          <div className="xs-hero-grid">
            <div className="xs-hero-copy">
              <div className="xs-eyebrow">
                <span className="xs-avail" />Open to senior and founding infrastructure roles
              </div>
              <h1 className="xs-h1">
                Noel Jackson <span className="xs-h1-iii">III</span>
                <span className="xs-h1-sub">Systems &amp; AI Infrastructure Engineer</span>
              </h1>
              <p className="xs-lead">
                Building <b>deterministic Rust runtimes</b>, WASM execution engines, and low-level
                AI infrastructure, from the kernel to the edge.
              </p>
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
              </div>
            </aside>
          </div>
        </section>

        {/* ── three doors ──
            The OS used to sit below the two text cards. It is a whole retro
            desktop running real Rust compiled to WASM, the most distinctive
            thing on the site, and burying the best asset under two paragraphs
            was the clearest mistake in the previous layout.

            Each door also carries its own contents rather than a description of
            them. Three identical blocks of prose is not a choice a reader can
            make; three lists of real things is. */}
        <section className="xs-doors">
          <Link className="xs-door" to="/work">
            <span className="u-kicker">Portfolio</span>
            <span className="xs-door-h">The work</span>
            <span className="xs-door-p">
              Running software, each with the command that regenerates its numbers.
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
              Design notes, including where each guarantee stops holding.
            </span>
            <ul className="xs-door-list">
              {postsRanked().slice(0, 3).map((p) => (
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
              A retro desktop running real Rust in this tab, compiled to WebAssembly.
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
            {/* ⌘K works everywhere (bound in App.jsx); this is the only thing
                that says so now the header is gone. Down here it costs nothing
                above the fold, and anyone who wants a command palette will
                look for it rather than need it advertised. */}
            <button className="xs-kbd-hint" onClick={openPalette}>
              <span>⌘</span>K
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}
