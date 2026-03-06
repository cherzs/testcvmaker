'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, FileStack, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'CV Saya', href: '/cv' },
  { name: 'Buat CV', href: '/cv/create' },
  { name: 'Lowongan', href: '/jobs' },
  { name: 'Referral', href: '/referral' },
  { name: 'Profil', href: '/profile' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <header className="md:hidden bg-slate-900 border-b border-slate-800">
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <FileStack className="w-5 h-5 text-blue-500" />
          <span className="text-white font-semibold text-sm">CV Maker</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-400 hover:text-white p-2"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-900">
          <nav className="px-3 py-2 space-y-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
              >
                <Crown className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"
            >
              Keluar
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
