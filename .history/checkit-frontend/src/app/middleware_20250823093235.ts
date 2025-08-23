// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/sessions';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('session_token')?.value;
  const isProtected = req.nextUrl.pathname.startsWith('/home');

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const session = await decrypt(token);
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*'],
};
