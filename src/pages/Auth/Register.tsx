import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Loader } from '../../components/Loader';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAppStore();
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
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please retry.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-surface to-surface/90">
      <div className="card-surface w-full max-w-lg p-8">
        <p className="text-xs uppercase text-primary-200 font-semibold">Join SafeNet</p>
        <h1 className="text-2xl font-bold text-white mt-2">Create an account</h1>
        <p className="text-muted text-sm mt-1">Build your safety net with quick alerts and guidance.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary-400 outline-none"
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
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary-400 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? <Loader label="Creating account" /> : 'Create account'}
          </button>
          <p className="text-sm text-muted text-center">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
