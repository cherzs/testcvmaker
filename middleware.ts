import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard') || 
            req.nextUrl.pathname.startsWith('/cv') || 
            req.nextUrl.pathname.startsWith('/jobs') || 
            req.nextUrl.pathname.startsWith('/referral') || 
            req.nextUrl.pathname.startsWith('/profile') ||
            req.nextUrl.pathname.startsWith('/admin')) {
          return token !== null;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/cv/:path*', '/jobs/:path*', '/referral/:path*', '/profile/:path*', '/admin/:path*'],
};
