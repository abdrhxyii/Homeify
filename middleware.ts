// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;
  console.log(token, "token from middelware")
  console.log(userCookie, "token from middelware")

  if (!token || !userCookie) {
    // Redirect to login if not authenticated
    if (!request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const user = JSON.parse(decodeURIComponent(userCookie));

  // Admin tries to access home page
  if (user.role === 'ADMIN' && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // User tries to access dashboard
  if (user.role === 'USER' && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard', '/login'],
};