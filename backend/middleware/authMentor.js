const jwt = require('jsonwebtoken');
const Mentor = require('../models/Mentor');

exports.authenticate = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    // 1. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // 2. Find mentor and attach to request (excluding password)
    const mentor = await Mentor.findById(decoded.id).select('-password');
    if (!mentor) return res.status(401).json({ error: 'Mentor not found' });

    req.mentor = mentor; // Attach mentor to request
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};