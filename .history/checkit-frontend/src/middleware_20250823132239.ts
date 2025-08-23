import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/sessions";
import { COOKIE_NAME } from "@/lib/constants";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const session = cookie ? await decrypt(cookie) : null;

  console.log("MIDDLEWARE path:", path);
  console.log("MIDDLEWARE cookie:", cookie);
  console.log("MIDDLEWARE session:", session);

  if (protectedRoutes.includes(path) && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (publicRoutes.includes(path) && session) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(png|jpg|jpeg|svg|webp)$).*)"],
};
