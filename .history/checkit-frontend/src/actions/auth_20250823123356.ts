"use server";
import { LoginFormSchema, FormState } from "@/lib/definitions";
import { url } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setSession } from "@/lib/sessions"; // uses jose

export async function login(state: FormState | undefined, formdata: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    username: formdata.get("username"),
    password: formdata.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input.",
    };
  }

  const { username, password } = validatedFields.data;

  const response = await fetch(`${url}auth/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ username, password }).toString(),
  });

  if (!response.ok) {
    return {
      errors: {
        password: ["Invalid Credentials"],
      },
    };
  }

  const data = await response.json();
  const cookieStore = await cookies();

  // Save access token and refresh token
  cookieStore.set("access_token", data.access, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60,
  });

  cookieStore.set("access_refresh", data.refresh, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  console.log('DATA ACCESS: COOKIE')
  await setSession({
    access: data.access,
  }); // adjust based on your backend

  redirect("/dashboard");
}

import { clearSession } from '@/lib/sessions'
 
export async function logout() {
  await clearSession()
  console.log('Logged out')
  redirect('/login')
}