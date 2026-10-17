import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Gatekeeper proxy for registration routes and APIs.
 * Redirects registration frontend traffic to /coming-soon and blocks registration/enrollment/checkout APIs.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Blocked API routes for registration, enrollment, checkout, and payment
  const isBlockedApi =
    pathname === '/api/register' ||
    pathname.startsWith('/api/register/') ||
    pathname === '/api/check-email' ||
    pathname.startsWith('/api/check-email/') ||
    pathname === '/api/verify-email' ||
    pathname.startsWith('/api/verify-email/') ||
    pathname === '/api/submit-registration' ||
    pathname.startsWith('/api/submit-registration/') ||
    pathname === '/api/enroll-event' ||
    pathname.startsWith('/api/enroll-event/') ||
    pathname === '/api/enrolled-event' ||
    pathname.startsWith('/api/enrolled-event/') ||
    pathname === '/api/enrollment' ||
    pathname.startsWith('/api/enrollment/') ||
    pathname === '/api/checkout' ||
    pathname.startsWith('/api/checkout/') ||
    pathname === '/api/checkout-event' ||
    pathname.startsWith('/api/checkout-event/') ||
    pathname === '/api/payment' ||
    pathname.startsWith('/api/payment/');

  if (isBlockedApi) {
    return new NextResponse('You cannot access this cheater', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  // 2. Do not redirect /coming-soon itself
  if (pathname === '/coming-soon' || pathname.startsWith('/coming-soon/')) {
    return NextResponse.next();
  }

  // 3. Frontend registration and enrollment related pages -> Redirect to /coming-soon
  const isRegistrationPage =
    pathname === '/register' ||
    pathname.startsWith('/register/') ||
    pathname === '/check-email' ||
    pathname.startsWith('/check-email/') ||
    pathname === '/verify-email' ||
    pathname.startsWith('/verify-email/') ||
    pathname === '/email-verify' ||
    pathname.startsWith('/email-verify/') ||
    pathname === '/enroll-event' ||
    pathname.startsWith('/enroll-event/') ||
    pathname === '/enroll-events' ||
    pathname.startsWith('/enroll-events/') ||
    pathname === '/checkout-event' ||
    pathname.startsWith('/checkout-event/');

  if (isRegistrationPage) {
    return NextResponse.redirect(new URL('/coming-soon', request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
