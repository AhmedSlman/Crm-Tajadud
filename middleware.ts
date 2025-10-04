import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes that clients should not access
  const adminRoutes = [
    '/users',
    '/permissions', 
    '/clients',
    '/projects',
    '/tasks',
    '/campaigns',
    '/content',
    '/calendar',
    '/reports',
    '/'
  ];

  // Client routes that admins should not access via direct URL
  const clientRoutes = [
    '/client-dashboard',
    '/client-project'
  ];

  // Check if it's an admin route
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || (route !== '/' && pathname.startsWith(route))
  );

  // Check if it's a client route  
  const isClientRoute = clientRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If accessing admin route, check for client session
  if (isAdminRoute) {
    // This will be handled by client-side protection in ProtectedRoute component
    // We don't block here to allow proper admin authentication flow
    return NextResponse.next();
  }

  // If accessing client route, ensure no admin interference
  if (isClientRoute) {
    // This will be handled by ClientProtectedRoute component
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication pages)
     * - client-login (client login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|client-login).*)',
  ],
};
