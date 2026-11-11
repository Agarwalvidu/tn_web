const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  programs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Program' 
  }],
  role: { type: String, default: 'mentor' },
  mustChangePassword: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }
}, { timestamps: true });

module.exports = mongoose.model('Mentor', MentorSchema);
