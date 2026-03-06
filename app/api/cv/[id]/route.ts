import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// GET - Ambil CV by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await params;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cv = await prisma.cV.findUnique({
      where: { id },
    });

    if (!cv) {
      return NextResponse.json({ error: 'CV tidak ditemukan' }, { status: 404 });
    }

    if (cv.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      ...cv,
      skills: JSON.parse(cv.skills),
      experiences: JSON.parse(cv.experiences),
      educations: JSON.parse(cv.educations),
    });
  } catch (error) {
    console.error('Get CV error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

// PUT - Update CV
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await params;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cv = await prisma.cV.findUnique({
      where: { id },
    });

    if (!cv) {
      return NextResponse.json({ error: 'CV tidak ditemukan' }, { status: 404 });
    }

    if (cv.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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

    const updatedCV = await prisma.cV.update({
      where: { id },
      data: {
        template,
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

    return NextResponse.json(updatedCV);
  } catch (error) {
    console.error('Update CV error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate CV' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus CV
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await params;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cv = await prisma.cV.findUnique({
      where: { id },
    });

    if (!cv) {
      return NextResponse.json({ error: 'CV tidak ditemukan' }, { status: 404 });
    }

    if (cv.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.cV.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'CV berhasil dihapus' });
  } catch (error) {
    console.error('Delete CV error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus CV' },
      { status: 500 }
    );
  }
}
