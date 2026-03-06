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

interface MinimalTemplateProps {
  data: CVData;
  watermark?: boolean;
}

export function MinimalTemplate({ data, watermark = false }: MinimalTemplateProps) {
  return (
    <div className="bg-white min-h-[842px] w-full max-w-[595px] mx-auto shadow-lg relative">
      {/* Watermark */}
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-45deg]">
          <span className="text-4xl font-bold text-gray-400">Dibuat dengan CV Maker</span>
        </div>
      )}

      <div className="p-10">
        {/* Simple Header */}
        <div className="text-center mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-light text-gray-900 tracking-wide">{data.fullName}</h1>
          <p className="text-gray-500 mt-2">{data.jobTitle}</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm text-gray-400">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>|</span> && <span>{data.phone}</span>}
            {data.address && <span>|</span> && <span>{data.address}</span>}
          </div>
        </div>

        {/* About */}
        {data.about && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Profil
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{data.about}</p>
          </section>
        )}

        {/* Experience */}
        {data.experiences?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Pengalaman Kerja
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-24 shrink-0">
                    <span className="text-sm text-gray-400">{exp.year}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{exp.position}</h3>
                    <p className="text-gray-500 text-sm">{exp.company}</p>
                    {exp.description && (
                      <p className="text-gray-400 text-sm mt-1">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.educations?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Pendidikan
            </h2>
            <div className="space-y-3">
              {data.educations.map((edu, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-24 shrink-0">
                    <span className="text-sm text-gray-400">{edu.year}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{edu.major}</h3>
                    <p className="text-gray-500 text-sm">{edu.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Keahlian
            </h2>
            <p className="text-gray-600 text-sm">
              {data.skills.join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
