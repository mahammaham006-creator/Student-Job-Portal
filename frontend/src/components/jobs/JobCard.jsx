import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, CurrencyRupeeIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  remote: 'bg-green-100 text-green-700',
  'on-site': 'bg-blue-100 text-blue-700',
  hybrid: 'bg-purple-100 text-purple-700',
  internship: 'bg-yellow-100 text-yellow-700',
  'full-time': 'bg-indigo-100 text-indigo-700',
  'part-time': 'bg-pink-100 text-pink-700',
};

export default function JobCard({ job, savedIds = [], onSaveToggle }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(savedIds.includes(job._id));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login to save jobs');
    try {
      await api.post(`/users/save-job/${job._id}`);
      setSaved(!saved);
      onSaveToggle?.();
    } catch {
      toast.error('Failed to save job');
    }
  };

  const stipend = job.stipend?.isPaid
    ? `₹${job.stipend.min?.toLocaleString()}${job.stipend.max ? ` - ₹${job.stipend.max?.toLocaleString()}` : ''}/mo`
    : 'Unpaid';

  return (
    <Link to={`/jobs/${job._id}`} className="card hover:shadow-md transition-shadow block group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {job.company?.logo ? (
            <img src={job.company.logo} alt={job.company.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 font-bold text-lg">{job.company?.name?.[0]}</span>
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 truncate">{job.title}</h3>
            <p className="text-sm text-gray-500 truncate">{job.company?.name}</p>
          </div>
        </div>
        {user?.role === 'student' && (
          <button onClick={handleSave} className="p-1 text-gray-400 hover:text-primary-600 flex-shrink-0">
            {saved ? <BookmarkSolid className="w-5 h-5 text-primary-600" /> : <BookmarkIcon className="w-5 h-5" />}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`badge ${statusColors[job.workMode] || 'bg-gray-100 text-gray-600'}`}>{job.workMode}</span>
        <span className={`badge ${statusColors[job.type] || 'bg-gray-100 text-gray-600'}`}>{job.type}</span>
        {job.company?.isVerified && <span className="badge bg-green-100 text-green-700">✓ Verified</span>}
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {job.skillsRequired?.slice(0, 4).map(s => (
          <span key={s} className="badge bg-gray-100 text-gray-600">{s}</span>
        ))}
        {job.skillsRequired?.length > 4 && <span className="badge bg-gray-100 text-gray-500">+{job.skillsRequired.length - 4}</span>}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-3">
          {job.company?.location && (
            <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" />{job.company.location}</span>
          )}
          {job.duration && (
            <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" />{job.duration}</span>
          )}
        </div>
        <span className="flex items-center gap-1 font-medium text-gray-700">
          <CurrencyRupeeIcon className="w-4 h-4" />{stipend}
        </span>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        {job.deadline && ` · Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
      </div>
    </Link>
  );
}
