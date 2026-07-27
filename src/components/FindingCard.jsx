import './findings.css'

// One measured result. Used by both the home teaser and the project page, so
// the two can never render the same finding differently.
export default function FindingCard({ f }) {
  return (
    <article className="fx-card">
      <header className="fx-top">
        <span className="fx-n">{f.n}</span>
        <span className="fx-tag">{f.tag}</span>
      </header>

      <h3 className="fx-q">{f.question}</h3>

      <div className="fx-stat">
        <span className="fx-big">{f.stat.big}</span>
        <span className="fx-unit">{f.stat.unit}</span>
        <span className="fx-sub">{f.stat.sub}</span>
      </div>

      <dl className="fx-fields">
        <dt>Claim</dt>
        <dd>{f.claim}</dd>

        <dt>
          Kill criterion <span className="fx-first">written first</span>
        </dt>
        <dd>{f.kill}</dd>

        <dt>Result</dt>
        <dd>{f.result}</dd>

        <dt className="fx-dt-wrong">What went wrong</dt>
        <dd>{f.wrong}</dd>
      </dl>

      <pre className="fx-cmd">
        <code>{f.cmd}</code>
      </pre>
    </article>
  )
}

export function OpenQuestions({ questions }) {
  if (!questions?.length) return null
  return (
    <div className="fx-open">
      <h3 className="fx-open-h">Still open</h3>
      <ul className="fx-open-list">
        {questions.map((o) => (
          <li key={o.id}>
            <span className="fx-open-q">{o.q}</span>
            <span className="fx-open-why">{o.why}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
