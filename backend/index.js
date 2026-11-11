require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));         // Unified auth (login, change-password)
app.use('/api/admin', require('./routes/adminRoutes'));       // Admin panel routes
app.use('/api/mentor-requests', require('./routes/mentorRequestRoutes')); // Public mentor request form
app.use('/api/mentor', require('./routes/mentorRoutes'));      // Mentor panel routes
app.use('/api/public', require('./routes/publicRoutes'));      // Cohort listing + leaderboard (no auth)
app.use('/api/m', require('./routes/menteeRoutes'));          // Mentee portal routes

app.get('/', (req, res) => res.send('Mentorship API Running'));

// Any error thrown in an async route comes here as JSON (Express 5 forwards rejected promises)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// PORT: default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
