const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mentee = require('../models/Mentee');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Program = require('../models/Program');
const Resource = require('../models/Resource');
const { authenticateMentee } = require('../middleware/authMentor');
const router = express.Router();


router.post('/login', async (req, res) => {
  const { enrollmentNumber, password } = req.body;
  try {
    const mentee = await Mentee.findOne({ enrollmentNumber });
    if (!mentee || !(password === mentee.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: mentee._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
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

router.post('/resources/:id/quiz/submit', authenticateMentee, async (req, res) => {
  try {
    const resourceId = req.params.id;
    const mentee = req.mentee;
    const answers = req.body.answers; // [{ questionId, selectedOptionIndex }, ...]

    const resource = await Resource.findById(resourceId).populate('quiz');
    if (!resource || resource.type !== 'quiz') {
      return res.status(400).json({ error: 'Invalid quiz resource' });
    }

    if (resource.isLocked) {
      return res.status(403).json({ error: 'Quiz is locked' });
    }

    const quiz = await Quiz.findOne({resource:resourceId});
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const now = new Date();
    if (now < quiz.startTime || now > quiz.endTime) {
      return res.status(403).json({ error: 'Quiz is not active at this time' });
    }

    // Prevent resubmission
    const existing = await QuizSubmission.findOne({ quiz: quiz._id, mentee: mentee._id });
    if (existing) {
      return res.status(409).json({ error: 'Quiz already submitted' });
    }

    // Calculate score
    let totalScore = 0;
    for (const question of quiz.questions) {
      const userAnswer = answers.find(ans => ans.questionId === question._id.toString());
      if (userAnswer && userAnswer.selectedOptionIndex === question.correctOptionIndex) {
        totalScore += question.marks || 1;
      }
    }

    // Save submission
    const submission = new QuizSubmission({
      quiz: quiz._id,
      resource: resourceId,
      mentee: mentee._id,
      answers,
      score: totalScore,
    });

    await submission.save();

    // Update mentee's resource progress
    const completedResource = {
      resource: resource._id,
      score: totalScore,
      completedOn: new Date()
    };

    const alreadyCompleted = mentee.completedResources.find(
      (r) => r.resource.toString() === resource._id.toString()
    );

    if (alreadyCompleted) {
      alreadyCompleted.score = totalScore;
      alreadyCompleted.completedOn = new Date();
    } else {
      mentee.completedResources.push(completedResource);
    }

    // Update streak and total score
    await updateStreak(mentee);
    mentee.totalScore += totalScore;
    await mentee.save();

    res.status(200).json({ message: 'Quiz submitted successfully!', score: totalScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/resources/:id/quiz', authenticateMentee, async (req, res) => {
  try {
    const resourceId = req.params.id;
    console.log(resourceId);
    const resource = await Resource.findById(resourceId).populate('quiz');
    if (!resource || resource.type !== 'quiz') {
      return res.status(400).json({ error: 'Invalid resource or quiz not found' });
    }

    console.log(resource);
    const quiz = await Quiz.findOne({ resource: resourceId });
    console.log("quiz",quiz);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      title: resource.title,
      description: resource.description,
      questions: quiz.questions.map((q) => ({
        id: q._id,
        questionText: q.questionText,
        options: q.options,
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/m/resources/:resourceId/project
router.post('/resources/:resourceId/project', authenticateMentee, async (req, res) => {
  try {
    const { githubLink, deployedLink, description } = req.body;
    const resource = await Resource.findById(req.params.resourceId);
    const mentee = req.mentee;

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.type !== 'project') {
      return res.status(400).json({ error: 'Invalid resource type' });
    }

    if (resource.isLocked) {
      return res.status(403).json({ error: 'Resource is locked' });
    }
    // Validate inputs
    if (!githubLink || !deployedLink || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // if (description.trim().split(/\s+/).length < 300) {
    //   return res.status(400).json({ error: 'Description must be at least 300 words' });
    // }

    const deadline = resource.deadline;
    const isLate = deadline && new Date() > deadline;
    const latePenalty = isLate ? Math.floor((new Date() - deadline) / (1000 * 60 * 60 * 24)) : 0;
    const baseScore = resource.maxScore;
    const score = Math.max(0, baseScore - latePenalty);

    // Create the completion entry
    const projectCompletion = {
      resource: resource._id,
      githubLink,
      deployedLink,
      description,
      score: 0, // Score to be updated by mentor later
      submittedOn: new Date(),
    };

    // Check if already completed
    const existing = mentee.completedResources.find(
      (c) => c.resource.toString() === resource._id.toString()
    );

    if (existing) {
      existing.githubLink = githubLink;
      existing.deployedLink = deployedLink;
      existing.description = description;
      existing.submittedOn = new Date();
      existing.score = 0;
    } else {
      mentee.completedResources.push(projectCompletion);
    }
    await mentee.save();

    res.json({ message: 'Project submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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