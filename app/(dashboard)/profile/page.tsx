'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Crown, ArrowRight, Check, X } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const isPremium = session?.user?.membership === 'PREMIUM';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Profil Saya</h1>
          <p className="text-sm text-slate-500 mt-1">
            Informasi akun dan membership Anda
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-700 text-white flex items-center justify-center text-xl font-medium">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{session?.user?.name}</h2>
                <p className="text-sm text-slate-500">{session?.user?.email}</p>
                <div className="mt-2">
                  <Badge variant={isPremium ? 'premium' : 'default'}>
                    {isPremium ? 'Premium' : 'Gratis'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4 text-slate-400" />
                Informasi Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-slate-500">Nama Lengkap</label>
                <p className="font-medium text-slate-900">{session?.user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Email</label>
                <p className="font-medium text-slate-900">{session?.user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Kode Referral</label>
                <p className="font-mono text-sm text-blue-600">{session?.user?.referralCode}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Crown className="w-4 h-4 text-slate-400" />
                Membership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-slate-500">Status</label>
                <div className="mt-1">
                  <Badge variant={isPremium ? 'premium' : 'default'}>
                    {isPremium ? 'Premium' : 'Gratis'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-500">Benefit</label>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {isPremium ? (
                    <>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        CV Tidak Terbatas
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        PDF Tanpa Watermark
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Semua Template
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        1 CV
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        2 Template Dasar
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-xs text-slate-400">•</span>
                        PDF dengan Watermark
                      </li>
                    </>
                  )}
                </ul>
              </div>
              {!isPremium && (
                <Button size="sm" className="mt-2" onClick={() => setShowUpgradeModal(true)}>
                  Upgrade ke Premium
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

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
                          // Reload page untuk update session
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
      </div>
    </DashboardLayout>
  );
}
