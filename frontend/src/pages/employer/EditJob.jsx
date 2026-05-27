import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r => {
      const j = r.data;
      setForm({
        title: j.title, description: j.description, type: j.type, workMode: j.workMode,
        skillsRequired: j.skillsRequired || [], duration: j.duration || '',
        openings: j.openings, deadline: j.deadline?.split('T')[0] || '',
        stipend: j.stipend || { min: '', max: '', isPaid: true },
        perks: j.perks || [], requirements: j.requirements || '',
        responsibilities: j.responsibilities || '', status: j.status
      });
    }).catch(() => toast.error('Failed to load job'));
  }, [id]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/jobs/${id}`, form);
      toast.success('Job updated!');
      navigate('/employer/dashboard');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input required className="input" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={4} className="input resize-none" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input type="date" className="input" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={() => navigate('/employer/dashboard')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
