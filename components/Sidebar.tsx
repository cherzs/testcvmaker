'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Briefcase,
  Users,
  UserCircle,
  LogOut,
  Crown,
  FileStack,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'CV Saya', href: '/cv', icon: FileText },
  { name: 'Buat CV', href: '/cv/create', icon: PlusCircle },
];

const jobItems = [
  { name: 'Lowongan Kerja', href: '/jobs', icon: Briefcase },
];

const accountItems = [
  { name: 'Referral', href: '/referral', icon: Users },
  { name: 'Profil', href: '/profile', icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === 'ADMIN';

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <FileStack className="w-5 h-5 text-blue-500" />
          <span className="text-white font-semibold text-sm">CV Maker</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3">
        {/* Menu Section */}
        <div className="px-3 mb-6">
          <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Menu
          </p>
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive(item.href)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Lowongan Section */}
        <div className="px-3 mb-6">
          <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Lowongan
          </p>
          <nav className="space-y-0.5">
            {jobItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive(item.href)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Akun Section */}
        <div className="px-3 mb-6">
          <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Akun
          </p>
          <nav className="space-y-0.5">
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive(item.href)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="px-3">
            <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Admin
            </p>
            <nav className="space-y-0.5">
              <Link
                href="/admin"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname?.startsWith('/admin')
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )}
              >
                <Crown className="w-4 h-4" />
                Admin Panel
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* User Info & Logout */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-medium">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200 truncate max-w-[140px]">
                {session?.user?.name}
              </p>
              <p className="text-xs text-slate-500">
                {session?.user?.membership === 'PREMIUM' ? 'Premium' : 'Gratis'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}
