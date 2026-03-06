'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Edit2, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface CV {
  id: string;
  fullName: string;
  jobTitle: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

export default function CVListPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDemo, setLoadingDemo] = useState(false);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const response = await fetch('/api/cv');
      if (response.ok) {
        const data = await response.json();
        setCvs(data);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus CV ini?')) return;

    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCvs(cvs.filter((cv) => cv.id !== id));
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
    }
  };

  const handleLoadDemo = async () => {
    setLoadingDemo(true);
    try {
      const response = await fetch('/api/cv/demo', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the newly created CV
        router.push(`/cv/${data.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal membuat CV demo');
      }
    } catch (error) {
      console.error('Error loading demo CV:', error);
      alert('Terjadi kesalahan saat membuat CV demo');
    } finally {
      setLoadingDemo(false);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">CV Saya</h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola dan edit CV Anda
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={handleLoadDemo}
              disabled={loadingDemo}
            >
              {loadingDemo ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loadingDemo ? 'Memuat...' : 'Load Demo CV'}
            </Button>
            <Link href="/cv/create">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Buat CV Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Info Card */}
        {cvs.length === 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-slate-900">Belum punya CV?</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Coba fitur <strong>Load Demo CV</strong> untuk melihat contoh CV yang sudah jadi, 
                    atau buat CV baru dari awal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CV List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : cvs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900">Belum ada CV</h3>
              <p className="text-sm text-slate-500 mt-1 mb-5">
                Anda belum membuat CV. Mulai buat CV pertama Anda.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="secondary"
                  onClick={handleLoadDemo}
                  disabled={loadingDemo}
                >
                  {loadingDemo ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Load Demo CV
                </Button>
                <Link href="/cv/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Buat CV Pertama
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {cvs.map((cv) => (
              <Card key={cv.id} className="hover:border-slate-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-slate-900">{cv.fullName}</h3>
                        <p className="text-sm text-slate-500">{cv.jobTitle}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="default">
                            {cv.template === 'MODERN' ? 'Modern' : 'Minimal'}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {formatDate(cv.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/cv/${cv.id}`}>
                        <Button variant="ghost" size="sm">
                          Lihat
                        </Button>
                      </Link>
                      <Link href={`/cv/${cv.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(cv.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
