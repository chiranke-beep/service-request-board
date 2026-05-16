'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 text-lg hover:text-blue-600 transition-colors">
          Fix<span className="text-blue-600 font-bold">Desk</span>
        </Link>
        {pathname !== '/new' && (
          <Link
            href="/new"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Request
          </Link>
        )}
      </div>
    </nav>
  );
}
