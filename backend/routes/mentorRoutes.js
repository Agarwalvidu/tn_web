const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mentor = require('../models/Mentor');
const Program = require('../models/Program');
const Resource = require('../models/Resource');
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

// Mentor Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const mentor = await Mentor.findOne({ email });
    if (!mentor || !(await bcrypt.compare(password, mentor.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: mentor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Zjk2YzgyZDVlNjM4OTU1MTQ3YzY4MiIsImlhdCI6MTc0NDM5OTUyOCwiZXhwIjoxNzQ0NDAzMTI4fQ.9LYqa3feUHWM5vkNAyyaIdOnsXhtKBG18H0jIywHKTY
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

module.exports = router;