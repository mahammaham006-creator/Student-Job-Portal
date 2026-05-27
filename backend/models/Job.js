const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  type: { type: String, enum: ['internship', 'part-time', 'full-time', 'freelance'], default: 'internship' },
  workMode: { type: String, enum: ['remote', 'on-site', 'hybrid'], default: 'on-site' },

  skillsRequired: [String],
  branch: [String], // e.g. ['CSE', 'ECE', 'Any']

  stipend: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' },
    isPaid: { type: Boolean, default: true }
  },

  duration: String, // e.g. "2 months", "6 months"
  openings: { type: Number, default: 1 },
  deadline: { type: Date, required: true },

  perks: [String], // e.g. ['Certificate', 'Letter of Recommendation']
  requirements: String,
  responsibilities: String,

  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  isApproved: { type: Boolean, default: false }, // Admin approval

  applicationsCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

// Text index for search
jobSchema.index({ title: 'text', description: 'text', skillsRequired: 'text' });

module.exports = mongoose.model('Job', jobSchema);
