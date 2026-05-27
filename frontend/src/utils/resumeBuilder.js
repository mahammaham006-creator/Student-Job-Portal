import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a PDF resume from the student's profile data
 */
export const generateResumePDF = (user) => {
  const doc = new jsPDF();
  const { name, email, profile = {} } = user;
  const { phone, location, university, branch, graduationYear, cgpa, skills = [],
    linkedIn, github, bio, experience = [], education = [], projects = [] } = profile;

  let y = 20;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(name || 'Your Name', 105, y, { align: 'center' });
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  const contactLine = [email, phone, location].filter(Boolean).join(' | ');
  doc.text(contactLine, 105, y, { align: 'center' });
  y += 5;
  const linkLine = [linkedIn, github].filter(Boolean).join(' | ');
  if (linkLine) { doc.text(linkLine, 105, y, { align: 'center' }); y += 5; }

  doc.setTextColor(0);
  doc.setDrawColor(200);
  doc.line(14, y, 196, y);
  y += 6;

  const section = (title) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 14, y);
    y += 1;
    doc.line(14, y, 196, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  };

  // Summary
  if (bio) {
    section('Summary');
    const lines = doc.splitTextToSize(bio, 180);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 4;
  }

  // Education
  if (university || education.length) {
    section('Education');
    if (university) {
      doc.setFont('helvetica', 'bold');
      doc.text(university, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${branch || ''} | ${graduationYear || ''} | CGPA: ${cgpa || ''}`, 14, y + 5);
      y += 12;
    }
    education.forEach(e => {
      doc.setFont('helvetica', 'bold');
      doc.text(e.degree, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${e.institution} | ${e.year} | ${e.grade}`, 14, y + 5);
      y += 12;
    });
  }

  // Skills
  if (skills.length) {
    section('Skills');
    doc.text(skills.join(' • '), 14, y);
    y += 10;
  }

  // Experience
  if (experience.length) {
    section('Experience');
    experience.forEach(e => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${e.title} — ${e.company}`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(e.duration || '', 160, y);
      y += 5;
      if (e.description) {
        const lines = doc.splitTextToSize(e.description, 180);
        doc.text(lines, 14, y);
        y += lines.length * 5;
      }
      y += 4;
    });
  }

  // Projects
  if (projects.length) {
    section('Projects');
    projects.forEach(p => {
      doc.setFont('helvetica', 'bold');
      doc.text(p.name, 14, y);
      doc.setFont('helvetica', 'normal');
      y += 5;
      if (p.description) {
        const lines = doc.splitTextToSize(p.description, 180);
        doc.text(lines, 14, y);
        y += lines.length * 5;
      }
      if (p.techStack?.length) { doc.text(`Tech: ${p.techStack.join(', ')}`, 14, y); y += 5; }
      y += 3;
    });
  }

  doc.save(`${name?.replace(/\s+/g, '_') || 'resume'}_resume.pdf`);
};
