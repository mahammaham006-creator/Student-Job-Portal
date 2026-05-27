const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { uploadResume, uploadImage } = require('../utils/cloudinary');

// GET /api/users/profile - get own profile
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('companyId').select('-password');
  res.json(user);
});

// PUT /api/users/profile - update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const allowed = ['name', 'profile'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/upload-resume
router.post('/upload-resume', protect, authorize('student'), uploadResume.single('resume'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'profile.resumeUrl': req.file.path },
      { new: true }
    ).select('-password');
    res.json({ resumeUrl: user.profile.resumeUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/upload-avatar
router.post('/upload-avatar', protect, uploadImage.single('avatar'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'profile.avatar': req.file.path },
      { new: true }
    ).select('-password');
    res.json({ avatar: user.profile.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/save-job/:jobId
router.post('/save-job/:jobId', protect, authorize('student'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;
    const idx = user.savedJobs.indexOf(jobId);
    if (idx > -1) {
      user.savedJobs.splice(idx, 1);
    } else {
      user.savedJobs.push(jobId);
    }
    await user.save();
    res.json({ savedJobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/saved-jobs
router.get('/saved-jobs', protect, authorize('student'), async (req, res) => {
  const user = await User.findById(req.user._id).populate({ path: 'savedJobs', populate: { path: 'company' } });
  res.json(user.savedJobs);
});

// GET /api/users/notifications
router.get('/notifications', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('notifications');
  res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
});

// PUT /api/users/notifications/read
router.put('/notifications/read', protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { 'notifications.$[].read': true } });
  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
