import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/companies/unverified')
      .then(r => setCompanies(r.data))
      .finally(() => setLoading(false));
  }, []);

  const verify = async (id) => {
    try {
      await api.put(`/admin/companies/${id}/verify`);
      setCompanies(prev => prev.filter(c => c._id !== id));
      toast.success('Company verified!');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Pending Company Verifications</h1>
      <p className="text-gray-500 text-sm mb-6">{companies.length} companies awaiting verification</p>
      {loading ? <Spinner /> : companies.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">All companies verified!</div>
      ) : (
        <div className="space-y-4">
          {companies.map(c => (
            <div key={c._id} className="card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {c.logo ? (
                  <img src={c.logo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    {c.name?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.industry} · {c.location}</p>
                  <p className="text-xs text-gray-400">Owner: {c.owner?.name} ({c.owner?.email})</p>
                  {c.linkedIn && (
                    <a href={c.linkedIn} target="_blank" rel="noreferrer" className="text-xs text-primary-600 hover:underline">LinkedIn</a>
                  )}
                </div>
              </div>
              <button onClick={() => verify(c._id)} className="btn-primary text-sm py-1.5 flex-shrink-0">Verify</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
