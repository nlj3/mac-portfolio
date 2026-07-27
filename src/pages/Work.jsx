import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { PROJECTS, SITE_STATS, findingsFor } from '../content/projects.js'
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
      {/* Moved off the landing page. These are for someone deciding whether the
          work is real, which is a question people ask here, not on arrival. */}
      <div className="pg-facts">
        {SITE_STATS.map((s) => (
          <div className="pg-fact" key={s.label}>
            <span className="pg-fact-n">
              {s.n}
              {s.unit}
            </span>
            <span className="pg-fact-l">{s.label}</span>
          </div>
        ))}
      </div>

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
                    {n > 0 ? `${n} finding${n === 1 ? '' : 's'}` : 'no published results'}
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
