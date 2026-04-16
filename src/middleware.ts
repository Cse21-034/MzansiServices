import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log('🚦 Middleware running for:', req.nextUrl.pathname);
    
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    
    console.log('🔑 Token in middleware:', { 
      role: token?.role,
      path: pathname 
    });

    // Only redirect logged-in users from auth pages (login/signup)
    if (['/login', '/signup'].includes(pathname) && token) {
      // Redirect to the page they were trying to access, or their dashboard
      const returnTo = req.nextUrl.searchParams.get('callbackUrl') || getDashboardPath(token.role as string);
      console.log('📍 Redirecting from auth page to:', returnTo);
      return NextResponse.redirect(new URL(returnTo, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        console.log('🔒 Checking authorization:', { 
          path: pathname,
          role: token?.role 
        });

        // Always allow access to solidacare paths during development
        if (pathname.startsWith('/solidacare')) {
          console.log('✅ Allowing access to solidacare path');
          return true;
        }

        // Define public routes that don't require authentication
        const publicPaths = [
          '/',              // Home page
          '/login',         // Auth pages
          '/signup',
          '/businesses',    // Public business listings
          '/about',         // Static pages
          '/contact',
          '/blog',
          '/api/auth',      // Auth API routes
          '/_next',         // Next.js resources
          '/fonts',
          '/images'
        ];

        // Allow public routes without authentication
        if (publicPaths.some(path => pathname.startsWith(path))) {
          return true;
        }

        // Protected routes require authentication
        if (!token) {
          console.log('❌ No token - unauthorized');
          return false;
        }

        // Role-based access control
        const isAuthorized = (
          (pathname.startsWith('/usersdashboard') && (token.role === 'USER' || token.role === 'ADMIN')) ||
          (pathname.startsWith('/business') && (token.role === 'BUSINESS' || token.role === 'ADMIN')) ||
          (pathname.startsWith('/mzansiservices') && token.role === 'ADMIN') ||
          pathname.startsWith('/api/') // Allow API routes
        );

        console.log('🔐 Authorization result:', isAuthorized);
        return isAuthorized;
      },
    },
  }
);

function getDashboardPath(role: string): string {
  console.log('🎯 Getting dashboard for role:', role);
  switch (role) {
    case 'BUSINESS':
      return '/business';
    case 'ADMIN':
      return '/mzansiservices';
    case 'USER':
      return '/usersdashboard';
    default:
      return '/';
  }
}

export const config = {
  // Only run this middleware for actual protected dashboard routes.
  // Keep solidacare (dev-only admin creation) and public pages out of middleware processing
  matcher: [
    '/usersdashboard/:path*',
    '/business/:path*',
    '/mzansiservices/:path*',
    '/api/user/:path*',
  ],
};
