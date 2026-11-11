/**
 * TechNeeds 2.0: transparent, rule-based points.
 *
 * Nothing in here is decided by AI. The same inputs always give the same ranking.
 *
 * Per cohort, a mentee earns:
 *   - Quiz:     round(score / maxScore * 100)  per submitted quiz
 *   - On time:  +10 for every quiz submitted inside its window
 *   - Video:    +5 for every lecture video marked complete
 *   - Project:  round(score / maxScore * 100)  per mentor-verified project
 *
 * Ranking: total points (high to low). Tie-break: whoever reached their
 * current total first (earliest last activity). Then name, for a stable order.
 */

const POINTS = {
  QUIZ_MAX: 100,
  ON_TIME_BONUS: 10,
  VIDEO: 5,
  PROJECT_MAX: 100,
};

const clamp01 = (n) => Math.min(1, Math.max(0, n));

function quizPoints(score, maxScore, onTime) {
  const pct = maxScore > 0 ? clamp01(score / maxScore) : 0;
  return {
    base: Math.round(pct * POINTS.QUIZ_MAX),
    bonus: onTime ? POINTS.ON_TIME_BONUS : 0,
  };
}

function projectPoints(score, maxScore) {
  const pct = maxScore > 0 ? clamp01(score / maxScore) : 0;
  return Math.round(pct * POINTS.PROJECT_MAX);
}

const t = (d) => (d ? new Date(d).getTime() : null);

/**
 * @param {object} input
 * @param {Array}  input.mentees      [{ _id, name, enrollmentNumber, avatar, streak }]
 * @param {Array}  input.submissions  [{ mentee, score, maxScore, onTime, submittedAt }]
 * @param {Array}  input.videos       [{ mentee, completedOn }]
 * @param {Array}  input.projects     [{ mentee, score, maxScore, completedOn }]
 * @returns {Array} rows sorted best first, each with a 1-based rank
 */
function buildLeaderboard({ mentees = [], submissions = [], videos = [], projects = [] }) {
  const rows = new Map();
  for (const m of mentees) {
    rows.set(String(m._id), {
      menteeId: String(m._id),
      name: m.name,
      enrollmentNumber: m.enrollmentNumber,
      avatar: m.avatar || '',
      streak: m.streak || 0,
      points: 0,
      breakdown: { quiz: 0, onTime: 0, video: 0, project: 0 },
      quizzesCompleted: 0,
      videosCompleted: 0,
      lastActivity: null,
    });
  }

  const touch = (row, when) => {
    const ts = t(when);
    if (ts !== null && (row.lastActivity === null || ts > row.lastActivity)) row.lastActivity = ts;
  };

  for (const s of submissions) {
    const row = rows.get(String(s.mentee));
    if (!row) continue;
    const p = quizPoints(s.score || 0, s.maxScore || 0, s.onTime);
    row.breakdown.quiz += p.base;
    row.breakdown.onTime += p.bonus;
    row.quizzesCompleted += 1;
    touch(row, s.submittedAt);
  }
  for (const v of videos) {
    const row = rows.get(String(v.mentee));
    if (!row) continue;
    row.breakdown.video += POINTS.VIDEO;
    row.videosCompleted += 1;
    touch(row, v.completedOn);
  }
  for (const pr of projects) {
    const row = rows.get(String(pr.mentee));
    if (!row) continue;
    row.breakdown.project += projectPoints(pr.score || 0, pr.maxScore || 0);
    touch(row, pr.completedOn);
  }

  const list = [...rows.values()].map((r) => ({
    ...r,
    points: r.breakdown.quiz + r.breakdown.onTime + r.breakdown.video + r.breakdown.project,
  }));

  list.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    // earlier last activity wins; people with no activity go last
    if (a.lastActivity !== b.lastActivity) {
      if (a.lastActivity === null) return 1;
      if (b.lastActivity === null) return -1;
      return a.lastActivity - b.lastActivity;
    }
    return String(a.name).localeCompare(String(b.name));
  });

  return list.map((r, i) => ({ ...r, rank: i + 1 }));
}

/**
 * Badges are rule-based, never AI-decided.
 * stats = {
 *   quizResults: [{ pct, onTime }],
 *   videosCompleted, streak, bestRank (1 = top, null if none), cohortCount, totalPoints
 * }
 */
function computeBadges(stats) {
  const quizzes = stats.quizResults || [];
  const onTimeCount = quizzes.filter((q) => q.onTime).length;
  const defs = [
    { id: 'first-quiz', icon: 'fa-flag-checkered', name: 'First Quiz', description: 'Submit your first quiz', earned: quizzes.length >= 1 },
    { id: 'perfect-score', icon: 'fa-bullseye', name: 'Perfect Score', description: 'Score 100% on a quiz', earned: quizzes.some((q) => q.pct >= 100) },
    { id: 'on-time-3', icon: 'fa-clock', name: 'On-Time Streak', description: 'Submit 3 quizzes on time', earned: onTimeCount >= 3 },
    { id: 'top-3', icon: 'fa-trophy', name: 'Top 3', description: 'Reach the top 3 of a cohort', earned: stats.bestRank !== null && stats.bestRank !== undefined && stats.bestRank <= 3 && (stats.totalPoints || 0) > 0 },
    { id: 'consistent', icon: 'fa-fire', name: 'Consistent Learner', description: 'Keep a 3-day learning streak', earned: (stats.streak || 0) >= 3 },
    { id: 'binge', icon: 'fa-circle-play', name: 'Video Explorer', description: 'Complete 2 lecture videos', earned: (stats.videosCompleted || 0) >= 2 },
    { id: 'all-rounder', icon: 'fa-layer-group', name: 'All-Rounder', description: 'Earn points in 2 cohorts', earned: (stats.cohortsWithPoints || 0) >= 2 },
  ];
  return defs;
}

module.exports = { POINTS, quizPoints, projectPoints, buildLeaderboard, computeBadges };
