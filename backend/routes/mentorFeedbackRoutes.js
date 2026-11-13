
const express = require('express');
const router = express.Router();

const { requireRole } = require('../middleware/requireRole');
const Program = require('../models/Program');
const MentorFeedback = require('../models/MentorFeedback');

const isId = (v) => /^[a-f\d]{24}$/i.test(String(v));
const menteeAuth = requireRole('mentee');
const mentorAuth = requireRole('mentor');
const adminAuth = requireRole('admin');

// Get aggregate ratings for a mentor's cohort
router.get('/mentor/:cohortId', mentorAuth, async (req, res) => {
  try {
    const { cohortId } = req.params;
    if (!isId(cohortId)) return res.status(400).json({ error: 'Invalid cohort id' });

    const program = await Program.findOne({
      _id: cohortId,
      mentors: req.user._id
    });

    if (!program) {
      return res.status(403).json({ error: 'You are not assigned to this cohort' });
    }

    const feedback = await MentorFeedback.find({
      mentor: req.user._id,
      cohort: cohortId
    }).select('rating');

    const totalRatings = feedback.length;

    const averageRating = totalRatings === 0
      ? 0
      : feedback.reduce((sum, item) => sum + item.rating, 0) / totalRatings;

    const distribution = [1, 2, 3, 4, 5].map(star => ({
      stars: star,
      count: feedback.filter(item => item.rating === star).length
    }));

    res.json({
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings,
      distribution
    });
  } catch (err) {
    console.error('Mentor ratings error:', err);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Get all mentor feedback (admin only). Feedback is ANONYMOUS: the mentee's identity is never sent.
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const feedback = await MentorFeedback.find()
      .select('-mentee') // keep the mentee out of the response entirely
      .populate('mentor', 'name email')
      .populate('cohort', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ feedback });
  } catch (err) {
    console.error('Admin feedback error:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get mentors assigned to a cohort and check whether feedback was submitted
router.get('/:cohortId', menteeAuth, async (req, res) => {
  try {
    const mentee = req.user;
    const { cohortId } = req.params;
    if (!isId(cohortId)) return res.status(400).json({ error: 'Invalid cohort id' });

    const isEnrolled = (mentee.programs || []).some(
      programId => String(programId) === String(cohortId)
    );

    if (!isEnrolled) {
      return res.status(403).json({ error: 'You are not enrolled in this cohort' });
    }

    const program = await Program.findById(cohortId)
      .populate('mentors', 'name');

    if (!program) {
      return res.status(404).json({ error: 'Cohort not found' });
    }

    const feedback = await MentorFeedback.find({
      mentee: mentee._id,
      cohort: cohortId
    }).select('mentor');

    const submittedIds = feedback.map(item => String(item.mentor));

    const mentors = program.mentors.map(mentor => ({
      _id: mentor._id,
      name: mentor.name,
      hasSubmitted: submittedIds.includes(String(mentor._id))
    }));

    res.json({ mentors });
  } catch (err) {
    console.error('Feedback fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});


// Submit feedback for an assigned mentor
router.post('/:cohortId', menteeAuth, async (req, res) => {
  try {
    const mentee = req.user;
    const { cohortId } = req.params;
    const { mentorId, rating, comment } = req.body;

    if (!isId(cohortId) || !isId(mentorId) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Please provide a valid mentor and rating (1-5)' });
    }

    if (typeof comment !== 'string' || !comment.trim()) {
      return res.status(400).json({ error: 'Please enter a comment' });
    }

    const isEnrolled = (mentee.programs || []).some(
      programId => String(programId) === String(cohortId)
    );

    if (!isEnrolled) {
      return res.status(403).json({ error: 'You are not enrolled in this cohort' });
    }

    const program = await Program.findOne({
      _id: cohortId,
      mentors: mentorId
    });

    if (!program) {
      return res.status(403).json({ error: 'This mentor is not assigned to the cohort' });
    }

    const feedback = new MentorFeedback({
      mentee: mentee._id,
      mentor: mentorId,
      cohort: cohortId,
      rating,
      comment: comment.trim()
    });

    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You have already submitted feedback for this mentor' });
    }

    console.error('Feedback submission error:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

module.exports = router;