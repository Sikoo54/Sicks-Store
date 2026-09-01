import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PRODUCTS } from "@/lib/data";
import { supabaseServer } from "@/lib/supabase";

export async function POST() {
  if (cookies().get("admin_auth")?.value !== "ok")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sb = supabaseServer();
  // Map PRODUCTS -> DB rows
  const rows = PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    category: p.category,
    image: p.image,
    rating: p.rating,
    is_new: p.isNew,
    featured: p.featured,
    colors: p.colors,
    sizes: p.sizes.map(String),
    size_type: p.sizeType,
    tagline: p.tagline,
  }));

  const { error } = await sb.from("products").upsert(rows, { onConflict: "id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, count: rows.length });
}
