const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mentor = require('../models/Mentor');
const Program = require('../models/Program');
const Resource = require('../models/Resource');
const Mentee = require('../models/Mentee')
const { authenticate } = require('../middleware/authMentor');
const router = express.Router();

// ==== MENTOR MANAGEMENT ==== //
// Create Mentor (Directly via Thunder Client)
router.post('/mentors', async (req, res) => {
  try {
    console.log("Creating mentor...")
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const mentor = new Mentor({
      name,
      email,
      password: await bcrypt.hash(password, salt)
    });
    await mentor.save();
    res.status(201).json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find().populate('programs'); // Populate programs if you want the full program data
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all programs
router.get('/programs', async (req, res) => {
  try {
    const programs = await Program.find().populate('mentors'); // Populate mentors if you want the full mentor data
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mentor Login
router.post('/mentors/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const mentor = await Mentor.findOne({ email });
    if (!mentor || !(await bcrypt.compare(password, mentor.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: mentor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, mentor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==== PROGRAM MANAGEMENT ==== //
// Create Program (Assign to Mentor)
router.post('/programs', async (req, res) => {
  try {
    const program = new Program({
      name: req.body.name // Auto-assign creator as mentor
    });
    await program.save();
    
    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Mentor to Program (Manual via Thunder Client)
router.post('/programs/:programId/add-mentor', async (req, res) => {
  try {
    const program = await Program.findById(req.params.programId);
    const mentor = await Mentor.findById(req.body.mentorId);
    
    if (!program || !mentor) {
      return res.status(404).json({ error: 'Program/Mentor not found' });
    }
    
    program.mentors.push(mentor._id);
    mentor.programs.push(program._id);
    
    await program.save();
    await mentor.save();
    
    res.json({ program, mentor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==== RESOURCE MANAGEMENT ==== //
// Add Resource (Only for assigned programs)
router.post('/resources', authenticate, async (req, res) => {
  try {
    const program = await Program.findById(req.body.program);
    if (!program.mentors.includes(req.mentor._id)) {
      return res.status(403).json({ error: 'Not authorized for this program' });
    }

    const resource = new Resource({
      ...req.body,
      addedBy: req.mentor._id
    });

    await resource.save();

    program.resources.push(resource._id);

    await program.save();
    
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mentor adds a mentee (with auto-generated credentials)
router.post('/mentees', authenticate, async (req, res) => {
  try {
    const { email, name, enrollmentNumber, programId } = req.body;
    const mentor = req.mentor;

    // Check if mentor is assigned to the program
    const program = await Program.findById(programId);
    if (!program.mentors.includes(mentor._id)) {
      return res.status(403).json({ error: 'Not authorized for this program' });
    }

    // Generate a random password (or let mentor set one)
    const tempPassword = Math.random().toString(36).slice(-8); // Example: "x7f9d2y"
    console.log("salt")
    const salt = await bcrypt.genSalt(10);
    
    const mentee = new Mentee({
      email,
      name,
      enrollmentNumber,
      password: await bcrypt.hash(tempPassword, salt),
      programs: [programId]
    });
    await mentee.save();

    // Optional: Send email to mentee with credentials
    // await sendWelcomeEmail(mentee.email, enrollmentNumber, tempPassword);

    res.status(201).json({
      mentee,
      tempPassword // Mentor sees this (for manual sharing)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all mentees for a program
router.get('/:programId/mentees', async (req, res) => {
  try {
    const mentees = await Mentee.find({ programs: req.params.programId })
      .select('-password') // Exclude sensitive data
      .populate('completedResources.resource', 'title type'); // Optional: populate completed resources
    
    res.json(mentees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:programId/resources', async (req, res) => {
  try {
    const resources = await Resource.find({ program: req.params.programId })
      .sort({ createdAt: -1 }); // Newest first
    
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;