import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/sessions";
import { COOKIE_NAME } from "@/lib/constants";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Read cookie directly from request
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const session = cookie ? await decrypt(cookie) : null;

  console.log("Session Cookie Middleware:", session);

  // 2. Redirect unauthenticated users away from protected routes
  if (protectedRoutes.some((route) => path.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 3. Redirect authenticated users away from public routes
  if (publicRoutes.some((route) => path === route) && session) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // 4. Otherwise, continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(png|jpg|jpeg|svg|webp)$).*)"],
};
