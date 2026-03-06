import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// GET - Setup initial data (admin user and sample jobs)
export async function GET() {
  try {
    // Check if already setup
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@cvmaker.com' },
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Setup already completed',
        adminEmail: 'admin@cvmaker.com',
        adminPassword: 'admin123'
      });
    }

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@cvmaker.com',
        password: adminPassword,
        role: 'ADMIN',
        membership: 'PREMIUM',
        referralCode: 'ADMIN001',
      },
    });

    // Create sample jobs
    const sampleJobs = [
      {
        title: 'Frontend Developer',
        company: 'Tech Indonesia',
        location: 'Jakarta',
        description: 'Kami mencari Frontend Developer yang berpengalaman dengan React dan TypeScript. Anda akan bertanggung jawab untuk membangun antarmuka pengguna yang responsif dan modern.',
        requirements: '• Pengalaman 2+ tahun dengan React\n• Menguasai TypeScript dan Tailwind CSS\n• Pengalaman dengan Next.js merupakan nilai tambah',
      },
      {
        title: 'Backend Developer',
        company: 'Digital Solutions',
        location: 'Bandung',
        description: 'Bergabunglah dengan tim kami sebagai Backend Developer. Anda akan mengembangkan API dan mengelola database untuk aplikasi skala besar.',
        requirements: '• Pengalaman dengan Node.js atau Python\n• Menguasai database SQL dan NoSQL\n• Pemahaman tentang REST API dan GraphQL',
      },
      {
        title: 'UI/UX Designer',
        company: 'Creative Studio',
        location: 'Yogyakarta',
        description: 'Kami mencari UI/UX Designer yang kreatif untuk merancang pengalaman pengguna yang luar biasa untuk produk digital kami.',
        requirements: '• Portfolio desain yang kuat\n• Mahir menggunakan Figma\n• Pemahaman tentang prinsip UX',
      },
      {
        title: 'Digital Marketing',
        company: 'Growth Hub',
        location: 'Jakarta',
        description: 'Bantu kami mengembangkan presence digital dan mencapai target audiens yang lebih luas melalui strategi marketing yang efektif.',
        requirements: '• Pengalaman dalam social media marketing\n• Pemahaman SEO dan content marketing\n• Kemampuan analisis data',
      },
    ];

    for (const job of sampleJobs) {
      await prisma.job.create({
        data: job,
      });
    }

    return NextResponse.json({
      message: 'Setup completed successfully',
      adminEmail: admin.email,
      adminPassword: 'admin123',
      jobsCreated: sampleJobs.length,
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed' },
      { status: 500 }
    );
  }
}
