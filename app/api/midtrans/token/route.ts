// API route: creates Midtrans Snap transaction token.
// POST { items, orderId? } -> { token, redirect_url }

import { NextRequest, NextResponse } from "next/server";

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

  // Gross amount: sum of item price * qty. Jika clientTotal dikirim, pakai itu (sudah termasuk shipping).
  const grossAmount =
    typeof clientTotal === "number" && clientTotal > 0
      ? Math.round(clientTotal * 1000) // USD -> IDR approx (contoh: $89 -> 89000). Sesuaikan kurs kalau perlu.
      : Math.round(
          items.reduce((s, i) => s + i.product.price * i.qty, 0) * 1000
        );

  const orderId = body?.orderId || `SICKS-${Date.now()}`;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    item_details: items.map((i) => ({
      id: i.product.name.slice(0, 50),
      name: `${i.product.name} (${i.size})`.slice(0, 50),
      price: Math.round(i.product.price * 1000),
      quantity: i.qty,
    })),
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

  // data = { token, redirect_url }
  return NextResponse.json(data);
}
