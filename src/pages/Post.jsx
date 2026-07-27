import { Link, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { postBySlug } from '../content/posts.js'
import { projectBySlug } from '../content/projects.js'
import './pages.css'

export default function Post() {
  const { slug } = useParams()
  const post = postBySlug(slug)

  if (!post) {
    return (
      <PageShell
        kicker="404"
        title="No such post."
        lede="That slug doesn't match anything written."
        back={{ to: '/blog', label: 'All writing' }}
      />
    )
  }

  const project = projectBySlug(post.project)

  return (
    <PageShell
      kicker={post.tag}
      title={post.title}
      lede={post.tldr}
      back={{ to: '/blog', label: 'All writing' }}
      meta={
        project && (
          <>
            <span>on</span>
            <Link to={`/work/${project.slug}`}>{project.name}</Link>
          </>
        )
      }
    >
      <article className="pg-prose">
        {post.body.map((b, i) => (
          <section key={i}>
            <h2 className="pg-prose-h">{b.h}</h2>
            <p className="pg-prose-p">{b.p}</p>
          </section>
        ))}
      </article>

      {project && (
        <div className="pg-nextlink">
          <Link to={`/work/${project.slug}`}>
            See what {project.name} actually measured →
          </Link>
        </div>
      )}
    </PageShell>
  )
}
