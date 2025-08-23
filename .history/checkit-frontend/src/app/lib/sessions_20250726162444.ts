// lib/session.ts
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error("SESSION_SECRET is missing");
const key = new TextEncoder().encode(secret);

const COOKIE_NAME = "session_token";

export interface SessionPayload {
  userId: string;
  username: string;
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
  
    return payload as SessionPayload;
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

export async function clearSession() {
  const cookie = await cookies();
  cookie.delete(COOKIE_NAME);
}
