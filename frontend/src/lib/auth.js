'use client';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tn_token');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('tn_user') || 'null');
  } catch { return null; }
}

export function setAuth(token, user) {
  localStorage.setItem('tn_token', token);
  localStorage.setItem('tn_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('tn_token');
  localStorage.removeItem('tn_user');
}

export function isLoggedIn() {
  return !!getToken();
}

export function hasRole(...roles) {
  const user = getUser();
  return user && roles.includes(user.role);
}

// Redirect if not authenticated or wrong role
// Use this in useEffect on pages
export function requireAuth(router, ...roles) {
  const user = getUser();
  if (!user) { router.push('/login'); return false; }
  if (roles.length && !roles.includes(user.role)) {
    if (user.role === 'admin') router.push('/admin');
    else if (user.role === 'mentor') router.push('/mentor');
    else router.push('/dashboard');
    return false;
  }
  return true;
}
