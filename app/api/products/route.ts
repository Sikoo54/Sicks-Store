import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { PRODUCTS } from "@/lib/data";

function mapRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    brand: r.brand,
    price: Number(r.price),
    category: r.category,
    image: r.image,
    rating: Number(r.rating ?? 4.8),
    isNew: !!r.is_new,
    featured: !!r.featured,
    colors: r.colors ?? ["#111114"],
    sizes: r.sizes ?? ["M"],
    sizeType: r.size_type ?? "letter",
    tagline: r.tagline ?? "",
    sortOrder: r.sort_order ?? 0,
  };
}

export async function GET() {
  try {
    const sb = supabaseServer();
    const { data, error } = await sb.from("products").select("*").order("sort_order", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return NextResponse.json(PRODUCTS);
    return NextResponse.json(data.map(mapRow), {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json(PRODUCTS);
  }
}
