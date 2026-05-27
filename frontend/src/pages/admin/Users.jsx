import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users', { params: role ? { role } : {} })
      .then(r => setUsers(r.data.users))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [role]);

  const verify = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/verify`);
      setUsers(prev => prev.map(u => u._id === id ? data : u));
      toast.success('User verified');
    } catch { toast.error('Failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="flex gap-2 mb-6">
        {['', 'student', 'employer', 'admin'].map(r => (
          <button key={r} onClick={() => setRole(r)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${role === r ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {r || 'All'}
          </button>
        ))}
      </div>
      {loading ? <Spinner /> : (
        <div className="card divide-y divide-gray-100">
          {users.map(u => (
            <div key={u._id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email} · <span className="capitalize">{u.role}</span></p>
              </div>
              <div className="flex items-center gap-2">
                {u.isVerified ? (
                  <span className="badge bg-green-100 text-green-700">Verified</span>
                ) : (
                  <button onClick={() => verify(u._id)} className="btn-primary text-xs py-1">Verify</button>
                )}
                <button onClick={() => remove(u._id)} className="text-sm text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
