'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];

type FormErrors = Partial<Record<string, string>>;

export default function NewJobPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      // Small delay to let AuthContext load from localStorage first
      const t = setTimeout(() => {
        if (!localStorage.getItem('fixdesk_auth')) {
          router.push('/login');
        }
      }, 300);
      return () => clearTimeout(t);
    }
  }, [user, router]);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    contactName: '',
    contactEmail: '',
  });

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) {
      e.contactEmail = 'Enter a valid email address';
    }
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setSubmitting(true);
    try {
      await createJob(form);
      router.push('/');
    } catch (err: unknown) {
      setApiError((err as { error?: string })?.error || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  function field(name: keyof typeof form) {
    return {
      value: form[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((p) => ({ ...p, [name]: e.target.value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
      },
    };
  }

  const inputBase = 'w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white';
  const inputNormal = `${inputBase} border-slate-200 text-slate-900 placeholder:text-slate-400`;
  const inputError  = `${inputBase} border-red-300 text-slate-900 placeholder:text-slate-400`;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Request</h1>
        <p className="mt-1 text-sm text-slate-500">Fill in the details and we'll log the job.</p>
      </div>

      {apiError && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 text-sm">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Title <span className="text-red-400 normal-case font-normal">required</span>
          </label>
          <input type="text" placeholder="e.g. Leaking kitchen tap"
            className={errors.title ? inputError : inputNormal} {...field('title')} />
          {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Description <span className="text-red-400 normal-case font-normal">required</span>
          </label>
          <textarea rows={4} placeholder="Describe the issue in detail..."
            className={`${errors.description ? inputError : inputNormal} resize-none`} {...field('description')} />
          {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
            <select className={inputNormal} {...field('category')}>
              <option value="">Select...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Location</label>
            <input type="text" placeholder="e.g. Glasgow" className={inputNormal} {...field('location')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Contact Name</label>
            <input type="text" placeholder="Full name" className={inputNormal} {...field('contactName')} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Contact Email</label>
            <input type="email" placeholder="email@example.com"
              className={errors.contactEmail ? inputError : inputNormal} {...field('contactEmail')} />
            {errors.contactEmail && <p className="mt-1.5 text-xs text-red-500">{errors.contactEmail}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-colors shadow-sm">
            {submitting ? 'Submitting…' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
