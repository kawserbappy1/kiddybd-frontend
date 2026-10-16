"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { CatalogProduct } from "@/lib/catalog-data";
import { ProductCard } from "@/components/products/product-card";

interface ProductRecommendationsProps {
  relatedProducts: CatalogProduct[];
  moreForAgeProducts: CatalogProduct[];
  ageLabel: string;
}

export function ProductRecommendations({
  relatedProducts,
  moreForAgeProducts,
  ageLabel,
}: ProductRecommendationsProps) {
  return (
    <div className="space-y-12">
      {/* 1. Parents Also Bought Shelf */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Handpicked Companions
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
                Parents Also Bought
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} viewMode="grid" />
            ))}
          </div>
        </section>
      )}

      {/* 2. More for Age Shelf */}
      {moreForAgeProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                🎯 Age Stage Matched
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
                More Curated for {ageLabel}
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>See Age Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {moreForAgeProducts.map((p) => (
              <ProductCard key={p.id} product={p} viewMode="grid" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
