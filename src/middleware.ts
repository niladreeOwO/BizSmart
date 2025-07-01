import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // If the user has a session and tries to access an authentication page,
  // redirect them to the dashboard.
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// The matcher ensures this middleware only runs on the auth pages.
// Protection for dashboard routes is now handled by the layout.
export const config = {
  matcher: ['/login', '/signup'],
};
