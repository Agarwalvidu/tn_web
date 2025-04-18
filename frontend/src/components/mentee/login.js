'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function MenteeLogin() {
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/m/login', {
        enrollmentNumber,
        password
      });
      localStorage.setItem('menteeToken', res.data.token);
      alert("Mentee logged in");
      router.push('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Mentee Login</h2>
      <input
        type="text"
        placeholder="Enrollment Number"
        value={enrollmentNumber}
        onChange={(e) => setEnrollmentNumber(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white w-full py-2 rounded">
        Login
      </button>
    </div>
  );
}
