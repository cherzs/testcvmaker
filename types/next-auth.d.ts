import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      membership: string;
      referralCode: string;
    };
  }

  interface User {
    role: string;
    membership: string;
    referralCode: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    membership?: string;
    referralCode?: string;
  }
}
