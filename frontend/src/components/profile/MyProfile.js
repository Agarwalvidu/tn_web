'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleGuard, handleAuthError } from '../../lib/useAuth';
import { getMyProfile, refreshMyProfile, setAvatar } from '../../lib/api';
import { Spinner, Alert } from '../ui/Common';
import ProfileView from './ProfileView';
import '../ui/tn.css';

export default function MyProfile() {
  const router = useRouter();
  const { ready, token } = useRoleGuard('mentee');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const fail = (err) => { if (!handleAuthError(err, router)) setError(err.message); };

  useEffect(() => {
    if (!ready) return;
    getMyProfile(token).then(setData).catch(fail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, token]);

  const refresh = async () => {
    setBusy(true);
    setError('');
    try { setData(await refreshMyProfile(token)); } catch (e) { fail(e); } finally { setBusy(false); }
  };

  const changeAvatar = async (key) => {
    try {
      await setAvatar(token, key);
      setData((d) => ({ ...d, profile: { ...d.profile, avatar: key } }));
      const u = JSON.parse(localStorage.getItem('tn_user') || 'null');
      if (u) localStorage.setItem('tn_user', JSON.stringify({ ...u, avatar: key }));
    } catch (e) { fail(e); }
  };

  if (!ready || (!data && !error)) return <div className="tn-page"><Spinner /></div>;

  return (
    <div className="tn-page">
      <div className="tn-container">
        {error && <Alert>{error}</Alert>}
        {data && <ProfileView profile={data.profile} ai={data.ai} onRefresh={refresh} onAvatar={changeAvatar} busy={busy} />}
      </div>
    </div>
  );
}
