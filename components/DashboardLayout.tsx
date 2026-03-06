'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="md:pl-64 py-4 px-4 sm:px-6 lg:px-8 border-t border-slate-200 mt-auto">
          <p className="text-xs text-slate-400 text-center">
            Dibuat oleh Muhammad Zhafran Ghaly
          </p>
        </footer>
      </div>
    </div>
  );
}
