import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SKILL_SUGGESTIONS = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'Machine Learning', 'Graphic Design', 'Content Writing', 'Data Analysis', 'Flutter', 'Django', 'AWS'];

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    profile: {
      bio: '', phone: '', location: '', university: '', branch: '',
      graduationYear: '', cgpa: '', skills: [], linkedIn: '', github: '', portfolio: '',
      ...user?.profile
    }
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const setProfile = (key, val) => setForm(f => ({ ...f, profile: { ...f.profile, [key]: val } }));

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !form.profile.skills.includes(s)) {
      setProfile('skills', [...form.profile.skills, s]);
    }
    setSkillInput('');
  };

  const removeSkill = (s) => setProfile('skills', form.profile.skills.filter(x => x !== s));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('resume', file);
    setUploading(true);
    try {
      const { data } = await api.post('/users/upload-resume', fd);
      setProfile('resumeUrl', data.resumeUrl);
      toast.success('Resume uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <form onSubmit={handleSave} className="space-y-6">

        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input className="input" value={form.profile.phone} onChange={e => setProfile('phone', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input className="input" placeholder="City, State" value={form.profile.location} onChange={e => setProfile('location', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea rows={3} className="input resize-none" placeholder="Tell employers about yourself..."
              value={form.profile.bio} onChange={e => setProfile('bio', e.target.value)} />
          </div>
        </div>

        {/* Education */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Education</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input className="input" value={form.profile.university} onChange={e => setProfile('university', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch / Major</label>
              <input className="input" placeholder="e.g. Computer Science" value={form.profile.branch} onChange={e => setProfile('branch', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <input type="number" className="input" value={form.profile.graduationYear} onChange={e => setProfile('graduationYear', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
              <input type="number" step="0.01" max="10" className="input" value={form.profile.cgpa} onChange={e => setProfile('cgpa', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Skills</h2>
          <div className="flex gap-2">
            <input className="input" placeholder="Add a skill..." value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }} />
            <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary px-4">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.profile.skills.map(s => (
              <span key={s} className="badge bg-primary-100 text-primary-700 flex items-center gap-1">
                {s}
                <button type="button" onClick={() => removeSkill(s)} className="ml-1 text-primary-500 hover:text-primary-800">×</button>
              </span>
            ))}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-1">
              {SKILL_SUGGESTIONS.filter(s => !form.profile.skills.includes(s)).map(s => (
                <button key={s} type="button" onClick={() => addSkill(s)}
                  className="text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-primary-50 hover:border-primary-300">
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Links</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[['linkedIn', 'LinkedIn URL'], ['github', 'GitHub URL'], ['portfolio', 'Portfolio URL']].map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input className="input" type="url" value={form.profile[key]} onChange={e => setProfile(key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div className="card space-y-3">
          <h2 className="font-semibold text-lg">Resume</h2>
          {form.profile.resumeUrl && (
            <a href={form.profile.resumeUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline text-sm">
              📄 View current resume
            </a>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF/DOC)</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="text-sm" />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
