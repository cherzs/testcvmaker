import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// POST - Lamar pekerjaan
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

    const { jobId, cvId } = await req.json();

    if (!jobId || !cvId) {
      return NextResponse.json(
        { error: 'Job ID dan CV ID harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah sudah pernah melamar
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        userId: user.id,
        jobId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Anda sudah melamar lowongan ini' },
        { status: 400 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        userId: user.id,
        jobId,
        cvId,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Apply job error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat melamar' },
      { status: 500 }
    );
  }
}

// GET - Ambil riwayat lamaran user
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

    const applications = await prisma.jobApplication.findMany({
      where: { userId: user.id },
      include: {
        job: true,
        cv: {
          select: {
            fullName: true,
            jobTitle: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
