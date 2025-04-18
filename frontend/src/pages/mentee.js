// import MenteeDashboard from "@/components/mentee/dashboard";
// import MenteeLogin from "@/components/mentee/login";

import dynamic from 'next/dynamic';
const MenteeLogin = dynamic(() => import('../components/mentee/login'), { ssr: false });

export default function Menteepage() {
  return (
    <div>
      <h1>Mentee Page</h1>
      <MenteeLogin/>
    </div>
  );
}
