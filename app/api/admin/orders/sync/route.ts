// Sync status order dari Midtrans Core API (buat order yang notifikasinya terlewat).
// POST { orderId?: string } -> sync satu order, atau semua order pending kalau orderId kosong.
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase";
import { mapTransactionStatus, midtransApiBase, midtransAuthHeader } from "@/lib/midtrans";

export const dynamic = "force-dynamic";

async function fetchStatus(orderId: string) {
  const res = await fetch(`${midtransApiBase()}/${encodeURIComponent(orderId)}/status`, {
    headers: { Accept: "application/json", Authorization: midtransAuthHeader() },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.status_message || `Midtrans error ${res.status}`);
  return data;
}

export async function POST(req: NextRequest) {
  if (cookies().get("admin_auth")?.value !== "ok")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const sb = supabaseServer();

  try {
    let orderIds: string[] = [];

    if (body?.orderId) {
      orderIds = [String(body.orderId)];
    } else {
      const { data, error } = await sb
        .from("orders")
        .select("order_id")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      orderIds = (data || []).map((o: any) => o.order_id);
    }

    const results: Array<{ orderId: string; status?: string; error?: string }> = [];

    for (const orderId of orderIds) {
      try {
        const d = await fetchStatus(orderId);
        const status = mapTransactionStatus(d.transaction_status, d.fraud_status);
        const { error } = await sb.from("orders").update({ status }).eq("order_id", orderId);
        if (error) throw error;
        results.push({ orderId, status });
      } catch (e: any) {
        results.push({ orderId, error: e.message });
      }
    }

    return NextResponse.json({ ok: true, synced: results.length, results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
