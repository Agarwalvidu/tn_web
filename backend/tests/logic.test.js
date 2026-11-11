const assert = require('assert');
const { buildLeaderboard, quizPoints, computeBadges, POINTS } = require('../utils/points');
const { fallbackProfile, validate, statsHash } = require('../utils/ai');

// ---- points
assert.deepStrictEqual(quizPoints(3, 3, true), { base: 100, bonus: 10 });
assert.deepStrictEqual(quizPoints(2, 3, true), { base: 67, bonus: 10 });
assert.deepStrictEqual(quizPoints(1, 3, false), { base: 33, bonus: 0 });
assert.deepStrictEqual(quizPoints(5, 0, true), { base: 0, bonus: 10 }); // no div by zero
assert.strictEqual(quizPoints(9, 3, false).base, 100); // clamped

// ---- ranking (mirrors the web-dev seed data)
const mentees = [
  { _id: 'a', name: 'Aarav', streak: 4 }, { _id: 'b', name: 'Diya', streak: 2 },
  { _id: 'c', name: 'Rohan', streak: 0 }, { _id: 'd', name: 'Zed', streak: 0 },
];
const D = (s) => new Date('2026-11-0' + s);
const rows = buildLeaderboard({
  mentees,
  submissions: [
    { mentee: 'a', score: 3, maxScore: 3, onTime: true, submittedAt: D(5) },   // 100+10
    { mentee: 'b', score: 2, maxScore: 3, onTime: true, submittedAt: D(5) },   // 67+10
    { mentee: 'c', score: 1, maxScore: 3, onTime: false, submittedAt: D(5) },  // 33
  ],
  videos: [{ mentee: 'a', completedOn: D(6) }, { mentee: 'a', completedOn: D(7) }, { mentee: 'b', completedOn: D(6) }],
  projects: [],
});
assert.deepStrictEqual(rows.map((r) => [r.name, r.points, r.rank]), [['Aarav', 120, 1], ['Diya', 82, 2], ['Rohan', 33, 3], ['Zed', 0, 4]]);
assert.strictEqual(rows[0].breakdown.video, 10);

// tie-break: same points -> earlier last activity wins; no activity last
const tie = buildLeaderboard({
  mentees: [{ _id: 'x', name: 'Late' }, { _id: 'y', name: 'Early' }, { _id: 'z', name: 'None' }],
  submissions: [
    { mentee: 'x', score: 1, maxScore: 1, onTime: true, submittedAt: D(9) },
    { mentee: 'y', score: 1, maxScore: 1, onTime: true, submittedAt: D(2) },
  ],
});
assert.deepStrictEqual(tie.map((r) => r.name), ['Early', 'Late', 'None']);

// submissions from people not enrolled are ignored
assert.strictEqual(buildLeaderboard({ mentees: [{ _id: 'a', name: 'A' }], submissions: [{ mentee: 'ghost', score: 1, maxScore: 1, onTime: true }] })[0].points, 0);

// ---- badges
const none = computeBadges({ quizResults: [], videosCompleted: 0, streak: 0, bestRank: 1, totalPoints: 0, cohortsWithPoints: 0 });
assert.ok(none.every((b) => !b.earned), 'rank 1 with 0 points must not earn Top 3');
const some = computeBadges({ quizResults: [{ pct: 100, onTime: true }], videosCompleted: 2, streak: 3, bestRank: 2, totalPoints: 50, cohortsWithPoints: 1 });
assert.deepStrictEqual(some.filter((b) => b.earned).map((b) => b.id).sort(), ['binge', 'consistent', 'first-quiz', 'perfect-score', 'top-3']);

// ---- AI fallback always valid
const facts = { firstName: 'Aarav', streak: 4, pending: [{ type: 'quiz', title: 'Q2', cohort: 'Web' }, { type: 'video', title: 'V3', cohort: 'Web' }],
  cohorts: [{ name: 'Web Dev', rank: 1, of: 4, quizzes: [{ title: 'Quiz 1', pct: 100 }, { title: 'Quiz 0', pct: 40 }], videosCompleted: 2, totalVideos: 2, quizzesCompleted: 2, totalQuizzes: 3 }] };
const fb = fallbackProfile(facts);
assert.ok(validate(fb), 'fallback must pass the same validator as LLM output');
assert.strictEqual(fb.recommendations.length, 3);
const empty = fallbackProfile({ firstName: 'New', streak: 0, pending: [], cohorts: [] });
assert.ok(validate(empty));
// LLM junk is rejected
assert.strictEqual(validate({ summary: 'x' }), null);
assert.strictEqual(validate(null), null);
assert.strictEqual(statsHash(facts), statsHash(JSON.parse(JSON.stringify(facts))));
console.log('ALL LOGIC TESTS PASSED');
