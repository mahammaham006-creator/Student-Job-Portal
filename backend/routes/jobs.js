const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, authorize, requireVerified } = require('../middleware/auth');
const matchJobsForStudent = require('../utils/matchJobs');
const { sendJobMatchEmail } = require('../utils/sendEmail');

// GET /api/jobs/employer/my-jobs  ← MUST be before /:id
router.get('/employer/my-jobs', protect, authorize('employer'), async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/recommended  ← MUST be before /:id
router.get('/recommended', protect, authorize('student'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobs = await Job.find({ status: 'active', isApproved: true })
      .populate('company', 'name logo location industry isVerified');
    const matched = matchJobsForStudent(user.profile?.skills || [], jobs);
    res.json(matched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs - list with filters
router.get('/', async (req, res) => {
  try {
    const { search, type, workMode, branch, minStipend, maxStipend, skills, page = 1, limit = 12 } = req.query;
    const query = { status: 'active', isApproved: true };

    if (search) query.$text = { $search: search };
    if (type) query.type = type;
    if (workMode) query.workMode = workMode;
    if (branch) query.branch = { $in: branch.split(',') };
    if (skills) query.skillsRequired = { $in: skills.split(',') };
    if (minStipend) query['stipend.min'] = { $gte: Number(minStipend) };
    if (maxStipend) query['stipend.max'] = { $lte: Number(maxStipend) };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo location industry isVerified')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ jobs, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('company').populate('employer', 'name profile.avatar');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs - employer creates job
router.post('/', protect, authorize('employer'), async (req, res) => {
  try {
    const employer = await User.findById(req.user._id);
    const job = await Job.create({ ...req.body, employer: req.user._id, company: employer.companyId });

    // Notify matching students
    const students = await User.find({ role: 'student', isVerified: true });
    const matching = students.filter(s =>
      (s.profile?.skills || []).some(skill =>
        (job.skillsRequired || []).map(r => r.toLowerCase()).includes(skill.toLowerCase())
      )
    );
    if (matching.length) {
      matching.forEach(s => sendJobMatchEmail(s.email, [job]).catch(() => {}));
    }

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/jobs/:id - employer updates own job
router.put('/:id', protect, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, employer: req.user._id };
    const job = await Job.findOneAndDelete(filter);
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
