import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { BellIcon, ChatBubbleLeftIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard' },
  { to: '/student/applications', label: 'Applications' },
  { to: '/student/resume', label: 'Resume Builder' },
  { to: '/student/saved', label: 'Saved Jobs' },
];

const employerLinks = [
  { to: '/employer/dashboard', label: 'Dashboard' },
  { to: '/employer/post-job', label: 'Post Job' },
  { to: '/employer/company', label: 'Company Profile' },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/jobs', label: 'Jobs' },
  { to: '/admin/companies', label: 'Companies' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = user?.role === 'student' ? studentLinks
    : user?.role === 'employer' ? employerLinks
    : user?.role === 'admin' ? adminLinks : [];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SJ</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">StudentJobs</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-gray-600 hover:text-primary-600 text-sm font-medium">Browse Jobs</Link>
            <Link to="/resources" className="text-gray-600 hover:text-primary-600 text-sm font-medium">Resources</Link>
            {links.map(l => (
              <Link key={l.to} to={l.to} className="text-gray-600 hover:text-primary-600 text-sm font-medium">{l.label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/chat" className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                </Link>
                <Link to={user.role === 'student' ? '/student/profile' : '#'} className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                  <BellIcon className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary text-sm py-1.5">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-1.5">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          <Link to="/jobs" className="block py-2 text-gray-700" onClick={() => setOpen(false)}>Browse Jobs</Link>
          <Link to="/resources" className="block py-2 text-gray-700" onClick={() => setOpen(false)}>Resources</Link>
          {links.map(l => (
            <Link key={l.to} to={l.to} className="block py-2 text-gray-700" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {user ? (
            <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full text-left py-2 text-red-600">Logout</button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="btn-secondary flex-1 text-center" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary flex-1 text-center" onClick={() => setOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
