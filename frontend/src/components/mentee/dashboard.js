'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import QuizAttempt from './QuizAttempt';

export default function MenteeDashboard() {
  const [mentee, setMentee] = useState(null);
  const [activeQuizResource, setActiveQuizResource] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('menteeToken');
      if (!token) return router.push('/mentee');

      try {
        const res = await axios.get('http://localhost:5000/api/m/dashboard', {
          headers: { 'x-auth-token': token }
        });
        setMentee(res.data);
      } catch (err) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('menteeToken');
        router.push('/mentee/login');
      }
    };

    fetchDashboard();
  }, []);

  const handleComplete = async (resourceId) => {
    try {
      const token = localStorage.getItem('menteeToken');
      console.log(token);
      const res = await axios.post(`http://localhost:5000/api/m/resources/${resourceId}/complete`, {}, {
        headers: { 'x-auth-token': token }
      });
      alert(res.data.message);
      const updatedMentee = { ...mentee };
      updatedMentee.programs.forEach((program) => {
        program.resources.forEach((resource) => {
          if (resource._id === resourceId) {
            resource.completed = true;
            resource.score = res.data.score;
            resource.completedOn = new Date().toISOString();
          }
        });
      });
      setMentee(updatedMentee);
      // window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong.');
    }
  };

  if (!mentee) return <div>Loading...</div>;
  console.log(mentee);
  // components/MenteeDashboard.js

  return (
    <div>
      <h1>Welcome, {mentee.name} 👋</h1>
      <p>Rank: {mentee.rank}</p>
      <p>Total Score: 🏆 {mentee.totalScore}</p>
      <p>Streak: 🔥 {mentee.streak} days</p>

      {mentee.programs.map((program) => (
        <div key={program._id} style={{ marginTop: '2rem' }}>
          <h2>{program.name}</h2>

          {program.resources.length === 0 ? (
            <p>No resources yet!</p>
          ) : (
            <ul>
              {program.resources.map((res) => (
                <li key={res._id} style={{ marginBottom: '1rem' }}>
                  <strong>{res.title}</strong> ({res.type})
                  <br />
                  {!res.completed && res.type === 'quiz' && !res.isLocked && (
  activeQuizResource === res._id ? (
    <QuizAttempt
      resourceId={res._id}
      onComplete={(score) => {
        const updated = { ...mentee };
        updated.programs.forEach((p) =>
          p.resources.forEach((r) => {
            if (r._id === res._id) {
              r.completed = true;
              r.score = score;
              r.completedOn = new Date().toISOString();
            }
          })
        );
        setMentee(updated);
        setActiveQuizResource(null);
      }}
    />
  ) : (
    <button onClick={() => setActiveQuizResource(res._id)}>Attempt Quiz</button>
  )
)}

                  <a href={res.url} target="_blank" rel="noopener noreferrer">View Resource</a>
                  <br />
                  <span>Score: {res.maxScore}</span> <br />
                  <span>Status: {res.isLocked ? '🔒 Locked' : '✅ Unlocked'}</span> <br />
                  <span>Deadline: {res.deadline}</span> <br />

                  {res.completed ? (
  <div>
    <input type="checkbox" checked disabled />
    <span> ✅ Completed</span>
    <br />
    <span>Completed on: {new Date(res.completedOn).toLocaleDateString()}</span>
    <br />
    <span>Score Achieved: {res.score}</span>
  </div>
) : (
  !res.isLocked && (
    <div>
      <input type="checkbox" onChange={() => handleComplete(res._id)} />
      Mark as Completed
    </div>
  )
)}

                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
