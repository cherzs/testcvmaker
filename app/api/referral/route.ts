import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// GET - Ambil statistik referral user
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

    // Hitung jumlah referral
    const referralCount = await prisma.referral.count({
      where: { referrerId: user.id },
    });

    // Ambil detail referral dengan query terpisah
    const referrals = await prisma.referral.findMany({
      where: { referrerId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Ambil data user yang direferensikan
    const referredUsers = await Promise.all(
      referrals.map(async (ref) => {
        const referredUser = await prisma.user.findUnique({
          where: { id: ref.referredId },
          select: { name: true, email: true, createdAt: true },
        });
        return {
          id: ref.id,
          referred: referredUser,
          createdAt: ref.createdAt,
        };
      })
    );

    return NextResponse.json({
      referralCode: user.referralCode,
      referralCount,
      referrals: referredUsers,
    });
  } catch (error) {
    console.error('Get referral error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
