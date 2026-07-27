// ═══════════════════════════════════════════════════════════════════
//  PROJECT CONTENT: the single source of truth.
//
//  The home page, the /work index, the /work/<slug> page and the blog all
//  read from here. Two copies of a number eventually disagree, and the
//  disagreement looks like a finding rather than a typo.
//
//  House rule for `findings`: every `stat` must be regenerable from `cmd`.
//  `kill` is the threshold written down BEFORE the measurement. Reporting a
//  good number afterwards is easy; publishing what you'd have accepted as
//  failure, in advance, is the part that costs something. If a finding has no
//  honest `cmd`, it is a design note and belongs in DeepDives instead.
// ═══════════════════════════════════════════════════════════════════

// Site-level headline numbers.
//
// These lived in ExecutiveSurface.jsx as a second copy and had already drifted
// from reality: "16 crates published" when 15 are live, "199 tests passing"
// when 258 pass. Exactly the failure this module exists to prevent, found in
// the module's own blind spot. One copy now.
//
// Every figure re-measured 2026-07-26, and every one has a command:
//
//   crates      crates.io API, kedge* namespace                       -> 15
//   tests       sum of `cargo test --workspace` results               -> 258
//   compaction  `kedge compact` over all 41 crate sources:
//               143,541 -> 62,085 tokens, 81,456 elided, 56.7%
//
// The compaction pair replaces "73,942 tokens compacted (measured from the
// ledger)". The ledger holds zero compaction rows, so that number had no live
// backing. It was a real measurement once and had quietly become folklore.
// The replacement is a full-workspace sweep anyone can re-run.
export const SITE_STATS = [
  { n: '15', unit: '', label: 'crates published' },
  { n: '258', unit: '', label: 'tests passing' },
  { n: '81,456', unit: '', label: 'tokens elided' },
  { n: '56.7', unit: '%', label: 'context reduction' },
]

