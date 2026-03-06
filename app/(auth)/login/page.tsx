'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-xl text-slate-900">CV Maker</span>
          </Link>
          <h2 className="mt-6 text-2xl font-semibold text-slate-900">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              Daftar gratis
            </Link>
          </p>
        </div>

        <Suspense fallback={
          <div className="mt-8 bg-white py-8 px-6 shadow-sm rounded-lg border border-slate-200">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center text-xs text-slate-400">
          Dibuat oleh Muhammad Zhafran Ghaly
        </p>
      </div>
    </div>
  );
}
