'use client';
import { useState } from 'react';
import axios from 'axios';

export default function ProjectSubmissionForm({ resourceId, onSubmitted }) {
  const [githubLink, setGithubLink] = useState('');
  const [deployedLink, setdeployedLink] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (description.trim().split(' ').length < 50) {
      return alert('Please enter a description with at least 300 words (~50+ words).');
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('menteeToken');
      const res = await axios.post(
        `http://localhost:5000/api/m/resources/${resourceId}/project`,
        { githubLink, deployedLink, description },
        { headers: { 'x-auth-token': token } }
      );

      alert('Project submitted successfully!');
      onSubmitted(res.data.score || 0);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <div>
        <label>GitHub Repository:</label>
        <input
          type="url"
          required
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          placeholder="https://github.com/your-repo"
        />
      </div>
      <div>
        <label>Live Project Link:</label>
        <input
          type="url"
          required
          value={deployedLink}
          onChange={(e) => setdeployedLink(e.target.value)}
          placeholder="https://your-project.live"
        />
      </div>
      <div>
        <label>Project Description:</label>
        <textarea
          rows={6}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write at least 300 words about your project"
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Project'}
      </button>
    </form>
  );
}
