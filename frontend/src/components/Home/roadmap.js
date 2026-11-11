'use client';

import Link from 'next/link';
import './roadmap.css';

const STEPS = [
  { icon: 'fa-layer-group', title: 'Join a cohort', text: 'Pick a track. Your mentor adds you and shares your login.' },
  { icon: 'fa-circle-play', title: 'Learn from lectures', text: 'Watch videos, read the syllabus and mark lessons complete.' },
  { icon: 'fa-pen-to-square', title: 'Take quizzes', text: 'Test yourself before each deadline and see your score instantly.' },
  { icon: 'fa-star', title: 'Earn points', text: 'Every quiz, on-time submission and lesson adds to your score.' },
  { icon: 'fa-ranking-star', title: 'Climb the leaderboard', text: 'Transparent, rule-based ranking inside your cohort.' },
  { icon: 'fa-id-badge', title: 'Get your AI Profile', text: 'Badges, strengths and what to learn next, built from your real progress.' },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="rm-section" aria-labelledby="rm-title">
      <h2 id="rm-title" className="rm-title">Your journey, step by step</h2>
      <p className="rm-sub">New here? Follow the path.</p>
      <ol className="rm-path">
        {STEPS.map((s, i) => (
          <li key={s.title} className={`rm-step ${i % 2 === 0 ? 'left' : 'right'}`} style={{ '--i': i }}>
            <div className="rm-card">
              <span className="rm-num">{i + 1}</span>
              <div className="rm-icon"><i className={`fas ${s.icon}`} /></div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="rm-cta">
        <Link href="/cohorts" className="rm-btn">Get started <i className="fas fa-arrow-right" /></Link>
      </div>
    </section>
  );
}
