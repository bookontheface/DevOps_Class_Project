import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => { e.preventDefault(); setError(''); setBusy(true); try { await login(form.email, form.password); navigate('/'); } catch (e) { setError(e.response?.data?.message || 'Unable to sign in'); } finally { setBusy(false); } };
  return <div className="auth-layout"><div className="auth-art"><div className="auth-art-content"><span className="eyebrow text-white-50">WELCOME TO ELECTROMART</span><h1>Technology that moves you forward.</h1><p>Discover thoughtfully selected electronics for work, play, and everything in between.</p></div></div>
    <div className="auth-panel"><div className="auth-form"><Link to="/" className="navbar-brand fw-bold fs-3">electro<span className="brand-dot">.</span></Link><h2 className="mt-5 fw-bold">Welcome back</h2><p className="text-secondary mb-4">Sign in to continue shopping.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}><label className="form-label">Email address</label><input className="form-control form-control-lg mb-3" type="email" name="email" value={form.email} onChange={change} required placeholder="you@example.com"/><label className="form-label">Password</label><input className="form-control form-control-lg mb-4" type="password" name="password" value={form.password} onChange={change} required placeholder="Your password"/><button className="btn btn-dark btn-lg w-100" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button></form>
      <p className="text-secondary mt-4 text-center">New to ElectroMart? <Link to="/register">Create an account</Link></p>
    </div></div></div>;
}
