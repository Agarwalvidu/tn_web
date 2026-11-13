const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  mustChangePassword: { type: Boolean, default: false },
  avatar: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
