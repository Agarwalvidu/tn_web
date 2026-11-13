const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mentors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Mentor' 
  }],
  resources: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resource' 
  }],
  description: { type: String },
  syllabus: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Program', ProgramSchema);
