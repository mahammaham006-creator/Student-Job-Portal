import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import JobCard from '../components/jobs/JobCard';
import Spinner from '../components/common/Spinner';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const TYPES = ['internship', 'part-time', 'full-time', 'freelance'];
const MODES = ['remote', 'on-site', 'hybrid'];

export default function JobList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: '', workMode: '', minStipend: '', maxStipend: '', skills: '',
    page: 1
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const update = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Browse Jobs</h1>
          <p className="text-gray-500 text-sm">{total} opportunities found</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2 md:hidden">
          <AdjustmentsHorizontalIcon className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="card space-y-5 sticky top-20">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input className="input" placeholder="Role, skill, company..." value={filters.search}
                onChange={e => update('search', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <div className="space-y-1">
                {TYPES.map(t => (
                  <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="type" value={t} checked={filters.type === t}
                      onChange={() => update('type', filters.type === t ? '' : t)} />
                    <span className="capitalize">{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode</label>
              <div className="space-y-1">
                {MODES.map(m => (
                  <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="mode" value={m} checked={filters.workMode === m}
                      onChange={() => update('workMode', filters.workMode === m ? '' : m)} />
                    <span className="capitalize">{m}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
              <input className="input" placeholder="React, Python..." value={filters.skills}
                onChange={e => update('skills', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Stipend (₹/mo)</label>
              <input type="number" className="input" value={filters.minStipend}
                onChange={e => update('minStipend', e.target.value)} />
            </div>
            <button onClick={() => setFilters({ search: '', type: '', workMode: '', minStipend: '', maxStipend: '', skills: '', page: 1 })}
              className="btn-secondary w-full text-sm">Clear Filters</button>
          </div>
        </aside>

        {/* Job grid */}
        <div className="flex-1">
          {loading ? <Spinner /> : jobs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No jobs found. Try adjusting your filters.</div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {jobs.map(job => <JobCard key={job._id} job={job} />)}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${filters.page === p ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
