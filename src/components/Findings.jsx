import { Link } from 'react-router-dom'
import FindingCard from './FindingCard.jsx'
import { FINDINGS } from '../content/projects.js'
import './findings.css'

// Home-page teaser. The full set lives on each project page — this shows the
// two that carry the most weight and sends the reader there, rather than
// reprinting everything above the fold.
const TEASER = ['authority-cut', 'red-team']

export default function Findings() {
  const shown = TEASER.map((id) => FINDINGS[id]).filter(Boolean)

  return (
    <section className="xs-section" id="findings">
      <div className="xs-section-head">
        <span className="xs-section-kicker">Findings</span>
        <h2 className="xs-h2">What was claimed, what was measured, what broke.</h2>
        <p className="fx-lede">
          Each entry states a claim, the threshold for calling it a failure written{' '}
          <em>before</em> the measurement, the number that came back, and what went wrong getting
          there. Every figure regenerates from the command shown.
        </p>
      </div>

      <div className="fx">
        {shown.map((f) => (
          <FindingCard f={f} key={f.id} />
        ))}
      </div>

      <div className="fx-more">
        <Link to="/work">All results, by project →</Link>
      </div>
    </section>
  )
}
