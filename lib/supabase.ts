// Supabase clients: browser (anon/publishable) + server (secret).
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Client for browser / client components (RLS applies).
export const supabase = createClient(url, publishableKey);

// Server client for API routes / admin (bypass RLS with secret key).
export function supabaseServer() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("SUPABASE_SECRET_KEY belum di-set");
  return createClient(url, secret);
}
