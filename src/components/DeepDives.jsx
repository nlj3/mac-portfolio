import { Link } from 'react-router-dom'
import { POSTS } from '../content/posts.js'
import './deepdives.css'


export default function DeepDives() {
  return (
    <section className="xs-section" id="writing">
      <div className="xs-section-head">
        <span className="xs-section-kicker">Engineering notes</span>
        <h2 className="xs-h2">Design docs, not project cards.</h2>
      </div>
      <div className="dd">
        {POSTS.map((e) => (
          <details key={e.n} className="dd-item">
            <summary className="dd-summary">
              <span className="dd-n">{e.n}</span>
              <span className="dd-head">
                <span className="dd-tag">{e.tag}</span>
                <span className="dd-title">{e.title}</span>
                <span className="dd-tldr">{e.tldr}</span>
              </span>
              <span className="dd-caret">read →</span>
            </summary>
            <div className="dd-body">
              {e.body.map((b, i) => (
                <div className="dd-block" key={i}>
                  <div className="dd-b-h">{b.h}</div>
                  <p className="dd-b-p">{b.p}</p>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
