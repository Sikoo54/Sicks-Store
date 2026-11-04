// Helper Midtrans: base URL, auth header, dan mapping status transaksi -> status order.
import crypto from "crypto";

export function midtransIsProduction() {
  return process.env.MIDTRANS_IS_PRODUCTION === "true";
}

export function midtransSnapUrl() {
  return midtransIsProduction()
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
}

export function midtransApiBase() {
  return midtransIsProduction()
    ? "https://api.midtrans.com/v2"
    : "https://api.sandbox.midtrans.com/v2";
}

export function midtransAuthHeader() {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) throw new Error("MIDTRANS_SERVER_KEY belum di-set");
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

// Kurs USD -> IDR untuk Midtrans. Override lewat env USD_IDR_RATE.
export function usdToIdr(usd: number) {
  const rate = Number(process.env.USD_IDR_RATE) || 18116.7;
  return Math.round(usd * rate);
}

// Signature key dari notifikasi Midtrans:
// SHA512(order_id + status_code + gross_amount + server_key)
export function midtransSignature(orderId: string, statusCode: string, grossAmount: string) {
  const key = process.env.MIDTRANS_SERVER_KEY || "";
  return crypto.createHash("sha512").update(`${orderId}${statusCode}${grossAmount}${key}`).digest("hex");
}

export type OrderStatus = "pending" | "paid" | "expired" | "cancelled" | "failed" | "refunded";

// Map transaction_status (+ fraud_status) Midtrans ke status order internal.
export function mapTransactionStatus(transactionStatus?: string, fraudStatus?: string): OrderStatus {
  switch (transactionStatus) {
    case "settlement":
      return "paid";
    case "capture":
      // Kartu kredit: capture baru lunas kalau fraud_status = accept.
      return fraudStatus === "challenge" ? "pending" : "paid";
    case "pending":
      return "pending";
    case "deny":
    case "failure":
      return "failed";
    case "cancel":
      return "cancelled";
    case "expire":
      return "expired";
    case "refund":
    case "partial_refund":
      return "refunded";
    case "chargeback":
    case "partial_chargeback":
      return "failed";
    default:
      return "pending";
  }
}
