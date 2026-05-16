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
  status: string;
  createdAt: string;
};

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce search input by 400ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params: Record<string, string> = {};
    if (category !== 'All') params.category = category;
    if (search.trim()) params.search = search.trim();
    getJobs(params)
      .then(setJobs)
      .catch(() => setError('Failed to load jobs. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Service Requests</h1>
        <p className="mt-1 text-slate-500 text-sm">Track and manage all open trade job requests.</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              category === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 font-medium">
          {jobs.length} result{jobs.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-center text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && jobs.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-16 text-center">
          <p className="text-slate-400 text-sm mb-3">
            {search ? `No results for "${search}".` : 'No service requests found.'}
          </p>
          {!search && (
            <Link href="/new" className="text-blue-600 text-sm font-medium hover:underline">
              + Create the first request
            </Link>
          )}
        </div>
      )}

      {/* Job cards */}
      {!loading && !error && jobs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link
              key={job._id}
              href={`/jobs/${job._id}`}
              className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h2>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {job.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                  {job.category}
                </span>
                {job.location && (
                  <span className="flex items-center gap-0.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                )}
                <span className="ml-auto">
                  {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
