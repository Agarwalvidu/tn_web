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
app.use('/api', require('./routes/mentorRoutes'));            // Mentor / program / mentee routes (prefix /api)
app.use('/api/m', require('./routes/menteeRoutes'));          // Mentee portal routes (prefix /api/m)

app.get('/', (req, res) => res.send('Mentorship API Running'));

// PORT: default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
