'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import './leaderboard.css';

export default function Leaderboard() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          'https://tn-backend-1.onrender.com/api/m/leaderboard'
        );
        setMentees(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="load-wrapp">
        <div className="load-4">
          <div className="ring-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h1>🏆 Mentee Leaderboard</h1>
      <div className="responsive-table-wrapper">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total Score</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee, index) => (
              <tr key={index}>
                <td>#{mentee.rank}</td>
                <td>{mentee.name}</td>
                <td>{mentee.totalScore}</td>
                <td>🔥 {mentee.streak} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
