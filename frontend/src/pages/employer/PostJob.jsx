import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const PERKS = ['Certificate', 'Letter of Recommendation', 'Pre-Placement Offer', 'Flexible Hours', 'Mentorship', 'Travel Allowance'];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', type: 'internship', workMode: 'on-site',
    skillsRequired: [], duration: '', openings: 1,
    deadline: '', stipend: { min: '', max: '', isPaid: true },
    perks: [], requirements: '', responsibilities: '', branch: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setStipend = (key, val) => setForm(f => ({ ...f, stipend: { ...f.stipend, [key]: val } }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skillsRequired.includes(s)) set('skillsRequired', [...form.skillsRequired, s]);
    setSkillInput('');
  };

  const togglePerk = (p) => set('perks', form.perks.includes(p) ? form.perks.filter(x => x !== p) : [...form.perks, p]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/jobs', form);
      toast.success('Job posted! Awaiting admin approval.');
      navigate('/employer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Basic Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
            <input required className="input" placeholder="e.g. Frontend Developer Intern"
              value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                {['internship', 'part-time', 'full-time', 'freelance'].map(t => (
                  <option key={t} value={t} className="capitalize">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
              <select className="input" value={form.workMode} onChange={e => set('workMode', e.target.value)}>
                {['remote', 'on-site', 'hybrid'].map(m => (
                  <option key={m} value={m} className="capitalize">{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input className="input" placeholder="e.g. 2 months" value={form.duration} onChange={e => set('duration', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Openings</label>
              <input type="number" min={1} className="input" value={form.openings} onChange={e => set('openings', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline *</label>
              <input type="date" required className="input" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Stipend</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.stipend.isPaid} onChange={e => setStipend('isPaid', e.target.checked)} />
            Paid internship/job
          </label>
          {form.stipend.isPaid && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Stipend (₹/month)</label>
                <input type="number" className="input" value={form.stipend.min} onChange={e => setStipend('min', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Stipend (₹/month)</label>
                <input type="number" className="input" value={form.stipend.max} onChange={e => setStipend('max', e.target.value)} />
              </div>
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Description</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About the Role *</label>
            <textarea required rows={4} className="input resize-none" value={form.description}
              onChange={e => set('description', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
            <textarea rows={3} className="input resize-none" value={form.responsibilities}
              onChange={e => set('responsibilities', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <textarea rows={3} className="input resize-none" value={form.requirements}
              onChange={e => set('requirements', e.target.value)} />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Skills Required</h2>
          <div className="flex gap-2">
            <input className="input" placeholder="Add skill..." value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
            <button type="button" onClick={addSkill} className="btn-secondary px-4">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skillsRequired.map(s => (
              <span key={s} className="badge bg-primary-100 text-primary-700 flex items-center gap-1">
                {s}
                <button type="button" onClick={() => set('skillsRequired', form.skillsRequired.filter(x => x !== s))} className="ml-1">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-semibold text-lg">Perks</h2>
          <div className="flex flex-wrap gap-2">
            {PERKS.map(p => (
              <button key={p} type="button" onClick={() => togglePerk(p)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${form.perks.includes(p) ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}
