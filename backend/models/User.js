const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'employer', 'admin'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Student-specific
  profile: {
    avatar: String,
    bio: String,
    phone: String,
    location: String,
    university: String,
    branch: String,
    graduationYear: Number,
    cgpa: Number,
    skills: [String],
    resumeUrl: String,
    linkedIn: String,
    github: String,
    portfolio: String,
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      degree: String,
      institution: String,
      year: String,
      grade: String
    }],
    projects: [{
      name: String,
      description: String,
      techStack: [String],
      link: String
    }]
  },

  // Employer-specific
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },

  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  notifications: [{
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
