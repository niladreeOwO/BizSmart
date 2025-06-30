import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';

async function verifySessionCookie(session: string | undefined) {
    if (!session) return null;

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(session, true);
        return decodedClaims;
    } catch (error) {
        return null;
    }
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const decodedToken = await verifySessionCookie(session);

  const { pathname } = request.nextUrl;

  const authenticatedRoutes = ['/dashboard', '/transactions', '/insights'];
  const isProtectedRoute = authenticatedRoutes.some(path => pathname.startsWith(path));

  // If user is not authenticated and tries to access a protected route, redirect to login
  if (!decodedToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and tries to access login or signup, redirect to dashboard
  if (decodedToken && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // if user is authenticated and is on the root path, redirect to dashboard
  if (decodedToken && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
