'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleGuard, handleAuthError } from '../../lib/useAuth';
import { getMenteeDashboard } from '../../lib/api';
import { formatDateTime } from '../../lib/video';
import Avatar from '../ui/Avatar';
import { Spinner, Alert, Empty } from '../ui/Common';
import '../ui/tn.css';

const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);

export default function MenteeDashboard() {
  const router = useRouter();
  const { ready, token } = useRoleGuard('mentee');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    getMenteeDashboard(token)
      .then(setData)
      .catch((err) => {
        if (!handleAuthError(err, router)) setError(err.message);
      });
  }, [ready, token, router]);

  if (!ready || (!data && !error)) return <div className="tn-page"><Spinner /></div>;

  return (
    <div className="tn-page">
      <div className="tn-container">
        {error && <Alert>{error}</Alert>}
        {data && (
          <>
            <div className="tn-hero">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Avatar avatarKey={data.avatar} name={data.name} size={60} />
                <div>
                  <h1>Welcome, {data.name.split(' ')[0]}</h1>
                  <p>{data.enrollmentNumber}</p>
                </div>
              </div>
              <Link href="/profile" className="tn-btn-outline" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: '#fff' }}>
                <i className="fas fa-id-badge" /> My AI Profile
              </Link>
            </div>

            <div className="tn-grid-stats">
              <div className="tn-stat"><div className="tn-stat-label">Total points</div><div className="tn-stat-value">{data.totalPoints}</div></div>
              <div className="tn-stat"><div className="tn-stat-label">Best rank</div><div className="tn-stat-value">{data.bestRank ? `#${data.bestRank}` : '-'}</div></div>
              <div className="tn-stat"><div className="tn-stat-label">Day streak</div><div className="tn-stat-value">{data.streak} <i className="fas fa-fire" style={{ color: '#f39c12', fontSize: '1.3rem' }} /></div></div>
              <div className="tn-stat"><div className="tn-stat-label">Cohorts</div><div className="tn-stat-value">{data.cohorts.length}</div></div>
            </div>

            {data.nextDeadline && (
              <Alert type="warn">
                <i className="fas fa-hourglass-half" /> Next quiz deadline: <strong>{data.nextDeadline.title}</strong> ({data.nextDeadline.cohort}) closes {formatDateTime(data.nextDeadline.deadline)}.
              </Alert>
            )}

            <div className="tn-card">
              <h2>My cohorts</h2>
              {data.cohorts.length === 0 ? (
                <Empty icon="fa-layer-group">
                  You are not in a cohort yet.<br />
                  <Link href="/cohorts" style={{ color: '#296c9e', fontWeight: 600 }}>Browse cohorts</Link>, then ask the cohort&apos;s mentor to add you.
                </Empty>
              ) : (
                <div className="tn-grid">
                  {data.cohorts.map((c) => {
                    const done = c.quizzesCompleted + c.videosCompleted;
                    const total = c.totalQuizzes + c.totalVideos;
                    return (
                      <div key={c._id} className="tn-card" style={{ margin: 0, border: '1px solid #e3eaf1', boxShadow: 'none' }}>
                        <h3>{c.name}</h3>
                        <div className="tn-muted" style={{ marginBottom: '0.6rem' }}>
                          Rank <strong>#{c.rank}</strong> of {c.of} &middot; <strong>{c.points}</strong> pts
                        </div>
                        <div className="tn-progress"><div style={{ width: `${pct(done, total)}%` }} /></div>
                        <div className="tn-muted" style={{ margin: '0.4rem 0 0.9rem' }}>{done} of {total} activities done</div>
                        <Link href={`/cohort/${c._id}`} className="tn-btn tn-btn-sm">Open cohort <i className="fas fa-arrow-right" /></Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {data.pending.length > 0 && (
              <div className="tn-card">
                <h2>Up next</h2>
                <ul className="tn-list">
                  {data.pending.map((p, i) => (
                    <li key={i}>
                      <i className={`fas ${p.type === 'quiz' ? 'fa-pen-to-square' : 'fa-circle-play'}`} style={{ color: '#296c9e', marginRight: 6 }} />
                      {p.type === 'quiz' ? 'Take' : 'Watch'} <strong>{p.title}</strong> <span className="tn-muted">({p.cohort})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
