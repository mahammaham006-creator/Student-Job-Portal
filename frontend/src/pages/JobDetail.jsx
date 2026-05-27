import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import { MapPinIcon, ClockIcon, CalendarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(r => setJob(r.data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      await api.post(`/applications/${id}`, { coverLetter });
      toast.success('Application submitted!');
      setApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Spinner />;
  if (!job) return <div className="text-center py-20 text-gray-500">Job not found</div>;

  const stipend = job.stipend?.isPaid
    ? `₹${job.stipend.min?.toLocaleString()}${job.stipend.max ? ` – ₹${job.stipend.max?.toLocaleString()}` : ''}/month`
    : 'Unpaid';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start gap-4">
              {job.company?.logo ? (
                <img src={job.company.logo} alt={job.company.name} className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-2xl">{job.company?.name?.[0]}</span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-gray-600">{job.company?.name}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="badge bg-blue-100 text-blue-700 capitalize">{job.type}</span>
                  <span className="badge bg-green-100 text-green-700 capitalize">{job.workMode}</span>
                  {job.company?.isVerified && <span className="badge bg-emerald-100 text-emerald-700">✓ Verified</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Stipend</div>
                <div className="font-semibold text-sm">{stipend}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Duration</div>
                <div className="font-semibold text-sm">{job.duration || 'N/A'}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Openings</div>
                <div className="font-semibold text-sm">{job.openings}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Deadline</div>
                <div className="font-semibold text-sm">{new Date(job.deadline).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {job.description && (
            <div className="card">
              <h2 className="font-semibold text-lg mb-3">About the Role</h2>
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>
          )}

          {job.responsibilities && (
            <div className="card">
              <h2 className="font-semibold text-lg mb-3">Responsibilities</h2>
              <p className="text-gray-600 whitespace-pre-line">{job.responsibilities}</p>
            </div>
          )}

          {job.requirements && (
            <div className="card">
              <h2 className="font-semibold text-lg mb-3">Requirements</h2>
              <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {job.skillsRequired?.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-lg mb-3">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map(s => <span key={s} className="badge bg-primary-100 text-primary-700">{s}</span>)}
              </div>
            </div>
          )}

          {job.perks?.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-lg mb-3">Perks</h2>
              <div className="flex flex-wrap gap-2">
                {job.perks.map(p => <span key={p} className="badge bg-yellow-100 text-yellow-700">🎁 {p}</span>)}
              </div>
            </div>
          )}

          {/* Apply form */}
          {showApplyForm && (
            <div className="card border-2 border-primary-200">
              <h2 className="font-semibold text-lg mb-3">Apply for this role</h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
                  <textarea rows={5} className="input resize-none" placeholder="Tell the employer why you're a great fit..."
                    value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={applying} className="btn-primary">{applying ? 'Submitting...' : 'Submit Application'}</button>
                  <button type="button" onClick={() => setShowApplyForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card">
            {applied ? (
              <div className="text-center py-2">
                <div className="text-2xl mb-2">✅</div>
                <p className="font-medium text-green-700">Application Submitted</p>
                <Link to="/student/applications" className="text-sm text-primary-600 hover:underline mt-1 block">Track your application</Link>
              </div>
            ) : user?.role === 'student' ? (
              <button onClick={() => setShowApplyForm(true)} className="btn-primary w-full">Apply Now</button>
            ) : !user ? (
              <Link to="/login" className="btn-primary w-full block text-center">Login to Apply</Link>
            ) : null}
            <div className="mt-3 text-xs text-gray-400 text-center">{job.applicationsCount} applicants</div>
          </div>

          {job.company && (
            <div className="card">
              <h3 className="font-semibold mb-3">About the Company</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {job.company.location && <div className="flex items-center gap-2"><MapPinIcon className="w-4 h-4" />{job.company.location}</div>}
                {job.company.industry && <div className="flex items-center gap-2"><BuildingOfficeIcon className="w-4 h-4" />{job.company.industry}</div>}
                {job.company.website && <a href={job.company.website} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline block">Visit Website</a>}
              </div>
              {job.company.description && <p className="text-sm text-gray-500 mt-3">{job.company.description}</p>}
            </div>
          )}

          {user?.role === 'student' && (
            <Link to="/chat" state={{ employerId: job.employer?._id, jobId: job._id }}
              className="btn-secondary w-full block text-center text-sm">
              💬 Message Recruiter
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
