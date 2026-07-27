import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { PROJECTS, findingsFor } from '../content/projects.js'
import './pages.css'

export default function Work() {
  return (
    <PageShell
      kicker="Work"
      title={
        <>
          Software, and what it <em>measured</em>.
        </>
      }
      lede="Each of these is running software, not a case study. Where a project has published results, the page states the claim, the threshold for failure written before the measurement, and the command that regenerates the number."
    >
      <ul className="pg-index">
        {PROJECTS.map((p) => {
          const n = findingsFor(p).length
          return (
            <li key={p.slug}>
              <Link to={`/work/${p.slug}`} className="pg-index-row">
                <span className="pg-index-l">
                  <span className="pg-index-kicker">{p.kicker}</span>
                  <span className="pg-index-name">{p.name}</span>
                  <span className="pg-index-tag">{p.tagline}</span>
                </span>
                <span className="pg-index-r">
                  <span className={`pg-status pg-status-${p.status}`}>{p.status}</span>
                  <span className="pg-index-count">
                    {/* "no published results" is accurate under the findings
                        model and wrong about WorldFrame, which is a shipped,
                        paid product. Judging a commercial release by whether it
                        published a benchmark makes it look weaker than an
                        unfinished experiment. Not every project owes the same
                        kind of evidence. */}
                    {n > 0
                      ? `${n} finding${n === 1 ? '' : 's'}`
                      : p.site
                        ? 'shipped · in customers’ hands'
                        : 'no published results'}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </PageShell>
  )
}
