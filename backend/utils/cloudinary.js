const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'resumes', allowed_formats: ['pdf', 'doc', 'docx'], resource_type: 'raw' }
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'avatars', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] }
});

exports.uploadResume = multer({ storage: resumeStorage });
exports.uploadImage = multer({ storage: imageStorage });
exports.cloudinary = cloudinary;
