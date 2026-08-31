// Warms all category pages in the background so nav is instant.
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/types";

export default function PrefetchCategories() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      CATEGORIES.forEach((slug) => router.prefetch(`/category/${slug}`));
    }, 300);
    return () => clearTimeout(t);
  }, [router]);

  return null;
}
