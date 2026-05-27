import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/applications/StatusBadge';
import toast from 'react-hot-toast';

const STATUSES = ['under_review', 'interview_scheduled', 'selected', 'rejected'];

export default function Applicants() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ date: '', link: '', notes: '' });

  useEffect(() => {
    api.get(`/applications/job/${id}`)
      .then(r => setApplicants(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (appId, status, extra = {}) => {
    try {
      const { data } = await api.put(`/applications/${appId}/status`, { status, ...extra });
      setApplicants(prev => prev.map(a => a._id === appId ? { ...a, ...data } : a));
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
      setSelected(null);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Applicants</h1>
      <p className="text-gray-500 text-sm mb-6">{applicants.length} total applicants</p>

      {applicants.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">No applicants yet.</div>
      ) : (
        <div className="space-y-4">
          {applicants.map(app => (
            <div key={app._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">{app.student?.name?.[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{app.student?.name}</p>
                    <p className="text-sm text-gray-500">{app.student?.email}</p>
                    {app.student?.profile?.university && (
                      <p className="text-xs text-gray-400">{app.student.profile.university} · {app.student.profile.branch}</p>
                    )}
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {/* Skills */}
              {app.student?.profile?.skills?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {app.student.profile.skills.map(s => (
                    <span key={s} className="badge bg-gray-100 text-gray-600">{s}</span>
                  ))}
                </div>
              )}

              {/* Cover letter */}
              {app.coverLetter && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">Cover Letter</p>
                  <p className="line-clamp-3">{app.coverLetter}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {app.student?.profile?.resumeUrl && (
                  <a href={app.student.profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-secondary text-sm py-1.5">
                    📄 View Resume
                  </a>
                )}
                <Link to={`/chat/${app.student?._id}`} className="btn-secondary text-sm py-1.5">💬 Message</Link>

                {app.status === 'applied' && (
                  <button onClick={() => updateStatus(app._id, 'under_review')} className="btn-primary text-sm py-1.5">
                    Move to Review
                  </button>
                )}
                {app.status === 'under_review' && (
                  <>
                    <button onClick={() => setSelected(app._id)} className="btn-primary text-sm py-1.5">
                      Schedule Interview
                    </button>
                    <button onClick={() => updateStatus(app._id, 'rejected')} className="text-sm text-red-500 hover:text-red-700 px-2">
                      Reject
                    </button>
                  </>
                )}
                {app.status === 'interview_scheduled' && (
                  <>
                    <button onClick={() => updateStatus(app._id, 'selected')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">
                      Select ✓
                    </button>
                    <button onClick={() => updateStatus(app._id, 'rejected')} className="text-sm text-red-500 hover:text-red-700 px-2">
                      Reject
                    </button>
                  </>
                )}
              </div>

              {/* Interview scheduling form */}
              {selected === app._id && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg space-y-3">
                  <p className="font-medium text-purple-800">Schedule Interview</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date & Time</label>
                      <input type="datetime-local" className="input text-sm" value={interviewForm.date}
                        onChange={e => setInterviewForm(f => ({ ...f, date: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Meeting Link</label>
                      <input type="url" className="input text-sm" placeholder="https://meet.google.com/..."
                        value={interviewForm.link} onChange={e => setInterviewForm(f => ({ ...f, link: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(app._id, 'interview_scheduled', {
                      interviewDate: interviewForm.date, interviewLink: interviewForm.link
                    })} className="btn-primary text-sm">Confirm</button>
                    <button onClick={() => setSelected(null)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
