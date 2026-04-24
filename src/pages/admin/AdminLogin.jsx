import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/api';
import { FiLock, FiMail, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import './AdminLogin.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await login({ email: form.email.toLowerCase().trim(), password: form.password });
      loginUser(res.data.token, res.data.user);
      setSuccessMsg('Admin login successful! Redirecting...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1200);
    } catch (err) {
      if (!err.response) {
        setErrorMsg('Cannot connect to server. Please start the backend.');
      } else {
        setErrorMsg(err.response?.data?.message || 'Invalid email or password.');
      }
      setLoading(false);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="admin-login-page">
      <div className="login-bg">
        <div className="login-orb orb1" />
        <div className="login-orb orb2" />
        <div className="login-grid" />
      </div>

      <div className="login-card glass-card login-animate">
        <div className="login-header">
          <div className="login-logo login-logo-bounce">
            <FiLock size={28} />
          </div>
          <h1 className="login-title">Admin Panel</h1>
          <p className="login-subtitle">Mohammed Yasir · Portfolio Dashboard</p>
        </div>

        {errorMsg && (
          <div className="login-alert login-alert-error">
            <FiAlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="login-alert login-alert-success">
            <FiCheckCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" size={18} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="form-control input-with-icon"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" size={18} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="form-control input-with-icon input-with-toggle"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full login-btn"
            disabled={loading || !!successMsg}
          >
            {loading ? <span className="login-spinner" /> : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <button type="button" className="back-link" onClick={goHome}>
            ← Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
