import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/jobs/pending')
      .then(r => setJobs(r.data))
      .finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    try {
      const { data } = await api.put(`/admin/jobs/${id}/approve`);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Job approved and live!');
    } catch { toast.error('Failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Remove this job listing?')) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Job removed');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Pending Job Approvals</h1>
      <p className="text-gray-500 text-sm mb-6">{jobs.length} jobs awaiting review</p>
      {loading ? <Spinner /> : jobs.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">All caught up! No pending jobs.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company?.name} · {job.employer?.name} ({job.employer?.email})</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="badge bg-blue-100 text-blue-700 capitalize">{job.type}</span>
                    <span className="badge bg-gray-100 text-gray-600 capitalize">{job.workMode}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => approve(job._id)} className="btn-primary text-sm py-1.5">Approve</button>
                  <button onClick={() => remove(job._id)} className="text-sm text-red-500 hover:text-red-700 px-2">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
