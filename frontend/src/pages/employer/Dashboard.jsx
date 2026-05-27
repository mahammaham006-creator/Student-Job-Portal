import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/employer/my-jobs')
      .then(r => setJobs(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <Spinner />;

  const active = jobs.filter(j => j.status === 'active').length;
  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          <p className="text-gray-500 text-sm">{user?.companyId?.name || 'Your Company'}</p>
        </div>
        <Link to="/employer/post-job" className="btn-primary">+ Post Job</Link>
      </div>

      {!user?.isVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="font-medium text-yellow-800">⚠️ Account pending verification</p>
          <p className="text-sm text-yellow-600">Your job posts will be reviewed by admin before going live.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[['Total Jobs', jobs.length], ['Active', active], ['Total Applicants', totalApps]].map(([l, v]) => (
          <div key={l} className="card text-center">
            <div className="text-3xl font-bold text-primary-600">{v}</div>
            <div className="text-sm text-gray-500 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Job listings */}
      <h2 className="text-lg font-semibold mb-4">Your Job Postings</h2>
      {jobs.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          No jobs posted yet. <Link to="/employer/post-job" className="text-primary-600 hover:underline">Post your first job</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job._id} className="card flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{job.title}</h3>
                  <span className={`badge ${job.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {job.isApproved ? 'Live' : 'Pending Approval'}
                  </span>
                  <span className={`badge ${job.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {job.applicationsCount || 0} applicants · Deadline: {new Date(job.deadline).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to={`/employer/jobs/${job._id}/applicants`} className="btn-secondary text-sm py-1.5">
                  View Applicants
                </Link>
                <Link to={`/employer/jobs/${job._id}/edit`} className="btn-secondary text-sm py-1.5">Edit</Link>
                <button onClick={() => handleDelete(job._id)} className="text-sm text-red-500 hover:text-red-700 px-2">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
