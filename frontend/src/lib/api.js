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
  
export async function mentorLogin(email, password) {
  console.log(email,password);
    const res = await fetch(`${BASE_URL}/api/mentors/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) throw new Error('Login failed');
    return res.json(); // returns { token }
}
  
export async function addMentee(token, { email, name, enrollmentNumber, programId }) {
    const res = await fetch(`${BASE_URL}/api/mentees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'x-auth-token': token
      },
      body: JSON.stringify({ email, name, enrollmentNumber, programId }),
    });
  
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to add mentee');
    }
    return res.json(); // returns { mentee, tempPassword }
}

export async function addResource(token, resourceData) {
    const res = await fetch(`${BASE_URL}/api/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'x-auth-token': token,
      },
      body: JSON.stringify(resourceData), // includes title, type, url, program, etc.
    });
  
    if (!res.ok) throw new Error('Failed to add resource');
    return res.json(); // returns resource
}
  
export async function getMentorDetails(token) {
    const res = await fetch(`${BASE_URL}/api/mentors/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('Failed to fetch mentor details');
    return res.json(); // returns mentor object
  }


  export async function getProgramMentees(programId, token) {
    const res = await fetch(`${BASE_URL}/api/${programId}/mentees`, {
      headers: {
      'x-auth-token': token
      }
    });
    if (!res.ok) throw new Error('Failed to fetch mentees');
    return res.json();
  }

  export async function getProgramResources(programId, token) {
    const res = await fetch(`${BASE_URL}/api/${programId}/resources`, {
      headers: {
        'x-auth-token': token
      }
    });
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  }
  