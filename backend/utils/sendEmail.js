const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Student Job Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

exports.sendVerificationEmail = (email, token) =>
  sendEmail({
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${process.env.CLIENT_URL}/verify-email/${token}">here</a> to verify your email.</p>`
  });

exports.sendStatusUpdateEmail = (email, jobTitle, status) =>
  sendEmail({
    to: email,
    subject: `Application Update: ${jobTitle}`,
    html: `<p>Your application for <strong>${jobTitle}</strong> has been updated to: <strong>${status.replace('_', ' ')}</strong>.</p>`
  });

exports.sendJobMatchEmail = (email, jobs) =>
  sendEmail({
    to: email,
    subject: 'New jobs matching your profile!',
    html: `<p>New jobs matching your skills:</p><ul>${jobs.map(j => `<li><a href="${process.env.CLIENT_URL}/jobs/${j._id}">${j.title}</a></li>`).join('')}</ul>`
  });

exports.sendPasswordResetEmail = (email, token) =>
  sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${process.env.CLIENT_URL}/reset-password/${token}">here</a> to reset your password. Link expires in 1 hour.</p>`
  });
