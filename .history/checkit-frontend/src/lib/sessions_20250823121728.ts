// lib/session.ts
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/constants";
const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error("SESSION_SECRET is missing");
const key = new TextEncoder().encode(secret);
import type { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
  access: string;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  console.log(`Encrypt: ${payload}`)
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    console.log(token)
    const { payload } = await jwtVerify(token, key);

    return payload as unknown as SessionPayload;
  } catch (err) {
    console.error("Invalid session token", err);
    return null;
  }
}

export async function setSession(payload: SessionPayload) {
  const cookie = await cookies(); // no await
  const token = await encrypt(payload);
  cookie.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookie = await cookies();
  cookie.delete(COOKIE_NAME);
}
