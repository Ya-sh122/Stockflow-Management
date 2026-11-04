import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost, saveSession } from '../api';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (!form.email || !form.password) {
      setErrorMessage('email and password are required');
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost('/auth/login', form);
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
            <p className="muted small">inventory for small sellers</p>
          </div>
        </div>

        <h2>Log in</h2>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@store.com" />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="your password" />
        </div>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <button className="button button--block" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <p className="muted small center">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
