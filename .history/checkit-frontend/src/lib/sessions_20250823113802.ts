// lib/session.ts
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { COOKIE_NAME } from '@/lib/constants'
const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error("SESSION_SECRET is missing");
const key = new TextEncoder().encode(secret);



export interface SessionPayload {
  userId: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);

    return payload as unknown as SessionPayload;
  } catch (err) {
    console.error("Invalid session token", err);
    return null;
  }
}

export async function setSession(payload: SessionPayload) {
  const cookie = await cookies();
  const token = await encrypt(payload);
  cookie.set(COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

