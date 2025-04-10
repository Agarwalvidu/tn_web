const express = require("express");
const Program = require("../models/Program");

const router = express.Router();

// Create a new program
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        const newProgram = new Program({ name });
        await newProgram.save();
        res.status(201).json(newProgram);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all programs
router.get("/", async (req, res) => {
    try {
        const programs = await Program.find().populate("resources");
        res.status(200).json(programs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
