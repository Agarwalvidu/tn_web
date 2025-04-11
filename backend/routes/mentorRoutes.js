const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Mentor = require("../models/Mentor");
const Program = require("../models/Program");
const protect = require("../middleware/authMentor");
const router = express.Router();

// @route   POST /api/mentors/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let mentor = await Mentor.findOne({ email });
    if (mentor) return res.status(400).json({ error: "Mentor already exists" });

    mentor = new Mentor({ name, email, password: await bcrypt.hash(password, 10) });
    await mentor.save();

    const payload = { id: mentor._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/mentors/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const mentor = await Mentor.findOne({ email });
    if (!mentor) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: mentor._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/mentors/programs (Protected)
router.get("/programs", protect, async (req, res) => {
  try {
    const programs = await Program.find({ mentor: req.mentor._id }).populate("resources");
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;