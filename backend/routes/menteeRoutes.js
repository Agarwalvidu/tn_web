const express = require('express');
const Mentee = require('../models/Mentee');
const Mentor = require('../models/Mentor');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Resource = require('../models/Resource');
const { requireRole } = require('../middleware/requireRole');
const { POINTS, quizPoints } = require('../utils/points');
const { loadCohortData, getMenteeFacts, quizTotalMarks } = require('../utils/standings');
const { buildProfile } = require('../utils/profileService');
const { AVATARS } = require('../utils/avatars');

const router = express.Router();
const menteeAuth = requireRole('mentee');

const isEnrolled = (mentee, programId) =>
  (mentee.programs || []).some((p) => String(p) === String(programId));

// Streak: +1 for each consecutive day with activity
function updateStreak(mentee) {
  const today = new Date().toDateString();
  const last = mentee.lastActiveDate ? new Date(mentee.lastActiveDate).toDateString() : null;
  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    mentee.streak = last === yesterday ? (mentee.streak || 0) + 1 : 1;
    mentee.lastActiveDate = new Date();
  }
}

function quizStatus(meta, submitted) {
  if (submitted) return 'submitted';
  const now = Date.now();
  if (meta.startTime && now < new Date(meta.startTime).getTime()) return 'upcoming';
  if (meta.endTime && now > new Date(meta.endTime).getTime()) return 'closed';
  return 'open';
}

// GET /api/m/dashboard
router.get('/dashboard', menteeAuth, async (req, res) => {
  const facts = await getMenteeFacts(req.user._id);
  if (!facts) return res.status(404).json({ error: 'Mentee not found' });

  const upcoming = facts.pending
    .filter((p) => p.type === 'quiz' && p.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0] || null;

  res.json({
    name: facts.mentee.name,
    enrollmentNumber: facts.mentee.enrollmentNumber,
    avatar: facts.mentee.avatar || '',
    streak: facts.streak,
    totalPoints: facts.totalPoints,
    bestRank: facts.bestRank,
    cohorts: facts.cohorts.map((c) => ({
      _id: c.programId,
      name: c.name,
      points: c.points,
      rank: c.rank,
      of: c.of,
      quizzesCompleted: c.quizzesCompleted,
      totalQuizzes: c.totalQuizzes,
      videosCompleted: c.videosCompleted,
      totalVideos: c.totalVideos,
    })),
    pending: facts.pending.slice(0, 8),
    nextDeadline: upcoming,
  });
});

// GET /api/m/cohorts/:id  - syllabus, videos, quizzes and standings for one cohort
router.get('/cohorts/:id', menteeAuth, async (req, res) => {
  if (!isEnrolled(req.user, req.params.id)) {
    return res.status(403).json({ error: 'You are not enrolled in this cohort' });
  }
  const data = await loadCohortData(req.params.id);
  if (!data) return res.status(404).json({ error: 'Cohort not found' });

  const me = await Mentee.findById(req.user._id).select('completedResources').lean();
  const done = new Map((me.completedResources || []).map((c) => [String(c.resource), c]));
  const mySubs = new Map(
    data.submissions.filter((s) => String(s.mentee) === String(req.user._id)).map((s) => [String(s.resource), s])
  );
  const metaByResource = new Map([...data.quizMeta.values()].map((m) => [String(m.resourceId), m]));

  const resources = data.resources
    .filter((r) => r.type === 'video' || r.type === 'quiz')
    .map((r) => {
      const base = { _id: r._id, title: r.title, type: r.type, createdAt: r.createdAt };
      if (r.type === 'video') {
        return { ...base, url: r.url, completed: done.has(String(r._id)), points: POINTS.VIDEO };
      }
      const meta = metaByResource.get(String(r._id));
      if (!meta) return null;
      const sub = mySubs.get(String(r._id));
      return {
        ...base,
        status: quizStatus(meta, !!sub),
        startTime: meta.startTime,
        endTime: meta.endTime,
        maxScore: meta.max,
        result: sub
          ? { score: sub.score, max: sub.maxScore, ...quizPoints(sub.score, sub.maxScore, sub.onTime) }
          : null,
      };
    })
    .filter(Boolean);

  const mentors = await Mentor.find({ _id: { $in: data.program.mentors || [] } }).select('name').lean();
  const board = data.rows.map((r) => ({
    rank: r.rank,
    name: r.name,
    avatar: r.avatar,
    points: r.points,
    quizzesCompleted: r.quizzesCompleted,
    isMe: r.menteeId === String(req.user._id),
  }));
  const mine = board.find((r) => r.isMe) || null;

  res.json({
    cohort: {
      _id: data.program._id,
      name: data.program.name,
      description: data.program.description || '',
      syllabus: data.program.syllabus || '',
    },
    mentors: mentors.map((m) => m.name),
    resources,
    leaderboard: board,
    me: mine ? { rank: mine.rank, points: mine.points, of: board.length } : null,
  });
});

