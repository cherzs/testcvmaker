import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cvmaker.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@cvmaker.com',
      password: adminPassword,
      role: 'ADMIN',
      membership: 'PREMIUM',
      referralCode: 'ADMIN001',
    },
  });
  console.log('Admin created:', admin.email);

  // Create sample jobs
  const jobs = [
    {
      id: 'frontend-developer',
      title: 'Frontend Developer',
      company: 'Tech Indonesia',
      location: 'Jakarta',
      description: 'Kami mencari Frontend Developer yang berpengalaman dengan React dan TypeScript. Anda akan bertanggung jawab untuk membangun antarmuka pengguna yang responsif dan modern.',
      requirements: '• Pengalaman 2+ tahun dengan React\n• Menguasai TypeScript dan Tailwind CSS\n• Pengalaman dengan Next.js merupakan nilai tambah',
    },
    {
      id: 'backend-developer',
      title: 'Backend Developer',
      company: 'Digital Solutions',
      location: 'Bandung',
      description: 'Bergabunglah dengan tim kami sebagai Backend Developer. Anda akan mengembangkan API dan mengelola database untuk aplikasi skala besar.',
      requirements: '• Pengalaman dengan Node.js atau Python\n• Menguasai database SQL dan NoSQL\n• Pemahaman tentang REST API dan GraphQL',
    },
    {
      id: 'ui-ux-designer',
      title: 'UI/UX Designer',
      company: 'Creative Studio',
      location: 'Yogyakarta',
      description: 'Kami mencari UI/UX Designer yang kreatif untuk merancang pengalaman pengguna yang luar biasa untuk produk digital kami.',
      requirements: '• Portfolio desain yang kuat\n• Mahir menggunakan Figma\n• Pemahaman tentang prinsip UX',
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      company: 'Growth Hub',
      location: 'Jakarta',
      description: 'Bantu kami mengembangkan presence digital dan mencapai target audiens yang lebih luas melalui strategi marketing yang efektif.',
      requirements: '• Pengalaman dalam social media marketing\n• Pemahaman SEO dan content marketing\n• Kemampuan analisis data',
    },
  ];

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {},
      create: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: job.requirements,
        isActive: true,
      },
    });
  }
  console.log('Sample jobs created');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
