const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
    name: { type: String, required: true },
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
});

module.exports = mongoose.model("Program", ProgramSchema);
