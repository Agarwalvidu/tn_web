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
    const clean = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return res.status(400).json({ error: 'Enter a valid email' });
    const dup = await MentorRequest.findOne({ email: clean, status: 'pending' });
    if (dup) return res.status(409).json({ error: 'You already have a pending request' });
    const request = new MentorRequest({ name: String(name).trim(), email: clean, reason: String(reason).trim() });
    await request.save();
    res.status(201).json({ message: 'Request submitted successfully', request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
