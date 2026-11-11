'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getUser, setAuth, requireAuth } from '../../lib/auth';
import { changePassword } from '../../lib/api';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!requireAuth(router)) return;
    setAuthChecked(true);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const data = await changePassword(token, '', newPassword);

      // Update stored user to reflect password has been changed
      const user = getUser();
      if (user) {
        const updatedUser = { ...user, mustChangePassword: false };
        setAuth(data.token || token, updatedUser);
        const role = updatedUser.role;
        if (role === 'admin') router.push('/admin');
        else if (role === 'mentor') router.push('/mentor');
        else router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) return null;

  return (
    <>
      <style>{`
        body { background: linear-gradient(135deg, #1a3a5c 0%, #296c9e 50%, #167F92 100%); min-height: 100vh; }
        .cp-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
        .cp-card { background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 440px; width: 100%; padding: 2.5rem; }
        .cp-icon { width: 64px; height: 64px; background: linear-gradient(135deg, #296c9e, #167F92); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
        .cp-title { color: #296c9e; font-weight: 700; font-size: 1.4rem; text-align: center; margin-bottom: 0.5rem; }
        .cp-subtitle { color: #6c757d; font-size: 0.9rem; text-align: center; margin-bottom: 1.5rem; }
        .password-wrapper { position: relative; }
        .password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6c757d; cursor: pointer; padding: 0; }
        .form-control:focus { border-color: #296c9e; box-shadow: 0 0 0 0.2rem rgba(41,108,158,0.25); }
        .form-label { font-weight: 600; color: #333; font-size: 0.9rem; }
        .submit-btn { background: linear-gradient(135deg, #296c9e, #167F92); border: none; color: #fff; width: 100%; padding: 0.75rem; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .hint-box { background: #f0f7ff; border: 1px solid #c8e1f8; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #296c9e; }
      `}</style>

      <div className="cp-wrapper">
        <div className="cp-card">
          <div className="cp-icon">
            <i className="fas fa-lock text-white" style={{ fontSize: '1.5rem' }}></i>
          </div>
          <h1 className="cp-title">Set Your New Password</h1>
          <p className="cp-subtitle">
            Welcome to TechNeeds! Please set a new password before continuing.
          </p>

          <div className="hint-box">
            <i className="fas fa-info-circle me-2"></i>
            Password must be at least <strong>8 characters</strong> long.
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="alert alert-danger d-flex align-items-center py-2 mb-3" role="alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <div className="password-wrapper">
                <input
                  id="newPassword"
                  type={showNew ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNew(!showNew)}
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas ${showNew ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Setting Password…
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>Set New Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
