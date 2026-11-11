'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoleGuard, handleAuthError } from '../../lib/useAuth';
import { getMenteeProfileAsMentor } from '../../lib/api';
import { Spinner, Alert } from '../ui/Common';
import ProfileView from './ProfileView';
import '../ui/tn.css';

export default function MenteeProfileForMentor() {
  const { id } = useParams();
  const router = useRouter();
  const { ready, token } = useRoleGuard('mentor');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    getMenteeProfileAsMentor(token, id)
      .then(setData)
      .catch((err) => { if (!handleAuthError(err, router)) setError(err.message); });
  }, [ready, token, id, router]);

  if (!ready || (!data && !error)) return <div className="tn-page"><Spinner /></div>;

  return (
    <div className="tn-page">
      <div className="tn-container">
        <Link href="/mentor" className="tn-btn-outline tn-btn-sm" style={{ marginBottom: '1rem' }}><i className="fas fa-arrow-left" /> Back to mentor panel</Link>
        {error && <Alert>{error}</Alert>}
        {data && <ProfileView profile={data.profile} ai={data.ai} />}
      </div>
    </div>
  );
}
