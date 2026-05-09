import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginOwner, checkOwnerSession } from '../api/auth.js';
import './OwnerLogin.css';

export default function OwnerLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await checkOwnerSession();
        navigate('/dashboard');
      } catch {
        // No active session; stay on login page.
      }
    };

    checkSession();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError('Please enter username and password');
      setLoading(false);
      return;
    }

    try {
      await loginOwner(formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-decoration"></div>

      <div className="login-card">
        <div className="login-header">
          <h2>Efru_Perfume</h2>
          <p>Owner Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Enter Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
