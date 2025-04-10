const express = require("express");
const Resource = require("../models/Resource");
const Program = require("../models/Program");

const router = express.Router();

// Add a new resource to a program
router.post("/", async (req, res) => {
    try {
        const { heading, deadline, assigned_score, video_link, programId } = req.body;

        const program = await Program.findById(programId);
        if (!program) return res.status(404).json({ error: "Program not found" });

        const newResource = new Resource({
            heading,
            deadline,
            assigned_score,
            video_link,
            program: programId,
        });

        await newResource.save();
        program.resources.push(newResource._id);
        await program.save();

        res.status(201).json(newResource);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all resources
router.get("/", async (req, res) => {
    try {
        const resources = await Resource.find().populate("program");
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
