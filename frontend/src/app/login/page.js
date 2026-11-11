'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../assets/logo.png';
import { login, submitMentorRequest } from '../../lib/api';
import { setAuth } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();

  // Login form state
  const [role, setRole] = useState('mentee');
  const [emailOrEnrollment, setEmailOrEnrollment] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mentor request modal state
  const [showModal, setShowModal] = useState(false);
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorReason, setMentorReason] = useState('');
  const [mentorRequestLoading, setMentorRequestLoading] = useState(false);
  const [mentorRequestError, setMentorRequestError] = useState('');
  const [mentorRequestSuccess, setMentorRequestSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(emailOrEnrollment, password, role);
      setAuth(data.token, data.user);

      if (data.user.mustChangePassword) {
        router.push('/change-password');
        return;
      }

      if (data.user.role === 'admin') router.push('/admin');
      else if (data.user.role === 'mentor') router.push('/mentor');
      else router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMentorRequest = async (e) => {
    e.preventDefault();
    setMentorRequestError('');
    setMentorRequestLoading(true);

    try {
      await submitMentorRequest({ name: mentorName, email: mentorEmail, reason: mentorReason });
      setMentorRequestSuccess(true);
      setMentorName('');
      setMentorEmail('');
      setMentorReason('');
    } catch (err) {
      setMentorRequestError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setMentorRequestLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setMentorRequestSuccess(false);
    setMentorRequestError('');
    setMentorName('');
    setMentorEmail('');
    setMentorReason('');
  };

  return (
    <>
      <style>{`
        body { background: linear-gradient(135deg, #1a3a5c 0%, #296c9e 50%, #167F92 100%); min-height: 100vh; }
        .login-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
        .login-card { background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 440px; width: 100%; padding: 2.5rem; }
        .logo-container { text-align: center; margin-bottom: 1.5rem; }
        .site-title { color: #296c9e; font-weight: 700; font-size: 1.4rem; margin-top: 0.5rem; margin-bottom: 0; }
        .site-subtitle { color: #6c757d; font-size: 0.85rem; }
        .role-selector { display: flex; gap: 0; border: 2px solid #296c9e; border-radius: 50px; overflow: hidden; margin-bottom: 1.5rem; }
        .role-btn { flex: 1; padding: 0.5rem 0; border: none; background: transparent; color: #296c9e; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; }
        .role-btn.active { background: linear-gradient(135deg, #296c9e, #167F92); color: #fff; }
        .role-btn:hover:not(.active) { background: rgba(41,108,158,0.1); }
        .login-btn { background: linear-gradient(135deg, #296c9e, #167F92); border: none; color: #fff; width: 100%; padding: 0.75rem; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
        .login-btn:hover:not(:disabled) { opacity: 0.9; }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .password-wrapper { position: relative; }
        .password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6c757d; cursor: pointer; padding: 0; }
        .mentor-link { text-align: center; margin-top: 1.5rem; color: #6c757d; font-size: 0.9rem; }
        .mentor-link a { color: #296c9e; text-decoration: none; font-weight: 600; }
        .mentor-link a:hover { text-decoration: underline; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; }
        .modal-box { background: #fff; border-radius: 16px; padding: 2rem; max-width: 480px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-height: 90vh; overflow-y: auto; }
        .modal-title { color: #296c9e; font-weight: 700; font-size: 1.3rem; margin-bottom: 0.25rem; }
        .modal-subtitle { color: #6c757d; font-size: 0.85rem; margin-bottom: 1.5rem; }
        .modal-close { background: none; border: none; font-size: 1.5rem; color: #6c757d; cursor: pointer; float: right; line-height: 1; }
        .form-label { font-weight: 600; color: #333; font-size: 0.9rem; }
        .form-control:focus { border-color: #296c9e; box-shadow: 0 0 0 0.2rem rgba(41,108,158,0.25); }
        .submit-btn { background: linear-gradient(135deg, #296c9e, #167F92); border: none; color: #fff; padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .divider { border-top: 1px solid #e9ecef; margin: 1.5rem 0; }
      `}</style>

      <div className="login-wrapper">
        <div className="login-card">
          <div className="logo-container">
            <Image src={logo} alt="TechNeeds Logo" width={80} height={80} />
            <h1 className="site-title">TechNeeds</h1>
            <p className="site-subtitle">Sign in to your account</p>
          </div>

          {/* Role Selector */}
          <div className="role-selector">
            {['mentee', 'mentor', 'admin'].map((r) => (
              <button
                key={r}
                className={`role-btn${role === r ? ' active' : ''}`}
                onClick={() => { setRole(r); setEmailOrEnrollment(''); setError(''); }}
                type="button"
              >
                {r === 'mentee' ? 'Mentee' : r === 'mentor' ? 'Mentor' : 'Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} noValidate>
            {error && (
              <div className="alert alert-danger d-flex align-items-center py-2 mb-3" role="alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label" htmlFor="emailOrEnrollment">
                {role === 'mentee' ? 'Enrollment Number / Email' : 'Email'}
              </label>
              <input
                id="emailOrEnrollment"
                type="text"
                className="form-control"
                placeholder={role === 'mentee' ? 'Enter enrollment number or email' : 'Enter your email'}
                value={emailOrEnrollment}
                onChange={(e) => setEmailOrEnrollment(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in…
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>Login
                </>
              )}
            </button>
          </form>

          <div className="mentor-link">
            Want to become a Mentor?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>
              Apply here →
            </a>
          </div>
        </div>
      </div>

      {/* Mentor Request Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
            <h2 className="modal-title">Apply to be a Mentor</h2>
            <p className="modal-subtitle">Fill in your details and we'll get back to you.</p>

            {mentorRequestSuccess ? (
              <div className="text-center py-3">
                <i className="fas fa-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3 text-success">Application Submitted!</h5>
                <p className="text-muted">Thank you for applying. We'll review your request and get back to you soon.</p>
                <button className="login-btn mt-2" style={{ maxWidth: '200px', margin: '0 auto' }} onClick={closeModal}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleMentorRequest} noValidate>
                {mentorRequestError && (
                  <div className="alert alert-danger py-2 mb-3">
                    <i className="fas fa-exclamation-circle me-2"></i>{mentorRequestError}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label" htmlFor="mentorName">Full Name</label>
                  <input
                    id="mentorName"
                    type="text"
                    className="form-control"
                    placeholder="Your full name"
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="mentorEmail">Email</label>
                  <input
                    id="mentorEmail"
                    type="email"
                    className="form-control"
                    placeholder="your@email.com"
                    value={mentorEmail}
                    onChange={(e) => setMentorEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="mentorReason">Why do you want to be a Mentor?</label>
                  <textarea
                    id="mentorReason"
                    className="form-control"
                    rows={4}
                    placeholder="Tell us about your experience and why you'd like to mentor..."
                    value={mentorReason}
                    onChange={(e) => setMentorReason(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="submit-btn" disabled={mentorRequestLoading}>
                    {mentorRequestLoading ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting…</>
                    ) : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
