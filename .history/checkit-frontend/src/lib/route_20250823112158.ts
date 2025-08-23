import { NextResponse } from "next/server";
import { getUser } from "@/lib/dal";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
