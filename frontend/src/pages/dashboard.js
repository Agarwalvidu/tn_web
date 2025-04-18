import dynamic from 'next/dynamic';
const Dashboard = dynamic(() => import('../components/mentee/dashboard'), { ssr: false });

export default function Menteepage() {
  return (
    <div>
      <h1>Mentee Page</h1>
      <Dashboard/>
    </div>
  );
}