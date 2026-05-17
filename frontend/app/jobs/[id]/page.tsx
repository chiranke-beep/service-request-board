'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getJob, updateJobStatus, deleteJob } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
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
  const { user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    getJob(id).then(setJob).catch(() => setError('Job not found.')).finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!job) return;
    setUpdating(true);
    setUpdateError('');
    try {
      setJob(await updateJobStatus(job._id, e.target.value));
    } catch {
      setUpdateError('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!user) {
      setDeleteError('You need to log in before you can delete a request.');
      return;
    }
    if (!job || !confirm('Delete this request? This cannot be undone.')) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteJob(job._id);
      router.push('/');
    } catch (err: unknown) {
      const msg = (err as { error?: string })?.error;
      setDeleteError(msg === 'Not authorised — please log in'
        ? 'You need to be logged in to delete a request.'
        : 'Failed to delete. Please try again.');
      setDeleting(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  );

  if (error || !job) return (
    <div className="text-center py-24">
      <p className="text-slate-400 mb-4 text-sm">{error || 'Job not found.'}</p>
      <button onClick={() => router.push('/')} className="text-blue-600 text-sm hover:underline">← Back to requests</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => router.push('/')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All requests
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold text-slate-900 leading-snug">{job.title}</h1>
            <StatusBadge status={job.status} />
          </div>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">{job.description}</p>
        </div>

        {/* Meta grid */}
        <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-4 text-sm border-b border-slate-100">
          <MetaField label="Category" value={job.category} />
          {job.location    && <MetaField label="Location"     value={job.location} />}
          {job.contactName && <MetaField label="Contact"      value={job.contactName} />}
          {job.contactEmail && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Email</p>
              <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:underline text-sm">{job.contactEmail}</a>
            </div>
          )}
          <MetaField label="Submitted" value={new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
        </div>

        {/* Actions */}
        <div className="px-6 py-5 space-y-3">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Update Status</label>
              <select value={job.status} onChange={handleStatusChange} disabled={updating}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-slate-800">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {user ? (
              <button onClick={handleDelete} disabled={deleting}
                className="rounded-xl border border-red-200 text-red-500 hover:bg-red-50 px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            ) : (
              <button onClick={handleDelete}
                className="rounded-xl border border-slate-200 text-slate-400 px-5 py-2.5 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors">
                Delete
              </button>
            )}
          </div>

          {updateError && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{updateError}</p>
          )}
          {deleteError && (
            <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              <p className="text-sm text-amber-700">{deleteError}</p>
              <button onClick={() => router.push('/login')}
                className="text-xs text-blue-600 font-medium hover:underline ml-3 whitespace-nowrap">
                Log in →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-slate-800">{value}</p>
    </div>
  );
}
