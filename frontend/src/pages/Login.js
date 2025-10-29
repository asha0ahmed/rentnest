import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.emailOrMobile || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Call login API
    const result = await login(formData);

    setLoading(false);

    if (result.success) {
      // Redirect based on account type
      // Note: user will be available after successful login via context
      setTimeout(() => {
        if (user?.accountType === 'owner') {
          navigate('/dashboard/owner');
        } else {
          navigate('/properties');
        }
      }, 100);
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Login to your Rentnest account</p>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email or Mobile */}
            <div className="form-group">
              <label className="form-label">Email or Mobile Number *</label>
              <input
                type="text"
                name="emailOrMobile"
                className="form-input"
                placeholder="Enter email or mobile number"
                value={formData.emailOrMobile}
                onChange={handleChange}
                required
              />
              <small className="form-hint">
                Use the email or mobile you registered with
              </small>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Signup Link */}
          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;