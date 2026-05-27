import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/jobs/JobCard';
import StatusBadge from '../../components/applications/StatusBadge';
import Spinner from '../../components/common/Spinner';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/jobs/recommended').catch(() => ({ data: [] })),
      api.get('/applications/my').catch(() => ({ data: [] }))
    ]).then(([rec, apps]) => {
      setRecommended(rec.data.slice(0, 3));
      setApplications(apps.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const stats = [
    { label: 'Applications', value: applications.length, to: '/student/applications' },
    { label: 'Under Review', value: applications.filter(a => a.status === 'under_review').length, to: '/student/applications' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'interview_scheduled').length, to: '/student/applications' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to your dashboard.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, to }) => (
          <Link key={label} to={to} className="card text-center hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-primary-600">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </Link>
        ))}
      </div>

      {/* Profile completion */}
      {!user?.profile?.resumeUrl && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-medium text-yellow-800">Complete your profile</p>
            <p className="text-sm text-yellow-600">Add your resume and skills to get better job matches.</p>
          </div>
          <Link to="/student/profile" className="btn-primary text-sm">Update Profile</Link>
        </div>
      )}

      {/* Recent applications */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Applications</h2>
          <Link to="/student/applications" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        {applications.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            No applications yet. <Link to="/jobs" className="text-primary-600 hover:underline">Browse jobs</Link>
          </div>
        ) : (
          <div className="card divide-y divide-gray-100">
            {applications.map(app => (
              <div key={app._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{app.job?.title}</p>
                  <p className="text-xs text-gray-500">{app.job?.company?.name}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recommended for You</h2>
          <Link to="/jobs" className="text-sm text-primary-600 hover:underline">Browse all</Link>
        </div>
        {recommended.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            Add skills to your profile to get personalized recommendations.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  );
}
