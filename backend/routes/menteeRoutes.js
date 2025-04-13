const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mentee = require('../models/Mentee');
const Program = require('../models/Program');
const Resource = require('../models/Resource');
const { authenticateMentee } = require('../middleware/authMentor');
const router = express.Router();


router.post('/login', async (req, res) => {
  const { enrollmentNumber, password } = req.body;
  try {
    const mentee = await Mentee.findOne({ enrollmentNumber });
    if (!mentee || !(await bcrypt.compare(password, mentee.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: mentee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Mentee Dashboard --- //
router.get('/dashboard', authenticateMentee, async (req, res) => {
  try {
    const mentee = await Mentee.findById(req.mentee._id)
      .populate('programs')
      .populate('completedResources.resource');
    
    res.json({
      name: mentee.name,
      programs: mentee.programs,
      streak: mentee.streak,
      rank: await calculateRank(mentee._id), // Implement this helper
    //   resources: await getResourcesWithStatus(mentee) // Implement this
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Resource Completion --- //
router.post('/resources/:id/complete', authenticateMentee, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    const mentee = req.mentee;

    // Check if resource is unlocked
    console.log(resource.isLocked);
    if (resource.isLocked) {
      return res.status(403).json({ error: 'Resource is locked' });
    }

    // Calculate score (deduct for late submission)
    const deadline = resource.deadline;
    const isLate = deadline && new Date() > deadline;
    const latePenalty = isLate ? Math.floor((new Date() - deadline) / (1000 * 60 * 60 * 24)) : 0; // 1 point/day
    const score = Math.max(0, resource.maxScore - latePenalty);

    // Update mentee's progress
    mentee.completedResources.push({
      resource: resource._id,
      score
    });

    // Update streak (if active today)
    await updateStreak(mentee);
    await mentee.save();

    res.json({ message: 'Resource marked as completed!', score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Project Submission --- //
router.post('/resources/:id/submit-project', authenticateMentee, async (req, res) => {
  try {
    const { link } = req.body;
    const mentee = req.mentee;

    mentee.projectSubmissions.push({
      resource: req.params.id,
      link
    });

    await mentee.save();
    res.json({ message: 'Project submitted for review!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: Calculate rank (example: based on total score)
async function calculateRank(menteeId) {
  const mentee = await Mentee.findById(menteeId);
  const allMentees = await Mentee.find().sort({ 'completedResources.score': -1 });
  return allMentees.findIndex(m => m._id.equals(mentee._id)) + 1;
}

// Helper: Update streak
async function updateStreak(mentee) {
  const today = new Date().toDateString();
  const lastActive = mentee.lastActiveDate?.toDateString();

  if (lastActive !== today) {
    mentee.streak = lastActive === new Date(Date.now() - 86400000).toDateString() 
      ? mentee.streak + 1 
      : 1;
    mentee.lastActiveDate = new Date();
  }
}

module.exports = router;