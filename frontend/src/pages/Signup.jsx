import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost, saveSession } from '../api';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (!form.organizationName || !form.email || !form.password || !form.confirmPassword) {
      setErrorMessage('all fields are required');
      return;
    }

    if (form.password.length < 6) {
      setErrorMessage('password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost('/auth/register', form);
      saveSession(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand">
          <span className="brand-mark">SF</span>
          <div>
            <h1>StockFlow</h1>
            <p className="muted small">create your store account</p>
          </div>
        </div>

        <h2>Sign up</h2>

        <div className="field">
          <label htmlFor="organizationName">Organization name</label>
          <input id="organizationName" name="organizationName" value={form.organizationName} onChange={handleChange} placeholder="my test store" />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@store.com" />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="at least 6 characters" />
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="repeat password" />
        </div>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <button className="button button--block" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="muted small center">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
