import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api.get(`/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card text-center max-w-md w-full">
        {status === 'loading' && <p className="text-gray-500">Verifying your email...</p>}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-4">Your account is now active.</p>
            <Link to="/login" className="btn-primary">Go to Login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-4">The link may be invalid or expired.</p>
            <Link to="/login" className="btn-secondary">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
}
