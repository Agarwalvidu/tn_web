'use client';

import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import Avatar, { AVATAR_KEYS } from '../ui/Avatar';
import { Alert, Empty } from '../ui/Common';
import { formatDateTime } from '../../lib/video';
import '../ui/tn.css';

/**
 * The AI Tech Identity page. Stats, rank and badges are rule-based;
 * the summary and recommendations are AI-written (or a template fallback).
 * Pass `onRefresh` / `onAvatar` only for the mentee's own profile; a mentor sees it read-only.
 */
export default function ProfileView({ profile, ai, onRefresh, onAvatar, busy }) {
  const [picker, setPicker] = useState(false);
  const earned = profile.badges.filter((b) => b.earned);
  const chartData = profile.quizResults.map((q) => ({ name: q.title.length > 14 ? q.title.slice(0, 13) + '…' : q.title, full: q.title, pct: q.pct }));

  return (
    <>
      <div className="tn-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar avatarKey={profile.avatar} name={profile.name} size={72} />
          <div>
            <h1>{profile.name}</h1>
            <p>{profile.enrollmentNumber} &middot; {profile.cohorts.map((c) => c.name).join(', ') || 'No cohort yet'}</p>
          </div>
        </div>
        {onAvatar && (
          <button className="tn-btn-outline" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: '#fff' }} onClick={() => setPicker(!picker)}>
            <i className="fas fa-palette" /> Change avatar
          </button>
        )}
      </div>

      {picker && onAvatar && (
        <div className="tn-card">
          <h3>Choose your avatar</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {AVATAR_KEYS.map((k) => (
              <button key={k} onClick={() => { onAvatar(k); setPicker(false); }} aria-label={`Use ${k} avatar`}
                style={{ background: 'none', border: profile.avatar === k ? '3px solid #296c9e' : '3px solid transparent', borderRadius: '50%', padding: 2, cursor: 'pointer' }}>
                <Avatar avatarKey={k} name={profile.name} size={52} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="tn-grid-stats">
        <div className="tn-stat"><div className="tn-stat-label">Total points</div><div className="tn-stat-value">{profile.totalPoints}</div></div>
        <div className="tn-stat"><div className="tn-stat-label">Best rank</div><div className="tn-stat-value">{profile.bestRank ? `#${profile.bestRank}` : '-'}</div></div>
        <div className="tn-stat"><div className="tn-stat-label">Day streak</div><div className="tn-stat-value">{profile.streak}</div></div>
        <div className="tn-stat"><div className="tn-stat-label">Badges</div><div className="tn-stat-value">{earned.length}/{profile.badges.length}</div></div>
      </div>

      <div className="tn-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <h2 style={{ margin: 0 }}><i className="fas fa-wand-magic-sparkles" style={{ color: '#167F92' }} /> Performance summary</h2>
          {onRefresh && (
            <button className="tn-btn-outline tn-btn-sm" disabled={busy} onClick={onRefresh}>
              <i className={`fas fa-rotate${busy ? ' fa-spin' : ''}`} /> {busy ? 'Updating...' : 'Refresh'}
            </button>
          )}
        </div>
        <p style={{ lineHeight: 1.7, margin: '0.5rem 0 0.75rem' }}>{ai.summary}</p>
        <div className="tn-muted">
          {ai.source === 'ai' ? 'Written by AI from your real activity' : 'Auto-generated from your activity'}
          {ai.generatedAt && ` · ${formatDateTime(ai.generatedAt)}`}
          {!ai.upToDate && ' · your stats changed since (press Refresh)'}
        </div>
      </div>

      <div className="tn-two-col">
        <div className="tn-card">
          <h3><i className="fas fa-thumbs-up" style={{ color: '#1b7a43' }} /> Strengths</h3>
          <ul className="tn-list">{ai.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
        <div className="tn-card">
          <h3><i className="fas fa-seedling" style={{ color: '#9a6200' }} /> Room to grow</h3>
          <ul className="tn-list">{ai.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      </div>

      <div className="tn-card">
        <h2><i className="fas fa-compass" style={{ color: '#296c9e' }} /> What to learn next</h2>
        <div className="tn-grid">
          {ai.recommendations.map((r, i) => (
            <div key={i} style={{ background: '#f4f8fc', borderRadius: 10, padding: '0.9rem 1rem' }}>
              <div style={{ fontWeight: 700, color: '#1a3a5c', marginBottom: 4 }}>{i + 1}. {r.title}</div>
              <div className="tn-muted">{r.reason}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tn-card">
        <h2>Quiz performance</h2>
        {chartData.length === 0 ? (
          <Empty icon="fa-chart-column">No quizzes taken yet. Your scores will appear here.</Empty>
        ) : (
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} labelFormatter={(_, p) => (p && p[0] ? p[0].payload.full : '')} />
                <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.pct >= 75 ? '#167F92' : d.pct >= 50 ? '#296c9e' : '#e67e22'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="tn-card">
        <h2>Badges</h2>
        <div className="tn-badge-grid">
          {profile.badges.map((b) => (
            <div key={b.id} className={`tn-badge${b.earned ? '' : ' locked'}`} title={b.earned ? 'Earned' : 'Locked'}>
              <i className={`fas ${b.icon}`} />
              <div className="tn-badge-name">{b.name}</div>
              <div className="tn-badge-desc">{b.description}</div>
            </div>
          ))}
        </div>
        <p className="tn-muted" style={{ marginTop: '0.9rem' }}>Badges and ranks follow fixed rules. AI only writes the summary and suggestions.</p>
      </div>

      {profile.cohorts.length > 0 && (
        <div className="tn-card">
          <h2>Cohort standings</h2>
          <div className="tn-table-wrap">
            <table className="tn-table">
              <thead><tr><th>Cohort</th><th>Rank</th><th>Points</th><th>Quizzes</th><th>Videos</th></tr></thead>
              <tbody>
                {profile.cohorts.map((c) => (
                  <tr key={c.programId}>
                    <td><strong>{c.name}</strong></td>
                    <td>#{c.rank} of {c.of}</td>
                    <td>{c.points}</td>
                    <td>{c.quizzesCompleted}/{c.totalQuizzes}</td>
                    <td>{c.videosCompleted}/{c.totalVideos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export function ProfileError({ children }) {
  return <Alert>{children}</Alert>;
}
