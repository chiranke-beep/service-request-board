// Central place to call the backend API. All fetch calls go through here.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getJobs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/jobs${query ? `?${query}` : ''}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function getJob(id) {
  const res = await fetch(`${BASE_URL}/api/jobs/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Job not found');
  return res.json();
}

export async function createJob(data) {
  const res = await fetch(`${BASE_URL}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function updateJobStatus(id, status) {
  const res = await fetch(`${BASE_URL}/api/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function deleteJob(id) {
  const res = await fetch(`${BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete job');
  return res.json();
}
