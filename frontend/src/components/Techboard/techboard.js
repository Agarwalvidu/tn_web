'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '../../lib/auth';
import { Spinner } from '../ui/Common';
import '../ui/tn.css';
import './techboard.css';

const HOME = { admin: '/admin', mentor: '/mentor', mentee: '/dashboard' };

// The portal entry point: signed-in people go straight to their own home, everyone else picks a path.
export default function Techboard() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user && HOME[user.role]) {
      router.replace(HOME[user.role]);
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) return <div className="tn-page"><Spinner /></div>;

  const paths = [
    { href: '/login', icon: 'fa-user-graduate', title: 'I am a mentee', text: 'Log in with the enrollment number your mentor gave you.', cta: 'Mentee login' },
    { href: '/login', icon: 'fa-chalkboard-user', title: 'I am a mentor', text: 'Log in, or request mentor access from the admin.', cta: 'Mentor login' },
    { href: '/cohorts', icon: 'fa-compass', title: 'I am new here', text: 'Explore cohorts and find the track that fits you.', cta: 'Browse cohorts' },
  ];

  return (
    <div className="tn-page">
      <div className="tn-container tb-wrap">
        <div className="tb-head">
          <span className="tn-eyebrow"><i className="fas fa-microchip" /> Techboard</span>
          <h1>Welcome to the TechNeeds portal</h1>
          <p>Let&apos;s get you to the right place.</p>
        </div>
        <div className="tb-grid">
          {paths.map((p) => (
            <Link key={p.title} href={p.href} className="tn-card lift tb-card">
              <span className="tb-icon"><i className={`fas ${p.icon}`} /></span>
              <h2>{p.title}</h2>
              <p>{p.text}</p>
              <span className="tb-cta">{p.cta} <i className="fas fa-arrow-right" /></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
