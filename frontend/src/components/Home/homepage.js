'use client';

import Link from 'next/link';
import Image from 'next/image';
import './landing.css';
import Roadmap from './roadmap';
import MeetOurTeam from '../Team/team';
import Testimonials from '../FAQnTest/Testimonials';
import Avatar from '../ui/Avatar';
import ML from '../../assets/ML.png';
import Web from '../../assets/WEB.jpeg';
import Java from '../../assets/JAVA.jpeg';
import AR from '../../assets/ar.png';
import C from '../../assets/C.png';
import app from '../../assets/app.jpg';
import Glimpses from '../../assets/Glimpse.png';

const STATS = [
  ['1200+', 'Trained mentees', 'fa-user-graduate'],
  ['50+', 'Professional mentors', 'fa-chalkboard-user'],
  ['10+', 'Mentorship cohorts', 'fa-layer-group'],
  ['100+', 'Amazing events', 'fa-calendar-check'],
];

const ROLES = [
  { icon: 'fa-user-graduate', name: 'Mentees', tone: 'teal', points: ['Follow a clear learning roadmap', 'Take quizzes and earn points', 'Climb the cohort leaderboard', 'Get an AI Tech Identity profile'] },
  { icon: 'fa-chalkboard-user', name: 'Mentors', tone: 'blue', points: ['Add mentees with auto-generated logins', 'Upload lecture videos in seconds', 'Create quizzes with deadlines', 'See every mentee\u2019s progress live'] },
  { icon: 'fa-shield-halved', name: 'Admins', tone: 'violet', points: ['Approve mentor requests', 'Create cohorts and assign mentors', 'Track engagement and quiz scores', 'Keep everything role-secured'] },
];

const FEATURES = [
  ['fa-wand-magic-sparkles', 'AI Tech Identity', 'A living profile with badges, strengths and what to learn next, built from your real activity.'],
  ['fa-ranking-star', 'Transparent leaderboard', 'Rule-based points anyone can verify. No black-box ranking, ever.'],
  ['fa-pen-to-square', 'Quizzes with deadlines', 'Instant scoring, on-time bonuses and one fair attempt per quiz.'],
  ['fa-circle-play', 'Cohort learning spaces', 'Syllabus, lecture videos and quizzes together in one place.'],
  ['fa-users-gear', 'Mentor toolkit', 'Bulk-add mentees, share credentials safely and track progress.'],
  ['fa-lock', 'Secure by role', 'Admin, mentor and mentee access enforced on every request.'],
];

const COHORTS = [
  { title: 'Web Development', mentor: 'Vidusi Agarwal', image: Web, bg: '#d9f7e4' },
  { title: 'DSA in C/C++', mentor: 'Shefali Kaushal', image: C, bg: '#ffeed8' },
  { title: 'Machine Learning', mentor: 'Sripriya Aggarwal', image: ML, bg: '#ffe4ef' },
  { title: 'DSA in Java', mentor: 'Tavleen Kaur', image: Java, bg: '#fff7cf' },
  { title: 'AR/VR Mentorship', mentor: 'Snighdha', image: AR, bg: '#d8f1ff' },
  { title: 'App Development', mentor: 'Muskan Manvi', image: app, bg: '#f2defc' },
];

