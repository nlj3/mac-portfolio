// ═══════════════════════════════════════════════════════════════════
//  RÉSUMÉ: a clean one-page PDF, generated client-side.
//  jsPDF is dynamically imported so it's a separate chunk that only loads
//  when someone actually downloads. Recruiters need one artifact they can
//  forward; this is it.
// ═══════════════════════════════════════════════════════════════════

const INK = [17, 24, 39]
const MUTE = [107, 114, 128]
const ACCENT = [37, 99, 235]

export async function downloadResume() {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const W = doc.internal.pageSize.getWidth()
  const M = 54
  let y = 64

  const text = (s, x, opts = {}) => {
    doc.setFont('helvetica', opts.style || 'normal')
    doc.setFontSize(opts.size || 10)
    doc.setTextColor(...(opts.color || INK))
    doc.text(s, x, y)
  }
  const line = () => {
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.8)
    doc.line(M, y, W - M, y)
  }
  const gap = (n) => { y += n }

  // ── header ──
  text('Noel Jackson', M, { size: 22, style: 'bold' })
  gap(18)
  text('Systems & AI Infrastructure Engineer', M, { size: 12, color: ACCENT })
  gap(15)
  text('noel@nlj.dev   ·   nlj.dev   ·   github.com/nlj3', M, { size: 9.5, color: MUTE })
  gap(16); line(); gap(20)

  // ── summary ──
  const summary =
    'I build deterministic Rust runtimes, WASM execution engines, and AI infrastructure: ' +
    'high-assurance systems from the kernel to the edge. I ship production software solo: I own the ' +
    'architecture, direct AI to implement against contracts I design, and verify every change before it lands.'
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...INK)
  doc.splitTextToSize(summary, W - M * 2).forEach((ln) => { doc.text(ln, M, y); gap(14) })
  gap(8)

  const section = (title) => { text(title, M, { size: 11, style: 'bold', color: ACCENT }); gap(6); line(); gap(16) }
  const item = (title, sub, bullets) => {
    text(title, M, { size: 10.5, style: 'bold' })
    if (sub) { doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(...MUTE); doc.text(sub, W - M, y, { align: 'right' }) }
    gap(15)
    bullets.forEach((b) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(...INK)
      doc.splitTextToSize('•  ' + b, W - M * 2 - 8).forEach((ln, i) => { doc.text(ln, M + (i ? 10 : 0), y); gap(13) })
    })
    gap(6)
  }

  // ── selected work ──
  // Numbers here must match SITE_STATS and the findings in content/projects.js.
  // They are re-measured, not remembered: 17 crates was wrong (18), and the
  // adversarial result did not exist when this file was written.
  section('Selected Work')
  item('Kedge: deterministic AI-agent harness', 'Rust · WebAssembly · 18 crates · 271 tests', [
    'A safety harness that classifies every agent action before it runs (read-only allowed, anything mutating intercepted), journaling each step to an append-only ledger so a run can be replayed and diffed against a baseline.',
    'Deny-by-default capability manifests declare the paths, commands and hosts a task may touch. In a deterministic 16-scenario adversarial suite it blocked all 10 defined attacks while completing all 8 benign controls; both figures are pinned by CI, which re-runs the published command on a clean checkout.',
    'Core classifier compiled to WebAssembly and running live in-browser; 15 crates published to crates.io.',
  ])
  item('Foreguard: dry-run trust layer for AI agents', 'Rust · MCP · six published versions', [
    'An MCP proxy that intercepts every mutating tool call and previews its concrete effect before execution, then runs exactly the call that was approved. Extracted from Kedge as a standalone product.',
    'Implements Meta’s Agents "Rule of Two": tracks the provenance of tool output and forces human approval when untrusted data would drive a state change, a practical defense against prompt injection (OWASP LLM01). The taint tracking is documented as best-effort rather than sound.',
  ])
  item('WorldFrame: desktop worldbuilding app', 'Tauri 2 · Rust · React 19 · v1.0.15', [
    'Built and shipped end-to-end, solo: Ed25519 licensing, hard online verification, auto-update proven in production, and an E2EE cloud-sync vault on Cloudflare R2.',
  ])
  item('nlj.dev: this site', 'React · WASM · Cloudflare Workers', [
    'A working retro OS in the browser; every app is real, including a terminal that runs the real Kedge engine and a prompt-injection-hardened LLM proxy at the edge.',
  ])

  // ── skills ──
  section('Skills')
  const skills = [
    ['Languages', 'Rust · TypeScript · JavaScript · Python'],
    ['Systems', 'WebAssembly · eBPF · Tree-sitter · SQLite'],
    ['AI infra', 'LLM agent harnesses · MCP protocol · taint tracking · prompt-injection defense'],
    ['Edge / Web', 'Cloudflare Workers · React · Tauri · Vite'],
  ]
  skills.forEach(([k, v]) => {
    text(k, M, { size: 9.5, style: 'bold' })
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(...INK)
    doc.text(v, M + 78, y)
    gap(15)
  })

  // ── footer ──
  gap(10)
  doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(...MUTE)
  doc.text('Generated from nlj.dev. The whole site is a working OS I built.', M, y)

  // jsPDF draws past the bottom of the page without complaining or adding one,
  // so an extra bullet silently loses whatever it pushed off. Adding content
  // above means checking this. The returned y is the cursor after the footer.
  const limit = doc.internal.pageSize.getHeight()
  if (y > limit) {
    console.warn(`[resume] content runs ${Math.round(y - limit)}pt past the page; trim a bullet`)
  }

  doc.save('Noel-Jackson-Resume.pdf')
  return { y, limit }
}
