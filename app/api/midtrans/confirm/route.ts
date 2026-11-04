// Dipanggil dari browser setelah Snap onSuccess: minta status asli ke Midtrans
// lalu update order di DB. Berguna kalau webhook belum terpasang / telat.
// Aman karena status diambil langsung dari Midtrans, bukan dari client.
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { mapTransactionStatus, midtransApiBase, midtransAuthHeader } from "@/lib/midtrans";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const orderId: string | undefined = body?.orderId;
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  try {
    const res = await fetch(`${midtransApiBase()}/${encodeURIComponent(orderId)}/status`, {
      headers: { Accept: "application/json", Authorization: midtransAuthHeader() },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.status_message || `Midtrans error ${res.status}` },
        { status: 502 }
      );
    }

    const status = mapTransactionStatus(data.transaction_status, data.fraud_status);
    const sb = supabaseServer();
    await sb.from("orders").update({ status }).eq("order_id", orderId);

    return NextResponse.json({ orderId, status, transaction_status: data.transaction_status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
