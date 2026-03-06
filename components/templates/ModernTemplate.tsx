'use client';

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

interface ModernTemplateProps {
  data: CVData;
  watermark?: boolean;
}

export function ModernTemplate({ data, watermark = false }: ModernTemplateProps) {
  return (
    <div className="bg-white min-h-[842px] w-full max-w-[595px] mx-auto shadow-lg relative">
      {/* Watermark */}
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-45deg]">
          <span className="text-4xl font-bold text-gray-400">Dibuat dengan CV Maker</span>
        </div>
      )}

      {/* Header with accent color */}
      <div className="bg-blue-600 text-white p-8">
        <h1 className="text-3xl font-bold">{data.fullName}</h1>
        <p className="text-blue-100 text-lg mt-1">{data.jobTitle}</p>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-blue-100">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.address && <span>• {data.address}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* About */}
        {data.about && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              TENTANG SAYA
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{data.about}</p>
          </section>
        )}

        {/* Experience */}
        {data.experiences?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              PENGALAMAN KERJA
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                    <span className="text-sm text-gray-500">{exp.year}</span>
                  </div>
                  <p className="text-blue-600 text-sm">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.educations?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              PENDIDIKAN
            </h2>
            <div className="space-y-3">
              {data.educations.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">{edu.major}</h3>
                    <span className="text-sm text-gray-500">{edu.year}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              KEAHLIAN
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
