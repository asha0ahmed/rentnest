import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    accountType: 'tenant',
    useEmail: true // Toggle between email or mobile
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggle = () => {
    setFormData({
      ...formData,
      useEmail: !formData.useEmail,
      email: '',
      mobile: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName) {
      setError('Please enter your full name');
      return;
    }

    if (formData.useEmail && !formData.email) {
      setError('Please enter your email');
      return;
    }

    if (!formData.useEmail && !formData.mobile) {
      setError('Please enter your mobile number');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Prepare data for API
    const signupData = {
      fullName: formData.fullName,
      password: formData.password,
      accountType: formData.accountType
    };

    if (formData.useEmail) {
      signupData.email = formData.email;
    } else {
      signupData.mobile = formData.mobile;
    }

    setLoading(true);

    // Call signup API
    const result = await signup(signupData);

    setLoading(false);

    if (result.success) {
      // Redirect based on account type
      if (formData.accountType === 'owner') {
        navigate('/dashboard/owner');
      } else {
        navigate('/properties');
      }
    } else {
      setError(result.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Create Your Account</h2>
          <p className="auth-subtitle">Join Rentnest today!</p>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Account Type Selection */}
            <div className="form-group">
              <label className="form-label">I am a *</label>
              <div className="account-type-toggle">
                <label className={`account-option ${formData.accountType === 'tenant' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="tenant"
                    checked={formData.accountType === 'tenant'}
                    onChange={handleChange}
                  />
                  <span>🏠 Tenant (Looking for a place)</span>
                </label>
                <label className={`account-option ${formData.accountType === 'owner' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="accountType"
                    value="owner"
                    checked={formData.accountType === 'owner'}
                    onChange={handleChange}
                  />
                  <span>🏘️ Owner (Have property to rent)</span>
                </label>
              </div>
            </div>

            {/* Email or Mobile Toggle */}
            <div className="form-group">
              <label className="form-label">Sign up with *</label>
              <div className="toggle-buttons">
                <button
                  type="button"
                  className={`toggle-btn ${formData.useEmail ? 'active' : ''}`}
                  onClick={handleToggle}
                >
                  📧 Email
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${!formData.useEmail ? 'active' : ''}`}
                  onClick={handleToggle}
                >
                  📱 Mobile
                </button>
              </div>
            </div>

            {/* Email or Mobile Input */}
            {formData.useEmail ? (
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  className="form-input"
                  placeholder="01712345678"
                  value={formData.mobile}
                  onChange={handleChange}
                  pattern="01[0-9]{9}"
                  title="Enter valid BD mobile number (01XXXXXXXXX)"
                  required
                />
                <small className="form-hint">Format: 01XXXXXXXXX (11 digits)</small>
              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;