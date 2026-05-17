import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FixDesk',
  description: 'Submit and track trade service requests.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
            {children}
          </main>
          <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400 tracking-wide">
            FixDesk — Service Request Management
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
