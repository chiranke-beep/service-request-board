'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            F
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Fix<span className="text-blue-400">Desk</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-slate-400 text-sm hidden sm:block">
                Hi, <span className="text-white font-medium">{user.name}</span>
              </span>
              {pathname !== '/new' && (
                <Link
                  href="/new"
                  className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  + New Request
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
