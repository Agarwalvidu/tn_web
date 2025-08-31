'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../mentee/mentee.css';

export default function UserProfile() {
  const [mentee, setMentee] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('menteeToken');
      if (!token) return router.push('/mentee');

      try {
        const res = await axios.get(
          'https://tn-backend-1.onrender.com/api/m/dashboard',
          { headers: { 'x-auth-token': token } }
        );
        setMentee(res.data);
      } catch (err) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('menteeToken');
        router.push('/mentee');
      }
    };

    fetchProfile();
  }, []);

  if (!mentee) {
    return (
      <div className="load-wrapp">
        <div className="load-4">
          <div className="ring-1"></div>
        </div>
      </div>
    );
  }

  // Prepare analytics data (progress over time)
  const analyticsData = mentee.completedResources?.map((res) => ({
    date: new Date(res.completedOn).toLocaleDateString(),
    score: res.score,
  })) || [];

  return (
    <div className="mentee-dashboard">
      {/* Profile Header */}
      <div className="mentee-header">
        <img
          src={`https://ui-avatars.com/api/?name=${mentee.name}&background=167F92&color=fff`}
          alt="profile"
          className="profile-avatar"
        />
        <h1>{mentee.name} 👤</h1>
        <p>Email: {mentee.email || 'Not provided'}</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <h3>Rank</h3>
          <span>🏅 {mentee.rank}</span>
        </div>
        <div className="stat-card">
          <h3>Total Score</h3>
          <span>🏆 {mentee.totalScore}</span>
        </div>
        <div className="stat-card">
          <h3>Streak</h3>
          <span>🔥 {mentee.streak} days</span>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <span>✅ {mentee.completedResources?.length || 0}</span>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="program-card">
        <h2>📊 Learning Analytics</h2>
        {analyticsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#167F92"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No completed resources yet.</p>
        )}
      </div>
    </div>
  );
}
