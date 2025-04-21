import { useState, useEffect } from 'react';
import { mentorLogin, addMentee, addResource, getAllPrograms, getProgramMentees, getProgramResources } from '../lib/api';

export default function MentorPanel() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [menteeName, setMenteeName] = useState('');
  const [menteeEmail, setMenteeEmail] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceURL, setResourceURL] = useState('');
  const [resourceType, setResourceType] = useState('video');
  const [mentees, setMentees] = useState([]);
  const [resources, setResources] = useState([]);


  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [revealScores, setRevealScores] = useState(false);
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: 1
      }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedMentor = JSON.parse(localStorage.getItem('mentor'));
    const savedProgram = localStorage.getItem('selectedProgram');
  
    if (savedToken && savedMentor) {
      setToken(savedToken);
      setLoggedIn(true);
  
      // Optional: load programs here
      getAllPrograms().then(allPrograms => {
        const mentorPrograms = allPrograms.filter(program =>
          savedMentor.programs.some(programId =>
            programId.toString() === program._id.toString()
          )
        );
        setPrograms(mentorPrograms);
        if (savedProgram) {
          setSelectedProgram(savedProgram); // 👈 Restore
          handleProgramSelect(savedProgram); // 👈 Load its data
        }
      }).catch(err => {
        console.error("Failed to load programs", err);
      });
    }
  }, []);
  
  const handleLogin = async () => {
    try {
      const { token, mentor } = await mentorLogin(email, password);
      setToken(token);
      setLoggedIn(true);

      localStorage.setItem('token', token);
      localStorage.setItem('mentor', JSON.stringify(mentor));

      const allPrograms = await getAllPrograms();
      const mentorPrograms = allPrograms.filter(program => 
        mentor.programs.some(programId => 
          programId.toString() === program._id.toString()
        )
      );
  
      setPrograms(mentorPrograms);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    setLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('mentor');
  };

  const handleAddMentee = async () => {
    try {
      const result = await addMentee(token, {
        email: menteeEmail,
        name: menteeName,
        enrollmentNumber,
        programId: selectedProgram,
      });
      alert(`Mentee added with password: ${result.tempPassword}`);
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProgramSelect = async (programId) => {
    setSelectedProgram(programId);
    localStorage.setItem('selectedProgram', programId);
    try {
      const [menteesData, resourcesData] = await Promise.all([
        getProgramMentees(programId, token),
        getProgramResources(programId, token)
      ]);
      setMentees(menteesData);
      setResources(resourcesData);
    } catch (err) {
      console.error('Failed to load program data:', err);
      // Handle error (show toast/message)
    }
  };

  const handleAddResource = async () => {
    try {
      let resourceData = {
        title: resourceTitle,
        type: resourceType,
        program: selectedProgram,
      };
  
      let isQuiz = false;
  
      if (resourceType === 'quiz') {
        isQuiz = true;
        const maxScore = questions.reduce((sum, q) => sum + Number(q.marks || 1), 0);
        resourceData = {
          ...resourceData,
          questions,
          startTime,
          endTime,
          revealScores,
          maxScore
        };
      } else {
        resourceData.url = resourceURL;
      }
  
      const result = await addResource(token, resourceData, isQuiz);
      alert('Resource added!');
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };
  
  

  return (
    <div style={{ padding: '20px' }}>
      {!loggedIn ? (
        <div>
          <h2>Mentor Login</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          /><br />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <h2>Mentor Panel</h2>
          <h3>Programs</h3>
          <select value={selectedProgram} onChange={e => handleProgramSelect(e.target.value)}>
            <option value="">Select Program</option>
            {programs.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <h3>Add Mentee</h3>
          <input
            placeholder="Email"
            value={menteeEmail}
            onChange={e => setMenteeEmail(e.target.value)}
          /><br />
          <input
            placeholder="Mentee Name"
            value={menteeName}
            onChange={e => setMenteeName(e.target.value)}
          /><br />
          <input
            placeholder="Enrollment Number"
            value={enrollmentNumber}
            onChange={e => setEnrollmentNumber(e.target.value)}
          /><br />
          <button onClick={handleAddMentee}>Add Mentee</button>
          <div>
      <h3>Add Resource</h3>
      <input
        placeholder="Resource Title"
        value={resourceTitle}
        onChange={e => setResourceTitle(e.target.value)}
      /><br />

      {resourceType !== 'quiz' && (
        <>
        <input
          placeholder="Resource URL"
          value={resourceURL}
          onChange={e => setResourceURL(e.target.value)}
        /><br />
        </>
      )}

      <select onChange={e => setResourceType(e.target.value)} value={resourceType}>
        <option value="video">Video</option>
        <option value="quiz">Quiz</option>
        <option value="project">Project</option>
      </select><br />

      {resourceType === 'quiz' && (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
          <label>Start Time:</label>
          <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} /><br />
          <label>End Time:</label>
          <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} /><br />
          <label>Reveal Scores: </label>
          <input type="checkbox" checked={revealScores} onChange={e => setRevealScores(e.target.checked)} /><br />

          <h4>Questions</h4>
          {questions.map((q, i) => (
            <div key={i} style={{ marginBottom: '1rem', border: '1px dashed gray', padding: '1rem' }}>
              <input
                placeholder="Question Text"
                value={q.questionText}
                onChange={e => updateQuestion(i, 'questionText', e.target.value)}
              /><br />
              {q.options.map((opt, j) => (
                <input
                  key={j}
                  placeholder={`Option ${j + 1}`}
                  value={opt}
                  onChange={e => updateOption(i, j, e.target.value)}
                />
              ))}<br />
              <label>Correct Option Index:</label>
              <input
                type="number"
                min="0"
                max="3"
                value={q.correctOptionIndex}
                onChange={e => updateQuestion(i, 'correctOptionIndex', parseInt(e.target.value))}
              /><br />
              <label>Marks:</label>
              <input
                type="number"
                value={q.marks}
                onChange={e => updateQuestion(i, 'marks', parseInt(e.target.value))}
              />
            </div>
          ))}
          <button onClick={addQuestion}>+ Add Question</button>
        </div>
      )}

      <button onClick={handleAddResource}>Add Resource</button>
    </div>
          {selectedProgram && (
  <div>
    <h3>Mentees</h3>
    {mentees.length > 0 ? (
      <ul>
        {mentees.map(mentee => (
          <li key={mentee._id}>
            {mentee.name} - {mentee.enrollmentNumber} - {mentee.password}
          </li>
        ))}
      </ul>
    ) : <p>No mentees in this program</p>}

    <h3>Resources</h3>
    {resources.length > 0 ? (
      <ul>
        {resources.map(resource => (
          <li key={resource._id}>
            {resource.title} ({resource.type})
          </li>
        ))}
      </ul>
    ) : <p>No resources in this program</p>}
  </div>
)}
        </div>
      )}
    </div>
  );
}
