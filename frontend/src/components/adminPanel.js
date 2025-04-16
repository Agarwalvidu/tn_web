import { useEffect, useState } from 'react';
import {
  createProgram,
  createMentor,
  addMentorToProgram,
  getAllPrograms,
  getAllMentors,
} from '../lib/api';

export default function AdminPanel() {
  const [programName, setProgramName] = useState('');
  const [mentorData, setMentorData] = useState({ name: '', email: '', password: '' });
  const [programs, setPrograms] = useState([]);
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [programRes, mentorRes] = await Promise.all([getAllPrograms(), getAllMentors()]);
    setPrograms(programRes);
    setMentors(mentorRes);
  };

  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    await createProgram(programName);
    setProgramName('');
    fetchData();
  };

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    await createMentor(mentorData);
    setMentorData({ name: '', email: '', password: '' });
    fetchData();
  };

  const handleAssignMentor = async (programId, mentorId) => {
    await addMentorToProgram(programId, mentorId);
    alert(`Mentor assigned!`);
    fetchData(); // refresh data
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Panel</h1>

      {/* Create Program */}
      <form onSubmit={handleProgramSubmit}>
        <h2>Create Program</h2>
        <input
          type="text"
          placeholder="Program Name"
          value={programName}
          onChange={(e) => setProgramName(e.target.value)}
          required
        />
        <button type="submit">Add Program</button>
      </form>

      <hr />

      {/* Create Mentor */}
      <form onSubmit={handleMentorSubmit}>
        <h2>Create Mentor</h2>
        <input
          type="text"
          placeholder="Name"
          value={mentorData.name}
          onChange={(e) => setMentorData({ ...mentorData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={mentorData.email}
          onChange={(e) => setMentorData({ ...mentorData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={mentorData.password}
          onChange={(e) => setMentorData({ ...mentorData, password: e.target.value })}
          required
        />
        <button type="submit">Add Mentor</button>
      </form>

      <hr />

      <h2>Programs</h2>
      {programs.map((program) => {
        // Mentors assigned to this specific program
        const assignedMentors = mentors.filter(
            (mentor) =>
              mentor.programs &&
              mentor.programs.some((p) => {
                const mentorProgramId = p._id || p;
                return mentorProgramId.toString() === program._id.toString();
              })
          );

        // Mentors not assigned to any program
        const unassignedMentors = mentors.filter(
          (mentor) => !mentor.programs || mentor.programs.length === 0
        );

        return (
          <div key={program._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{program.name}</h3>

            <p><strong>Mentors Assigned:</strong></p>
            {assignedMentors.length > 0 ? (
              <ul>
                {assignedMentors.map((mentor) => (
                  <li key={mentor._id}>
                    {mentor.name} ({mentor.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No mentors assigned to this program.</p>
            )}

            <p><strong>Add Mentors:</strong></p>
            {unassignedMentors.length === 0 ? (
              <p>All mentors are already assigned to programs.</p>
            ) : (
              unassignedMentors.map((mentor) => (
                <div key={mentor._id} style={{ marginBottom: '0.5rem' }}>
                  {mentor.name} ({mentor.email}){' '}
                  <button onClick={() => handleAssignMentor(program._id, mentor._id)}>
                    Add to Program
                  </button>
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
