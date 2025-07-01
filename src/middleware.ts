import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth as adminAuth } from './lib/firebase-admin';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (!sessionCookie) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
    
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();

  } catch (error) {
    // Session cookie is invalid.
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
