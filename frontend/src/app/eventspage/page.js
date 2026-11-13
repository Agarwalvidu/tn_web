import Link from 'next/link';
import '@/components/ui/tn.css';

export const metadata = { title: 'Events | TechNeeds' };

export default function EventsPage() {
  return (
    <div className="tn-page" style={{ display: 'grid', placeItems: 'center' }}>
      <div className="tn-card" style={{ maxWidth: 520, textAlign: 'center', padding: '3rem 2rem' }}>
        <span className="tn-stat-icon" style={{ margin: '0 auto 1.2rem', width: 64, height: 64, fontSize: '1.6rem', borderRadius: 18 }}><i className="fas fa-calendar-days" /></span>
        <h1 style={{ fontSize: '1.9rem', marginBottom: '0.6rem' }}>Events are coming soon</h1>
        <p className="tn-muted" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>We&apos;re putting together hackathons, speaker sessions and more. Stay tuned!</p>
        <Link href="/" className="tn-btn">Back to home</Link>
      </div>
    </div>
  );
}
