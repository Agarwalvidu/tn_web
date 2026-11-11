const Program = require('../models/Program');
const Resource = require('../models/Resource');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Mentee = require('../models/Mentee');
const { buildLeaderboard, computeBadges } = require('./points');

const quizTotalMarks = (quiz) => (quiz.questions || []).reduce((s, q) => s + (q.marks || 1), 0);

/** Loads everything needed to rank one cohort. */
async function loadCohortData(programId) {
  const program = await Program.findById(programId).lean();
  if (!program) return null;

  const resources = await Resource.find({ program: programId }).sort({ createdAt: 1 }).lean();
  const quizResources = resources.filter((r) => r.type === 'quiz');
  const quizzes = await Quiz.find({ resource: { $in: quizResources.map((r) => r._id) } }).lean();

  const resById = new Map(resources.map((r) => [String(r._id), r]));
  const quizMeta = new Map(); // quizId -> meta
  for (const q of quizzes) {
    const res = resById.get(String(q.resource));
    quizMeta.set(String(q._id), {
      quizId: q._id,
      resourceId: q.resource,
      title: res ? res.title : 'Quiz',
      max: quizTotalMarks(q),
      startTime: q.startTime,
      endTime: q.endTime,
    });
  }

  const mentees = await Mentee.find({ programs: programId })
    .select('name email enrollmentNumber avatar streak completedResources')
    .lean();
  const menteeIds = new Set(mentees.map((m) => String(m._id)));

  const subsRaw = await QuizSubmission.find({ quiz: { $in: [...quizMeta.keys()] } }).lean();
  const submissions = subsRaw
    .filter((s) => menteeIds.has(String(s.mentee)))
    .map((s) => {
      const meta = quizMeta.get(String(s.quiz));
      return {
        mentee: s.mentee,
        quiz: s.quiz,
        resource: s.resource,
        title: meta.title,
        score: s.score || 0,
        maxScore: meta.max,
        onTime: s.onTime !== false,
        submittedAt: s.submittedAt || s.createdAt,
      };
    });

  const videoIds = new Set(resources.filter((r) => r.type === 'video').map((r) => String(r._id)));
  const projectById = new Map(resources.filter((r) => r.type === 'project').map((r) => [String(r._id), r]));
  const videos = [];
  const projects = [];
  for (const m of mentees) {
    for (const c of m.completedResources || []) {
      const rid = String(c.resource);
      if (videoIds.has(rid)) videos.push({ mentee: m._id, resource: c.resource, completedOn: c.completedOn });
      else if (projectById.has(rid) && c.verified)
        projects.push({ mentee: m._id, score: c.score || 0, maxScore: projectById.get(rid).maxScore || 100, completedOn: c.completedOn });
    }
  }

  const rows = buildLeaderboard({ mentees, submissions, videos, projects });
  return { program, resources, quizMeta, mentees, submissions, videos, rows };
}

async function getCohortLeaderboard(programId) {
  const data = await loadCohortData(programId);
  return data ? data.rows : null;
}

/** Everything about one mentee across their cohorts. */
async function getMenteeFacts(menteeId) {
  const mentee = await Mentee.findById(menteeId).lean();
  if (!mentee) return null;

  const cohorts = [];
  const quizResults = [];
  const pending = [];
  let totalPoints = 0;
  let bestRank = null;
  let cohortsWithPoints = 0;
  const now = Date.now();

  for (const programId of mentee.programs || []) {
    const data = await loadCohortData(programId);
    if (!data) continue;
    const row = data.rows.find((r) => r.menteeId === String(menteeId));
    if (!row) continue;

    const mySubs = data.submissions.filter((s) => String(s.mentee) === String(menteeId));
    const quizzes = mySubs
      .map((s) => ({
        title: s.title,
        score: s.score,
        max: s.maxScore,
        pct: s.maxScore > 0 ? Math.round((s.score / s.maxScore) * 100) : 0,
        onTime: s.onTime,
        submittedAt: s.submittedAt,
      }))
      .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    quizResults.push(...quizzes);

    const submittedResourceIds = new Set(mySubs.map((s) => String(s.resource)));
    const doneVideoIds = new Set(
      (mentee.completedResources || []).map((c) => String(c.resource))
    );
    const quizRes = data.resources.filter((r) => r.type === 'quiz');
    const videoRes = data.resources.filter((r) => r.type === 'video');

    for (const q of quizRes) {
      if (submittedResourceIds.has(String(q._id))) continue;
      const meta = [...data.quizMeta.values()].find((m) => String(m.resourceId) === String(q._id));
      const open = meta && (!meta.endTime || new Date(meta.endTime).getTime() > now);
      if (open) pending.push({ type: 'quiz', title: q.title, cohort: data.program.name, deadline: meta.endTime });
    }
    for (const v of videoRes) {
      if (!doneVideoIds.has(String(v._id))) pending.push({ type: 'video', title: v.title, cohort: data.program.name });
    }

    totalPoints += row.points;
    if (row.points > 0) cohortsWithPoints += 1;
    if (bestRank === null || row.rank < bestRank) bestRank = row.rank;

    cohorts.push({
      programId: String(programId),
      name: data.program.name,
      points: row.points,
      rank: row.rank,
      of: data.rows.length,
      breakdown: row.breakdown,
      quizzes,
      quizzesCompleted: mySubs.length,
      totalQuizzes: quizRes.length,
      videosCompleted: row.videosCompleted,
      totalVideos: videoRes.length,
    });
  }

  const videosCompleted = cohorts.reduce((s, c) => s + c.videosCompleted, 0);
  const badges = computeBadges({
    quizResults,
    videosCompleted,
    streak: mentee.streak || 0,
    bestRank,
    cohortsWithPoints,
    totalPoints,
  });

  return {
    mentee,
    cohorts,
    quizResults,
    pending,
    totalPoints,
    bestRank,
    streak: mentee.streak || 0,
    badges,
    videosCompleted,
  };
}

/** Slim, privacy-safe facts for the LLM (no email, no enrollment number). */
function toAiFacts(facts) {
  return {
    firstName: String(facts.mentee.name || 'there').split(' ')[0],
    streak: facts.streak,
    cohorts: facts.cohorts.map((c) => ({
      name: c.name,
      rank: c.rank,
      of: c.of,
      quizzesCompleted: c.quizzesCompleted,
      totalQuizzes: c.totalQuizzes,
      videosCompleted: c.videosCompleted,
      totalVideos: c.totalVideos,
      quizzes: c.quizzes.map((q) => ({ title: q.title, pct: q.pct, onTime: q.onTime })),
    })),
    pending: facts.pending.slice(0, 6).map((p) => ({ type: p.type, title: p.title, cohort: p.cohort })),
  };
}

/** Generates unique sequential enrollment numbers like TN26-0007. */
async function nextEnrollmentNumbers(count, prefix = 'TN26-') {
  const existing = await Mentee.find({ enrollmentNumber: new RegExp('^' + prefix) })
    .select('enrollmentNumber')
    .lean();
  let max = 0;
  for (const e of existing) {
    const n = parseInt(String(e.enrollmentNumber).slice(prefix.length), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return Array.from({ length: count }, (_, i) => `${prefix}${String(max + i + 1).padStart(4, '0')}`);
}

module.exports = { loadCohortData, getCohortLeaderboard, getMenteeFacts, toAiFacts, nextEnrollmentNumbers, quizTotalMarks };
