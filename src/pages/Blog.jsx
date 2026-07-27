import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { POSTS } from '../content/posts.js'
import { projectBySlug } from '../content/projects.js'
import './pages.css'

export default function Blog() {
  return (
    <PageShell
      kicker="Writing"
      title={
        <>
          Design notes, not <em>project cards</em>.
        </>
      }
      lede="How something works and why it was built that way. These are arguments. Anything with a number in it lives under Work, where every figure has to regenerate from a command."
    >
      <ul className="pg-index">
        {POSTS.map((p) => {
          const project = projectBySlug(p.project)
          return (
            <li key={p.slug}>
              <Link to={`/blog/${p.slug}`} className="pg-index-row">
                <span className="pg-index-l">
                  <span className="pg-index-kicker">{p.tag}</span>
                  <span className="pg-index-name">{p.title}</span>
                  <span className="pg-index-tag">{p.tldr}</span>
                </span>
                <span className="pg-index-r">
                  <span className="pg-index-count">{project?.name || p.project}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </PageShell>
  )
}
