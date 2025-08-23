import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { COOKIE_NAME} from '@/lib/constants'
const url = process.env.BACKEND_URL!;

export async function GET() {
  const cookie = cookies().get(COOKIE_NAME)?.value;
  if (!cookie) return Response.json(null, { status: 401 });

  const session = await decrypt(cookie);
  if (!session?.access) return Response.json(null, { status: 401 });
  console.log('')
  try {
    const res = await fetch(`${url}user/`, {
      headers: { Authorization: `Bearer ${session.access}` },
    });

    if (!res.ok) return Response.json(null, { status: res.status });

    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json(null, { status: 500 });
  }
}
