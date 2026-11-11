const express = require('express');
const MentorRequest = require('../models/MentorRequest');
const router = express.Router();

// POST /api/mentor-requests  (no auth — public form)
router.post('/', async (req, res) => {
  try {
    const { name, email, reason } = req.body;
    if (!name || !email || !reason) {
      return res.status(400).json({ error: 'name, email and reason are required' });
    }
    const request = new MentorRequest({ name, email, reason });
    await request.save();
    res.status(201).json({ message: 'Request submitted successfully', request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
