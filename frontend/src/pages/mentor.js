import dynamic from 'next/dynamic';
const MentorPanel = dynamic(() => import('../components/mentorPanel'), { ssr: false });
const Navbar = dynamic(() => import('../components/navbar/navbar'), { ssr: false });

export default function Mentorpage() {
  return (
    <div>
      <Navbar />
      <MentorPanel />
    </div>
  );
}
