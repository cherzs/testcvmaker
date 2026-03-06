'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface Experience {
  company: string;
  position: string;
  year: string;
  description: string;
}

interface Education {
  institution: string;
  major: string;
  year: string;
}

export default function CreateCVPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState<'MODERN' | 'MINIMAL'>('MODERN');
  
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [about, setAbout] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddExperience = () => {
    setExperiences([...experiences, { company: '', position: '', year: '', description: '' }]);
  };

  const handleUpdateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleAddEducation = () => {
    setEducations([...educations, { institution: '', major: '', year: '' }]);
  };

  const handleUpdateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const handleRemoveEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          fullName,
          jobTitle,
          about,
          email,
          phone,
          address,
          skills,
          experiences,
          educations,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Terjadi kesalahan saat membuat CV');
        setLoading(false);
        return;
      }

      router.push(`/cv/${data.id}`);
    } catch {
      setError('Terjadi kesalahan saat membuat CV');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Buat CV Baru</h1>
          <p className="text-sm text-slate-500 mt-1">Isi informasi Anda untuk membuat CV</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pilih Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTemplate('MODERN')}
                  className={`p-4 border rounded-md text-left transition-colors ${
                    template === 'MODERN'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium text-slate-900">Modern</div>
                  <div className="text-sm text-slate-500 mt-1">Desain profesional dengan warna biru</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTemplate('MINIMAL')}
                  className={`p-4 border rounded-md text-left transition-colors ${
                    template === 'MINIMAL'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium text-slate-900">Minimal</div>
                  <div className="text-sm text-slate-500 mt-1">Desain bersih dan sederhana</div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nama Lengkap"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
              <Input
                label="Jabatan / Posisi"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Software Engineer"
              />
              <Textarea
                label="Tentang Saya"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Ceritakan singkat tentang diri Anda..."
                rows={4}
              />
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
              />
              <Input
                label="Nomor Telepon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812 3456 7890"
              />
              <Input
                label="Alamat"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jakarta, Indonesia"
              />
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Keahlian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                  placeholder="Tambah keahlian..."
                />
                <Button type="button" onClick={handleAddSkill} variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-slate-400 hover:text-slate-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pengalaman Kerja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {experiences.map((exp, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-md">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-slate-500">Pengalaman {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <Input
                      label="Nama Perusahaan"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                      placeholder="PT Contoh Indonesia"
                    />
                    <Input
                      label="Posisi"
                      value={exp.position}
                      onChange={(e) => handleUpdateExperience(index, 'position', e.target.value)}
                      placeholder="Senior Developer"
                    />
                    <Input
                      label="Tahun"
                      value={exp.year}
                      onChange={(e) => handleUpdateExperience(index, 'year', e.target.value)}
                      placeholder="2020 - 2023"
                    />
                    <Textarea
                      label="Deskripsi"
                      value={exp.description}
                      onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                      placeholder="Jelaskan tugas dan pencapaian Anda..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddExperience}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pengalaman
              </Button>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pendidikan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {educations.map((edu, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-md">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-slate-500">Pendidikan {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <Input
                      label="Nama Institusi"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                      placeholder="Universitas Indonesia"
                    />
                    <Input
                      label="Jurusan"
                      value={edu.major}
                      onChange={(e) => handleUpdateEducation(index, 'major', e.target.value)}
                      placeholder="Teknik Informatika"
                    />
                    <Input
                      label="Tahun"
                      value={edu.year}
                      onChange={(e) => handleUpdateEducation(index, 'year', e.target.value)}
                      placeholder="2016 - 2020"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddEducation}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pendidikan
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Menyimpan...' : 'Simpan CV'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
