'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download, Edit2 } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';

interface CVData {
  id: string;
  fullName: string;
  jobTitle: string;
  about: string;
  email: string;
  phone: string;
  address: string;
  skills: string[];
  experiences: Array<{
    company: string;
    position: string;
    year: string;
    description: string;
  }>;
  educations: Array<{
    institution: string;
    major: string;
    year: string;
  }>;
  template: string;
}

export default function CVPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const cvRef = useRef<HTMLDivElement>(null);
  const [cv, setCV] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<'MODERN' | 'MINIMAL'>('MODERN');
  const [membership, setMembership] = useState<string>('GRATIS');

  useEffect(() => {
    fetchCV();
  }, [params.id]);

  const fetchCV = async () => {
    try {
      const response = await fetch(`/api/cv/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCV(data);
        setSelectedTemplate(data.template);
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setMembership(stats.membership);
        }
      } else {
        router.push('/cv');
      }
    } catch (error) {
      console.error('Error fetching CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return;

    const element = cvRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`CV-${cv?.fullName.replace(/\s+/g, '-')}.pdf`);
  };

  const handleTemplateChange = async (template: 'MODERN' | 'MINIMAL') => {
    setSelectedTemplate(template);
    try {
      await fetch(`/api/cv/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cv,
          template,
          skills: cv?.skills || [],
          experiences: cv?.experiences || [],
          educations: cv?.educations || [],
        }),
      });
    } catch (error) {
      console.error('Error updating template:', error);
    }
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

  if (!cv) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-500">CV tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  const cvData = {
    fullName: cv.fullName,
    jobTitle: cv.jobTitle,
    about: cv.about,
    email: cv.email,
    phone: cv.phone,
    address: cv.address,
    skills: cv.skills || [],
    experiences: cv.experiences || [],
    educations: cv.educations || [],
  };

  const showWatermark = membership === 'GRATIS';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/cv">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Preview CV</h1>
              <p className="text-sm text-slate-500">{cv.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/cv/${cv.id}/edit`}>
              <Button variant="secondary" size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button size="sm" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Template Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-sm font-medium text-slate-700">Template:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTemplateChange('MODERN')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTemplate === 'MODERN'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Modern
                </button>
                <button
                  onClick={() => handleTemplateChange('MINIMAL')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTemplate === 'MINIMAL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Minimal
                </button>
              </div>
              {showWatermark && (
                <Badge variant="warning" className="ml-auto">
                  PDF akan ada watermark
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CV Preview */}
        <div ref={cvRef} className="bg-slate-100 p-4 sm:p-8">
          {selectedTemplate === 'MODERN' ? (
            <ModernTemplate data={cvData} watermark={showWatermark} />
          ) : (
            <MinimalTemplate data={cvData} watermark={showWatermark} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
