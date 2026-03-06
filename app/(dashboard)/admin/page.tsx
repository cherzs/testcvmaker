'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, FileText, Briefcase, Crown, Plus, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type Tab = 'users' | 'cvs' | 'jobs';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  membership: string;
  createdAt: string;
  _count: {
    cvs: number;
  };
}

interface CV {
  id: string;
  fullName: string;
  jobTitle: string;
  template: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  isActive: boolean;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [cvs, setCVs] = useState<CV[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);

  // Job form
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchData();
    }
  }, [activeTab, session]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await fetch('/api/admin/users');
        if (response.ok) setUsers(await response.json());
      } else if (activeTab === 'cvs') {
        const response = await fetch('/api/admin/cvs');
        if (response.ok) setCVs(await response.json());
      } else if (activeTab === 'jobs') {
        const response = await fetch('/api/jobs');
        if (response.ok) setJobs(await response.json());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeUser = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, membership: 'PREMIUM' }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error upgrading user:', error);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitle,
          company: jobCompany,
          location: jobLocation,
          description: jobDescription,
          requirements: jobRequirements,
        }),
      });

      if (response.ok) {
        setShowJobModal(false);
        setJobTitle('');
        setJobCompany('');
        setJobLocation('');
        setJobDescription('');
        setJobRequirements('');
        fetchData();
      }
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-slate-600" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-500">Kelola pengguna, CV, dan lowongan</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex gap-6">
            {[
              { id: 'users', label: 'Pengguna', icon: Users },
              { id: 'cvs', label: 'CV', icon: FileText },
              { id: 'jobs', label: 'Lowongan', icon: Briefcase },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-slate-900">{user.name}</h3>
                          <Badge variant={user.membership === 'PREMIUM' ? 'premium' : 'default'}>
                            {user.membership}
                          </Badge>
                          {user.role === 'ADMIN' && (
                            <Badge variant="info">Admin</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {user._count.cvs} CV • {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                    {user.membership === 'GRATIS' && user.role !== 'ADMIN' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpgradeUser(user.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Upgrade
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'cvs' && (
          <div className="space-y-3">
            {cvs.map((cv) => (
              <Card key={cv.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-slate-900">{cv.fullName}</h3>
                      <p className="text-sm text-slate-500">{cv.jobTitle}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {cv.user.name} • {cv.template} • {formatDate(cv.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button onClick={() => setShowJobModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Lowongan
              </Button>
            </div>
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900">{job.title}</h3>
                        <Badge variant={job.isActive ? 'success' : 'default'}>
                          {job.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{job.company}</p>
                      <p className="text-xs text-slate-400">{job.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Job Modal */}
        {showJobModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Tambah Lowongan Baru</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateJob} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Judul Pekerjaan</label>
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Frontend Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan</label>
                    <input
                      type="text"
                      required
                      value={jobCompany}
                      onChange={(e) => setJobCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="PT Contoh Indonesia"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                    <input
                      type="text"
                      required
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jakarta"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                    <textarea
                      required
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jelaskan tugas dan tanggung jawab..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Persyaratan</label>
                    <textarea
                      value={jobRequirements}
                      onChange={(e) => setJobRequirements(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jelaskan kualifikasi yang dibutuhkan..."
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setShowJobModal(false)}
                    >
                      Batal
                    </Button>
                    <Button type="submit" className="flex-1">
                      Simpan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
