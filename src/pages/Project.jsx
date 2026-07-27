import { Link, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import FindingCard, { OpenQuestions } from '../components/FindingCard.jsx'
import { findingsFor, projectBySlug, questionsFor } from '../content/projects.js'
import { postsForProject } from '../content/posts.js'
import './pages.css'

export default function Project() {
  const { slug } = useParams()
  const project = projectBySlug(slug)

  if (!project) {
    return (
      <PageShell
        kicker="404"
        title="No such project."
        lede="That slug doesn't match anything in the registry."
        back={{ to: '/work', label: 'All work' }}
      />
    )
  }

  const findings = findingsFor(project)
  const questions = questionsFor(project)
  const posts = postsForProject(project.slug)

  return (
    <PageShell
      kicker={project.kicker}
      title={project.name}
      lede={project.lede}
      back={{ to: '/work', label: 'All work' }}
      meta={
        <>
          <span className={`pg-status pg-status-${project.status}`}>{project.status}</span>
          {project.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer">
              Source ↗
            </a>
          )}
          {project.site && (
            <a href={project.site} target="_blank" rel="noreferrer">
              Live site ↗
            </a>
          )}
        </>
      }
    >
      {project.facts?.length > 0 && (
        <div className="pg-facts">
          {project.facts.map(([n, label]) => (
            <div className="pg-fact" key={label}>
              <span className="pg-fact-n">{n}</span>
              <span className="pg-fact-l">{label}</span>
            </div>
          ))}
        </div>
      )}

      {findings.length > 0 ? (
        <section className="pg-section">
          <div className="pg-section-head">
            <h2 className="pg-h2">Results</h2>
            <p className="pg-section-sub">
              Each one states the claim, the threshold for calling it a failure written{' '}
              <em>before</em> the measurement, the number that came back, and what went wrong
              getting there. Every figure regenerates from the command shown
              {project.branch && (
                <>
                  {' '}
                  — branch <code>{project.branch}</code>
                </>
              )}
              .
            </p>
          </div>
          <div className="fx">
            {findings.map((f) => (
              <FindingCard f={f} key={f.id} />
            ))}
          </div>
          <OpenQuestions questions={questions} />
        </section>
      ) : (
        <section className="pg-section">
          <p className="pg-empty">
            No measured results published for this one yet — it shipped before the findings format
            existed. Saying so beats back-filling numbers that were never recorded at the time.
          </p>
        </section>
      )}

      {posts.length > 0 && (
        <section className="pg-section">
          <div className="pg-section-head">
            <h2 className="pg-h2">Writing</h2>
            <p className="pg-section-sub">
              Design notes on this project. Arguments, not measurements.
            </p>
          </div>
          <ul className="pg-postlist">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link to={`/blog/${p.slug}`}>
                  <span className="pg-post-tag">{p.tag}</span>
                  <span className="pg-post-title">{p.title}</span>
                  <span className="pg-post-tldr">{p.tldr}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  )
}
