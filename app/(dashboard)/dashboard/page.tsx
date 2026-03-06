'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FileText, Users, Briefcase, Crown, Plus, ArrowRight, Check, X } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface DashboardStats {
  cvCount: number;
  referralCount: number;
  applicationCount: number;
  membership: string;
  referralCode: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPremium = stats?.membership === 'PREMIUM';

  const handleCopyReferral = () => {
    const url = `${window.location.origin}/register?ref=${stats?.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Selamat Datang, {session?.user?.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola CV dan lamaran pekerjaan Anda
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Total CV</p>
                  <p className="text-xl font-bold text-slate-900">{stats?.cvCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Referral</p>
                  <p className="text-xl font-bold text-slate-900">{stats?.referralCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Lamaran</p>
                  <p className="text-xl font-bold text-slate-900">{stats?.applicationCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Membership</p>
                  <Badge variant={isPremium ? 'premium' : 'default'}>
                    {isPremium ? 'Premium' : 'Gratis'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Aksi Cepat</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/cv/create">
              <Card className="hover:border-blue-300 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Buat CV Baru</h3>
                    <p className="text-sm text-slate-500">Mulai dari template</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cv">
              <Card className="hover:border-slate-300 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Lihat CV Saya</h3>
                    <p className="text-sm text-slate-500">Kelola CV yang ada</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/jobs">
              <Card className="hover:border-slate-300 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Cari Lowongan</h3>
                    <p className="text-sm text-slate-500">Temukan pekerjaan</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Upgrade Section - for free users */}
        {!isPremium && (
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">Upgrade ke Premium</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Dapatkan akses CV tanpa batas dan tanpa watermark.
                </p>
              </div>
              <Button onClick={() => setShowUpgradeModal(true)}>
                Upgrade Sekarang
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Upgrade ke Premium</h3>
                    <p className="text-sm text-slate-500 mt-1">Pilih paket yang sesuai untuk Anda</p>
                  </div>
                  <button 
                    onClick={() => setShowUpgradeModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      GRATIS untuk Demo
                    </span>
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">Premium</h4>
                      <p className="text-sm text-slate-500">Akses penuh semua fitur</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900 line-through text-slate-400">Rp 99rb</span>
                      <span className="text-2xl font-bold text-green-600 ml-2">GRATIS</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      CV Tidak Terbatas
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      PDF Tanpa Watermark
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      Semua Template
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600" />
                      Prioritas Support
                    </li>
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    disabled={upgrading}
                    onClick={async () => {
                      setUpgrading(true);
                      try {
                        const response = await fetch('/api/subscribe', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                        });
                        
                        if (response.ok) {
                          // Refresh stats dan session
                          await fetchStats();
                          // Reload session untuk update membership
                          window.location.reload();
                        } else {
                          const data = await response.json();
                          alert(data.error || 'Gagal upgrade. Silakan coba lagi.');
                        }
                      } catch (error) {
                        alert('Terjadi kesalahan. Silakan coba lagi.');
                      } finally {
                        setUpgrading(false);
                        setShowUpgradeModal(false);
                      }
                    }}
                  >
                    {upgrading ? 'Memproses...' : 'Upgrade Sekarang - Gratis!'}
                  </Button>
                </div>
                
                <p className="text-xs text-slate-400 text-center mt-4">
                  🎉 Khusus demo: Upgrade ke Premium GRATIS!
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Referral Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">Kode Referral Anda</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Bagikan link dan dapatkan poin
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md">
                  <code className="text-sm text-slate-600 font-mono">
                    {typeof window !== 'undefined' 
                      ? `${window.location.origin}/register?ref=${stats?.referralCode || ''}`
                      : `domain.com/register?ref=${stats?.referralCode || ''}`}
                  </code>
                </div>
                <Button variant="secondary" size="sm" onClick={handleCopyReferral}>
                  {copied ? 'Tersalin' : 'Salin'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
