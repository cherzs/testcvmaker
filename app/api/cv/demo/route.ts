import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// POST - Create demo CV
export async function POST() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cek membership untuk user gratis
    if (user.membership === 'GRATIS') {
      const cvCount = await prisma.cV.count({
        where: { userId: user.id },
      });
      if (cvCount >= 1) {
        return NextResponse.json(
          { error: 'Akun gratis hanya bisa membuat 1 CV. Upgrade ke Premium untuk membuat CV lebih banyak.' },
          { status: 403 }
        );
      }
    }

    // Data demo CV
    const demoCV = {
      userId: user.id,
      template: 'MODERN',
      fullName: 'Ahmad Rizky Pratama',
      jobTitle: 'Full Stack Developer',
      about: 'Saya adalah seorang Full Stack Developer dengan pengalaman 5 tahun dalam pengembangan aplikasi web modern. Memiliki keahlian dalam React, Node.js, dan database SQL/NoSQL. Saya passionate dalam membangun produk digital yang bermanfaat dan user-friendly.',
      email: user.email,
      phone: '+62 812 3456 7890',
      address: 'Jakarta, Indonesia',
      skills: JSON.stringify([
        'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 
        'Python', 'PostgreSQL', 'MongoDB', 'Git', 'Docker', 
        'AWS', 'Tailwind CSS', 'GraphQL'
      ]),
      experiences: JSON.stringify([
        {
          company: 'Tech Solutions Indonesia',
          position: 'Senior Full Stack Developer',
          year: '2021 - Sekarang',
          description: 'Memimpin tim pengembangan dalam membangun aplikasi e-commerce dengan 1M+ pengguna. Mengimplementasikan microservices architecture dan CI/CD pipeline. Meningkatkan performance aplikasi sebesar 40%.'
        },
        {
          company: 'Digital Creative Agency',
          position: 'Frontend Developer',
          year: '2019 - 2021',
          description: 'Mengembangkan website dan aplikasi web untuk berbagai klien menggunakan React dan Vue.js. Berkolaborasi dengan tim desain untuk implementasi pixel-perfect UI/UX.'
        },
        {
          company: 'StartUp Tech',
          position: 'Junior Web Developer',
          year: '2018 - 2019',
          description: 'Membangun RESTful API menggunakan Node.js dan Express. Mengelola database PostgreSQL dan MongoDB. Belajar dan mengimplementasikan best practices dalam pengembangan software.'
        }
      ]),
      educations: JSON.stringify([
        {
          institution: 'Universitas Indonesia',
          major: 'S1 Teknik Informatika',
          year: '2014 - 2018'
        },
        {
          institution: 'SMA Negeri 1 Jakarta',
          major: 'IPA',
          year: '2011 - 2014'
        }
      ]),
    };

    const cv = await prisma.cV.create({
      data: demoCV,
    });

    return NextResponse.json(cv, { status: 201 });
  } catch (error) {
    console.error('Create demo CV error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat CV demo' },
      { status: 500 }
    );
  }
}
