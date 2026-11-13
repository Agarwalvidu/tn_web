'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRoleGuard } from '../../lib/useAuth';
import {
  getAdminStats, getMentorRequests, approveMentorRequest, rejectMentorRequest,
  getAdminCohorts, createCohort, updateCohort, deleteCohort, assignMentor, removeMentor,
  getCohortAnalytics, getAdminMentors,
} from '../../lib/api';
import { Spinner, Alert, Empty } from '../../components/ui/Common';
import '../../components/ui/tn.css';

const toList = (d, key) => (Array.isArray(d) ? d : d[key] || []);
const idOf = (o) => o._id || o.id;
const when = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-');

export default function AdminPage() {
  const { ready, token, user } = useRoleGuard('admin');
  const [tab, setTab] = useState('dashboard');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState(null);
  const [cohorts, setCohorts] = useState(null);
  const [mentors, setMentors] = useState(null);

  const [approved, setApproved] = useState(null); // { name, email, password }
  const [busyId, setBusyId] = useState(null);
  const [cohortModal, setCohortModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', syllabus: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [analytics, setAnalytics] = useState(null); // { cohort, data }
  const [assignFor, setAssignFor] = useState(null);
  const [mentorPick, setMentorPick] = useState('');

  const guard = async (fn) => { setError(''); try { return await fn(); } catch (e) { setError(e.message || 'Something went wrong'); } };

  const loadStats = useCallback(() => guard(async () => setStats(await getAdminStats(token))), [token]);
  const loadRequests = useCallback(() => guard(async () => setRequests(toList(await getMentorRequests(token), 'requests'))), [token]);
  const loadCohorts = useCallback(() => guard(async () => setCohorts(toList(await getAdminCohorts(token), 'cohorts'))), [token]);
  const loadMentors = useCallback(() => guard(async () => setMentors(toList(await getAdminMentors(token), 'mentors'))), [token]);

  useEffect(() => {
    if (!ready) return;
    loadStats(); loadRequests(); loadCohorts(); loadMentors();
  }, [ready, loadStats, loadRequests, loadCohorts, loadMentors]);

  if (!ready) return <div className="tn-page"><Spinner /></div>;

  const pending = (requests || []).filter((r) => !r.status || r.status === 'pending');

  const approve = (r) => guard(async () => {
    setBusyId(idOf(r));
    try {
      const d = await approveMentorRequest(token, idOf(r));
      setApproved({ name: r.name, email: r.email, password: d.tempPassword || d.password });
      await Promise.all([loadRequests(), loadStats(), loadMentors()]);
    } finally { setBusyId(null); }
  });
  const reject = (r) => {
    if (!confirm(`Reject the request from ${r.name}?`)) return;
    return guard(async () => { setBusyId(idOf(r)); try { await rejectMentorRequest(token, idOf(r)); await Promise.all([loadRequests(), loadStats()]); } finally { setBusyId(null); } });
  };

  const openCohort = (c) => {
    setEditing(c || null);
    setForm({ title: c ? c.name || c.title || '' : '', description: c?.description || '', syllabus: c?.syllabus || '' });
    setFormError(''); setCohortModal(true);
  };
  const saveCohort = async (e) => {
    e.preventDefault(); setSaving(true); setFormError('');
    try {
      if (editing) await updateCohort(token, idOf(editing), form); else await createCohort(token, form);
      setCohortModal(false);
      setToast(editing ? 'Cohort updated' : 'Cohort created');
      await Promise.all([loadCohorts(), loadStats()]);
    } catch (err) { setFormError(err.message); } finally { setSaving(false); }
  };
  const removeCohort = (c) => {
    if (!confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    return guard(async () => { await deleteCohort(token, idOf(c)); setToast('Cohort deleted'); await Promise.all([loadCohorts(), loadStats()]); });
  };
  const showAnalytics = async (c) => {
    setAnalytics({ cohort: c, data: null });
    try { setAnalytics({ cohort: c, data: await getCohortAnalytics(token, idOf(c)) }); }
    catch (e) { setAnalytics({ cohort: c, data: { error: e.message } }); }
  };
  const doAssign = (c) => guard(async () => {
    if (!mentorPick) return;
    await assignMentor(token, idOf(c), mentorPick);
    setAssignFor(null); setMentorPick(''); setToast('Mentor assigned');
    await Promise.all([loadCohorts(), loadMentors()]);
  });
  const doRemoveMentor = (c, m) => {
    if (!confirm(`Remove ${m.name} from ${c.name}?`)) return;
    return guard(async () => { await removeMentor(token, idOf(c), idOf(m)); setToast('Mentor removed'); await Promise.all([loadCohorts(), loadMentors()]); });
  };

  const TABS = [
    ['dashboard', 'Overview', 'fa-gauge-high'],
    ['requests', `Mentor requests${pending.length ? ` (${pending.length})` : ''}`, 'fa-user-clock'],
    ['cohorts', 'Cohorts', 'fa-layer-group'],
    ['mentors', 'Mentors', 'fa-chalkboard-user'],
  ];

  return (
    <div className="tn-page">
      <div className="tn-container">
        <div className="tn-hero">
          <div>
            <span className="tn-eyebrow"><i className="fas fa-shield-halved" /> Admin panel</span>
            <h1>Hello, {user?.name || 'Admin'}</h1>
            <p>Approve mentors, run cohorts and keep an eye on progress.</p>
          </div>
          <div className="tn-hero-actions">
            <button className="tn-btn-ghost" onClick={() => { setTab('cohorts'); openCohort(null); }}><i className="fas fa-plus" /> New cohort</button>
          </div>
        </div>

        {error && <Alert>{error}</Alert>}
        {toast && <Alert type="success"><i className="fas fa-circle-check" /><span style={{ flex: 1 }}>{toast}</span><button onClick={() => setToast('')} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>×</button></Alert>}

        <div className="tn-tabs" role="tablist">
          {TABS.map(([k, l, i]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={`tn-tab${tab === k ? ' active' : ''}`} onClick={() => setTab(k)}><i className={`fas ${i}`} /> {l}</button>
          ))}
        </div>

        {/* ───── Overview ───── */}
        {tab === 'dashboard' && (
          <>
            {!stats ? <Spinner /> : (
              <div className="tn-grid-stats">
                <div className="tn-stat"><span className="tn-stat-icon"><i className="fas fa-layer-group" /></span><div><div className="tn-stat-label">Cohorts</div><div className="tn-stat-value">{stats.cohorts}</div></div></div>
                <div className="tn-stat"><span className="tn-stat-icon violet"><i className="fas fa-chalkboard-user" /></span><div><div className="tn-stat-label">Mentors</div><div className="tn-stat-value">{stats.mentors}</div></div></div>
                <div className="tn-stat"><span className="tn-stat-icon amber"><i className="fas fa-user-graduate" /></span><div><div className="tn-stat-label">Mentees</div><div className="tn-stat-value">{stats.mentees}</div></div></div>
                <div className="tn-stat"><span className="tn-stat-icon coral"><i className="fas fa-user-clock" /></span><div><div className="tn-stat-label">Pending requests</div><div className="tn-stat-value">{stats.pendingRequests}</div></div></div>
              </div>
            )}
            {pending.length > 0 && (
              <Alert type="warn"><i className="fas fa-bell" /><span style={{ flex: 1 }}><strong>{pending.length}</strong> mentor request{pending.length > 1 ? 's' : ''} waiting for your review.</span><button className="tn-btn tn-btn-sm" onClick={() => setTab('requests')}>Review</button></Alert>
            )}
            <div className="tn-card">
              <h2>Cohorts at a glance</h2>
              {!cohorts ? <Spinner /> : cohorts.length === 0 ? <Empty icon="fa-layer-group">No cohorts yet. Create your first one.</Empty> : (
                <div className="tn-table-wrap"><table className="tn-table">
                  <thead><tr><th>Cohort</th><th>Mentors</th><th>Mentees</th><th /></tr></thead>
                  <tbody>{cohorts.map((c) => (
                    <tr key={idOf(c)}><td><strong>{c.name}</strong></td><td>{c.mentors?.length || 0}</td><td>{c.menteeCount ?? 0}</td>
                      <td style={{ textAlign: 'right' }}><button className="tn-btn-outline tn-btn-sm" onClick={() => showAnalytics(c)}><i className="fas fa-chart-simple" /> Analytics</button></td></tr>
                  ))}</tbody></table></div>
              )}
            </div>
          </>
        )}

        {/* ───── Mentor requests ───── */}
        {tab === 'requests' && (
          <div className="tn-card">
            <h2>Mentor requests</h2>
            {!requests ? <Spinner /> : requests.length === 0 ? <Empty icon="fa-inbox">No requests yet.</Empty> : (
              <div className="tn-table-wrap"><table className="tn-table">
                <thead><tr><th>Applicant</th><th>Reason</th><th>Date</th><th>Status</th><th /></tr></thead>
                <tbody>{requests.map((r) => {
                  const st = r.status || 'pending';
                  return (
                    <tr key={idOf(r)}>
                      <td><strong>{r.name}</strong><div className="tn-muted">{r.email}</div></td>
                      <td style={{ maxWidth: 320 }}><span title={r.reason}>{r.reason?.length > 90 ? r.reason.slice(0, 90) + '…' : r.reason}</span></td>
                      <td>{when(r.createdAt)}</td>
                      <td><span className={`tn-pill ${st === 'approved' ? 'done' : st === 'rejected' ? 'closed' : 'upcoming'}`}>{st}</span></td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {st === 'pending' && <>
                          <button className="tn-btn tn-btn-sm" disabled={busyId === idOf(r)} onClick={() => approve(r)}><i className="fas fa-check" /> Approve</button>{' '}
                          <button className="tn-btn-danger" disabled={busyId === idOf(r)} onClick={() => reject(r)}>Reject</button>
                        </>}
                      </td>
                    </tr>
                  );
                })}</tbody></table></div>
            )}
          </div>
        )}

        {/* ───── Cohorts ───── */}
        {tab === 'cohorts' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.2rem' }}>All cohorts</h2>
              <button className="tn-btn" onClick={() => openCohort(null)}><i className="fas fa-plus" /> Create cohort</button>
            </div>
            {!cohorts ? <Spinner /> : cohorts.length === 0 ? <div className="tn-card"><Empty icon="fa-layer-group">No cohorts yet.</Empty></div> : (
              <div className="tn-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
                {cohorts.map((c, i) => (
                  <div key={idOf(c)} className="tn-cohort">
                    <div className={`tn-cohort-top c${(i % 5) + 1}`}><span className="tn-cohort-icon"><i className="fas fa-layer-group" /></span></div>
                    <div className="tn-cohort-body">
                      <h2>{c.name}</h2>
                      <p>{c.description || 'No description yet.'}</p>
                      <div className="tn-cohort-meta"><span><i className="fas fa-user-graduate" />{c.menteeCount ?? 0} mentees</span></div>
                      <div style={{ marginBottom: '0.9rem' }}>
                        <div className="tn-label">Mentors</div>
                        {(c.mentors || []).length === 0 ? <span className="tn-muted">None assigned</span> : c.mentors.map((m) => (
                          <span key={idOf(m)} className="tn-chip">{m.name}<button onClick={() => doRemoveMentor(c, m)} aria-label={`Remove ${m.name}`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}><i className="fas fa-xmark" /></button></span>
                        ))}
                        {assignFor === idOf(c) ? (
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                            <select className="tn-select" value={mentorPick} onChange={(e) => setMentorPick(e.target.value)} aria-label="Choose mentor">
                              <option value="">Select a mentor</option>
                              {(mentors || []).filter((m) => !(c.mentors || []).some((x) => idOf(x) === idOf(m))).map((m) => <option key={idOf(m)} value={idOf(m)}>{m.name}</option>)}
                            </select>
                            <button className="tn-btn tn-btn-sm" disabled={!mentorPick} onClick={() => doAssign(c)}>Add</button>
                            <button className="tn-btn-outline tn-btn-sm" onClick={() => { setAssignFor(null); setMentorPick(''); }}>×</button>
                          </div>
                        ) : <div><button className="tn-btn-outline tn-btn-sm" onClick={() => setAssignFor(idOf(c))}><i className="fas fa-user-plus" /> Assign mentor</button></div>}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button className="tn-btn-outline tn-btn-sm" onClick={() => showAnalytics(c)}><i className="fas fa-chart-simple" /> Analytics</button>
                        <button className="tn-btn-outline tn-btn-sm" onClick={() => openCohort(c)}><i className="fas fa-pen" /> Edit</button>
                        <button className="tn-btn-danger" onClick={() => removeCohort(c)}><i className="fas fa-trash" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ───── Mentors ───── */}
        {tab === 'mentors' && (
          <div className="tn-card">
            <h2>Approved mentors</h2>
            {!mentors ? <Spinner /> : mentors.length === 0 ? <Empty icon="fa-chalkboard-user">No mentors yet. Approve a request to add one.</Empty> : (
              <div className="tn-table-wrap"><table className="tn-table">
                <thead><tr><th>Mentor</th><th>Cohorts</th></tr></thead>
                <tbody>{mentors.map((m) => (
                  <tr key={idOf(m)}><td><strong>{m.name}</strong><div className="tn-muted">{m.email}</div></td>
                    <td>{(m.programs || []).length ? m.programs.map((p) => <span key={idOf(p)} className="tn-chip">{p.name}</span>) : <span className="tn-muted">Not assigned</span>}</td></tr>
                ))}</tbody></table></div>
            )}
          </div>
        )}
      </div>

      {/* ───── Modals ───── */}
      {approved && (
        <div className="tn-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setApproved(null); }}>
          <div className="tn-modal" style={{ maxWidth: 460 }}>
            <h2><i className="fas fa-circle-check" style={{ color: '#16a34a' }} /> Mentor approved</h2>
            <p className="tn-muted" style={{ marginBottom: '1rem' }}>Share these login details with <strong>{approved.name}</strong>. The password is shown only once.</p>
            <div className="tn-card" style={{ background: '#f4f8fc', boxShadow: 'none' }}>
              <div className="tn-label">Email</div><code>{approved.email}</code>
              <div className="tn-label" style={{ marginTop: '0.8rem' }}>Temporary password</div><code style={{ fontSize: '1.1rem' }}>{approved.password}</code>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="tn-btn-outline" onClick={() => navigator.clipboard.writeText(`Email: ${approved.email}\nPassword: ${approved.password}`).then(() => setToast('Copied to clipboard'))}><i className="fas fa-copy" /> Copy</button>
              <button className="tn-btn" onClick={() => setApproved(null)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {cohortModal && (
        <div className="tn-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setCohortModal(false); }}>
          <form className="tn-modal" onSubmit={saveCohort}>
            <h2>{editing ? 'Edit cohort' : 'Create cohort'}</h2>
            <Alert>{formError}</Alert>
            <div className="tn-field"><label htmlFor="ct">Name</label><input id="ct" className="tn-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Web Development" required /></div>
            <div className="tn-field"><label htmlFor="cd">Description</label><textarea id="cd" className="tn-textarea" style={{ minHeight: 80 }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will mentees learn?" /></div>
            <div className="tn-field"><label htmlFor="cs">Syllabus</label><textarea id="cs" className="tn-textarea" value={form.syllabus} onChange={(e) => setForm({ ...form, syllabus: e.target.value })} placeholder={'Week 1: HTML & CSS\nWeek 2: JavaScript basics'} /></div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="button" className="tn-btn-outline" onClick={() => setCohortModal(false)}>Cancel</button>
              <button className="tn-btn" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create cohort'}</button>
            </div>
          </form>
        </div>
      )}

      {analytics && (
        <div className="tn-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setAnalytics(null); }}>
          <div className="tn-modal" style={{ maxWidth: 560 }}>
            <h2>Analytics: {analytics.cohort.name}</h2>
            {!analytics.data ? <Spinner /> : analytics.data.error ? <Alert>{analytics.data.error}</Alert> : (
              <>
                <div className="tn-grid-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="tn-stat" style={{ flexDirection: 'column', alignItems: 'flex-start' }}><div className="tn-stat-label">Mentees</div><div className="tn-stat-value">{analytics.data.menteeCount}</div></div>
                  <div className="tn-stat" style={{ flexDirection: 'column', alignItems: 'flex-start' }}><div className="tn-stat-label">Avg quiz score</div><div className="tn-stat-value">{analytics.data.avgQuizScore}%</div></div>
                  <div className="tn-stat" style={{ flexDirection: 'column', alignItems: 'flex-start' }}><div className="tn-stat-label">Completion</div><div className="tn-stat-value">{analytics.data.completionRate}%</div></div>
                </div>
                {analytics.data.topMentee && <p className="tn-muted"><i className="fas fa-trophy" style={{ color: '#f5b301' }} /> Top mentee: <strong>{analytics.data.topMentee.name}</strong> with {analytics.data.topMentee.points} points.</p>}
              </>
            )}
            <div style={{ textAlign: 'right', marginTop: '1rem' }}><button className="tn-btn" onClick={() => setAnalytics(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
