// Category page (SSG): one statically generated page per category slug.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPage from "@/components/CategoryPage";
import { CATEGORY_META, productsByCategory } from "@/lib/data";
import { CATEGORIES } from "@/types";
import type { Category } from "@/types";
import { supabaseServer } from "@/lib/supabase";

export const dynamicParams = false;
export const revalidate = 30;

export function generateStaticParams() {
  return CATEGORIES.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const meta = CATEGORY_META[params.slug as Category];
  if (!meta) {
    return { title: "SICKS — Gear that goes hard" };
  }
  return {
    title: `${meta.label} — SICKS`,
    description: meta.tagline,
  };
}

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
    number: r.number ?? "",
  };
}

export default async function CategoryRoute({
  params,
}: {
  params: { slug: string };
}) {
  const meta = CATEGORY_META[params.slug as Category];
  if (!meta) return notFound();

  // Try Supabase first, fallback to static data.
  try {
    const sb = supabaseServer();
    const { data, error } = await sb.from("products").select("*").eq("category", meta.slug);
    if (!error && data && data.length) {
      return <CategoryPage meta={meta} products={data.map(mapRow)} />;
    }
  } catch {}
  return <CategoryPage meta={meta} products={productsByCategory(meta.slug)} />;
}
