const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

// requireRole('admin') or requireRole('mentor', 'admin') etc.
exports.requireRole = (...roles) => async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = null;
    if (decoded.role === 'admin') user = await Admin.findById(decoded.id).select('-password');
    else if (decoded.role === 'mentor') user = await Mentor.findById(decoded.id).select('-password');
    else if (decoded.role === 'mentee') user = await Mentee.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (roles.length && !roles.includes(decoded.role)) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    req.user.role = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