// POST /api/m/resources/:id/complete  - mark a lecture video as watched
router.post('/resources/:id/complete', menteeAuth, async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  if (resource.type !== 'video') return res.status(400).json({ error: 'Only videos can be marked complete' });
  if (resource.isLocked) return res.status(403).json({ error: 'Resource is locked' });
  if (!isEnrolled(req.user, resource.program)) return res.status(403).json({ error: 'You are not enrolled in this cohort' });

  const mentee = await Mentee.findById(req.user._id);
  const already = mentee.completedResources.some((c) => String(c.resource) === String(resource._id));
  if (already) return res.json({ message: 'Already completed', points: 0 });

  mentee.completedResources.push({ resource: resource._id, score: POINTS.VIDEO, completedOn: new Date() });
  updateStreak(mentee);
  await mentee.save();
  res.json({ message: `Video completed! +${POINTS.VIDEO} points`, points: POINTS.VIDEO });
});

// GET /api/m/resources/:id/quiz  - quiz questions (never includes the answers)
router.get('/resources/:id/quiz', menteeAuth, async (req, res) => {
  const resource = await Resource.findById(req.params.id).lean();
  if (!resource || resource.type !== 'quiz') return res.status(404).json({ error: 'Quiz not found' });
  if (!isEnrolled(req.user, resource.program)) return res.status(403).json({ error: 'You are not enrolled in this cohort' });

  const quiz = await Quiz.findOne({ resource: resource._id }).lean();
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const max = quizTotalMarks(quiz);
  const existing = await QuizSubmission.findOne({ quiz: quiz._id, mentee: req.user._id }).lean();
  const status = quizStatus(quiz, !!existing);
  const head = { title: resource.title, status, startTime: quiz.startTime, endTime: quiz.endTime, maxScore: max };

  if (existing) {
    return res.json({ ...head, submitted: true, result: { score: existing.score, max, ...quizPoints(existing.score, max, existing.onTime) } });
  }
  if (status !== 'open') return res.json({ ...head, questions: [] });

  res.json({
    ...head,
    questions: quiz.questions.map((q) => ({
      id: q._id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks || 1,
    })),
  });
});

// POST /api/m/resources/:id/quiz/submit  - one submission per quiz, scored on the server
router.post('/resources/:id/quiz/submit', menteeAuth, async (req, res) => {
  const resource = await Resource.findById(req.params.id).lean();
  if (!resource || resource.type !== 'quiz') return res.status(404).json({ error: 'Quiz not found' });
  if (resource.isLocked) return res.status(403).json({ error: 'Quiz is locked' });
  if (!isEnrolled(req.user, resource.program)) return res.status(403).json({ error: 'You are not enrolled in this cohort' });

  const quiz = await Quiz.findOne({ resource: resource._id }).lean();
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const now = new Date();
  if (quiz.startTime && now < new Date(quiz.startTime)) return res.status(403).json({ error: 'This quiz has not started yet' });
  if (quiz.endTime && now > new Date(quiz.endTime)) return res.status(403).json({ error: 'The deadline for this quiz has passed' });

  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  const byQuestion = new Map(answers.map((a) => [String(a.questionId), Number(a.selectedOptionIndex)]));

  let score = 0;
  const stored = [];
  quiz.questions.forEach((q, index) => {
    const selected = byQuestion.has(String(q._id)) ? byQuestion.get(String(q._id)) : -1;
    if (selected === q.correctOptionIndex) score += q.marks || 1;
    stored.push({ questionIndex: index, selectedOptionIndex: selected });
  });
  const max = quizTotalMarks(quiz);

  try {
    await QuizSubmission.create({
      quiz: quiz._id,
      resource: resource._id,
      mentee: req.user._id,
      answers: stored,
      score,
      onTime: true, // submissions after the deadline are rejected above
      submittedAt: now,
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'You have already submitted this quiz' });
    throw err;
  }

  const mentee = await Mentee.findById(req.user._id);
  if (!mentee.completedResources.some((c) => String(c.resource) === String(resource._id))) {
    mentee.completedResources.push({ resource: resource._id, score, completedOn: now });
  }
  updateStreak(mentee);
  await mentee.save();

  const pts = quizPoints(score, max, true);
  res.status(201).json({
    message: 'Quiz submitted!',
    score,
    max,
    points: pts.base + pts.bonus,
    breakdown: pts,
  });
});

// GET /api/m/profile  - AI Profile (rule-based stats + cached AI summary)
router.get('/profile', menteeAuth, async (req, res) => {
  const out = await buildProfile(req.user._id);
  if (!out) return res.status(404).json({ error: 'Mentee not found' });
  res.json(out);
});

// POST /api/m/profile/refresh  - force a new AI summary
router.post('/profile/refresh', menteeAuth, async (req, res) => {
  const out = await buildProfile(req.user._id, { force: true });
  if (!out) return res.status(404).json({ error: 'Mentee not found' });
  res.json(out);
});

// PUT /api/m/avatar
router.put('/avatar', menteeAuth, async (req, res) => {
  const { avatar } = req.body;
  if (!AVATARS.includes(avatar)) return res.status(400).json({ error: 'Invalid avatar' });
  await Mentee.updateOne({ _id: req.user._id }, { $set: { avatar } });
  res.json({ avatar });
});

module.exports = router;
