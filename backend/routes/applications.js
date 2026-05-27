const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { sendStatusUpdateEmail } = require('../utils/sendEmail');

// POST /api/applications/:jobId - student applies
router.post('/:jobId', protect, authorize('student'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== 'active') return res.status(400).json({ message: 'Job not available' });
    if (new Date(job.deadline) < new Date()) return res.status(400).json({ message: 'Application deadline passed' });

    const student = await User.findById(req.user._id);
    const app = await Application.create({
      student: req.user._id,
      job: req.params.jobId,
      company: job.company,
      resumeUrl: req.body.resumeUrl || student.profile?.resumeUrl,
      coverLetter: req.body.coverLetter
    });

    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicationsCount: 1 } });
    res.status(201).json(app);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already applied to this job' });
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/my - student's applications
router.get('/my', protect, authorize('student'), async (req, res) => {
  const apps = await Application.find({ student: req.user._id })
    .populate({ path: 'job', populate: { path: 'company', select: 'name logo' } })
    .sort({ createdAt: -1 });
  res.json(apps);
});

// GET /api/applications/job/:jobId - employer views applicants for a job
router.get('/job/:jobId', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (req.user.role === 'employer' && job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const apps = await Application.find({ job: req.params.jobId })
      .populate('student', 'name email profile')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/applications/:id/status - employer updates status
router.put('/:id/status', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate('job').populate('student', 'email name');
    if (!app) return res.status(404).json({ message: 'Application not found' });

    if (req.user.role === 'employer' && app.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, interviewDate, interviewLink, employerNotes } = req.body;
    app.status = status || app.status;
    if (interviewDate) app.interviewDate = interviewDate;
    if (interviewLink) app.interviewLink = interviewLink;
    if (employerNotes) app.employerNotes = employerNotes;
    await app.save();

    // Notify student via email and in-app notification
    await sendStatusUpdateEmail(app.student.email, app.job.title, app.status).catch(() => {});
    await User.findByIdAndUpdate(app.student._id, {
      $push: {
        notifications: {
          message: `Your application for "${app.job.title}" is now: ${app.status.replace('_', ' ')}`
        }
      }
    });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/applications/:id - student withdraws
router.delete('/:id', protect, authorize('student'), async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, student: req.user._id });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    await Job.findByIdAndUpdate(app.job, { $inc: { applicationsCount: -1 } });
    res.json({ message: 'Application withdrawn' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
