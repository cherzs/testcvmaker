import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// GET - Ambil statistik dashboard
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

    // Hitung jumlah CV
    const cvCount = await prisma.cV.count({
      where: { userId: user.id },
    });

    // Hitung jumlah referral
    const referralCount = await prisma.referral.count({
      where: { referrerId: user.id },
    });

    // Hitung jumlah lamaran
    const applicationCount = await prisma.jobApplication.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      cvCount,
      referralCount,
      applicationCount,
      membership: user.membership,
      referralCode: user.referralCode,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
