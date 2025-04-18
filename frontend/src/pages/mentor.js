import dynamic from 'next/dynamic';
const MentorPanel = dynamic(() => import('../components/mentorPanel'), { ssr: false });

export default function Mentorpage() {
  return (
    <div>
      <h1>Mentor Page</h1>
      <MentorPanel />
    </div>
  );
}
