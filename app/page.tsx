import Link from 'next/link';
import { FileText, Briefcase, Users, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-900">CV Maker</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">
                Masuk
              </Link>
              <Link href="/register">
                <Button size="sm">Daftar Gratis</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight">
            Buat CV Profesional
            <br />
            <span className="text-blue-600">dalam Hitungan Menit</span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed">
            Platform pembuat CV online yang membantu Anda membuat CV menarik 
            dan melamar pekerjaan dengan mudah.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Buat CV Sekarang
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sudah Punya Akun?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo/Data Preview */}
      <section className="py-12 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-slate-900">Template CV yang Tersedia</h2>
            <p className="text-sm text-slate-500 mt-1">Pilih dari template profesional kami</p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Modern Template Preview */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Template Modern</h3>
                  <p className="text-sm text-slate-500">Desain profesional dengan warna biru</p>
                </div>
                <Sparkles className="w-5 h-5 text-blue-500" />
              </div>
              <div className="bg-slate-50 rounded-md p-4 space-y-3">
                <div className="h-8 bg-blue-600 rounded-sm" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-300 rounded w-3/4" />
                  <div className="h-2 bg-slate-200 rounded w-full" />
                  <div className="h-2 bg-slate-200 rounded w-5/6" />
                </div>
              </div>
            </div>

            {/* Minimal Template Preview */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Template Minimal</h3>
                  <p className="text-sm text-slate-500">Desain bersih dan sederhana</p>
                </div>
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <div className="bg-slate-50 rounded-md p-4 space-y-3">
                <div className="text-center border-b border-slate-200 pb-3">
                  <div className="h-3 bg-slate-800 rounded w-1/2 mx-auto" />
                  <div className="h-2 bg-slate-300 rounded w-1/3 mx-auto mt-2" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-200 rounded w-full" />
                  <div className="h-2 bg-slate-200 rounded w-4/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-lg font-semibold text-slate-900">Fitur Utama</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <FileText className="w-6 h-6 text-slate-400 mx-auto mb-3" />
              <h3 className="font-medium text-slate-900">Template Modern</h3>
              <p className="text-sm text-slate-500 mt-1">Pilih dari berbagai template CV profesional</p>
            </div>
            <div className="text-center">
              <Briefcase className="w-6 h-6 text-slate-400 mx-auto mb-3" />
              <h3 className="font-medium text-slate-900">Portal Lowongan</h3>
              <p className="text-sm text-slate-500 mt-1">Temukan dan lamar pekerjaan impian</p>
            </div>
            <div className="text-center">
              <Users className="w-6 h-6 text-slate-400 mx-auto mb-3" />
              <h3 className="font-medium text-slate-900">Sistem Referral</h3>
              <p className="text-sm text-slate-500 mt-1">Ajak teman dan dapatkan keuntungan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-slate-900">Pilih Paket Anda</h2>
            <p className="text-sm text-slate-500 mt-1">Mulai gratis dan upgrade kapan saja</p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Free Plan */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900">Gratis</h3>
                <p className="text-sm text-slate-500">Cocok untuk pemula</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-slate-900">Rp 0</span>
                <span className="text-slate-500">/bulan</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  1 CV
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  2 Template
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  Akses Lowongan
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-4 h-4 rounded-full border border-slate-300" />
                  PDF dengan watermark
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button variant="secondary" className="w-full">
                  Mulai Gratis
                </Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white border-2 border-blue-600 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-4">
                <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                  POPULER
                </span>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900">Premium</h3>
                <p className="text-sm text-slate-500">Untuk profesional</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-slate-900">Rp 99rb</span>
                <span className="text-slate-500">/bulan</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  CV Tidak Terbatas
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  Semua Template
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  PDF Tanpa Watermark
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  Prioritas Support
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button className="w-full">
                  Upgrade Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Data Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-slate-900">Contoh Lowongan Pekerjaan</h2>
            <p className="text-sm text-slate-500 mt-1">Daftar pekerjaan yang tersedia di platform kami</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Frontend Developer', company: 'Tech Indonesia', location: 'Jakarta' },
              { title: 'Backend Developer', company: 'Digital Solutions', location: 'Bandung' },
              { title: 'UI/UX Designer', company: 'Creative Studio', location: 'Yogyakarta' },
              { title: 'Digital Marketing', company: 'Growth Hub', location: 'Jakarta' },
            ].map((job, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">{job.title}</h4>
                  <p className="text-sm text-slate-500">{job.company} • {job.location}</p>
                </div>
                <Briefcase className="w-5 h-5 text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white">
            Siap Membuat CV Profesional?
          </h2>
          <p className="mt-3 text-slate-400">
            Bergabung dengan ribuan pengguna yang telah berhasil mendapatkan pekerjaan impian.
          </p>
          <Link href="/register" className="inline-block mt-6">
            <Button size="lg" variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
              Daftar Gratis Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">CV Maker</span>
          </div>
          <p className="text-sm text-slate-400">
            © 2026 CV Maker Platform • Dibuat oleh Muhammad Zhafran Ghaly
          </p>
        </div>
      </footer>
    </div>
  );
}
