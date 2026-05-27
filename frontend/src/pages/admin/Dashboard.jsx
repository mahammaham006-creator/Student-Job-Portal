import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data));
  }, []);

  if (!stats) return <Spinner />;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, to: '/admin/users', color: 'text-blue-600' },
    { label: 'Students', value: stats.students, to: '/admin/users?role=student', color: 'text-indigo-600' },
    { label: 'Employers', value: stats.employers, to: '/admin/users?role=employer', color: 'text-purple-600' },
    { label: 'Total Jobs', value: stats.totalJobs, to: '/admin/jobs', color: 'text-green-600' },
    { label: 'Active Jobs', value: stats.activeJobs, to: '/admin/jobs', color: 'text-emerald-600' },
    { label: 'Applications', value: stats.totalApplications, to: '#', color: 'text-yellow-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {(stats.pendingJobs > 0 || stats.unverifiedCompanies > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 space-y-1">
          <p className="font-medium text-red-800">Action Required</p>
          {stats.pendingJobs > 0 && (
            <p className="text-sm text-red-600">
              {stats.pendingJobs} job(s) pending approval. <Link to="/admin/jobs" className="underline">Review now</Link>
            </p>
          )}
          {stats.unverifiedCompanies > 0 && (
            <p className="text-sm text-red-600">
              {stats.unverifiedCompanies} company(ies) pending verification. <Link to="/admin/companies" className="underline">Review now</Link>
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, to, color }) => (
          <Link key={label} to={to} className="card text-center hover:shadow-md transition-shadow">
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { to: '/admin/users', label: 'Manage Users', icon: '👥' },
          { to: '/admin/jobs', label: 'Approve Jobs', icon: '💼' },
          { to: '/admin/companies', label: 'Verify Companies', icon: '🏢' },
        ].map(({ to, label, icon }) => (
          <Link key={to} to={to} className="card text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{icon}</div>
            <p className="font-medium">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
