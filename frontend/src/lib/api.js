const BASE_URL = 'http://localhost:5000'; // Replace with your actual backend URL

export async function createProgram(name) {
  const res = await fetch(`${BASE_URL}/api/programs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function createMentor(data) {
  const res = await fetch(`${BASE_URL}/api/mentors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function addMentorToProgram(programId, mentorId) {
  const res = await fetch(`${BASE_URL}/api/programs/${programId}/add-mentor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mentorId }),
  });
  return res.json();
}

export async function getAllPrograms() {
    const res = await fetch(`${BASE_URL}/api/programs`);
    return res.json();
  }
  
  export async function getAllMentors() {
    const res = await fetch(`${BASE_URL}/api/mentors`);
    return res.json();
  }
  
