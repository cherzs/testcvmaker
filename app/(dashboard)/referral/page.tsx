'use client';

import { useEffect, useState } from 'react';
import { Users, Copy, Share2, User } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ReferralData {
  referralCode: string;
  referralCount: number;
  referrals: Array<{
    id: string;
    referred: {
      name: string;
      email: string;
      createdAt: string;
    } | null;
    createdAt: string;
  }>;
}

export default function ReferralPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referral');
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReferralUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/register?ref=${data?.referralCode}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getReferralUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bergabung dengan CV Maker',
          text: 'Daftar di CV Maker dan buat CV profesionalmu!',
          url: getReferralUrl(),
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopy();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Program Referral</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ajak teman bergabung dan dapatkan keuntungan
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Jumlah Referral</p>
                      <p className="text-xl font-bold text-slate-900">{data?.referralCount || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Total Poin</p>
                      <p className="text-xl font-bold text-slate-900">{data?.referralCount || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Referral Link */}
            <Card>
              <CardHeader>
                <CardTitle>Link Referral Anda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md">
                    <code className="text-sm text-slate-600 font-mono">
                      {getReferralUrl()}
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Tersalin' : 'Salin'}
                    </Button>
                    <Button onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral List */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Referral</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.referrals && data.referrals.length > 0 ? (
                  <div className="divide-y divide-slate-200">
                    {data.referrals.map((referral) => (
                      <div key={referral.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-600">
                              {referral.referred?.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{referral.referred?.name}</p>
                            <p className="text-sm text-slate-500">{referral.referred?.email}</p>
                          </div>
                        </div>
                        <span className="text-sm text-slate-400">
                          {formatDate(referral.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Belum ada yang bergabung</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Bagikan link referral Anda untuk mulai mengajak teman
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
