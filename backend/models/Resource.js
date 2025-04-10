const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    deadline: { type: Date, required: true },
    assigned_score: { type: Number, required: true },
    video_link: { type: String, required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
});

module.exports = mongoose.model("Resource", ResourceSchema);
