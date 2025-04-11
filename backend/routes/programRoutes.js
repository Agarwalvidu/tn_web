const express = require("express");
const Program = require("../models/Program");
const protect = require("../middleware/authMentor");
const router = express.Router();

// @route   POST /api/programs (Protected)
router.post("/", protect, async (req, res) => {
  try {
    const program = new Program({
      name: req.body.name,
      mentor: req.mentor._id
    });

    await program.save();
    
    // Add program to mentor's programs array
    req.mentor.programs.push(program._id);
    await req.mentor.save();

    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Keep your existing GET /api/programs route
module.exports = router;