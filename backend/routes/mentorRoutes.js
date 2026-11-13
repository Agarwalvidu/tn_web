const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const Program = require('../models/Program');
const Resource = require('../models/Resource');
const Quiz = require('../models/Quiz');
const { requireRole } = require('../middleware/requireRole');
const { loadCohortData, nextEnrollmentNumbers } = require('../utils/standings');
const { buildProfile } = require('../utils/profileService');

const router = express.Router();
const mentorAuth = requireRole('mentor');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// readable alphabet: no 0/O, 1/l/I
const PW_ALPHABET = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const genPassword = (len = 8) =>
  Array.from(crypto.randomBytes(len), (b) => PW_ALPHABET[b % PW_ALPHABET.length]).join('');

const ownsCohort = (mentorId, cohortId) => Program.findOne({ _id: cohortId, mentors: mentorId });

// GET /api/mentor/me
router.get('/me', mentorAuth, async (req, res) => {
  const mentor = await Mentor.findById(req.user._id).select('-password').lean();
  res.json(mentor);
});

// GET /api/mentor/cohorts  - only the cohorts this mentor is assigned to
router.get('/cohorts', mentorAuth, async (req, res) => {
  const programs = await Program.find({ mentors: req.user._id }).select('name description syllabus resources').lean();
  const counts = await Mentee.aggregate([
    { $unwind: '$programs' },
    { $match: { programs: { $in: programs.map((p) => p._id) } } },
    { $group: { _id: '$programs', count: { $sum: 1 } } },
  ]);
  const map = new Map(counts.map((c) => [String(c._id), c.count]));
  res.json(
    programs.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description || '',
      menteeCount: map.get(String(p._id)) || 0,
      resourceCount: (p.resources || []).length,
    }))
  );
});

// GET /api/mentor/cohorts/:id/overview  - mentees with live points/rank, videos and quizzes
router.get('/cohorts/:id/overview', mentorAuth, async (req, res) => {
  if (!(await ownsCohort(req.user._id, req.params.id))) {
    return res.status(403).json({ error: 'Not authorized for this cohort' });
  }
  const data = await loadCohortData(req.params.id);
  if (!data) return res.status(404).json({ error: 'Cohort not found' });

  const emailById = new Map(data.mentees.map((m) => [String(m._id), m.email]));
  const mentees = data.rows.map((r) => ({
    _id: r.menteeId,
    rank: r.rank,
    name: r.name,
    email: emailById.get(r.menteeId) || '',
    enrollmentNumber: r.enrollmentNumber,
    points: r.points,
    quizzesCompleted: r.quizzesCompleted,
    videosCompleted: r.videosCompleted,
    streak: r.streak,
  }));

  const subCount = new Map();
  data.submissions.forEach((s) => subCount.set(String(s.resource), (subCount.get(String(s.resource)) || 0) + 1));
  const metaByResource = new Map([...data.quizMeta.values()].map((m) => [String(m.resourceId), m]));

  const resources = data.resources
    .filter((r) => r.type === 'video' || r.type === 'quiz')
    .map((r) => {
      const meta = metaByResource.get(String(r._id));
      return {
        _id: r._id,
        type: r.type,
        title: r.title,
        url: r.url,
        createdAt: r.createdAt,
        endTime: meta ? meta.endTime : undefined,
        startTime: meta ? meta.startTime : undefined,
        maxScore: meta ? meta.max : undefined,
        submissions: r.type === 'quiz' ? subCount.get(String(r._id)) || 0 : undefined,
      };
    });

  res.json({
    cohort: { _id: data.program._id, name: data.program.name, description: data.program.description || '', syllabus: data.program.syllabus || '' },
    mentees,
    resources,
  });
});

// POST /api/mentor/mentees/bulk   Body: { cohortId, lines: "name,email\nname,email" }
// Creates mentees with an auto-generated enrollment number and password.
// Existing mentees (same email) are just added to the cohort, with no new password.
router.post('/mentees/bulk', mentorAuth, async (req, res) => {
  const { cohortId, lines } = req.body;
  if (!cohortId || !lines || typeof lines !== 'string') {
    return res.status(400).json({ error: 'cohortId and lines are required' });
  }
  const program = await ownsCohort(req.user._id, cohortId);
  if (!program) return res.status(403).json({ error: 'Not authorized for this cohort' });

  const parsed = [];
  const seen = new Set();
  for (const raw of lines.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const parts = raw.split(/[,\t]/).map((s) => s.trim());
    const name = parts[0];
    const email = (parts[1] || '').toLowerCase();
    if (!name || !EMAIL_RE.test(email)) {
      parsed.push({ raw, error: 'Expected "Name, email@college.edu"' });
    } else if (seen.has(email)) {
      parsed.push({ name, email, error: 'Duplicate in this list' });
    } else {
      seen.add(email);
      parsed.push({ name, email });
    }
  }
  if (parsed.length > 200) return res.status(400).json({ error: 'Add at most 200 mentees at a time' });

  const valid = parsed.filter((p) => !p.error);
  const existing = await Mentee.find({ email: { $in: valid.map((v) => v.email) } }).select('email programs').lean();
  const existingByEmail = new Map(existing.map((m) => [m.email, m]));
  const newOnes = valid.filter((v) => !existingByEmail.has(v.email));
  const numbers = await nextEnrollmentNumbers(newOnes.length);
  let nextIdx = 0;

  const results = [];
  for (const p of parsed) {
    if (p.error) {
      results.push({ name: p.name || '', email: p.email || p.raw, status: 'error', error: p.error });
      continue;
    }
    const ex = existingByEmail.get(p.email);
    try {
      if (ex) {
        const already = (ex.programs || []).some((id) => String(id) === String(cohortId));
        if (!already) await Mentee.updateOne({ _id: ex._id }, { $addToSet: { programs: cohortId } });
        results.push({ name: p.name, email: p.email, status: already ? 'already-enrolled' : 'added-existing' });
      } else {
        const enrollmentNumber = numbers[nextIdx++];
        const tempPassword = genPassword();
        await Mentee.create({
          name: p.name,
          email: p.email,
          enrollmentNumber,
          password: await bcrypt.hash(tempPassword, 10),
          programs: [cohortId],
          mustChangePassword: true,
          createdBy: req.user._id,
        });
        results.push({ name: p.name, email: p.email, enrollmentNumber, tempPassword, status: 'created' });
      }
    } catch (err) {
      results.push({ name: p.name, email: p.email, status: 'error', error: err.message });
    }
  }
  res.status(201).json(results);
});

