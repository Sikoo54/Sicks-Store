// API route: creates Midtrans Snap transaction token.
// POST { items, orderId? } -> { token, redirect_url }

import { NextRequest, NextResponse } from "next/server";
import { usdToIdr } from "@/lib/midtrans";

// Use native fetch to Midtrans API (no extra SDK init needed for edge compat).
// Docs: https://docs.midtrans.com/reference/create-snap-token

export async function POST(req: NextRequest) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  if (!serverKey) {
    return NextResponse.json(
      { error: "MIDTRANS_SERVER_KEY belum di-set di env." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const items: Array<{ product: { name: string; price: number }; qty: number; size: string; color: string }> =
    body?.items ?? [];
  const clientTotal: number | undefined = body?.total;

  if (!items.length) {
    return NextResponse.json({ error: "Cart kosong." }, { status: 400 });
  }

  // Total dalam USD (produk + ongkir), lalu dikonversi ke IDR pakai kurs.
  const itemsUsd = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const totalUsd =
    typeof clientTotal === "number" && clientTotal > 0 ? clientTotal : itemsUsd;

  const itemDetails = items.map((i) => ({
    id: i.product.name.slice(0, 50),
    name: `${i.product.name} (${i.size})`.slice(0, 50),
    price: usdToIdr(i.product.price),
    quantity: i.qty,
  }));

  const itemSum = itemDetails.reduce((s, d) => s + d.price * d.quantity, 0);
  let grossAmount = usdToIdr(totalUsd);

  // Midtrans mewajibkan gross_amount == jumlah item_details.
  // Selisih (ongkir / pembulatan kurs) dimasukkan sebagai item "Shipping",
  // atau gross_amount disamakan kalau selisihnya negatif karena pembulatan.
  const shipping = grossAmount - itemSum;
  if (shipping > 0) {
    itemDetails.push({ id: "shipping", name: "Shipping", price: shipping, quantity: 1 });
  } else if (shipping < 0) {
    grossAmount = itemSum;
  }

  const orderId = body?.orderId || `SICKS-${Date.now()}`;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    item_details: itemDetails,
    customer_details: {
      first_name: "SICKS Customer",
      email: "customer@sicks.store",
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}`,
    },
  };

  const baseUrl = isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const auth = Buffer.from(`${serverKey}:`).toString("base64");

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(parameter),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.error_messages?.join(", ") || "Gagal membuat Snap token.", raw: data },
      { status: res.status }
    );
  }

  // Simpan order ke Supabase (best-effort, jangan gagalkan payment kalau DB belum siap).
  try {
    const { supabaseServer } = await import("@/lib/supabase");
    const sb = supabaseServer();
    await sb.from("orders").insert({
      order_id: orderId,
      items,
      total: grossAmount,
      status: "pending",
      customer_email: "customer@sicks.store",
    });
  } catch (_) {}

  // data = { token, redirect_url }
  return NextResponse.json({ ...data, orderId });
}
