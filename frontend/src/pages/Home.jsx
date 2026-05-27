import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, BriefcaseIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: BriefcaseIcon, title: 'Smart Job Matching', desc: 'AI-powered recommendations based on your skills and profile.' },
  { icon: UserGroupIcon, title: 'Application Tracker', desc: 'Track every application from Applied to Offer in one place.' },
  { icon: BuildingOfficeIcon, title: 'Verified Companies', desc: 'Only verified employers can post — no spam, no scams.' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your First Big Break</h1>
          <p className="text-xl text-primary-100 mb-8">Internships and jobs curated for students. Verified employers only.</p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by role, skill, or company..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5" /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[['10,000+', 'Students'], ['500+', 'Companies'], ['2,000+', 'Active Jobs']].map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl font-bold text-primary-600">{n}</div>
              <div className="text-gray-500 text-sm mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">Everything you need to land the job</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-gray-400 mb-8">Join thousands of students already using StudentJobs.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Sign Up as Student
          </Link>
          <Link to="/register?role=employer" className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Post a Job
          </Link>
        </div>
      </section>
    </div>
  );
}