export const PROJECTS = [
  {
    slug: 'kedge',
    name: 'kedge',
    kicker: 'Rust · agent runtime',
    tagline: 'A deterministic execution harness for AI agents.',
    lede: 'Agents are non-deterministic by construction: the same prompt takes a different path every run, with no way to prove what happened or reproduce a failure. kedge makes a run into a record: journaled, replayable, budget-capped, and auditable.',
    status: 'active',
    repo: 'https://github.com/nlj3/kedge',
    stack: ['Rust', '18-crate workspace', 'SQLite WAL', 'Tree-sitter', 'MCP'],
    facts: [
      ['15', 'crates published'],
      ['43', 'test suites green'],
      ['58.7%', 'context reduction'],
    ],
    // The capability map. Descriptions are lifted from each crate's own
    // Cargo.toml, so the page cannot describe the workspace differently from
    // the workspace. Grouped by what the crate is for rather than
    // alphabetically: a list of 18 names in order teaches nothing.
    //
    // `unpublished: true` marks the three that are deliberately not on
    // crates.io. Saying which is more useful than a count that hides it.
    crates: [
      {
        group: 'Execution',
        blurb: 'The loop itself, and everything that runs inside it.',
        items: [
          ['kedge', 'The CLI and workspace root. The binary you actually run.'],
          ['kedge-core', 'Domain models, ReAct state machine, budget enforcement, error types.'],
          ['kedge-llm', 'OpenAI-compatible reasoner driving the loop: OpenAI, Ollama, vLLM, LM Studio.'],
          ['kedge-mesh', 'Bounded Tokio subagent supervision and multi-agent orchestration.'],
          ['kedge-exec', 'Isolated subprocess runner in its own process group, with auto-detected cargo/go/npm/pytest verification.'],
        ],
      },
      {
        group: 'Context',
        blurb: 'Fitting a large codebase into a small window without lying about it.',
        items: [
          ['kedge-compact', 'Tree-sitter token compactor across Rust, Python, JavaScript, TypeScript and Go.'],
          ['kedge-cache', 'Content-hashed cache of deterministic compaction results. Never caches model output.'],
        ],
      },
      {
        group: 'Record and replay',
        blurb: 'What turns a run into evidence rather than an anecdote.',
        items: [
          ['kedge-ledger', 'SQLite audit logging and deterministic replay of agent trajectories.'],
          ['kedge-eval', 'Event-sourced regression harness. Compares a run against a baseline ledger.'],
          ['kedge-bench', 'A reproducible repair-task suite that generates the trajectories Forge learns from.', true],
        ],
      },
      {
        group: 'Safety',
        blurb: 'Four independent layers, from a TOML file down to the kernel.',
        items: [
          ['kedge-policy', 'User-space guardrails: blocked tools, PII redaction, budgets, from a TOML file.'],
          ['kedge-audit', 'Shadow-Guard dry-run interceptor plus a forensic security report.'],
          ['kedge-hitl', 'Human-in-the-loop gate. Pauses the loop on a high-risk tool and asks.'],
          ['kedge-probe', 'Kernel-level process supervision via eBPF LSM on Linux, with a portable no-op fallback.'],
          ['kedge-skill', 'Deny-by-default capability manifests: declare what a skill may touch, prove it stayed inside.', true],
          ['kedge-forge', 'Derives a least-privilege manifest from a recorded trajectory.', true],
        ],
      },
      {
        group: 'Interop',
        blurb: 'How other things talk to it.',
        items: [
          ['kedge-mcp', 'Native Model Context Protocol client over stdio and streamable HTTP.'],
          ['kedge-server', 'Embedded REST control API: inspect runs, resolve pending approvals.'],
        ],
      },
    ],
    findings: ['adversarial', 'authority-cut', 'empty-ledger', 'red-team', 'oracle-integrity'],
    openQuestions: ['generalization', 'repeated-structure', 'real-vocabularies'],
  },
  {
    slug: 'foreguard',
    name: 'Foreguard',
    kicker: 'Rust · agent security',
    tagline: 'Preview what your AI agent is about to do, before it does it.',
    lede: 'A dry-run trust layer for MCP agents. Point it at the tool calls an agent wants to make and it produces a plan: which calls are read-only, and which would mutate your files, APIs or data, flagged, previewed, and not executed.',
    status: 'shipped',
    repo: 'https://github.com/nlj3/foreguard',
    stack: ['Rust', 'MCP stdio proxy', 'BUSL-1.1'],
    facts: [
      ['84.6%', 'agreement vs declared hints'],
      ['0', 'false negatives across 80 tools'],
      ['10', 'real MCP servers scored'],
    ],
    findings: ['ecosystem-validation'],
    openQuestions: [],
  },
  {
    slug: 'worldframe',
    name: 'WorldFrame',
    kicker: 'Tauri · desktop app',
    tagline: 'The worldbuilding and writing studio you own.',
    lede: 'A static wiki stores facts. WorldFrame links them into a graph, dates them on a calendar you invent, draws them on a map, moves the whole world through time, and lets you write the manuscript inside it. Plain files on your own disk, bought once, with no subscription, no account and no forced AI.',
    status: 'shipped',
    site: 'https://tryworldframe.com',
    stack: ['Rust', 'Tauri', 'React', 'Zustand', 'macOS + Windows'],
    // Counted off the live site rather than recalled. Deliberately absent:
    // the E2EE vault sync, which is built and tested but not yet switched on,
    // and a version number the public site does not state.
    facts: [
      ['16', 'built-in record types, plus custom'],
      ['7', 'relationship layouts'],
      ['0', 'subscriptions, accounts or cloud'],
    ],
    highlights: [
      'Type @ anywhere to link a record or create one inline; every mention becomes a two-way connection.',
      'Pathfinder traces the chain between any two records, across the whole graph.',
      'Family trees with multiple parents, spouses and lines, plus heraldry for flags and emblems.',
      'A calendar you define, a timeline that moves the world through the ages, and navigable maps.',
    ],
    findings: [],
    openQuestions: [],
  },
]

// ── findings: measured results, keyed so a project can reference them ──

