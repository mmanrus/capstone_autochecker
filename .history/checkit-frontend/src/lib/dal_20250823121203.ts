import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { cache } from "react";
import { redirect } from "next/navigation";
import { url, COOKIE_NAME } from "@/lib/constants";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  console.log('cookie:',cookie)
  if (!cookie) {
     redirect("/login");
   }
  const session = await decrypt(cookie);
  console.log(`Session: ${session}`);
  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId };
});

export const getUser = cache(async () => {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  const session = await verifySession();
  if (!session) return null;

  try {
    const res = await fetch(`${url}user/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    const user = await res.json();
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});
