const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  // Optional: link to a job/application for context
  relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
