'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPublicCohorts } from '../../lib/api';
import { getUser } from '../../lib/auth';
import { Spinner, Alert, Empty } from '../ui/Common';
import '../ui/tn.css';

const ICONS = ['fa-code', 'fa-microchip', 'fa-brain', 'fa-mobile-screen', 'fa-vr-cardboard', 'fa-database'];

export default function CohortList() {
  const [cohorts, setCohorts] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
    getPublicCohorts().then(setCohorts).catch((e) => setError(e.message));
  }, []);

  const cta = (c) => {
    if (user && user.role === 'mentee') return <Link href={`/cohort/${c._id}`} className="tn-btn">Open cohort <i className="fas fa-arrow-right" /></Link>;
    if (user) return <span className="tn-muted">Mentees join via their mentor</span>;
    return <Link href={`/login?cohort=${c._id}&name=${encodeURIComponent(c.name)}`} className="tn-btn">Log in to join <i className="fas fa-arrow-right" /></Link>;
  };

  return (
    <div className="tn-page">
      <div className="tn-container">
        <div className="tn-hero">
          <div>
            <span className="tn-eyebrow"><i className="fas fa-compass" /> Explore</span>
            <h1>Choose your cohort</h1>
            <p>Pick the track you want to learn. Your mentor adds you and gives you your login.</p>
          </div>
        </div>

        {error && <Alert>{error}</Alert>}
        {!cohorts && !error && <Spinner />}
        {cohorts && cohorts.length === 0 && <div className="tn-card"><Empty icon="fa-layer-group">No cohorts are open yet. Check back soon.</Empty></div>}

        {cohorts && cohorts.length > 0 && (
          <div className="tn-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))' }}>
            {cohorts.map((c, i) => (
              <article key={c._id} className="tn-cohort">
                <div className={`tn-cohort-top c${(i % 5) + 1}`}><span className="tn-cohort-icon"><i className={`fas ${ICONS[i % ICONS.length]}`} /></span></div>
                <div className="tn-cohort-body">
                  <h2>{c.name}</h2>
                  <p>{c.description || 'Learn with mentors and peers.'}</p>
                  <div className="tn-cohort-meta">
                    <span><i className="fas fa-chalkboard-user" />{c.mentors.length ? c.mentors.join(', ') : 'Mentor to be assigned'}</span>
                    <span><i className="fas fa-user-graduate" />{c.menteeCount} mentee{c.menteeCount === 1 ? '' : 's'}</span>
                  </div>
                  {cta(c)}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="tn-card" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div><h3 style={{ marginBottom: '0.2rem' }}>Want to mentor a cohort?</h3><span className="tn-muted">Send a request and the admin will review it.</span></div>
          <Link href="/login" className="tn-btn-outline">Request mentor access</Link>
        </div>
      </div>
    </div>
  );
}
