import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPage from "@/components/CategoryPage";
import { CATEGORY_META, productsByCategory } from "@/lib/data";
import { CATEGORIES } from "@/types";
import type { Category } from "@/types";

export const dynamicParams = false;

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

export default function CategoryRoute({
  params,
}: {
  params: { slug: string };
}) {
  const meta = CATEGORY_META[params.slug as Category];
  if (!meta) return notFound();

  return <CategoryPage meta={meta} products={productsByCategory(meta.slug)} />;
}
