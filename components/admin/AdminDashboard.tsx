// Admin dashboard: overview stats + products CRUD + orders. SICKS design system.
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Star,
  TrendingUp,
  DollarSign,
  Eye,
  Upload,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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

const CAT_COLOR: Record<string, string> = {
  shoes: "#2B5CFF",
  jerseys: "#0FA36B",
  shorts: "#FF6B2C",
  shirts: "#8B3FF0",
  other: "#E0301E",
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
  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Product>(empty);
  const [editing, setEditing] = useState(false);
  const [newColor, setNewColor] = useState("#111114");
  const [uploading, setUploading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any | null>(null);
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) { setMsg(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm({ ...form, image: data.publicUrl });
    setMsg("Image uploaded!");
    setUploading(false);
    setTimeout(() => setMsg(""), 2000);
  };

  const load = async () => {
    const r = await fetch("/api/admin/products");
    const d = await r.json();
    if (Array.isArray(d)) setProducts(d);
    else setMsg(d.error || "Gagal load products. Pastikan supabase.sql sudah di-run.");
    const o = await fetch("/api/admin/orders").then((x) => x.json()).catch(() => []);
    if (Array.isArray(o)) setOrders(o);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, search, catFilter]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
    return {
      totalProducts: products.length,
      featured: products.filter((p) => p.featured).length,
      totalOrders: orders.length,
      revenue: totalRevenue,
    };
  }, [products, orders]);

  const openAdd = () => { setForm(empty); setEditing(false); setShowForm(true); };
  const openEdit = (p: Product) => { setForm(p); setEditing(true); setShowForm(true); };

  const save = async () => {
    if (!form.id || !form.name) { setMsg("ID dan name wajib diisi."); return; }
    const method = editing ? "PUT" : "POST";
    const r = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    if (!r.ok) setMsg(d.error);
    else { setMsg(editing ? "Produk diupdate!" : "Produk ditambahkan!"); setShowForm(false); setForm(empty); setEditing(false); load(); setTimeout(() => setMsg(""), 2000); }
  };

  const del = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    load();
  };

  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); };

  return (
    <div className="min-h-screen bg-chalk">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-ink/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center bg-cobalt text-white font-display font-bold">S</span>
            <span className="font-display text-xl font-bold uppercase tracking-tight">SICKS <span className="font-normal text-ink/40">Admin</span></span>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-chalk">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { k: "overview", label: "Overview", icon: LayoutDashboard },
            { k: "products", label: `Products (${products.length})`, icon: Package },
            { k: "orders", label: `Orders (${orders.length})`, icon: ShoppingCart },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as any)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition ${tab === t.k ? "bg-ink text-white" : "bg-white ring-1 ring-ink/10 hover:ring-ink/20"}`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {msg && <div className="mt-4 rounded-lg bg-cobalt px-4 py-2 text-sm font-semibold text-white">{msg}</div>}

        {tab === "overview" && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-cobalt" },
              { label: "Featured", value: stats.featured, icon: Star, color: "bg-orange" },
              { label: "Orders", value: stats.totalOrders, icon: ShoppingCart, color: "bg-green" },
              { label: "Revenue", value: `Rp ${(stats.revenue / 1000).toFixed(0)}k`, icon: DollarSign, color: "bg-violet" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink/40">{s.label}</p>
                  <span className={`grid h-9 w-9 place-items-center rounded-lg text-white ${s.color}`}><s.icon size={18} /></span>
                </div>
                <p className="mt-3 font-display text-3xl font-bold">{s.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-ink/40"><TrendingUp size={12} /> live from Supabase</p>
              </div>
            ))}
            <div className="sm:col-span-2 lg:col-span-4 rounded-2xl bg-ink p-6 text-chalk">
              <h3 className="font-display text-lg font-bold uppercase">Quick actions</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => { setTab("products"); openAdd(); }} className="inline-flex items-center gap-2 bg-cobalt px-5 py-2.5 text-sm font-bold uppercase text-white"><Plus size={16} /> Add Product</button>
                <button onClick={() => setTab("orders")} className="border border-white/20 px-5 py-2.5 text-sm font-bold uppercase">View Orders</button>
              </div>
            </div>
          </div>
        )}

        {tab === "products" && (
          <>
            {/* Toolbar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, brand, id..." className="w-full rounded-lg border border-ink/15 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-ink" />
                </div>
                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm">
                  <option value="all">All categories</option><option value="shoes">Shoes</option><option value="jerseys">Jerseys</option><option value="shorts">Shorts</option><option value="shirts">Shirts</option><option value="other">Other</option>
                </select>
              </div>
              <button onClick={openAdd} className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-sm font-bold uppercase text-white hover:bg-ink/90"><Plus size={16} /> Add Product</button>
            </div>

            {/* Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <div key={p.id} className="group overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 transition hover:shadow-card">
                  <div className="relative aspect-square bg-chalk">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded bg-white px-2 py-1 text-[10px] font-bold uppercase" style={{ borderLeft: `4px solid ${CAT_COLOR[p.category] || "#111"}` }}>{p.category}</span>
                    {p.featured && <span className="absolute right-3 top-3 bg-orange px-2 py-1 text-[10px] font-bold uppercase text-ink">Featured</span>}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: CAT_COLOR[p.category] }}>{p.brand}</p>
                    <h3 className="mt-1 font-display font-bold uppercase leading-tight">{p.name}</h3>
                    <p className="text-xs text-ink/50 line-clamp-1">{p.tagline}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-display text-xl font-bold">${p.price}</span>
                      <span className="flex items-center gap-1 text-xs text-ink/50"><Star size={12} className="fill-amber-400 text-amber-400" />{p.rating}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => openEdit(p)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-ink/15 py-2 text-xs font-bold uppercase hover:bg-chalk"><Pencil size={14} /> Edit</button>
                      <button onClick={() => del(p.id)} className="flex items-center justify-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold uppercase text-red-600 hover:bg-red-100"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && <p className="mt-8 text-center text-sm text-ink/40">No products found.</p>}
          </>
        )}

        {tab === "orders" && (
          <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
            <div className="border-b bg-chalk/30 px-5 py-4"><h2 className="font-display font-bold uppercase">Recent Orders</h2><p className="text-xs text-ink/50">From Midtrans → Supabase</p></div>
            {orders.length === 0 ? <p className="p-8 text-center text-sm text-ink/40">Belum ada order.</p> : (
              <div className="overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-chalk/20 text-xs uppercase tracking-wider text-ink/50"><tr><th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3"></th></tr></thead>
                  <tbody>
                    {orders.map((o: any) => (
                      <tr key={o.id} className="border-b hover:bg-chalk/20">
                        <td className="px-4 py-3 font-mono text-xs">{o.order_id}</td>
                        <td className="px-4 py-3 font-semibold">Rp {Number(o.total).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-3"><span className={`rounded px-2 py-1 text-xs font-bold uppercase ${o.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{o.status}</span></td>
                        <td className="px-4 py-3 text-xs text-ink/50">{new Date(o.created_at).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-3"><button onClick={() => setOrderDetail(o)} className="inline-flex items-center gap-1 text-xs font-bold text-cobalt hover:underline"><Eye size={14} /> Detail</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowForm(false)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-chalk"><X size={18} /></button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold uppercase tracking-wider">ID (slug) <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={editing} placeholder="jordan-4-comic" className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-ink disabled:bg-chalk" /></label>
              <label className="text-xs font-bold uppercase tracking-wider">Category
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm"><option value="shoes">Shoes</option><option value="jerseys">Jerseys</option><option value="shorts">Shorts</option><option value="shirts">Shirts</option><option value="other">Other</option></select>
              </label>
              <label className="text-xs font-bold uppercase tracking-wider sm:col-span-2">Name <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Air Jordan 4 Retro" className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm" /></label>
              <label className="text-xs font-bold uppercase tracking-wider">Brand <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm" /></label>
              <label className="text-xs font-bold uppercase tracking-wider">Price ($) <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm" /></label>
              <label className="text-xs font-bold uppercase tracking-wider sm:col-span-2">Image
                <div className="mt-1 flex gap-2">
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/images/hero.jpg atau https://...supabase.co/..." className="flex-1 rounded-lg border border-ink/15 px-3 py-2.5 text-sm" />
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-xs font-bold uppercase text-white hover:bg-ink/90">
                    <Upload size={14} /> {uploading ? "..." : "Upload"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} disabled={uploading} />
                  </label>
                </div>
              </label>
              {form.image && <div className="sm:col-span-2 relative h-40 overflow-hidden rounded-lg bg-chalk"><img src={form.image} alt="preview" className="h-full w-full object-contain" /></div>}
              <label className="text-xs font-bold uppercase tracking-wider sm:col-span-2">Tagline <input value={form.tagline || ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="The drop is live." className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm" /></label>
              {/* Colors picker */}
              <div className="sm:col-span-2 rounded-lg border border-ink/10 p-3">
                <p className="text-xs font-bold uppercase tracking-wider">Colors</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(form.colors || []).map((c) => (
                    <span key={c} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-chalk px-2 py-1 text-xs">
                      <span className="h-5 w-5 rounded-full border border-ink/10" style={{ backgroundColor: c }} />
                      {c}
                      <button onClick={() => setForm({ ...form, colors: (form.colors || []).filter((x) => x !== c) })} className="ml-1 grid h-5 w-5 place-items-center rounded-full hover:bg-white"><X size={12} /></button>
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="h-10 w-10 cursor-pointer rounded border p-1" />
                  <span className="text-xs font-mono">{newColor}</span>
                  <button
                    onClick={() => {
                      if (!newColor) return;
                      if ((form.colors || []).includes(newColor)) return;
                      setForm({ ...form, colors: [...(form.colors || []), newColor] });
                    }}
                    className="rounded-lg bg-ink px-4 py-2 text-xs font-bold uppercase text-white"
                  >
                    Add color
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-2 rounded-lg border border-ink/10 px-3 py-2.5 text-sm"><input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured (tampil di home)</label>
              <label className="flex items-center gap-2 rounded-lg border border-ink/10 px-3 py-2.5 text-sm"><input type="checkbox" checked={!!form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} /> Is New</label>
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={save} className="flex-1 bg-ink py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-cobalt">{editing ? "Update" : "Add Product"}</button>
              <button onClick={() => setShowForm(false)} className="border border-ink/15 px-6 py-3 text-sm font-bold uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {orderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm" onClick={() => setOrderDetail(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="font-display font-bold uppercase">Order {orderDetail.order_id}</h3><button onClick={() => setOrderDetail(null)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-chalk"><X size={16} /></button></div>
            <div className="mt-4 space-y-2 text-sm"><p><span className="text-ink/50">Status:</span> <span className="font-bold">{orderDetail.status}</span></p><p><span className="text-ink/50">Total:</span> Rp {Number(orderDetail.total).toLocaleString("id-ID")}</p><p><span className="text-ink/50">Date:</span> {new Date(orderDetail.created_at).toLocaleString("id-ID")}</p></div>
            <div className="mt-4 rounded-lg bg-chalk p-3"><p className="text-xs font-bold uppercase">Items</p><pre className="mt-2 max-h-60 overflow-auto text-xs">{JSON.stringify(orderDetail.items, null, 2)}</pre></div>
          </div>
        </div>
      )}
    </div>
  );
}
