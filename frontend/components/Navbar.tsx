'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            F
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Fix<span className="text-blue-400">Desk</span>
          </span>
        </Link>
        {pathname !== '/new' && (
          <Link
            href="/new"
            className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + New Request
          </Link>
        )}
      </div>
    </nav>
  );
}
