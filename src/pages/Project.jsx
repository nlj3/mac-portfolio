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

      {project.crates?.length > 0 && (
        <section className="pg-section">
          <div className="pg-section-head">
            <h2 className="pg-h2">What is in it</h2>
            <p className="pg-section-sub">
              {project.crates.reduce((n, g) => n + g.items.length, 0)} crates. Each description is
              the crate&rsquo;s own, taken from its manifest, so this page cannot describe the
              workspace differently from the workspace.
            </p>
          </div>
          <div className="pg-crates">
            {project.crates.map((g) => (
              <div className="pg-crate-group" key={g.group}>
                <div className="pg-crate-head">
                  <h3 className="pg-crate-h">{g.group}</h3>
                  <p className="pg-crate-blurb">{g.blurb}</p>
                </div>
                <ul className="pg-crate-list">
                  {g.items.map(([name, desc, unpublished]) => (
                    <li key={name}>
                      <span className="pg-crate-n">
                        {name}
                        {unpublished && <span className="pg-crate-wip">not published</span>}
                      </span>
                      <span className="pg-crate-d">{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it works, for the project whose promise is about your data. A
          feature list says what it does; this says what it does it with, which
          is the part that can be checked. */}
      {project.architecture?.length > 0 && (
        <section className="pg-section">
          <div className="pg-section-head">
            <h2 className="pg-h2">How it works</h2>
            <p className="pg-section-sub">
              Read out of the source rather than recalled, so the page cannot
              describe an architecture the app does not have.
            </p>
          </div>
          <div className="pg-prose">
            {project.architecture.map((a) => (
              <section key={a.h}>
                <h3 className="pg-prose-h">{a.h}</h3>
                <p className="pg-prose-p">{a.p}</p>
              </section>
            ))}
          </div>
        </section>
      )}

      {project.highlights?.length > 0 && (
        <section className="pg-section">
          <div className="pg-section-head">
            <h2 className="pg-h2">What it does</h2>
          </div>
          <ul className="pg-highlights">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      {findings.length > 0 ? (
        <section className="pg-section">
          <div className="pg-section-head">
            <h2 className="pg-h2">Results</h2>
            <p className="pg-section-sub">
              Each one states the claim, the threshold for calling it a failure written{' '}
              <em>before</em> the measurement, the number that came back, and what went wrong
              getting there. Every figure regenerates from the command shown, on a clean clone
              of the default branch.
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
            No measured results published for this one yet. It shipped before the findings format
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
