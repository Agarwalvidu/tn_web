const mongoose = require('mongoose');

const aiProfileSchema = new mongoose.Schema({
  summary: { type: String },
  strengths: [String],
  improvements: [String],
  recommendations: [{
    title: { type: String },
    reason: { type: String }
  }],
  generatedAt: { type: Date },
  statsSnapshot: { type: String }
}, { _id: false });

const MenteeSchema = new mongoose.Schema({
  email: { type: String, required: true},
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
    score: { type: Number, default: 0 },

    // Optional fields for project resources
    githubLink: { type: String },
    deployedLink: { type: String },
    description: { type: String },
    submittedOn: { type: Date },
    verified:{type: Boolean, default:false},
  }],
  streak: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Mentor',
  },

  role: { type: String, default: 'mentee' },
  mustChangePassword: { type: Boolean, default: true },
  avatar: { type: String, default: '' },
  aiProfile: { type: aiProfileSchema, default: () => ({}) }
}, { timestamps: true });

MenteeSchema.index({ email: 1, enrollmentNumber: 1 }, { unique: true });

module.exports = mongoose.model('Mentee', MenteeSchema);
