const mongoose = require('mongoose');

const MenteeSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  name: { type: String, required: true },
  enrollmentNumber: { type: String, required: true },
  password: { type: String, required: true },
  programs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }],
  completedResources: [{
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    completedOn: { type: Date, default: Date.now },
    score: { type: Number, default: 0 }
  }],
  streak: { type: Number, default: 0 },
  totalScore: {type: Number, default: 0},
  lastActiveDate: { type: Date }, 
  projectSubmissions: [{
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    link: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Mentor',
  }
}, { timestamps: true });

module.exports = mongoose.model('Mentee', MenteeSchema);