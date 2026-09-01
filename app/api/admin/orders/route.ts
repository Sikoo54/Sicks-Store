import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase";

export async function GET() {
  if (cookies().get("admin_auth")?.value !== "ok")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const sb = supabaseServer();
    const { data, error } = await sb.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
