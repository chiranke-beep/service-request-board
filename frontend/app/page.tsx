'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];

type Job = {
  _id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  contactName?: string;
  status: string;
  createdAt: string;
};

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = category !== 'All' ? { category } : {};
    getJobs(params)
      .then(setJobs)
      .catch(() => setError('Could not load jobs. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
        <span className="text-sm text-gray-400">{jobs.length} job{jobs.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
              category === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      )}

      {error && (
        <div className="text-center py-16 text-red-500">{error}</div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No requests found.{' '}
          <Link href="/new" className="text-blue-600 hover:underline">Create one?</Link>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <Link
              key={job._id}
              href={`/jobs/${job._id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-semibold text-gray-900 leading-snug line-clamp-2">{job.title}</h2>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{job.category}</span>
                {job.location && <span>📍 {job.location}</span>}
                <span className="ml-auto">{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
