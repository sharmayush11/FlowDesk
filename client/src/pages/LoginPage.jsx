import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../store/slices/authSlice';

const LoginPage = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { loading, error } = useSelector((s) => s.auth);
const [form, setForm] = useState({ email: '', password: '' });

const handleChange = (e) =>
setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
e.preventDefault();
const result = await dispatch(loginUser(form));


if (result.meta.requestStatus === 'fulfilled') {
  navigate('/dashboard');
}


};

return ( <div className="auth-page"> <div className="auth-card"> <div className="auth-logo">FlowDesk</div>


    <h1 className="auth-title">Welcome back</h1>
    <p className="auth-sub">Sign in to your workspace</p>

    {error && <div className="error-banner">{error}</div>}

    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>

    <p className="auth-switch">
      Don't have an account? <Link to="/register">Sign up</Link>
    </p>
  </div>
</div>


);
};

export default LoginPage;
