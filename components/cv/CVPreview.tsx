'use client';

import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
import { Button } from '@/components/ui/Button';
import { Download, FileText } from 'lucide-react';

interface CVData {
  fullName: string;
  jobTitle: string;
  about?: string;
  email: string;
  phone?: string;
  address?: string;
  skills: string[];
  experiences: Array<{
    company: string;
    position: string;
    year: string;
    description?: string;
  }>;
  educations: Array<{
    institution: string;
    major: string;
    year: string;
  }>;
}

interface CVPreviewProps {
  data: CVData;
  template: 'MODERN' | 'MINIMAL';
  showWatermark?: boolean;
}

export function CVPreview({ data, template, showWatermark = false }: CVPreviewProps) {
  const cvRef = useRef<HTMLDivElement>(null);

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
    pdf.save(`CV-${data.fullName.replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      <div ref={cvRef} className="bg-gray-100 p-4">
        {template === 'MODERN' ? (
          <ModernTemplate data={data} watermark={showWatermark} />
        ) : (
          <MinimalTemplate data={data} watermark={showWatermark} />
        )}
      </div>
    </div>
  );
}
