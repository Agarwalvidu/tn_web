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

    // Generate 8-char temp password
    const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 hex chars

    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const mentor = new Mentor({
      name: request.name,
      email: request.email,
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
    const { name, description, syllabus } = req.body;
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
    const { name, description, syllabus } = req.body;
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
router.get('/cohorts/:id/analytics', adminAuth, async (req, res) => {
  try {
    const programId = req.params.id;
    const program = await Program.findById(programId);
    if (!program) return res.status(404).json({ error: 'Cohort not found' });

    const mentees = await Mentee.find({ programs: programId });
    const menteeCount = mentees.length;

    // Find all quiz resources in this program
    const Resource = require('../models/Resource');
    const quizResources = await Resource.find({ program: programId, type: 'quiz' });
    const quizResourceIds = quizResources.map(r => r._id);

    // Find quizzes for those resources
    const quizzes = await Quiz.find({ resource: { $in: quizResourceIds } });
    const quizIds = quizzes.map(q => q._id);

    // Get all submissions for those quizzes
    const submissions = await QuizSubmission.find({ quiz: { $in: quizIds } });

    let avgQuizScore = 0;
    if (submissions.length > 0) {
      const totalScore = submissions.reduce((sum, s) => sum + (s.score || 0), 0);
      avgQuizScore = parseFloat((totalScore / submissions.length).toFixed(2));
    }

    // Completion rate: mentees who completed at least one resource in this program
    const menteeIds = mentees.map(m => m._id.toString());
    const programResourceIds = program.resources.map(r => r.toString());
    const completedCount = mentees.filter(m =>
      m.completedResources.some(cr => programResourceIds.includes(cr.resource.toString()))
    ).length;
    const completionRate = menteeCount > 0 ? parseFloat((completedCount / menteeCount * 100).toFixed(2)) : 0;

    res.json({ menteeCount, avgQuizScore, completionRate });
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
