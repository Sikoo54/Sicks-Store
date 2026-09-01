// Admin login: simple password form.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setErr(data.error || "Gagal login");
    else router.push("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-chalk px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-card ring-1 ring-ink/10">
        <h1 className="font-display text-2xl font-bold uppercase">Admin Login</h1>
        <p className="mt-1 text-sm text-ink/60">Masukkan password admin (default: sicks-admin-2026)</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-ink"
        />
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        <button
          disabled={loading}
          className="mt-4 w-full bg-ink py-3 font-display text-sm font-bold uppercase tracking-wide text-white disabled:opacity-60"
        >
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
