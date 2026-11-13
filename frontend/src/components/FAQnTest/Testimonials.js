'use client';

import Avatar from '../ui/Avatar';
import testimonials from '../../lib/testimonials.json';
import './Testimonials.css';

const AVATARS = ['ocean', 'berry', 'sunrise', 'forest', 'coral', 'mint', 'gold', 'midnight'];

export default function Testimonials({ limit }) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;
  return (
    <section id="Test" className="ts-section" aria-labelledby="ts-title">
      <div className="lp-wrap">
        <div className="lp-head">
          <span className="lp-eyebrow">Testimonials</span>
          <h2 id="ts-title">What our students say</h2>
          <p>Real words from mentees who learned with TechNeeds.</p>
        </div>
        <div className="ts-grid">
          {items.map((t, i) => (
            <figure className="ts-card" key={t.name}>
              <div className="ts-stars" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((s) => <i key={s} className="fas fa-star" />)}
              </div>
              <blockquote>{t.text}</blockquote>
              <figcaption>
                <Avatar avatarKey={AVATARS[i % AVATARS.length]} name={t.name} size={40} />
                <div><strong>{t.name}</strong><span>TechNeeds mentee</span></div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
