'use client';

import { useEffect, useState } from 'react';
import { Building2, MapPin, Send, CheckCircle, Globe, Store, ExternalLink, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type JobSource = 'google' | 'local';

interface LocalJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
}

interface GoogleJob {
  id: string;
  title: string;
  company_name: string;
  location: string;
  description: string;
  via: string;
  share_link: string;
  detected_extensions?: {
    posted_at?: string;
    schedule_type?: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  totalJobs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface CV {
  id: string;
  fullName: string;
  jobTitle: string;
}

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<JobSource>('google');
  const [localJobs, setLocalJobs] = useState<LocalJob[]>([]);
  const [googleJobs, setGoogleJobs] = useState<GoogleJob[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 8,
    totalJobs: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [selectedCV, setSelectedCV] = useState<string>('');
  const [showApplyModal, setShowApplyModal] = useState<LocalJob | null>(null);

  useEffect(() => {
    fetchLocalJobs();
    fetchCVs();
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    if (activeTab === 'google') {
      fetchGoogleJobs(pagination.page);
    }
  }, [activeTab, pagination.page]);

  const fetchLocalJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setLocalJobs(data);
      }
    } catch (error) {
      console.error('Error fetching local jobs:', error);
    }
  };

  const fetchGoogleJobs = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/jobs/google?page=${page}&limit=8`);
      if (response.ok) {
        const data = await response.json();
        setGoogleJobs(data.jobs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching Google jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCVs = async () => {
    try {
      const response = await fetch('/api/cv');
      if (response.ok) {
        const data = await response.json();
        setCvs(data);
        if (data.length > 0) {
          setSelectedCV(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await fetch('/api/jobs/apply');
      if (response.ok) {
        const data = await response.json();
        setAppliedJobs(data.map((app: { jobId: string }) => app.jobId));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApply = async () => {
    if (!showApplyModal || !selectedCV) return;

    setApplying(showApplyModal.id);
    try {
      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: showApplyModal.id,
          cvId: selectedCV,
        }),
      });

      if (response.ok) {
        setAppliedJobs([...appliedJobs, showApplyModal.id]);
        setShowApplyModal(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal melamar pekerjaan');
      }
    } catch (error) {
      console.error('Error applying:', error);
    } finally {
      setApplying(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const currentJobs = activeTab === 'local' ? localJobs : googleJobs;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Lowongan Kerja</h1>
          <p className="text-sm text-slate-500 mt-1">
            Temukan pekerjaan dari berbagai sumber
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('google')}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'google'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Globe className="w-4 h-4" />
              Google Jobs
              <Badge variant="info" className="ml-1">{pagination.totalJobs}</Badge>
            </button>
            <button
              onClick={() => setActiveTab('local')}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'local'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Store className="w-4 h-4" />
              Lowongan Lokal
              <Badge variant="default" className="ml-1">{localJobs.length}</Badge>
            </button>
          </div>
        </div>

        {loading && activeTab === 'google' ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : currentJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900">Belum ada lowongan</h3>
              <p className="text-sm text-slate-500 mt-1">
                Nantikan lowongan terbaru dari kami
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {currentJobs.map((job) => {
                const isLocal = activeTab === 'local';
                const jobId = job.id;
                const title = isLocal ? (job as LocalJob).title : (job as GoogleJob).title;
                const company = isLocal ? (job as LocalJob).company : (job as GoogleJob).company_name;
                const location = isLocal ? (job as LocalJob).location : (job as GoogleJob).location;
                const description = isLocal ? (job as LocalJob).description : (job as GoogleJob).description;
                const via = !isLocal ? (job as GoogleJob).via : null;
                const postedAt = !isLocal ? (job as GoogleJob).detected_extensions?.posted_at : null;
                const scheduleType = !isLocal ? (job as GoogleJob).detected_extensions?.schedule_type : null;
                const shareLink = !isLocal ? (job as GoogleJob).share_link : null;

                return (
                  <Card key={jobId} className="hover:border-slate-300 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-slate-900">{title}</h3>
                              <p className="text-sm text-slate-600">{company}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-sm text-slate-500">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {location}
                                </span>
                                {via && (
                                  <span className="text-xs text-slate-400">
                                    via {via}
                                  </span>
                                )}
                              </div>
                              {(postedAt || scheduleType) && (
                                <div className="flex items-center gap-2 mt-1">
                                  {postedAt && (
                                    <span className="text-xs text-slate-400">{postedAt}</span>
                                  )}
                                  {scheduleType && (
                                    <Badge variant="default" className="text-xs">
                                      {scheduleType}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 pl-8">
                            <p className="text-sm text-slate-600 line-clamp-3">{description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isLocal ? (
                            appliedJobs.includes(jobId) ? (
                              <Badge variant="success" className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Sudah Dilamar
                              </Badge>
                            ) : cvs.length === 0 ? (
                              <Button variant="secondary" size="sm" disabled>
                                Buat CV Dulu
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => setShowApplyModal(job as LocalJob)}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Lamar
                              </Button>
                            )
                          ) : (
                            <a 
                              href={shareLink || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button variant="secondary" size="sm">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Lihat Detail
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination - hanya untuk Google Jobs */}
            {activeTab === 'google' && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-slate-500">
                  Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.totalJobs)} dari {pagination.totalJobs} lowongan
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Sebelumnya
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                          pagination.page === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Apply Modal */}
        {showApplyModal && activeTab === 'local' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Lamar Pekerjaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-md">
                  <p className="text-sm font-medium text-slate-900">{showApplyModal.title}</p>
                  <p className="text-sm text-slate-500">{showApplyModal.company}</p>
                </div>
                
                {cvs.length === 0 ? (
                  <p className="text-sm text-slate-500">Anda belum memiliki CV.</p>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Pilih CV</label>
                    <select
                      value={selectedCV}
                      onChange={(e) => setSelectedCV(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {cvs.map((cv) => (
                        <option key={cv.id} value={cv.id}>
                          {cv.fullName} — {cv.jobTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowApplyModal(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleApply}
                    disabled={cvs.length === 0 || applying === showApplyModal.id}
                  >
                    {applying === showApplyModal.id ? 'Mengirim...' : 'Kirim Lamaran'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
