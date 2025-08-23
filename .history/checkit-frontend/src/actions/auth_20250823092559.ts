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

  const response = await fetch(`${url}api/auth/token/`, {
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

  const user = await fetch(`${url}api/user/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${data.access}`,
    },
  });

  const user_data = await user.json();
  console.log(user_data);
  await setSession({
    userId: user_data.id,
    full_name: user_data.full_name,
    username: user_data.username,
    first_name: user_data.first_name,
    last_name: user_data.last_name,
    email: user_data.email,
    role: user_data.role,
  }); // adjust based on your backend

  redirect("/home");
}
