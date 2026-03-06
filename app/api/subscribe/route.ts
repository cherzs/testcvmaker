import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// POST - Upgrade user to Premium
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

    if (user.membership === 'PREMIUM') {
      return NextResponse.json({ error: 'User already Premium' }, { status: 400 });
    }

    // Update user to Premium
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { membership: 'PREMIUM' },
    });

    return NextResponse.json({
      message: 'Upgrade to Premium successful',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        membership: updatedUser.membership,
      },
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat upgrade' },
      { status: 500 }
    );
  }
}
