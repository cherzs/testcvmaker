import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function generateReferralCode(): Promise<string> {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const existing = await prisma.user.findUnique({
    where: { referralCode: code },
  });
  if (existing) {
    return generateReferralCode();
  }
  return code;
}
