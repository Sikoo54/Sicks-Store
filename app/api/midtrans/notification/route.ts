// Webhook Midtrans (HTTP Notification).
// Set URL ini di Midtrans Dashboard -> Settings -> Configuration -> Payment Notification URL:
//   https://sicks-store.vercel.app/api/midtrans/notification
// Docs: https://docs.midtrans.com/reference/notification-handling
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { mapTransactionStatus, midtransSignature } from "@/lib/midtrans";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.order_id) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
    payment_type,
  } = body;

  // Tolak kalau signature tidak cocok (bukan dari Midtrans).
  const expected = midtransSignature(order_id, status_code ?? "", gross_amount ?? "");
  if (!signature_key || signature_key !== expected) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  const status = mapTransactionStatus(transaction_status, fraud_status);

  try {
    const sb = supabaseServer();
    const { error } = await sb
      .from("orders")
      .update({ status })
      .eq("order_id", order_id);
    if (error) throw error;
  } catch (e: any) {
    // Balikin 500 supaya Midtrans retry notifikasi.
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, order_id, status, transaction_status, payment_type });
}
