'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getJob, updateJobStatus, deleteJob } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';

const STATUSES = ['Open', 'In Progress', 'Closed'];

type Job = {
  _id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  status: string;
  createdAt: string;
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch(() => setError('Job not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!job) return;
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      const updated = await updateJobStatus(job._id, newStatus);
      setJob(updated);
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!job || !confirm('Delete this request? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteJob(job._id);
      router.push('/');
    } catch {
      alert('Failed to delete job.');
      setDeleting(false);
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (error || !job) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">{error || 'Job not found.'}</p>
      <button onClick={() => router.push('/')} className="text-blue-600 hover:underline text-sm">
        ← Back to all requests
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/')}
        className="text-sm text-gray-400 hover:text-gray-700 mb-6 inline-flex items-center gap-1 transition-colors"
      >
        ← All requests
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{job.title}</h1>
          <StatusBadge status={job.status} />
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed mb-6">{job.description}</p>

        {/* Meta grid */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm mb-6">
          <div>
            <dt className="text-gray-400 font-medium mb-0.5">Category</dt>
            <dd className="text-gray-800">{job.category}</dd>
          </div>
          {job.location && (
            <div>
              <dt className="text-gray-400 font-medium mb-0.5">Location</dt>
              <dd className="text-gray-800">{job.location}</dd>
            </div>
          )}
          {job.contactName && (
            <div>
              <dt className="text-gray-400 font-medium mb-0.5">Contact</dt>
              <dd className="text-gray-800">{job.contactName}</dd>
            </div>
          )}
          {job.contactEmail && (
            <div>
              <dt className="text-gray-400 font-medium mb-0.5">Email</dt>
              <dd>
                <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:underline">
                  {job.contactEmail}
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt className="text-gray-400 font-medium mb-0.5">Submitted</dt>
            <dd className="text-gray-800">{new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
          </div>
        </dl>

        <hr className="border-gray-100 mb-6" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-1">Update Status</label>
            <select
              value={job.status}
              onChange={handleStatusChange}
              disabled={updating}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="pt-5">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
