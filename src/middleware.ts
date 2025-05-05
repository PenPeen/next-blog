import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from './fetcher/getCurrentUser';

const protectedRoutes = ['/account'];

function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(route => {
    return path === route || path.startsWith(`${route}/`);
  });
}

export async function middleware(request: NextRequest) {
  const path = new URL(request.url).pathname;

  if (isProtectedRoute(path)) {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/((?!.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};
