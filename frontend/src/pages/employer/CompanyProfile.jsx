import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function CompanyProfile() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.companyId?._id || user?.companyId) {
      const id = user.companyId?._id || user.companyId;
      api.get(`/companies/${id}`).then(r => {
        setCompany(r.data);
        setForm(r.data);
      });
    }
  }, [user]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const id = company._id;
      const { data } = await api.put(`/companies/${id}`, form);
      setCompany(data);
      toast.success('Company profile updated!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('logo', file);
    setUploading(true);
    try {
      const { data } = await api.post(`/companies/${company._id}/upload-logo`, fd);
      setForm(f => ({ ...f, logo: data.logo }));
      toast.success('Logo uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!company) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Company Profile</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="card space-y-4">
          <div className="flex items-center gap-4">
            {form.logo ? (
              <img src={form.logo} alt="Logo" className="w-20 h-20 rounded-xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-bold text-3xl">{form.name?.[0]}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm" />
              {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input className="input" value={form.name || ''} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input className="input" placeholder="e.g. Technology, Finance" value={form.industry || ''} onChange={e => set('industry', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input className="input" value={form.location || ''} onChange={e => set('location', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
              <select className="input" value={form.size || ''} onChange={e => set('size', e.target.value)}>
                <option value="">Select size</option>
                {['1-10', '11-50', '51-200', '201-500', '500+'].map(s => <option key={s} value={s}>{s} employees</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About the Company</label>
            <textarea rows={4} className="input resize-none" value={form.description || ''} onChange={e => set('description', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Culture</label>
            <textarea rows={3} className="input resize-none" placeholder="Describe your work culture..."
              value={form.culture || ''} onChange={e => set('culture', e.target.value)} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" className="input" value={form.website || ''} onChange={e => set('website', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input type="url" className="input" value={form.linkedIn || ''} onChange={e => set('linkedIn', e.target.value)} />
            </div>
          </div>
        </div>

        {!company.isVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
            ⚠️ Your company is pending admin verification. Add your LinkedIn URL to speed up the process.
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving...' : 'Save Company Profile'}
        </button>
      </form>
    </div>
  );
}
