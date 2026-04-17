import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/navigation';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/';
  
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return null;
  }

  // If a user is not authenticated and they try to visit dashboard or account
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/account');
  if (isProtectedPage && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return null;
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*', '/account/:path*'],
};
