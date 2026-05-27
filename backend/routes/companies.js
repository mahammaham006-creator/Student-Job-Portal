const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage } = require('../utils/cloudinary');

// GET /api/companies/:id
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('owner', 'name email');
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/companies/:id - employer updates their company
router.put('/:id', protect, authorize('employer'), async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, owner: req.user._id });
    if (!company) return res.status(404).json({ message: 'Company not found or unauthorized' });
    Object.assign(company, req.body);
    await company.save();
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/companies/:id/upload-logo
router.post('/:id/upload-logo', protect, authorize('employer'), uploadImage.single('logo'), async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { logo: req.file.path },
      { new: true }
    );
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({ logo: company.logo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
