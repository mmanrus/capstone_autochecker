import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/sessions";
import { COOKIE_NAME} from '@/lib/constants'
// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 2. Read cookie directly from request
  const cookie = req.cookies.get()?.value;
  const session = cookie ? await decrypt(cookie) : null;

  console.log("Session:", session);

  // 3. Redirect unauthenticated users
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 4. Redirect authenticated users away from public routes
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
