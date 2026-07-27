// ═══════════════════════════════════════════════════════════════════
//  WRITING: design notes.
//
//  These explain how something works and why it was built that way. They are
//  arguments, not measurements: a post here makes no claim that needs a
//  command to back it.
//
//  Anything with a NUMBER in it belongs in `projects.js` as a finding, where
//  the house rule applies: every stat regenerable from a command, and a kill
//  criterion written before the measurement. Keeping the two apart is what
//  stops an essay quietly becoming evidence.
//
//  Moved out of DeepDives.jsx so the home page teaser and the /blog page read
//  from one copy. Two copies of a paragraph drift, and the drift looks
//  deliberate.
// ═══════════════════════════════════════════════════════════════════

export const POSTS = [
  {
    n: '01',
    slug: 'skeleton-edit-paradox',
    project: 'kedge',
    tag: 'compaction · agents',
    title: 'The Skeleton-Edit Paradox',
    tldr: 'How signature-preserving elision lets an agent navigate a huge file compacted, then edit it precisely, without re-sending it.',
    body: [
      { h: 'The problem', p: 'To fit a large source file in an agent’s context, kedge-compact elides function bodies and keeps the signatures: the skeleton. But an agent asked to change a body only sees { /* 54 lines elided */ }. It can’t patch code it can’t see. Re-sending the whole file defeats the compaction; leaving it elided makes the edit impossible. That is the skeleton-edit paradox.' },
      { h: 'The approach', p: 'Compaction is reversible and addressable. collect_body_elisions records, for every elided body, the exact source span it replaced, so any single symbol can be re-expanded on demand (kedge expand <symbol>) without re-hydrating the file. The agent reasons against the skeleton to navigate, and JIT-decompacts only the one function it is about to touch. Signatures are never elided, so the call graph and types stay legible even at full compaction.' },
      { h: 'Why it holds', p: 'Expansion is a lookup against a content-addressable cache (kedge-cache), so after the first parse re-expanding a symbol is effectively free. The only extra state is the span map, which is tiny next to the tokens saved. And because compaction is a pure function of the source (same input, same skeleton, same spans), the whole thing stays deterministic.' },
    ],
  },
  {
    n: '02',
    slug: 'verifiable-not-vibes',
    project: 'kedge',
    tag: 'determinism · ledger',
    title: 'Verifiable, not vibes',
    tldr: 'Why a SQLite-WAL event ledger, not a log file, is what makes an autonomous agent loop reproducible, bounded, and auditable.',
    body: [
      { h: 'The problem', p: 'Autonomous loops are non-deterministic: the same prompt takes a different trajectory each run, with no way to prove what happened or reproduce a failure. "It worked on my run" is not an engineering standard, and an unbounded loop is a blank cheque against a token budget.' },
      { h: 'The approach', p: 'Every step of the ReAct loop (kedge-core) is journaled as an append-only event to a SQLite ledger in WAL mode (kedge-ledger): the observation, the tool call, the token cost, the budget remaining. A run is not described. It is recorded. From that journal, kedge-eval replays a recorded trajectory and diffs it against a baseline, turning "did this change behaviour?" into a mechanical check. Budgets are enforced in-loop against the ledger’s running total, so a runaway agent is halted at a hard ceiling, not discovered on the invoice.' },
      { h: 'The trade', p: 'Journaling every step costs a synchronous write, but WAL makes those writes cheap and keeps reads concurrent, and the payoff (reproducibility, cost caps, and forensic audit via kedge-audit) is exactly the line between a demo and infrastructure.' },
    ],
  },
  {
    n: '03',
    slug: 'where-the-sandbox-ends',
    project: 'kedge',
    tag: 'isolation · security',
    title: 'Where the sandbox ends',
    tldr: 'A layered look at isolating agent tools (user-space policy, process groups, and experimental kernel eBPF), with an honest map of what’s shipped vs. analysed.',
    body: [
      { h: 'The problem', p: 'An agent that can run tools can run dangerous tools. Where you draw the isolation boundary decides what a compromised or merely confused agent can actually do to the host.' },
      { h: 'What kedge ships', p: 'First line, user space: kedge-policy blocks disallowed tools and redacts PII before a call is made, and kedge-audit’s Shadow-Guard runs mutating actions as dry-runs first, fail-safe, so anything not provably read-only is intercepted rather than executed. Process isolation: kedge-exec runs subprocesses in their own process groups so a spawned tool can be torn down cleanly. Kernel, experimental (Linux): kedge-probe uses an eBPF LSM via aya to supervise behaviour below user space: the strongest boundary, but Linux-only and still experimental.' },
      { h: 'The comparison (analysis, not a claim)', p: 'Wasmtime gives memory sandboxing for wasm tools, with no ambient authority over the host. seccomp-bpf filters which syscalls a process may make. Landlock restricts filesystem access, unprivileged. These are complementary (memory, syscall, and filesystem boundaries), and the right stack depends on the tool. kedge’s shipped isolation today is the user-space + process + experimental-eBPF layers above; the Wasmtime / seccomp / Landlock comparison is design analysis, not a claim that all three are wired in right now.' },
    ],
  },
  {
    n: '04',
    slug: 'taint-is-the-sensor',
    project: 'foreguard',
    tag: 'provenance · prompt injection',
    title: 'Taint is the sensor; the human is the actuator',
    tldr: 'Why prompt-injection defense belongs at the tool boundary, tracking where data came from rather than what it says, and why the honest version of it escalates instead of promising to block.',
    body: [
      { h: 'The problem', p: 'Prompt injection is the top real risk to autonomous agents (OWASP LLM01), and the usual defenses scan text: classifiers and filters that try to recognise a malicious instruction by how it reads. That is an arms race against natural language, and it is losing. The actual damage is never the sentence. It is the moment a poisoned web page, email, or document turns into a mutating tool call: send this data there, run this command, delete that file.' },
      { h: 'The approach', p: 'Foreguard ignores what the text says and tracks where it came from. Sitting in the MCP stream, it marks the distinctive strings returned by untrusted-source tools (a web fetch, an inbox read, RAG retrieval), then checks every mutating call against those marks. Untrusted data flowing into a state-changing action is exactly Meta’s Agents “Rule of Two” being violated (untrusted input, plus the power to change state, without a human), so that call does not auto-run: it pauses for an explicit decision, showing the concrete effect and the tainted value that triggered it. Taint is the sensor; the human approval gate is the actuator it pulls. Ordering matters: results are tainted before they are forwarded to the host, so by the time the model can act on a page, its provenance is already recorded.' },
      { h: 'The honest limit', p: 'This is best-effort, not sound, and saying so is the point. The proxy sees tool inputs and outputs, not the model’s hidden reasoning, so data the model paraphrases or re-encodes can slip a substring match. What it reliably catches is the common, un-laundered untrusted→mutation flow, and where it is uncertain it fails safe: a tainted mutation with no terminal attached is denied, not executed. A security tool that overstates its guarantee is worse than one that draws the boundary and holds it.' },
    ],
  },
  {
    n: '05',
    slug: 'two-checks-one-check',
    project: 'kedge',
    tag: 'defence in depth · verification',
    title: 'Your two safety checks might be one check',
    tldr: 'I wrote down that requiring two independent checks to agree meant neither could fail silently on its own. Then a tool call read a password file past both of them, because they were the same check asked twice.',
    body: [
      {
        h: 'Four things looked at it, and all four were wrong',
        p: 'A tool call asked to read /etc/shadow. The capability layer, which I had written and described in its own module header as fail-safe, permitted it under a manifest granting exactly one unrelated file. The observer then recorded the run as having exercised no capabilities at all. The verifier replayed the run against the manifest it had just produced and reported an exact fit, no violations, no unused grants. The promotion gate read all of that, marked the skill complete, and promoted it. The manifest it promoted was empty. Four separate things inspected that call. Every one of them agreed, and every one of them was wrong.',
      },
      {
        h: 'What I had written down',
        p: 'The completeness check required two conditions: nothing unnameable, and a verification result of Exact. I wrote the justification into the source and believed it. "Requiring both means neither check silently becomes load-bearing alone if the other\u2019s behaviour changes." That has the shape of an engineering argument. It is not one.',
      },
      {
        h: 'Why it was false',
        p: 'Both checks call the same function. kedge_skill::required maps a tool call to the set of capabilities it needs, and at the time it did that by looking at argument names: path, file_path, dest, and about twenty others. A server that calls its path argument resource produces a call that matches nothing in that table. A call that appears to require nothing is a call that any manifest permits. The observer calls required directly. The verifier replays the trajectory through SkillGuard, which calls required. Two names, one function, one blind spot. The two checks did not agree because they had independently reached the same conclusion. They agreed because they were the same conclusion, asked twice.',
      },
      {
        h: 'The part that stings',
        p: 'I shared that derivation on purpose, and left a comment saying why: "A second implementation here could disagree with the guard, and a manifest the guard then rejects is worse than no manifest at all." That reasoning is still correct. Sharing it was the right call. It is also the exact thing that destroyed the independence I claimed two hours later, in a different comment, without noticing.',
      },
      {
        h: 'The tension nobody resolves',
        p: 'You cannot have both properties. Two layers that share an implementation cannot disagree with each other, which means they also cannot catch each other\u2019s blind spots. Two layers implemented independently can catch each other, and will sometimes disagree, and every disagreement is a bug report someone has to triage. Defence in depth is usually discussed as though adding a layer is free and the benefit accumulates. It is neither. Every layer has some correlation with the layers next to it, and that correlation, not the count, decides whether the layer is doing any work at all. Two signals from one source is one signal, however many times you check it.',
      },
      {
        h: 'What measuring it might look like',
        p: 'Mutation testing gets closest to a number. Introduce a fault deliberately, then count how many of your checks catch it. If a single mutation to one derivation function blinds both the observer and the verifier, then with respect to that fault they were one check, and you have measured it rather than asserted it. The useful consequence is that redundancy is per-fault, not global. Two layers can be genuinely independent for path traversal and perfectly correlated for argument-name coverage, and a single claim that they are "independent" hides that completely.',
      },
      {
        h: 'What I actually did, which is not that',
        p: 'The fix was not a second implementation. It was three layers inside the same function: match the argument name, then match the shape of the value, then match the tool name. That closes the specific hole. A path-shaped string under any key is now seen, and a tool calling itself read_file while naming nothing it would read is refused outright. It is a real improvement and eleven bypasses across two rounds are now regression tests. But it is still one function, and if someone finds a fourth way to hide a path from it, all three layers go blind together exactly as before. I traded a wide hole for a narrow one. I did not buy independence.',
      },
      {
        h: 'Where this leaves me',
        p: 'I do not know how to get real independence here without a second derivation and the drift it brings, and I have not tried it. The mutation idea is untested. It may turn out that maintaining a deliberately divergent second implementation costs more than the blind spot it finds. One thing I am sure of: if you have written down that two checks protect each other, you have made a claim about their correlation, and you have probably not measured it. I had not. It took twenty minutes to find out.',
      },
    ],
  },
]

export const postBySlug = (slug) => POSTS.find((p) => p.slug === slug)
export const postsForProject = (project) => POSTS.filter((p) => p.project === project)
