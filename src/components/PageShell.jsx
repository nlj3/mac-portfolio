import { Link } from 'react-router-dom'
import './pageshell.css'

// The frame every routed page sits in. Deliberately quieter than the home
// surface: a reader who followed a link to one project or one post should get
// the thing they came for, not the whole portfolio again.
export default function PageShell({ kicker, title, lede, meta, back, children }) {
  return (
    <div className="ps">
      <div className="ps-grid" aria-hidden="true" />

      <header className="ps-nav">
        <Link className="ps-brand" to="/">
          nlj<span className="ps-brand-dot">.</span>dev
        </Link>
        <nav className="ps-links">
          <Link to="/work">Work</Link>
          <Link to="/blog">Writing</Link>
          <a href="https://github.com/nlj3" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
      </header>

      <main className="ps-main">
        <div className="ps-head">
          {back && (
            <Link className="ps-back" to={back.to}>
              ← {back.label}
            </Link>
          )}
          {kicker && <p className="ps-kicker">{kicker}</p>}
          <h1 className="ps-title">{title}</h1>
          {lede && <p className="ps-lede">{lede}</p>}
          {meta && <div className="ps-meta">{meta}</div>}
        </div>

        {children}
      </main>

      <footer className="ps-footer">
        <span>Noel Jackson III</span>
        <span className="ps-footer-r">
          <a href="https://github.com/nlj3" target="_blank" rel="noreferrer">
            github.com/nlj3
          </a>
        </span>
      </footer>
    </div>
  )
}
