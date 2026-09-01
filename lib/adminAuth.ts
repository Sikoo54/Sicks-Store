// Simple admin auth via httpOnly cookie set after password check.
import { cookies } from "next/headers";

const COOKIE = "admin_auth";
const COOKIE_VALUE = "ok";

export function isAdminAuthenticated() {
  const c = cookies().get(COOKIE)?.value;
  return c === COOKIE_VALUE;
}

export function setAdminCookie(res: Response) {
  // NextResponse cookies set via headers
  return res;
}
