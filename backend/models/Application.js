const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },

  status: {
    type: String,
    enum: ['applied', 'under_review', 'interview_scheduled', 'selected', 'rejected'],
    default: 'applied'
  },

  resumeUrl: String,
  coverLetter: String,

  interviewDate: Date,
  interviewLink: String, // video call link
  interviewNotes: String, // employer notes

  employerNotes: String,
  rating: { type: Number, min: 1, max: 5 } // employer rating of applicant
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
