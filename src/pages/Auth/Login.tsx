import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Loader } from '../../components/Loader';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Unable to log in right now. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="card-surface w-full max-w-lg p-8">
        <p className="text-xs uppercase text-primary-600 font-semibold">Welcome back</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Login to SafeNet</h1>
        <p className="text-muted text-sm mt-1">Securely access your dashboard and alerts.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? <Loader label="Checking credentials" /> : 'Log in'}
          </button>
          <p className="text-sm text-muted text-center">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
