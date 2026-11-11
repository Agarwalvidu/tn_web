'use client';

import './tn.css';

export function Spinner() {
  return (
    <div className="tn-spinner-wrap">
      <div className="tn-spinner" aria-label="Loading" />
    </div>
  );
}

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  return <div className={`tn-alert ${type}`} role={type === 'error' ? 'alert' : 'status'}>{children}</div>;
}

export function Empty({ icon = 'fa-inbox', children }) {
  return (
    <div className="tn-empty">
      <i className={`fas ${icon}`} />
      {children}
    </div>
  );
}

export function RankBadge({ rank }) {
  return <span className={`tn-rank${rank <= 3 ? ` r${rank}` : ''}`}>{rank}</span>;
}

export function HowPoints() {
  return (
    <details style={{ marginBottom: '1rem' }}>
      <summary style={{ cursor: 'pointer', color: '#296c9e', fontWeight: 600 }}><i className="fas fa-circle-info" /> How points work</summary>
      <ul className="tn-list tn-muted" style={{ marginTop: '0.6rem' }}>
        <li>Quiz: up to <strong>100</strong> points, proportional to your score.</li>
        <li>On-time bonus: <strong>+10</strong> for each quiz submitted before its deadline.</li>
        <li>Lecture video marked complete: <strong>+5</strong>.</li>
        <li>Mentor-verified project: up to <strong>100</strong>.</li>
        <li>Ties are broken by who reached their total first. Ranks are rule-based, never decided by AI.</li>
      </ul>
    </details>
  );
}
