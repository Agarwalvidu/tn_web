'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPublicCohorts } from '../../lib/api';
import { getUser } from '../../lib/auth';
import { Spinner, Alert, Empty } from '../ui/Common';
import '../ui/tn.css';

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
    if (user) return null;
    return <Link href={`/login?cohort=${c._id}&name=${encodeURIComponent(c.name)}`} className="tn-btn">Login to join <i className="fas fa-arrow-right" /></Link>;
  };

  return (
    <div className="tn-page">
      <div className="tn-container">
        <div className="tn-hero">
          <div>
            <h1>Choose your cohort</h1>
            <p>Pick the track you want to learn. Your mentor adds you and gives you your login.</p>
          </div>
        </div>

        {error && <Alert>{error}</Alert>}
        {!cohorts && !error && <Spinner />}
        {cohorts && cohorts.length === 0 && <div className="tn-card"><Empty icon="fa-layer-group">No cohorts are open yet. Check back soon.</Empty></div>}

        {cohorts && cohorts.length > 0 && (
          <div className="tn-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {cohorts.map((c) => (
              <div key={c._id} className="tn-card" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                <h2>{c.name}</h2>
                <p style={{ flexGrow: 1, lineHeight: 1.6 }}>{c.description || 'Learn with mentors and peers.'}</p>
                <div className="tn-muted" style={{ margin: '0.5rem 0 1rem' }}>
                  <div><i className="fas fa-chalkboard-teacher" /> {c.mentors.length ? c.mentors.join(', ') : 'Mentor to be assigned'}</div>
                  <div><i className="fas fa-user-graduate" /> {c.menteeCount} mentee{c.menteeCount === 1 ? '' : 's'}</div>
                </div>
                {cta(c)}
              </div>
            ))}
          </div>
        )}

        <p className="tn-muted" style={{ textAlign: 'center', marginTop: '2rem' }}>
          Want to mentor a cohort? <Link href="/login" style={{ color: '#296c9e', fontWeight: 600 }}>Request mentor access</Link>.
        </p>
      </div>
    </div>
  );
}
