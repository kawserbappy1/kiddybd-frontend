"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Award, Sparkles } from "lucide-react";
import { catalogService, type Brand } from "@/services/catalog.service";

interface BrandStyling {
  color: string;
  badge: string;
}

const BRAND_PALETTES: BrandStyling[] = [
  { color: "text-red-600 dark:text-red-400", badge: "Building & STEM" },
  { color: "text-rose-600 dark:text-rose-400", badge: "Infant & Toddler" },
  { color: "text-sky-700 dark:text-sky-400", badge: "Smart Feeding" },
  { color: "text-blue-600 dark:text-blue-400", badge: "Electronic Learning" },
  { color: "text-orange-600 dark:text-orange-400", badge: "Teething & Care" },
  { color: "text-indigo-600 dark:text-indigo-400", badge: "Baby Gear" },
  { color: "text-pink-600 dark:text-pink-400", badge: "Fashion & Play" },
  { color: "text-amber-700 dark:text-amber-400", badge: "Creative Modeling" },
  { color: "text-emerald-600 dark:text-emerald-400", badge: "Eco Montessori" },
  { color: "text-purple-600 dark:text-purple-400", badge: "Sensory Toys" },
];

export function TrustedBrandsCarousel() {
  const [brands, setBrands] = React.useState<
    (Brand & { _count?: { products: number } })[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchBrands() {
      try {
        const res = await catalogService.getBrands();
        if (res.data?.brands && isMounted) {
          setBrands(res.data.brands);
        }
      } catch (err) {
        console.error("Failed to fetch brands for homepage:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchBrands();

    return () => {
      isMounted = false;
    };
  }, []);

  // If loading or no brands yet, don't show empty broken component
  if (isLoading) {
    return (
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
        <div className="h-5 w-40 bg-muted animate-pulse rounded-md mb-2" />
        <div className="h-6 w-56 bg-muted/80 animate-pulse rounded-md mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-muted/40 animate-pulse border border-border/50"
            />
          ))}
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0EA5E9] uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>100% Authentic Guaranteed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Featured Brands</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0EA5E9] dark:bg-sky-950/60 dark:text-sky-300 font-bold border border-sky-200/80 dark:border-sky-900">
              {brands.length} Verified Brands
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            World-renowned child development and toy manufacturers certified non-toxic &amp; safe
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-[#0EA5E9] hover:underline flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>View All Products</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Database Brands Grid with Eye-Catching Hover Effects */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {brands.map((brand, idx) => {
          const styling = BRAND_PALETTES[idx % BRAND_PALETTES.length];
          const productCount = brand._count?.products ?? 0;

          return (
            <Link
              key={brand.id}
              href={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1.5 hover:border-[#0EA5E9]/50 transition-all duration-300 text-center overflow-hidden"
            >
              {/* Subtle top indicator */}
              <div className="h-10 flex items-center justify-center">
                <span
                  className={`font-black font-display text-lg tracking-tight ${styling.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  {brand.name}
                </span>
              </div>

              <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 font-medium">
                {productCount > 0 ? (
                  <span className="text-[#0EA5E9] font-bold">
                    {productCount} {productCount === 1 ? "Product" : "Products"}
                  </span>
                ) : (
                  <span>{styling.badge}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
