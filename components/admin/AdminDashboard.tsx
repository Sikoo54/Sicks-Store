// Admin dashboard client: list, add, edit, delete products + orders.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  image: string;
  rating?: number;
  is_new?: boolean;
  featured?: boolean;
  colors?: string[];
  sizes?: string[];
  size_type?: string;
  tagline?: string;
};

const empty: Product = {
  id: "",
  name: "",
  brand: "SICKS",
  price: 99,
  category: "shoes",
  image: "/images/hero.jpg",
  rating: 4.8,
  is_new: false,
  featured: false,
  colors: ["#111114"],
  sizes: ["M", "L"],
  size_type: "letter",
  tagline: "",
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [form, setForm] = useState<Product>(empty);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const load = async () => {
    const r = await fetch("/api/admin/products");
    const d = await r.json();
    if (Array.isArray(d)) setProducts(d);
    else setMsg(d.error || "Gagal load products. Jalankan supabase.sql dulu.");
    const o = await fetch("/api/admin/orders").then((x) => x.json()).catch(() => []);
    if (Array.isArray(o)) setOrders(o);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    const method = editing ? "PUT" : "POST";
    const r = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    if (!r.ok) setMsg(d.error);
    else { setMsg(editing ? "Updated!" : "Added!"); setForm(empty); setEditing(false); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    load();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-chalk">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold uppercase">Admin — SICKS</h1>
          <button onClick={logout} className="rounded-lg border px-4 py-2 text-sm">Logout</button>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => setTab("products")} className={`px-4 py-2 text-sm font-bold uppercase ${tab === "products" ? "bg-ink text-white" : "bg-white"}`}>Products ({products.length})</button>
          <button onClick={() => setTab("orders")} className={`px-4 py-2 text-sm font-bold uppercase ${tab === "orders" ? "bg-ink text-white" : "bg-white"}`}>Orders ({orders.length})</button>
        </div>
        {msg && <p className="mt-3 text-sm text-cobalt">{msg}</p>}

        {tab === "products" ? (
          <>
            <div className="mt-6 rounded-2xl bg-white p-6 shadow">
              <h2 className="font-bold uppercase">{editing ? "Edit" : "Add"} Product</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input placeholder="id (slug)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={editing} className="rounded border px-3 py-2 text-sm disabled:bg-chalk" />
                <input placeholder="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded border px-3 py-2 text-sm" />
                <input placeholder="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="rounded border px-3 py-2 text-sm" />
                <input placeholder="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="rounded border px-3 py-2 text-sm" />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded border px-3 py-2 text-sm">
                  <option value="shoes">shoes</option><option value="jerseys">jerseys</option><option value="shorts">shorts</option><option value="shirts">shirts</option><option value="other">other</option>
                </select>
                <input placeholder="image (/images/...)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="rounded border px-3 py-2 text-sm" />
                <input placeholder="tagline" value={form.tagline || ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="rounded border px-3 py-2 text-sm sm:col-span-2" />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} /> Is new</label>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={save} className="bg-cobalt px-6 py-2 text-sm font-bold uppercase text-white">{editing ? "Update" : "Add"}</button>
                {editing && <button onClick={() => { setEditing(false); setForm(empty); }} className="border px-6 py-2 text-sm">Cancel</button>}
              </div>
            </div>

            <div className="mt-6 overflow-auto rounded-2xl bg-white shadow">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-chalk/50 text-xs uppercase"><tr><th className="px-4 py-3">ID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Cat</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Action</th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="px-4 py-2 font-mono text-xs">{p.id}</td><td className="px-4 py-2">{p.name}</td><td className="px-4 py-2">{p.category}</td><td className="px-4 py-2">${p.price}</td>
                      <td className="px-4 py-2 flex gap-2"><button onClick={() => { setForm(p); setEditing(true); window.scrollTo({ top: 0 }); }} className="text-cobalt">Edit</button><button onClick={() => del(p.id)} className="text-red-600">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow">
            <h2 className="font-bold uppercase">Orders</h2>
            {orders.length === 0 ? <p className="mt-2 text-sm text-ink/60">Belum ada order.</p> : (
              <div className="mt-4 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b text-xs uppercase"><tr><th className="px-3 py-2">Order ID</th><th className="px-3 py-2">Total</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Date</th></tr></thead>
                  <tbody>{orders.map((o: any) => (<tr key={o.id} className="border-b"><td className="px-3 py-2 font-mono text-xs">{o.order_id}</td><td className="px-3 py-2">Rp {o.total}</td><td className="px-3 py-2">{o.status}</td><td className="px-3 py-2 text-xs">{new Date(o.created_at).toLocaleString()}</td></tr>))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}
        <p className="mt-6 text-xs text-ink/40">Langkah pertama: buka Supabase Dashboard → SQL Editor → paste isi <code>supabase.sql</code> → Run. Setelah itu refresh halaman ini.</p>
      </div>
    </div>
  );
}
