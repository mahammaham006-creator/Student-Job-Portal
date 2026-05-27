const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const { protect, authorize } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin')];

// GET /api/admin/stats - dashboard analytics
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const [totalUsers, students, employers, totalJobs, activeJobs, totalApplications, pendingJobs, unverifiedCompanies] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'employer' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      Job.countDocuments({ isApproved: false }),
      Company.countDocuments({ isVerified: false })
    ]);
    res.json({ totalUsers, students, employers, totalJobs, activeJobs, totalApplications, pendingJobs, unverifiedCompanies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users - list all users
router.get('/users', ...adminOnly, async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;
  const query = role ? { role } : {};
  const users = await User.find(query).select('-password').sort({ createdAt: -1 })
    .skip((page - 1) * limit).limit(Number(limit));
  const total = await User.countDocuments(query);
  res.json({ users, total });
});

// PUT /api/admin/users/:id/verify - verify a user
router.put('/users/:id/verify', ...adminOnly, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true }).select('-password');
  res.json(user);
});

// DELETE /api/admin/users/:id - remove a user
router.delete('/users/:id', ...adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// GET /api/admin/jobs/pending - jobs awaiting approval
router.get('/jobs/pending', ...adminOnly, async (req, res) => {
  const jobs = await Job.find({ isApproved: false }).populate('company', 'name').populate('employer', 'name email');
  res.json(jobs);
});

// PUT /api/admin/jobs/:id/approve
router.put('/jobs/:id/approve', ...adminOnly, async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  res.json(job);
});

// DELETE /api/admin/jobs/:id - remove spam listing
router.delete('/jobs/:id', ...adminOnly, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Job removed' });
});

// GET /api/admin/companies/unverified
router.get('/companies/unverified', ...adminOnly, async (req, res) => {
  const companies = await Company.find({ isVerified: false }).populate('owner', 'name email');
  res.json(companies);
});

// PUT /api/admin/companies/:id/verify
router.put('/companies/:id/verify', ...adminOnly, async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
  res.json(company);
});

module.exports = router;
