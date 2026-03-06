import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// GET - Ambil semua CV user
export async function GET() {
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

    const cvs = await prisma.cV.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(cvs);
  } catch (error) {
    console.error('Get CVs error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

// POST - Buat CV baru
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const {
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
    } = body;

    const cv = await prisma.cV.create({
      data: {
        userId: user.id,
        template: template || 'MODERN',
        fullName,
        jobTitle,
        about,
        email,
        phone,
        address,
        skills: JSON.stringify(skills || []),
        experiences: JSON.stringify(experiences || []),
        educations: JSON.stringify(educations || []),
      },
    });

    return NextResponse.json(cv, { status: 201 });
  } catch (error) {
    console.error('Create CV error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat CV' },
      { status: 500 }
    );
  }
}