export const FINDINGS = {
  adversarial: {
    id: 'adversarial',
    project: 'kedge',
    n: 'F00',
    tag: 'adversarial suite · kedge-bench',
    question: 'Does the capability layer actually stop an attack?',
    claim:
      'A deny-by-default capability manifest blocks forbidden tool calls without blocking legitimate ones.',
    kill: 'Attack success rate alone proves nothing, because `deny everything` scores a perfect zero on it. If the manifest cannot beat both no-protection AND deny-all, it has no result.',
    stat: {
      big: '0 / 10',
      unit: 'attacks reached the tools',
      sub: 'and 0 of 8 legitimate calls were refused',
    },
    result:
      'Sixteen scenarios: ten attacks across indirect prompt injection, secret exfiltration, destructive action, forged authorization and excessive agency, plus six benign controls using the same tools on the same workspace. No protection lets 10 of 10 through. Deny-all blocks all ten and also all eight legitimate calls. The manifest is the only one of the three in the useful corner. A test asserts every attacked tool has a benign counterpart, so a category cannot be quietly "defended" by banning a tool outright.',
    wrong:
      'Two limits, and both matter. These are fixed tool-call sequences, so this measures whether enforcement stops a call, never whether a model can be talked into attempting one: it is a claim about kedge-skill, not about any model. And it is self-graded. I wrote the attacks and the defence, so the suite tests what I thought of. An adversarial pass on the same code found eleven bypasses I had not thought of, three of them created by my own fixes.',
    cmd: 'cargo run -p kedge-bench --example adversarial_report',
  },

  'authority-cut': {
    id: 'authority-cut',
    project: 'kedge',
    n: 'F01',
    tag: 'least privilege · kedge-forge',
    question: 'Can an agent be given less power by watching what it actually did?',
    claim:
      'A skill learned from a recorded run can be granted strictly less authority than the general-purpose agent that produced it, and still do the job.',
    kill: 'If the authority is not measurably smaller, the security half of the thesis is flat. Stop and publish that.',
    stat: {
      big: '67%',
      unit: 'fewer files writable',
      sub: '60 → 20 across 20 tasks · 60 → 25 readable',
    },
    result:
      'Every one of the 20 learned manifests is a reduction individually, not just the aggregate. The comparison understates it on purpose: the baseline agent was given the same commands the skill used, because an unbounded command space cannot be counted, so the measured cut is a floor, not a ceiling. Reported separately and never mixed in, because the metric is filesystem-dependent: on the kedge repo itself, a general agent can write all 140 files.',
    wrong:
      'The first version of the measuring tool reported a wide-open permission set as reaching zero files, a fake result in the single most flattering direction. macOS resolves /var through a symlink, so the manifest and the directory walk were comparing different strings. Both sides canonicalise now.',
    cmd: 'cargo test -p kedge-forge --test authority_reduction -- --nocapture',
  },

  'empty-ledger': {
    id: 'empty-ledger',
    project: 'kedge',
    n: 'F02',
    tag: 'de-risking · kedge-bench',
    question: 'Was there anything to learn from in the first place?',
    claim:
      'The plan I was handed put "turn a recorded run into a reusable skill" at task 2, and "build a benchmark" at task 7.',
    kill: 'Before building any of it: count what is actually in the execution ledger every one of those components reads from.',
    stat: {
      big: '0',
      unit: 'recorded runs',
      sub: '0 steps · 0 events · no eval suite · no fixtures',
    },
    result:
      'Not few. None. The database existed with its schema applied and had never recorded a run, so every component downstream of it had no input and every before/after number was unmeasurable in both directions. The benchmark moved from task 7 to task 1: it is not how the system gets graded, it is how it gets fed. It now produces 20 runs and 110 steps in about 11 seconds at zero API cost, with a byte-identical report fingerprint across consecutive runs.',
    wrong:
      'Nothing. This is the one that went right, and only because the measurement ran before the design instead of after it. Had it run in the order it was given, four components would have been built on top of an empty input.',
    cmd: 'cargo run -p kedge-bench',
  },

  'red-team': {
    id: 'red-team',
    project: 'kedge',
    n: 'F03',
    tag: 'adversarial · kedge-skill',
    question: 'Does the security boundary actually hold?',
    claim:
      'The capability layer is fail-safe: anything not provably permitted is refused. Written in the module header, and repeated in three commit messages.',
    kill: 'Any call that reaches the executor under a manifest that does not grant it is a failure, no matter how contrived the input.',
    stat: {
      big: '11',
      unit: 'bypasses found',
      sub: 'two rounds · about two hours · all fixed',
    },
    result:
      "Round one found seven, including a read of any file on the machine under a manifest granting one single file. The layer recognised path arguments by key name, so a server calling its argument “resource” instead of “path” was invisible to it. Round two attacked round one's fixes and found four more, three of them created by those fixes. Every finding now has a regression test that names it.",
    wrong:
      'The fix for the first bypass reopened the first bypass. Patching it caused file contents to be mistaken for file paths, and I patched that with another list of argument names to ignore, the same broken tool that caused the original hole. Worse: the docs claimed that requiring two independent checks to agree meant neither could be load-bearing alone. Both were built on the same derivation, so they shared the blind spot and agreed with each other while being blind together. Two signals from one source is one signal.',
    cmd: 'cargo test -p kedge-forge --test redteam',
  },

  'oracle-integrity': {
    id: 'oracle-integrity',
    project: 'kedge',
    n: 'F04',
    tag: 'oracle integrity · kedge-bench',
    question: 'Can a benchmark tell a real bug from a fake one?',
    claim: 'A suite of deliberately broken fixtures measures how well an agent repairs code.',
    kill: "Every planted bug must be proven to actually fail the fixture's own tests. A task that is already solved reports as solved, and the solve rate becomes a lie.",
    stat: {
      big: '2',
      unit: 'silent corruptions caught',
      sub: 'before a single trajectory was recorded',
    },
    result:
      "A benchmark fails in two directions and only one is loud. An impossible task shows up as a low score. Obvious. An already-solved task shows up as a high one, and looks like success. The integrity check now adjudicates all 20 planted bugs on every run, and the acceptance oracle is the fixture's own compiler and test suite rather than any predicate written alongside the solver.",
    wrong:
      "The first planted bug changed nothing: swapping > for >= in a clamp is behaviourally identical, since both return the bound at the boundary. It passed. Then a performance optimisation (one shared build directory, measured at 0.10s per task against 0.15s isolated) made every fixture copy resolve to the same compiled artifact, so a pristine copy executed a previously-broken copy's binary and reported failure. Wrong in both directions, bought for 0.05 seconds a task.",
    cmd: 'cargo test -p kedge-bench every_breakage_actually_breaks',
  },

  'ecosystem-validation': {
    id: 'ecosystem-validation',
    project: 'foreguard',
    n: 'F05',
    tag: 'validation · foreguard',
    question: 'Does the classifier agree with servers that declare their own safety?',
    claim:
      'A fail-safe, deny-wins classifier can judge a tool from its name and arguments accurately enough to be useful against real MCP servers.',
    kill: 'A single false negative (a mutating tool judged read-only) invalidates the approach outright. False positives are a usability cost; false negatives are the product failing.',
    stat: {
      big: '0',
      unit: 'false negatives',
      sub: '84.6% agreement · 80 tools · 10 real servers',
    },
    result:
      'Scored against the readOnlyHint each server declares for itself. Six disagreements, all in the safe direction: tools the classifier called mutating that the server called read-only. Root causes were head-only read-verb matching and vocabulary gaps, both since addressed.',
    wrong:
      'A later attempt to close the false positives widened the read-verb match to a two-token window, which let a known-safe verb validate an unknown suffix, a structural bypass traded for ergonomics. Reverted in 0.3.1 with a regression test.',
    cmd: 'cargo test -p kedge-core ecosystem',
  },
}

