const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Admin = require('../models/Admin');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const Program = require('../models/Program');
const MentorRequest = require('../models/MentorRequest');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const { requireRole } = require('../middleware/requireRole');
const { loadCohortData } = require('../utils/standings');
const router = express.Router();

// All admin routes require admin role
const adminAuth = requireRole('admin');

// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [cohorts, mentors, mentees, pendingRequests] = await Promise.all([
      Program.countDocuments(),
      Mentor.countDocuments({ status: 'approved' }),
      Mentee.countDocuments(),
      MentorRequest.countDocuments({ status: 'pending' })
    ]);
    res.json({ cohorts, mentors, mentees, pendingRequests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/mentor-requests
router.get('/mentor-requests', adminAuth, async (req, res) => {
  try {
    const requests = await MentorRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/mentor-requests/:id/approve
router.post('/mentor-requests/:id/approve', adminAuth, async (req, res) => {
  try {
    const request = await MentorRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    const email = String(request.email).trim().toLowerCase();
    if (await Mentor.findOne({ email })) {
      return res.status(409).json({ error: 'A mentor with this email already exists' });
    }

    // Generate 8-char temp password
    const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 hex chars

    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const mentor = new Mentor({
      name: request.name,
      email,
      password: hashedPassword,
      role: 'mentor',
      status: 'approved',
      mustChangePassword: true
    });
    await mentor.save();

    request.status = 'approved';
    await request.save();

    res.json({ tempPassword, mentor: { id: mentor._id, name: mentor.name, email: mentor.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/mentor-requests/:id/reject
router.post('/mentor-requests/:id/reject', adminAuth, async (req, res) => {
  try {
    const request = await MentorRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    request.status = 'rejected';
    await request.save();
    res.json({ message: 'Request rejected', request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/cohorts
router.get('/cohorts', adminAuth, async (req, res) => {
  try {
    const cohorts = await Program.find().populate('mentors', '-password');
    // Attach mentee counts
    const cohortIds = cohorts.map(c => c._id);
    const menteeCounts = await Mentee.aggregate([
      { $unwind: '$programs' },
      { $match: { programs: { $in: cohortIds } } },
      { $group: { _id: '$programs', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    menteeCounts.forEach(m => { countMap[m._id.toString()] = m.count; });

    const result = cohorts.map(c => ({
      ...c.toObject(),
      menteeCount: countMap[c._id.toString()] || 0
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/cohorts
router.post('/cohorts', adminAuth, async (req, res) => {
  try {
    const { description, syllabus } = req.body;
    const name = String(req.body.name || req.body.title || '').trim();
    if (!name) return res.status(400).json({ error: 'Cohort name is required' });
    const program = new Program({
      name,
      description,
      syllabus,
      createdBy: req.user._id
    });
    await program.save();
    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/cohorts/:id
router.put('/cohorts/:id', adminAuth, async (req, res) => {
  try {
    const { description, syllabus } = req.body;
    const name = String(req.body.name || req.body.title || '').trim();
    if (!name) return res.status(400).json({ error: 'Cohort name is required' });
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { name, description, syllabus },
      { new: true }
    );
    if (!program) return res.status(404).json({ error: 'Cohort not found' });
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/cohorts/:id
router.delete('/cohorts/:id', adminAuth, async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ error: 'Cohort not found' });
    res.json({ message: 'Cohort deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/cohorts/:id/assign-mentor
router.post('/cohorts/:id/assign-mentor', adminAuth, async (req, res) => {
  try {
    const { mentorId } = req.body;
    const [program, mentor] = await Promise.all([
      Program.findById(req.params.id),
      Mentor.findById(mentorId)
    ]);
    if (!program) return res.status(404).json({ error: 'Cohort not found' });
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });

    if (!program.mentors.map(m => m.toString()).includes(mentorId)) {
      program.mentors.push(mentorId);
      await program.save();
    }
    if (!mentor.programs.map(p => p.toString()).includes(req.params.id)) {
      mentor.programs.push(req.params.id);
      await mentor.save();
    }

    res.json({ message: 'Mentor assigned', program, mentor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/cohorts/:id/remove-mentor
router.post('/cohorts/:id/remove-mentor', adminAuth, async (req, res) => {
  try {
    const { mentorId } = req.body;
    const [program, mentor] = await Promise.all([
      Program.findById(req.params.id),
      Mentor.findById(mentorId)
    ]);
    if (!program) return res.status(404).json({ error: 'Cohort not found' });
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });

    program.mentors = program.mentors.filter(m => m.toString() !== mentorId);
    mentor.programs = mentor.programs.filter(p => p.toString() !== req.params.id);

    await Promise.all([program.save(), mentor.save()]);
    res.json({ message: 'Mentor removed', program, mentor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/cohorts/:id/analytics
// avgQuizScore = mean quiz percentage; completionRate = mean % of the cohort's videos + quizzes each mentee has finished
router.get('/cohorts/:id/analytics', adminAuth, async (req, res) => {
  try {
    const data = await loadCohortData(req.params.id);
    if (!data) return res.status(404).json({ error: 'Cohort not found' });

    const menteeCount = data.mentees.length;
    const pcts = data.submissions.map((s) => (s.maxScore > 0 ? (s.score / s.maxScore) * 100 : 0));
    const avgQuizScore = pcts.length ? parseFloat((pcts.reduce((a, b) => a + b, 0) / pcts.length).toFixed(1)) : 0;

    const totalItems = data.resources.filter((r) => r.type === 'video' || r.type === 'quiz').length;
    let completionRate = 0;
    if (menteeCount > 0 && totalItems > 0) {
      const done = data.rows.reduce((s, r) => s + r.quizzesCompleted + r.videosCompleted, 0);
      completionRate = parseFloat(((done / (menteeCount * totalItems)) * 100).toFixed(1));
    }

    res.json({ menteeCount, avgQuizScore, completionRate, quizzes: data.quizMeta.size, topMentee: data.rows[0] ? { name: data.rows[0].name, points: data.rows[0].points } : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/mentors
router.get('/mentors', adminAuth, async (req, res) => {
  try {
    const mentors = await Mentor.find({ status: 'approved' }).select('-password').populate('programs');
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
