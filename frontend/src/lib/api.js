const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
  console.log(email, password);
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
      'x-auth-token': token,
    },
    body: JSON.stringify({ email, name, enrollmentNumber, programId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add mentee');
  }
  return res.json(); // returns { mentee, tempPassword }
}

export async function addResource(token, resourceData, isQuiz = false) {
  const endpoint = isQuiz ? '/api/resources/quiz' : '/api/resources';

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(resourceData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add resource');
  }

  return res.json(); // returns resource or quiz object
}

export async function getMentorDetails(token) {
  const res = await fetch(`${BASE_URL}/api/mentors/me`, {
    method: 'GET',
    headers: {
      'x-auth-token': token,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch mentor details');
  return res.json(); // returns mentor object
}

export async function getProgramMentees(programId, token) {
  const res = await fetch(`${BASE_URL}/api/${programId}/mentees`, {
    headers: {
      'x-auth-token': token,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch mentees');
  return res.json();
}

export async function getProgramResources(programId, token) {
  const res = await fetch(`${BASE_URL}/api/${programId}/resources`, {
    headers: {
      'x-auth-token': token,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

// Unified login
export async function login(email, password, role) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Login failed');
  }
  return res.json(); // returns { token, user }
}

// Change password
export async function changePassword(token, currentPassword, newPassword) {
  const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Failed to change password');
  }
  return res.json();
}

// Admin APIs
export async function getAdminStats(token) {
  const res = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: { 'x-auth-token': token },
  });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
}

export async function getMentorRequests(token) {
  const res = await fetch(`${BASE_URL}/api/admin/mentor-requests`, {
    headers: { 'x-auth-token': token },
  });
  if (!res.ok) throw new Error('Failed to fetch mentor requests');
  return res.json();
}

export async function approveMentorRequest(token, id) {
  const res = await fetch(`${BASE_URL}/api/admin/mentor-requests/${id}/approve`, {
    method: 'POST',
    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to approve mentor request');
  }
  return res.json();
}

export async function rejectMentorRequest(token, id) {
  const res = await fetch(`${BASE_URL}/api/admin/mentor-requests/${id}/reject`, {
    method: 'POST',
    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to reject mentor request');
  }
  return res.json();
}

export async function getAdminCohorts(token) {
  const res = await fetch(`${BASE_URL}/api/admin/cohorts`, {
    headers: { 'x-auth-token': token },
  });
  if (!res.ok) throw new Error('Failed to fetch cohorts');
  return res.json();
}

export async function createCohort(token, data) {
  const res = await fetch(`${BASE_URL}/api/admin/cohorts`, {
    method: 'POST',
    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create cohort');
  }
  return res.json();
}

export async function updateCohort(token, id, data) {
  const res = await fetch(`${BASE_URL}/api/admin/cohorts/${id}`, {
    method: 'PUT',
    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update cohort');
  }
  return res.json();
}

export async function deleteCohort(token, id) {
  const res = await fetch(`${BASE_URL}/api/admin/cohorts/${id}`, {
    method: 'DELETE',
    headers: { 'x-auth-token': token },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete cohort');
  }
  return res.json();
}

export async function assignMentor(token, cohortId, mentorId) {
  const res = await fetch(`${BASE_URL}/api/admin/cohorts/${cohortId}/assign-mentor`, {
    method: 'POST',
    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mentorId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to assign mentor');
  }
  return res.json();
}

export async function removeMentor(token, cohortId, mentorId) {
  const res = await fetch(`${BASE_URL}/api/admin/cohorts/${cohortId}/remove-mentor`, {
    method: 'POST',
    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mentorId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to remove mentor');
  }
  return res.json();
}

export async function getCohortAnalytics(token, cohortId) {
  const res = await fetch(`${BASE_URL}/api/admin/cohorts/${cohortId}/analytics`, {
    headers: { 'x-auth-token': token },
  });
  if (!res.ok) throw new Error('Failed to fetch cohort analytics');
  return res.json();
}

export async function getAdminMentors(token) {
  const res = await fetch(`${BASE_URL}/api/admin/mentors`, {
    headers: { 'x-auth-token': token },
  });
  if (!res.ok) throw new Error('Failed to fetch mentors');
  return res.json();
}

// Mentor request (public)
export async function submitMentorRequest(data) {
  const res = await fetch(`${BASE_URL}/api/mentor-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit mentor request');
  }
  return res.json();
}
