import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    }
  };

  if (sent) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card text-center max-w-md w-full">
        <div className="text-4xl mb-3">📧</div>
        <h2 className="text-xl font-bold mb-2">Check your email</h2>
        <p className="text-gray-500">We sent a password reset link to <strong>{email}</strong></p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold mb-1">Forgot password?</h1>
        <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send a reset link.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required className="input" placeholder="your@email.com"
            value={email} onChange={e => setEmail(e.target.value)} />
          <button type="submit" className="btn-primary w-full">Send Reset Link</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-primary-600 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
