const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('fixdesk_auth');
  return stored ? JSON.parse(stored).token : null;
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getJobs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/api/jobs${query ? `?${query}` : ''}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getJob(id) {
  const res = await fetch(`${API}/api/jobs/${id}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function createJob(data) {
  const res = await fetch(`${API}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function updateJobStatus(id, status) {
  const res = await fetch(`${API}/api/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function deleteJob(id) {
  const res = await fetch(`${API}/api/jobs/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
