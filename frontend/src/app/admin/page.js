'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth, getToken } from '../../lib/auth';
import {
  getAdminStats,
  getMentorRequests,
  approveMentorRequest,
  rejectMentorRequest,
  getAdminCohorts,
  createCohort,
  updateCohort,
  deleteCohort,
  assignMentor,
  getCohortAnalytics,
  getAdminMentors,
} from '../../lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dashboard stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');

  // Mentor requests
  const [mentorRequests, setMentorRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  const [approvedPassword, setApprovedPassword] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  // Cohorts
  const [cohorts, setCohorts] = useState([]);
  const [cohortsLoading, setCohortsLoading] = useState(false);
  const [cohortsError, setCohortsError] = useState('');
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [editingCohort, setEditingCohort] = useState(null);
  const [cohortForm, setCohortForm] = useState({ title: '', description: '', syllabus: '' });
  const [cohortSaving, setCohortSaving] = useState(false);
  const [cohortFormError, setCohortFormError] = useState('');

  // Analytics
  const [analyticsModal, setAnalyticsModal] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Mentors
  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [mentorsError, setMentorsError] = useState('');

  // Assign mentor dropdown
  const [assigningCohortId, setAssigningCohortId] = useState(null);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    if (!requireAuth(router, 'admin')) return;
    const t = getToken();
    setToken(t);
    setAuthChecked(true);
  }, [router]);

  const fetchStats = useCallback(async (t) => {
    setStatsLoading(true);
    setStatsError('');
    try {
      const data = await getAdminStats(t);
      setStats(data);
    } catch (err) {
      setStatsError(err.message || 'Failed to load stats');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchMentorRequests = useCallback(async (t) => {
    setRequestsLoading(true);
    setRequestsError('');
    try {
      const data = await getMentorRequests(t);
      setMentorRequests(Array.isArray(data) ? data : data.requests || []);
    } catch (err) {
      setRequestsError(err.message || 'Failed to load mentor requests');
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  const fetchCohorts = useCallback(async (t) => {
    setCohortsLoading(true);
    setCohortsError('');
    try {
      const data = await getAdminCohorts(t);
      setCohorts(Array.isArray(data) ? data : data.cohorts || []);
    } catch (err) {
      setCohortsError(err.message || 'Failed to load cohorts');
    } finally {
      setCohortsLoading(false);
    }
  }, []);

  const fetchMentors = useCallback(async (t) => {
    setMentorsLoading(true);
    setMentorsError('');
    try {
      const data = await getAdminMentors(t);
      setMentors(Array.isArray(data) ? data : data.mentors || []);
    } catch (err) {
      setMentorsError(err.message || 'Failed to load mentors');
    } finally {
      setMentorsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecked || !token) return;
    if (activeTab === 'dashboard') fetchStats(token);
    if (activeTab === 'requests') fetchMentorRequests(token);
    if (activeTab === 'cohorts') { fetchCohorts(token); fetchMentors(token); }
    if (activeTab === 'mentors') fetchMentors(token);
  }, [authChecked, token, activeTab, fetchStats, fetchMentorRequests, fetchCohorts, fetchMentors]);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      const data = await approveMentorRequest(token, id);
      setApprovedPassword({ id, password: data.tempPassword || data.password || 'Check email' });
      await fetchMentorRequests(token);
      await fetchStats(token);
    } catch (err) {
      alert(err.message || 'Failed to approve request');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this request?')) return;
    setRejectingId(id);
    try {
      await rejectMentorRequest(token, id);
      await fetchMentorRequests(token);
    } catch (err) {
      alert(err.message || 'Failed to reject request');
    } finally {
      setRejectingId(null);
    }
  };

  const openCreateCohort = () => {
    setEditingCohort(null);
    setCohortForm({ title: '', description: '', syllabus: '' });
    setCohortFormError('');
    setShowCohortModal(true);
  };

  const openEditCohort = (cohort) => {
    setEditingCohort(cohort);
    setCohortForm({ title: cohort.name || cohort.title || '', description: cohort.description || '', syllabus: cohort.syllabus || '' });
    setCohortFormError('');
    setShowCohortModal(true);
  };

  const handleCohortSubmit = async (e) => {
    e.preventDefault();
    setCohortFormError('');
    setCohortSaving(true);
    try {
      if (editingCohort) {
        await updateCohort(token, editingCohort._id || editingCohort.id, cohortForm);
      } else {
        await createCohort(token, cohortForm);
      }
      setShowCohortModal(false);
      await fetchCohorts(token);
      await fetchStats(token);
    } catch (err) {
      setCohortFormError(err.message || 'Failed to save cohort');
    } finally {
      setCohortSaving(false);
    }
  };

  const handleDeleteCohort = async (id) => {
    if (!confirm('Are you sure you want to delete this cohort?')) return;
    try {
      await deleteCohort(token, id);
      await fetchCohorts(token);
      await fetchStats(token);
    } catch (err) {
      alert(err.message || 'Failed to delete cohort');
    }
  };

  const handleViewAnalytics = async (cohort) => {
    setAnalyticsModal(cohort);
    setAnalyticsLoading(true);
    setAnalyticsData(null);
    try {
      const data = await getCohortAnalytics(token, cohort._id || cohort.id);
      setAnalyticsData(data);
    } catch (err) {
      setAnalyticsData({ error: err.message });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleAssignMentor = async (cohortId) => {
    if (!selectedMentorId) return;
    setAssignLoading(true);
    try {
      await assignMentor(token, cohortId, selectedMentorId);
      setAssigningCohortId(null);
      setSelectedMentorId('');
      await fetchCohorts(token);
    } catch (err) {
      alert(err.message || 'Failed to assign mentor');
    } finally {
      setAssignLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
  };

  if (!authChecked) return null;

  const statCards = [
    { label: 'Total Cohorts', value: stats?.cohorts ?? stats?.totalCohorts ?? '—', icon: 'fa-layer-group', color: '#296c9e' },
    { label: 'Total Mentors', value: stats?.mentors ?? stats?.totalMentors ?? '—', icon: 'fa-chalkboard-teacher', color: '#167F92' },
    { label: 'Total Mentees', value: stats?.mentees ?? stats?.totalMentees ?? '—', icon: 'fa-user-graduate', color: '#64a0cc' },
    { label: 'Pending Requests', value: stats?.pendingRequests ?? stats?.pending ?? '—', icon: 'fa-clock', color: '#e67e22' },
  ];

  return (
    <>
      <style>{`
        .admin-wrapper { min-height: 100vh; background: #f0f4f8; padding: 2rem 1rem; }
        .admin-header { background: linear-gradient(135deg, #1a3a5c, #296c9e); color: #fff; border-radius: 12px; padding: 1.5rem 2rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; }
        .admin-header h1 { font-size: 1.6rem; font-weight: 700; margin: 0; }
        .admin-header p { margin: 0; opacity: 0.8; font-size: 0.9rem; }
        .nav-tabs .nav-link { color: #296c9e; font-weight: 600; border: none; border-bottom: 3px solid transparent; padding: 0.75rem 1.25rem; }
        .nav-tabs .nav-link.active { color: #1a3a5c; border-bottom-color: #296c9e; background: transparent; }
        .nav-tabs .nav-link:hover:not(.active) { border-bottom-color: #64a0cc; }
        .nav-tabs { border-bottom: 2px solid #dee2e6; margin-bottom: 2rem; }
        .stat-card { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-card .card-body { padding: 1.5rem; }
        .stat-icon { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0.15; position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%); font-size: 1.5rem; }
        .stat-value { font-size: 2.5rem; font-weight: 800; line-height: 1; }
        .stat-label { color: #6c757d; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .section-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); padding: 1.5rem; }
        .table th { background: #f8f9fa; font-weight: 700; color: #333; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .badge-pending { background: #fff3cd; color: #856404; }
        .badge-approved { background: #d1e7dd; color: #0a3622; }
        .badge-rejected { background: #f8d7da; color: #842029; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; }
        .modal-box { background: #fff; border-radius: 16px; padding: 2rem; max-width: 520px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-height: 90vh; overflow-y: auto; }
        .modal-title { color: #296c9e; font-weight: 700; font-size: 1.3rem; margin-bottom: 1rem; }
        .modal-close { background: none; border: none; font-size: 1.5rem; color: #6c757d; cursor: pointer; float: right; line-height: 1; }
        .btn-approve { background: #198754; border-color: #198754; color: #fff; }
        .btn-approve:hover { background: #157347; border-color: #157347; color: #fff; }
        .btn-reject { background: #dc3545; border-color: #dc3545; color: #fff; }
        .btn-reject:hover { background: #bb2d3b; border-color: #bb2d3b; color: #fff; }
        .btn-primary-custom { background: linear-gradient(135deg, #296c9e, #167F92); border: none; color: #fff; }
        .btn-primary-custom:hover { opacity: 0.9; color: #fff; }
        .empty-state { text-align: center; padding: 3rem 1rem; color: #6c757d; }
        .empty-state i { font-size: 3rem; opacity: 0.3; display: block; margin-bottom: 1rem; }
        .password-display { background: #f0f7ff; border: 1px solid #c8e1f8; border-radius: 8px; padding: 1rem; font-family: monospace; font-size: 1.1rem; letter-spacing: 2px; text-align: center; color: #296c9e; font-weight: 700; }
        .form-control:focus, .form-select:focus { border-color: #296c9e; box-shadow: 0 0 0 0.2rem rgba(41,108,158,0.25); }
        .analytics-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0; }
        .analytics-row:last-child { border-bottom: none; }
        .analytics-label { color: #6c757d; font-weight: 600; }
        .analytics-value { font-weight: 700; color: #296c9e; }
      `}</style>

      <div className="admin-wrapper">
        <div className="container-fluid" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div className="admin-header">
            <div>
              <h1><i className="fas fa-tachometer-alt me-2"></i>Admin Panel</h1>
              <p>TechNeeds Administration Dashboard</p>
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs">
            {[
              { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
              { id: 'requests', icon: 'fa-user-check', label: 'Mentor Requests' },
              { id: 'cohorts', icon: 'fa-layer-group', label: 'Cohorts' },
              { id: 'mentors', icon: 'fa-chalkboard-teacher', label: 'Mentors' },
            ].map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <i className={`fas ${tab.icon} me-2`}></i>{tab.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              {statsError && (
                <div className="alert alert-danger"><i className="fas fa-exclamation-circle me-2"></i>{statsError}</div>
              )}
              {statsLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#296c9e' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading statistics…</p>
                </div>
              ) : (
                <div className="row g-4">
                  {statCards.map((card) => (
                    <div className="col-sm-6 col-xl-3" key={card.label}>
                      <div className="card stat-card h-100" style={{ borderLeft: `4px solid ${card.color}` }}>
                        <div className="card-body position-relative">
                          <div className="stat-label mb-2">{card.label}</div>
                          <div className="stat-value" style={{ color: card.color }}>{card.value}</div>
                          <div className="stat-icon" style={{ background: card.color, opacity: 0.1 }}>
                            <i className={`fas ${card.icon}`} style={{ color: card.color, opacity: 1 }}></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mentor Requests Tab */}
          {activeTab === 'requests' && (
            <div className="section-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold" style={{ color: '#296c9e' }}>
                  <i className="fas fa-user-check me-2"></i>Mentor Requests
                </h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => fetchMentorRequests(token)}>
                  <i className="fas fa-sync-alt me-1"></i>Refresh
                </button>
              </div>

              {requestsError && (
                <div className="alert alert-danger"><i className="fas fa-exclamation-circle me-2"></i>{requestsError}</div>
              )}

              {requestsLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" style={{ color: '#296c9e' }} role="status"></div>
                  <p className="mt-2 text-muted">Loading requests…</p>
                </div>
              ) : mentorRequests.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>No pending requests at this time.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Reason</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mentorRequests.map((req) => (
                        <tr key={req._id || req.id}>
                          <td className="fw-semibold">{req.name}</td>
                          <td>{req.email}</td>
                          <td style={{ maxWidth: '220px' }}>
                            <span title={req.reason}>{req.reason?.substring(0, 80)}{req.reason?.length > 80 ? '…' : ''}</span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td>
                            <span className={`badge badge-${req.status || 'pending'}`} style={{ padding: '0.4em 0.7em', borderRadius: '20px' }}>
                              {req.status || 'pending'}
                            </span>
                          </td>
                          <td>
                            {(!req.status || req.status === 'pending') && (
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-approve"
                                  onClick={() => handleApprove(req._id || req.id)}
                                  disabled={approvingId === (req._id || req.id)}
                                >
                                  {approvingId === (req._id || req.id)
                                    ? <span className="spinner-border spinner-border-sm" role="status"></span>
                                    : <><i className="fas fa-check me-1"></i>Approve</>
                                  }
                                </button>
                                <button
                                  className="btn btn-sm btn-reject"
                                  onClick={() => handleReject(req._id || req.id)}
                                  disabled={rejectingId === (req._id || req.id)}
                                >
                                  {rejectingId === (req._id || req.id)
                                    ? <span className="spinner-border spinner-border-sm" role="status"></span>
                                    : <><i className="fas fa-times me-1"></i>Reject</>
                                  }
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Cohorts Tab */}
          {activeTab === 'cohorts' && (
            <div className="section-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold" style={{ color: '#296c9e' }}>
                  <i className="fas fa-layer-group me-2"></i>Cohorts
                </h5>
                <button className="btn btn-primary-custom" onClick={openCreateCohort}>
                  <i className="fas fa-plus me-2"></i>Create Cohort
                </button>
              </div>

              {cohortsError && (
                <div className="alert alert-danger"><i className="fas fa-exclamation-circle me-2"></i>{cohortsError}</div>
              )}

              {cohortsLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" style={{ color: '#296c9e' }} role="status"></div>
                  <p className="mt-2 text-muted">Loading cohorts…</p>
                </div>
              ) : cohorts.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-layer-group"></i>
                  <p>No cohorts yet. Create your first cohort!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th># Mentors</th>
                        <th># Mentees</th>
                        <th>Assign Mentor</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohorts.map((cohort) => (
                        <tr key={cohort._id || cohort.id}>
                          <td className="fw-semibold">{cohort.name || cohort.title}</td>
                          <td style={{ maxWidth: '200px' }}>
                            <span title={cohort.description}>{cohort.description?.substring(0, 60)}{cohort.description?.length > 60 ? '…' : ''}</span>
                          </td>
                          <td>{cohort.mentors?.length ?? cohort.mentorCount ?? 0}</td>
                          <td>{cohort.mentees?.length ?? cohort.menteeCount ?? 0}</td>
                          <td style={{ minWidth: '200px' }}>
                            {assigningCohortId === (cohort._id || cohort.id) ? (
                              <div className="d-flex gap-2 align-items-center">
                                <select
                                  className="form-select form-select-sm"
                                  value={selectedMentorId}
                                  onChange={(e) => setSelectedMentorId(e.target.value)}
                                >
                                  <option value="">Select mentor…</option>
                                  {mentors.map((m) => (
                                    <option key={m._id || m.id} value={m._id || m.id}>{m.name}</option>
                                  ))}
                                </select>
                                <button
                                  className="btn btn-sm btn-approve"
                                  onClick={() => handleAssignMentor(cohort._id || cohort.id)}
                                  disabled={assignLoading || !selectedMentorId}
                                >
                                  {assignLoading ? <span className="spinner-border spinner-border-sm"></span> : '✓'}
                                </button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => { setAssigningCohortId(null); setSelectedMentorId(''); }}>✕</button>
                              </div>
                            ) : (
                              <button className="btn btn-sm btn-outline-primary" onClick={() => { setAssigningCohortId(cohort._id || cohort.id); setSelectedMentorId(''); }}>
                                <i className="fas fa-user-plus me-1"></i>Assign
                              </button>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1 flex-wrap">
                              <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditCohort(cohort)}>
                                <i className="fas fa-edit me-1"></i>Edit
                              </button>
                              <button className="btn btn-sm btn-outline-info" onClick={() => handleViewAnalytics(cohort)}>
                                <i className="fas fa-chart-bar me-1"></i>Analytics
                              </button>
                              <button className="btn btn-sm btn-reject" onClick={() => handleDeleteCohort(cohort._id || cohort.id)}>
                                <i className="fas fa-trash me-1"></i>Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Mentors Tab */}
          {activeTab === 'mentors' && (
            <div className="section-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold" style={{ color: '#296c9e' }}>
                  <i className="fas fa-chalkboard-teacher me-2"></i>Approved Mentors
                </h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => fetchMentors(token)}>
                  <i className="fas fa-sync-alt me-1"></i>Refresh
                </button>
              </div>

              {mentorsError && (
                <div className="alert alert-danger"><i className="fas fa-exclamation-circle me-2"></i>{mentorsError}</div>
              )}

              {mentorsLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" style={{ color: '#296c9e' }} role="status"></div>
                  <p className="mt-2 text-muted">Loading mentors…</p>
                </div>
              ) : mentors.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-chalkboard-teacher"></i>
                  <p>No approved mentors yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Cohorts Assigned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mentors.map((mentor) => (
                        <tr key={mentor._id || mentor.id}>
                          <td className="fw-semibold">
                            <i className="fas fa-user-circle me-2 text-muted"></i>
                            {mentor.name}
                          </td>
                          <td>{mentor.email}</td>
                          <td>
                            {mentor.cohorts?.length > 0
                              ? mentor.cohorts.map((c, i) => (
                                  <span key={i} className="badge bg-secondary me-1" style={{ background: '#296c9e !important' }}>{c.name || c.title || c}</span>
                                ))
                              : <span className="text-muted">None</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Approved Password Modal */}
      {approvedPassword && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setApprovedPassword(null); }}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setApprovedPassword(null)}>×</button>
            <div className="text-center mb-3">
              <i className="fas fa-check-circle text-success" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <h5 className="modal-title text-center">Mentor Approved!</h5>
            <p className="text-muted text-center mb-3">The mentor&apos;s temporary password has been generated. Please share it securely.</p>
            <div className="password-display mb-3">{approvedPassword.password}</div>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-primary-custom" onClick={() => copyToClipboard(approvedPassword.password)}>
                <i className="fas fa-copy me-2"></i>Copy to Clipboard
              </button>
              <button className="btn btn-outline-secondary" onClick={() => setApprovedPassword(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Cohort Form Modal */}
      {showCohortModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowCohortModal(false); }}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowCohortModal(false)}>×</button>
            <h5 className="modal-title">{editingCohort ? 'Edit Cohort' : 'Create New Cohort'}</h5>
            <form onSubmit={handleCohortSubmit} noValidate>
              {cohortFormError && (
                <div className="alert alert-danger py-2"><i className="fas fa-exclamation-circle me-2"></i>{cohortFormError}</div>
              )}
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="cohortTitle">Title</label>
                <input
                  id="cohortTitle"
                  type="text"
                  className="form-control"
                  placeholder="Cohort title"
                  value={cohortForm.title}
                  onChange={(e) => setCohortForm({ ...cohortForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="cohortDescription">Description</label>
                <textarea
                  id="cohortDescription"
                  className="form-control"
                  rows={3}
                  placeholder="Brief description of this cohort"
                  value={cohortForm.description}
                  onChange={(e) => setCohortForm({ ...cohortForm, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="cohortSyllabus">Syllabus</label>
                <textarea
                  id="cohortSyllabus"
                  className="form-control"
                  rows={5}
                  placeholder="Outline the syllabus topics…"
                  value={cohortForm.syllabus}
                  onChange={(e) => setCohortForm({ ...cohortForm, syllabus: e.target.value })}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCohortModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary-custom" disabled={cohortSaving}>
                  {cohortSaving
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                    : <><i className="fas fa-save me-2"></i>{editingCohort ? 'Update' : 'Create'} Cohort</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {analyticsModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setAnalyticsModal(null); }}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setAnalyticsModal(null)}>×</button>
            <h5 className="modal-title">
              <i className="fas fa-chart-bar me-2"></i>Analytics: {analyticsModal.name || analyticsModal.title}
            </h5>
            {analyticsLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border" style={{ color: '#296c9e' }} role="status"></div>
                <p className="mt-2 text-muted">Loading analytics…</p>
              </div>
            ) : analyticsData?.error ? (
              <div className="alert alert-danger">{analyticsData.error}</div>
            ) : analyticsData ? (
              <div>
                <div className="analytics-row">
                  <span className="analytics-label"><i className="fas fa-user-graduate me-2"></i>Mentee Count</span>
                  <span className="analytics-value">{analyticsData.menteeCount ?? analyticsData.mentees ?? '—'}</span>
                </div>
                <div className="analytics-row">
                  <span className="analytics-label"><i className="fas fa-star me-2"></i>Avg Quiz Score</span>
                  <span className="analytics-value">
                    {analyticsData.avgQuizScore !== undefined ? `${analyticsData.avgQuizScore}%` : '—'}
                  </span>
                </div>
                <div className="analytics-row">
                  <span className="analytics-label"><i className="fas fa-tasks me-2"></i>Completion Rate</span>
                  <span className="analytics-value">
                    {analyticsData.completionRate !== undefined ? `${analyticsData.completionRate}%` : '—'}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
