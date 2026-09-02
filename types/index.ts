// Shared types: product, cart, news, category meta + sort options.

export type Category = "shoes" | "jerseys" | "shorts" | "shirts" | "other";

export type SizeType = "us" | "letter" | "none";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  isNew: boolean;
  featured: boolean;
  colors: string[];
  sizes: (number | string)[];
  sizeType: SizeType;
  tagline: string;
  sortOrder?: number;
}

export interface CartItem {
  uid: string;
  product: Product;
  size: string;
  color: string;
  qty: number;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  tagColor: string;
  image: string;
}

export interface CategoryMeta {
  slug: Category;
  label: string;
  short: string;
  color: string;
  tagline: string;
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export const CATEGORIES: Category[] = [
  "shoes",
  "jerseys",
  "shorts",
  "shirts",
  "other",
];
