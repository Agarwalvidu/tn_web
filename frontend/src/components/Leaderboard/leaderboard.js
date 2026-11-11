'use client';

import { useCallback, useEffect, useState } from 'react';
import { getPublicCohorts, getPublicLeaderboard } from '../../lib/api';
import Avatar from '../ui/Avatar';
import { Spinner, Alert, Empty, RankBadge, HowPoints } from '../ui/Common';
import '../ui/tn.css';

const REFRESH_MS = 30000; // keeps the board live without a manual reload

export default function Leaderboard() {
  const [cohorts, setCohorts] = useState([]);
  const [cohortId, setCohortId] = useState('');
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicCohorts()
      .then((c) => {
        setCohorts(c);
        if (c.length) setCohortId(c[0]._id);
        else setRows([]);
      })
      .catch((e) => setError(e.message));
  }, []);

  const load = useCallback(() => {
    if (!cohortId) return;
    getPublicLeaderboard(cohortId)
      .then((d) => { setRows(d.rows); setError(''); })
      .catch((e) => setError(e.message));
  }, [cohortId]);

  useEffect(() => {
    if (!cohortId) return;
    setRows(null);
    load();
    const t = setInterval(load, REFRESH_MS);
    return () => clearInterval(t);
  }, [cohortId, load]);

  return (
    <div className="tn-page">
      <div className="tn-container">
        <div className="tn-hero">
          <div>
            <h1><i className="fas fa-ranking-star" /> Leaderboard</h1>
            <p>Rule-based points, updated automatically after every quiz.</p>
          </div>
          {cohorts.length > 0 && (
            <select className="tn-select" style={{ width: 'auto', minWidth: 220 }} value={cohortId} onChange={(e) => setCohortId(e.target.value)} aria-label="Select cohort">
              {cohorts.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          )}
        </div>

        {error && <Alert>{error}</Alert>}

        <div className="tn-card">
          <HowPoints />
          {rows === null && !error ? <Spinner /> : rows && rows.length === 0 ? (
            <Empty icon="fa-users">No mentees in this cohort yet.</Empty>
          ) : rows && (
            <div className="tn-table-wrap">
              <table className="tn-table">
                <thead><tr><th>Rank</th><th>Name</th><th>Quizzes</th><th>Streak</th><th>Points</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.rank}>
                      <td><RankBadge rank={r.rank} /></td>
                      <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar avatarKey={r.avatar} name={r.name} size={30} />{r.name}</span></td>
                      <td>{r.quizzesCompleted}</td>
                      <td>{r.streak > 0 ? <><i className="fas fa-fire" style={{ color: '#f39c12' }} /> {r.streak}</> : '-'}</td>
                      <td><strong>{r.points}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
