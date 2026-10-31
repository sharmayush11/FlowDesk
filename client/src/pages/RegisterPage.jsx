import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../store/slices/authSlice';

const RegisterPage = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { loading, error } = useSelector((s) => s.auth);
const [form, setForm] = useState({ name: '', email: '', password: '' });

const handleChange = (e) =>
setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
e.preventDefault();


const result = await dispatch(registerUser(form));

if (result.meta.requestStatus === 'fulfilled') {
  navigate('/dashboard');
}


};

return ( <div className="auth-page"> <div className="auth-card"> <div className="auth-logo">FlowDesk</div>


    <h1 className="auth-title">Create account</h1>
    <p className="auth-sub">Start managing your projects</p>

    {error && <div className="error-banner">{error}</div>}

    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          required
        />
      </div>

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
          placeholder="Min 6 characters"
          minLength={6}
          required
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>

    <p className="auth-switch">
      Already have an account? <Link to="/login">Sign in</Link>
    </p>
  </div>
</div>


);
};

export default RegisterPage;
