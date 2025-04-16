import dynamic from 'next/dynamic';
const AdminPanel = dynamic(() => import('../components/adminPanel'), { ssr: false });

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>
      <AdminPanel />
    </div>
  );
}
