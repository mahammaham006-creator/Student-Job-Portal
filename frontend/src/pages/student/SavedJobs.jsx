import { useEffect, useState } from 'react';
import api from '../../utils/api';
import JobCard from '../../components/jobs/JobCard';
import Spinner from '../../components/common/Spinner';
import { Link } from 'react-router-dom';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = () => {
    api.get('/users/saved-jobs')
      .then(r => setJobs(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSaved(); }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
      {jobs.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          No saved jobs yet. <Link to="/jobs" className="text-primary-600 hover:underline">Browse jobs</Link> and bookmark ones you like.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => <JobCard key={job._id} job={job} savedIds={jobs.map(j => j._id)} onSaveToggle={fetchSaved} />)}
        </div>
      )}
    </div>
  );
}