// POST /api/mentor/videos   Body: { cohortId, title, url }
router.post('/videos', mentorAuth, async (req, res) => {
  const { cohortId, title, url } = req.body;
  if (!cohortId || !title || !url) return res.status(400).json({ error: 'cohortId, title and url are required' });
  if (!/^https?:\/\/\S+$/i.test(url)) return res.status(400).json({ error: 'url must start with http:// or https://' });
  if (!(await ownsCohort(req.user._id, cohortId))) return res.status(403).json({ error: 'Not authorized for this cohort' });

  const resource = await Resource.create({
    title: String(title).trim().slice(0, 150),
    type: 'video',
    url: url.trim(),
    program: cohortId,
    isLocked: false,
    maxScore: 5,
    addedBy: req.user._id,
  });
  await Program.updateOne({ _id: cohortId }, { $push: { resources: resource._id } });
  res.status(201).json(resource);
});

// POST /api/mentor/quizzes   Body: { cohortId, title, questions[], startTime?, endTime }
router.post('/quizzes', mentorAuth, async (req, res) => {
  const { cohortId, title, questions, startTime, endTime } = req.body;
  if (!cohortId || !title) return res.status(400).json({ error: 'cohortId and title are required' });
  if (!(await ownsCohort(req.user._id, cohortId))) return res.status(403).json({ error: 'Not authorized for this cohort' });
  if (!Array.isArray(questions) || questions.length < 1 || questions.length > 50) {
    return res.status(400).json({ error: 'Add between 1 and 50 questions' });
  }

  const cleaned = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const text = String(q.questionText || '').trim();
    const options = (Array.isArray(q.options) ? q.options : []).map((o) => String(o || '').trim());
    const correct = Number(q.correctOptionIndex);
    const marks = Number(q.marks) || 1;
    if (!text) return res.status(400).json({ error: `Question ${i + 1}: text is required` });
    if (options.length < 2 || options.some((o) => !o)) return res.status(400).json({ error: `Question ${i + 1}: fill in every option (at least 2)` });
    if (!Number.isInteger(correct) || correct < 0 || correct >= options.length) return res.status(400).json({ error: `Question ${i + 1}: choose the correct option` });
    if (marks < 1 || marks > 100) return res.status(400).json({ error: `Question ${i + 1}: marks must be 1-100` });
    cleaned.push({ questionText: text, options, correctOptionIndex: correct, marks });
  }

  const start = startTime ? new Date(startTime) : new Date();
  const end = new Date(endTime);
  if (Number.isNaN(end.getTime())) return res.status(400).json({ error: 'A valid deadline is required' });
  if (Number.isNaN(start.getTime())) return res.status(400).json({ error: 'Invalid start time' });
  if (end <= start) return res.status(400).json({ error: 'Deadline must be after the start time' });
  if (end <= new Date()) return res.status(400).json({ error: 'Deadline must be in the future' });

  const maxScore = cleaned.reduce((s, q) => s + q.marks, 0);
  const resource = await Resource.create({
    title: String(title).trim().slice(0, 150),
    type: 'quiz',
    program: cohortId,
    maxScore,
    deadline: end,
    isLocked: false,
    addedBy: req.user._id,
  });
  const quiz = await Quiz.create({ resource: resource._id, questions: cleaned, startTime: start, endTime: end });
  await Resource.updateOne({ _id: resource._id }, { $set: { quiz: quiz._id } });
  await Program.updateOne({ _id: cohortId }, { $push: { resources: resource._id } });

  res.status(201).json({ message: 'Quiz created', resource, quizId: quiz._id, maxScore });
});

// GET /api/mentor/mentees/:id/profile  - read-only AI Profile of a mentee in one of my cohorts
router.get('/mentees/:id/profile', mentorAuth, async (req, res) => {
  const mentee = await Mentee.findById(req.params.id).select('programs').lean();
  if (!mentee) return res.status(404).json({ error: 'Mentee not found' });
  const mine = await Program.find({ mentors: req.user._id }).select('_id').lean();
  const mineIds = new Set(mine.map((p) => String(p._id)));
  if (!(mentee.programs || []).some((p) => mineIds.has(String(p)))) {
    return res.status(403).json({ error: 'This mentee is not in one of your cohorts' });
  }
  const out = await buildProfile(req.params.id);
  res.json(out);
});

module.exports = router;
