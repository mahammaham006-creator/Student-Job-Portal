import { useEffect, useState } from 'react';
import api from '../../utils/api';
import StatusBadge from '../../components/applications/StatusBadge';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const STATUSES = ['all', 'applied', 'under_review', 'interview_scheduled', 'selected', 'rejected'];

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    api.get('/applications/my')
      .then(r => setApplications(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return;
    setWithdrawing(id);
    try {
      await api.delete(`/applications/${id}`);
      setApplications(prev => prev.filter(a => a._id !== id));
      toast.success('Application withdrawn');
    } catch {
      toast.error('Failed to withdraw');
    } finally {
      setWithdrawing(null);
    }
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Application Tracker</h1>
      <p className="text-gray-500 text-sm mb-6">{applications.length} total applications</p>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${filter === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s.replace('_', ' ')}
            {s !== 'all' && <span className="ml-1 text-xs">({applications.filter(a => a.status === s).length})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          {filter === 'all' ? (
            <>No applications yet. <Link to="/jobs" className="text-primary-600 hover:underline">Browse jobs</Link></>
          ) : `No ${filter.replace('_', ' ')} applications.`}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            <div key={app._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {app.job?.company?.logo ? (
                    <img src={app.job.company.logo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-bold">{app.job?.company?.name?.[0]}</span>
                    </div>
                  )}
                  <div>
                    <Link to={`/jobs/${app.job?._id}`} className="font-semibold hover:text-primary-600">{app.job?.title}</Link>
                    <p className="text-sm text-gray-500">{app.job?.company?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {app.status === 'interview_scheduled' && app.interviewDate && (
                <div className="mt-3 p-3 bg-purple-50 rounded-lg text-sm">
                  <p className="font-medium text-purple-800">Interview Scheduled</p>
                  <p className="text-purple-600">{new Date(app.interviewDate).toLocaleString()}</p>
                  {app.interviewLink && (
                    <a href={app.interviewLink} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">Join Interview</a>
                  )}
                </div>
              )}

              {app.status === 'applied' && (
                <div className="mt-3 flex justify-end">
                  <button onClick={() => handleWithdraw(app._id)} disabled={withdrawing === app._id}
                    className="text-sm text-red-500 hover:text-red-700">
                    {withdrawing === app._id ? 'Withdrawing...' : 'Withdraw'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