export default function Homepage() {
  return (
    <main id="home">
      {/* ───── Hero ───── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <span className="lp-pill"><i className="fas fa-wand-magic-sparkles" /> IGDTUW&apos;s tech mentorship platform</span>
            <h1>Learn with mentors.<br /><span>Level up with your cohort.</span></h1>
            <p>
              TechNeeds brings cohorts, quizzes, a transparent leaderboard and an AI-powered Tech Identity into one place.
              Built by students, for students.
            </p>
            <div className="lp-hero-cta">
              <Link href="/cohorts" className="lp-btn primary">Get started <i className="fas fa-arrow-right" /></Link>
              <a href="#roadmap" className="lp-btn ghost"><i className="fas fa-route" /> See how it works</a>
            </div>
            <div className="lp-hero-proof">
              <div className="lp-faces">
                {['Aarav Singh', 'Diya Patel', 'Sneha Reddy', 'Kabir Khan'].map((n, i) => (
                  <span key={n} style={{ zIndex: 5 - i }}><Avatar avatarKey={['ocean', 'berry', 'sunrise', 'forest'][i]} name={n} size={36} /></span>
                ))}
              </div>
              <span>Join <strong>1200+</strong> mentees already learning</span>
            </div>
          </div>

          {/* Product preview (illustration) */}
          <div className="lp-visual" aria-hidden="true">
            <div className="lp-card board">
              <div className="lp-card-head"><i className="fas fa-ranking-star" /> Web Development <em>Leaderboard</em></div>
              {[['1', 'Aarav Singh', '120', 'ocean'], ['2', 'Diya Patel', '82', 'berry'], ['3', 'Rohan Mehta', '33', 'gold']].map(([r, n, p, a]) => (
                <div className="lp-row" key={r}>
                  <span className={`lp-rank r${r}`}>{r}</span>
                  <Avatar avatarKey={a} name={n} size={30} />
                  <span className="lp-row-name">{n}</span>
                  <strong>{p} <small>pts</small></strong>
                </div>
              ))}
            </div>
            <div className="lp-card ai">
              <div className="lp-card-head"><i className="fas fa-wand-magic-sparkles" /> AI Tech Identity</div>
              <p>You scored 100% in Quiz 1 and kept a 4-day streak. Next, revise React hooks before the next quiz.</p>
              <div className="lp-chips"><span><i className="fas fa-bullseye" /> Perfect Score</span><span><i className="fas fa-fire" /> Consistent</span></div>
            </div>
            <div className="lp-toast"><i className="fas fa-circle-check" /> Quiz submitted <b>+110 pts</b></div>
          </div>
        </div>
      </section>

      {/* ───── Stats ───── */}
      <section className="lp-stats" aria-label="TechNeeds in numbers">
        <div className="lp-stats-inner">
          {STATS.map(([n, l, i]) => (
            <div className="lp-stat" key={l}>
              <span className="lp-stat-icon"><i className={`fas ${i}`} /></span>
              <div><strong>{n}</strong><span>{l}</span></div>
            </div>
          ))}
        </div>
      </section>

      <Roadmap />

      {/* ───── Roles ───── */}
      <section className="lp-section" id="about">
        <div className="lp-wrap">
          <div className="lp-head">
            <span className="lp-eyebrow">One platform</span>
            <h2>Built for every role</h2>
            <p>IGDTUW students&apos; first choice for learning together. Everyone gets exactly the tools they need.</p>
          </div>
          <div className="lp-roles">
            {ROLES.map((r) => (
              <article key={r.name} className={`lp-role ${r.tone}`}>
                <span className="lp-role-icon"><i className={`fas ${r.icon}`} /></span>
                <h3>{r.name}</h3>
                <ul>{r.points.map((p) => <li key={p}><i className="fas fa-check" /> {p}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section className="lp-section alt">
        <div className="lp-wrap">
          <div className="lp-head">
            <span className="lp-eyebrow">Features</span>
            <h2>Everything a cohort needs</h2>
            <p>Gamified, guided and fair, with accountability for both sides.</p>
          </div>
          <div className="lp-features">
            {FEATURES.map(([icon, title, text]) => (
              <article className="lp-feature" key={title}>
                <span className="lp-feature-icon"><i className={`fas ${icon}`} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Cohorts ───── */}
      <section className="lp-section" id="Mentorship">
        <div className="lp-wrap">
          <div className="lp-head">
            <span className="lp-eyebrow">Programs</span>
            <h2>Our mentorship cohorts</h2>
            <p>Pick a track and learn alongside peers, guided by senior mentors.</p>
          </div>
          <div className="lp-cohorts">
            {COHORTS.map((c) => (
              <article className="lp-cohort" key={c.title}>
                <div className="lp-cohort-img" style={{ background: c.bg }}>
                  <Image src={c.image} alt={`${c.title} cohort`} />
                </div>
                <div className="lp-cohort-body">
                  <h3>{c.title}</h3>
                  <span>By {c.mentor}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="lp-center"><Link href="/cohorts" className="lp-btn primary">Explore live cohorts <i className="fas fa-arrow-right" /></Link></div>
        </div>
      </section>

      {/* ───── Glimpse ───── */}
      <section className="lp-section alt" id="Glimpse">
        <div className="lp-wrap">
          <div className="lp-head">
            <span className="lp-eyebrow">Moments</span>
            <h2>A glimpse of TechNeeds</h2>
          </div>
          <div className="lp-glimpse"><Image src={Glimpses} alt="Moments from TechNeeds events" /></div>
        </div>
      </section>

      {/* ───── Team ───── */}
      <section className="tn-team" id="team"><MeetOurTeam /></section>

      {/* ───── Testimonials ───── */}
      <Testimonials limit={6} />

      {/* ───── CTA ───── */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <h2>Ready to level up?</h2>
          <p>Choose your cohort, meet your mentor and start earning points today.</p>
          <div className="lp-hero-cta" style={{ justifyContent: 'center' }}>
            <Link href="/cohorts" className="lp-btn primary light">Get started <i className="fas fa-arrow-right" /></Link>
            <Link href="/login" className="lp-btn ghost">Log in / Become a mentor</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
