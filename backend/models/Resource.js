const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'quiz', 'text'], required: true },
  url: { type: String },
  deadline: { type: Date },
  maxScore: { type: Number, default: 10 },
  program: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Program',
    required: true 
  },
  isLocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);