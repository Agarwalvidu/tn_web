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
      <div className="lp-wrap">
        <div className="lp-head">
          <span className="lp-eyebrow">How it works</span>
          <h2 id="rm-title">Your journey, step by step</h2>
          <p>New here? Follow the path from your first login to your AI Tech Identity.</p>
        </div>
        <ol className="rm-path">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`rm-step ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="rm-card">
                <span className="rm-icon"><i className={`fas ${s.icon}`} /></span>
                <div>
                  <span className="rm-num">Step {i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="lp-center">
          <Link href="/cohorts" className="lp-btn primary">Get started <i className="fas fa-arrow-right" /></Link>
        </div>
      </div>
    </section>
  );
}
