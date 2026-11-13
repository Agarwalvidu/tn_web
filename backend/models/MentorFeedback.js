
const mongoose = require('mongoose');

const MentorFeedbackSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentee',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  }
}, { timestamps: true });

// One feedback entry per mentee, mentor and cohort
MentorFeedbackSchema.index(
  { mentee: 1, mentor: 1, cohort: 1 },
  { unique: true }
);

module.exports = mongoose.model('MentorFeedback', MentorFeedbackSchema);