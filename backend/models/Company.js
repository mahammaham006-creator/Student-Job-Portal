const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: String,
  description: String,
  industry: String,
  size: { type: String, enum: ['1-10', '11-50', '51-200', '201-500', '500+'] },
  location: String,
  website: String,
  linkedIn: String,
  twitter: String,

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false }, // Admin verified
  verificationDoc: String, // LinkedIn URL or document

  culture: String,
  benefits: [String],
  photos: [String]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