export const OPEN_QUESTIONS = {
  generalization: {
    id: 'generalization',
    q: 'Does a learned skill work on a job it has never seen?',
    why: 'The central product claim, and unmeasured. Needs a real LLM against held-out tasks. Kill criterion, already written: under 50% and the skill is a recording, not a capability.',
  },
  'repeated-structure': {
    id: 'repeated-structure',
    q: 'Do real agent runs share repeated structure worth extracting?',
    why: 'Rescoped mid-build. The corpus is produced by a scripted solver whose step shapes I authored, so mining it for structure would measure my own authoring habits. It cannot be answered for free after all.',
  },
  'real-vocabularies': {
    id: 'real-vocabularies',
    q: 'How does the capability layer behave against real tool vocabularies?',
    why: 'Unmeasured, and the blocker on releasing it. A tool named read_only_status is already refused for containing the token "read". If that shape is common, the false-refusal rate makes the layer unusable. A security check that refuses ordinary tools is one that gets switched off.',
  },
}

// ── lookups ──

export const projectBySlug = (slug) => PROJECTS.find((p) => p.slug === slug)

export const findingsFor = (project) =>
  (project?.findings || []).map((id) => FINDINGS[id]).filter(Boolean)

export const questionsFor = (project) =>
  (project?.openQuestions || []).map((id) => OPEN_QUESTIONS[id]).filter(Boolean)

export const allFindings = () => Object.values(FINDINGS)
