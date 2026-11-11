const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const { requireRole } = require('../middleware/requireRole');
const router = express.Router();

// POST /api/auth/login
// Body: { email, password, role }   role: admin | mentor | mentee
// For mentee: email field can also be an enrollment number (starts with TN)
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'email, password and role are required' });
    }

    let user = null;

    if (role === 'admin') {
      user = await Admin.findOne({ email: email.trim().toLowerCase() });
    } else if (role === 'mentor') {
      user = await Mentor.findOne({ email: email.trim().toLowerCase() });
    } else if (role === 'mentee') {
      // Allow login by enrollment number (starts with TN) or email
      if (/^TN\d{2}-\d+$/i.test(email.trim())) {
        user = await Mentee.findOne({ enrollmentNumber: email.trim().toUpperCase() });
      } else {
        user = await Mentee.findOne({ email: email.trim().toLowerCase() });
      }
    } else {
      return res.status(400).json({ error: 'Invalid role. Must be admin, mentor or mentee.' });
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const payload = { id: user._id, role: user.role || role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || role,
        mustChangePassword: user.mustChangePassword || false,
        avatar: user.avatar || ''
      },
      mustChangePassword: user.mustChangePassword || false
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/change-password
// Requires auth (any role). Body: { currentPassword, newPassword }
// If user.mustChangePassword is true, currentPassword check is skipped (first-login flow).
router.post('/change-password', requireRole('admin', 'mentor', 'mentee'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: 'newPassword is required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Fetch user WITH password for verification
    let userWithPassword = null;
    const userRole = req.user.role;
    const userId = req.user._id;

    if (userRole === 'admin') {
      userWithPassword = await Admin.findById(userId);
    } else if (userRole === 'mentor') {
      userWithPassword = await Mentor.findById(userId);
    } else if (userRole === 'mentee') {
      userWithPassword = await Mentee.findById(userId);
    }

    if (!userWithPassword) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Skip current password check on first-login forced change
    if (!userWithPassword.mustChangePassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'currentPassword is required' });
      }
      const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    userWithPassword.password = await bcrypt.hash(newPassword, 10);
    userWithPassword.mustChangePassword = false;
    await userWithPassword.save();

    res.json({ message: 'Password changed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
