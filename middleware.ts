import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rate limiting for sensitive routes
  if (['/api/auth', '/api/verification', '/api/payment/callback'].some(p => path.startsWith(p))) {
    const ip = request.ip || 'anonymous';
    if (!rateLimit(ip)) return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Admin check
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (path.startsWith('/dashboard')) {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
    if (session.role !== 'ADMIN') return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/api/auth/:path*', '/api/verification/:path*', '/api/payment/callback'] };
