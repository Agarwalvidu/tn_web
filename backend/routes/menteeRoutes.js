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
    .populate({
      path: 'programs',
      populate: {
        path: 'resources',
        model: 'Resource'
      }
    })  
    .populate({
      path: 'completedResources.resource',
      model: 'Resource'
    });
    // Map completedResources for quick lookup
    const completedMap = new Map();
    mentee.completedResources.forEach((item) => {
      completedMap.set(item.resource._id.toString(), {
        score: item.score,
        completedOn: item.completedOn
      });
    });

    let totalScore = 0;
mentee.completedResources.forEach((item) => {
  totalScore += item.score || 0;
});

    // Add completed status to each resource
    const updatedPrograms = mentee.programs.map((program) => {
      const updatedResources = program.resources.map((res) => {
        const isCompleted = completedMap.has(res._id.toString());
        return {
          ...res.toObject(),
          completed: isCompleted,
          score: isCompleted ? completedMap.get(res._id.toString()).score : null,
          completedOn: isCompleted ? completedMap.get(res._id.toString()).completedOn : null
        };
      });
      return {
        ...program.toObject(),
        resources: updatedResources
      };
    });
    res.json({
      name: mentee.name,
      programs: mentee.programs,
      streak: mentee.streak,
      totalScore,
      programs: updatedPrograms,
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
    if (resource.isLocked) {
      return res.status(403).json({ error: 'Resource is locked' });
    }

    // Calculate score (deduct for late submission)
    const deadline = resource.deadline;
    const isLate = deadline && new Date() > deadline;
    const latePenalty = isLate ? Math.floor((new Date() - deadline) / (1000 * 60 * 60 * 24)) : 0; // 1 point/day
    const score = Math.max(0, resource.maxScore - latePenalty);

    // Update mentee's progress
    const completedResource = {
      resource: resource._id,
      score,
      completedOn: new Date()
    };

    // Check if resource is already completed
    const existingCompletion = mentee.completedResources.find(
      (completed) => completed.resource.toString() === resource._id.toString()
    );

    if (existingCompletion) {
      // If already completed, update the score and date
      existingCompletion.score = score;
      existingCompletion.completedOn = new Date();
    } else {
      // If not completed yet, push new completion entry
      mentee.completedResources.push(completedResource);
    }

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