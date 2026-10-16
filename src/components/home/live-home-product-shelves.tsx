"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { ProductShelfSection, type ShelfProductItem } from "@/components/home/product-shelf-section";
import { ProductMarqueeSection } from "@/components/home/product-marquee-section";
import { HomeCategoriesGrid } from "@/components/home/home-categories-grid";
import { catalogService } from "@/services/catalog.service";
import { Button } from "@/components/ui/button";
import { Flame, Tag, Sparkles } from "lucide-react";

export function LiveHomeProductShelves() {
  const [products, setProducts] = React.useState<ShelfProductItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchLiveProducts() {
      setIsLoading(true);
      try {
        const res = await catalogService.listProducts({ limit: 50 });
        if (res.data?.products) {
          const liveItems: ShelfProductItem[] = res.data.products.map((p) => {
            const v = p.variants?.[0];
            const m = p.media?.[0];
            const dbReviews = Array.isArray(p.reviews) ? p.reviews : [];
            const realReviewCount = dbReviews.length;
            const realRating =
              realReviewCount > 0
                ? Number(
                    (
                      dbReviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 5), 0) /
                      realReviewCount
                    ).toFixed(1)
                  )
                : 5.0;

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: Number(v?.price || 0),
              originalPrice: v?.discountPrice ? Number(v.discountPrice) : undefined,
              image:
                m?.url ||
                "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=80",
              category: p.category?.name || "Toys & Games",
              rating: realRating,
              reviewCount: realReviewCount,
              isFeatured: Boolean(p.isFeatured),
              isBestSeller: Boolean(p.isBestSeller),
              isSpecialOffer: Boolean(v?.discountPrice),
            };
          });
          setProducts(liveItems);
        }
      } catch (err) {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    }
    fetchLiveProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
        <div className="h-6 w-48 bg-muted animate-pulse rounded-md mb-2" />
        <div className="h-4 w-64 bg-muted/60 animate-pulse rounded-md mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-3/4 rounded-2xl bg-muted/40 animate-pulse border border-border/50" />
          ))}
        </div>
      </section>
    );
  }

  // If user hasn't added products yet or has added products
  if (products.length === 0) {
    return (
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-12">
        <div className="rounded-3xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center bg-card">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Package className="h-8 w-8 stroke-1" />
          </div>
          <h2 className="text-xl font-bold font-display text-foreground tracking-tight">
            No Products in Store Yet
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mt-1 mb-6">
            You have not added any products to your store yet. Add products from your Admin Dashboard and they will immediately appear right here!
          </p>
          <Button size="sm" asChild className="gap-1.5 text-xs shadow-xs">
            <Link href="/admin/products">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Your First Product</span>
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  // 1. New Arrivals: Exactly maximum 4 cards
  const newArrivals = products.slice(0, 4);

  // 2. Best Sellers: Explicitly marked best sellers or high rated products
  const explicitBestSellers = products.filter((p) => p.isBestSeller);
  const bestSellers =
    explicitBestSellers.length >= 4
      ? explicitBestSellers.slice(0, 4)
      : explicitBestSellers.length > 0
      ? [
          ...explicitBestSellers,
          ...products.filter((p) => !p.isBestSeller),
        ].slice(0, 4)
      : products.slice(1, 5).length === 4
      ? products.slice(1, 5)
      : products.slice(0, 4);

  // 3. Special Offers: Products with discountPrice or special offer tag
  const explicitSpecialOffers = products.filter(
    (p) => p.isSpecialOffer || (p.originalPrice && p.originalPrice > p.price)
  );
  const specialOffers =
    explicitSpecialOffers.length >= 4
      ? explicitSpecialOffers.slice(0, 4)
      : explicitSpecialOffers.length > 0
      ? [
          ...explicitSpecialOffers,
          ...products.filter(
            (p) =>
              !p.isSpecialOffer &&
              !(p.originalPrice && p.originalPrice > p.price)
          ),
        ].slice(0, 4)
      : [...products].reverse().slice(0, 4);

  // Featured Collection (strictly display exactly 4 cards)
  const featuredProducts = products.filter((p) => p.isFeatured);
  const displayFeatured = (
    featuredProducts.length > 0
      ? featuredProducts
      : products.length > 4
      ? products.slice(4, 8)
      : products
  ).slice(0, 4);

  return (
    <>
      {/* 1. New Arrivals Shelf (Regular Grid) */}
      <ProductShelfSection
        title="New Arrivals"
        subtitle="Fresh finds newly published to your store"
        viewAllHref="/products"
        products={newArrivals}
      />

      {/* 2. Featured Products Shelf (Immediate next to New Arrivals) */}
      {displayFeatured.length > 0 && (
        <ProductShelfSection
          title="Featured Collection ⭐"
          subtitle="Specially handpicked spotlight products"
          viewAllHref="/products"
          products={displayFeatured}
        />
      )}

      {/* 3. Best Sellers (Marquee - Slides Right to Left) */}
      {bestSellers.length > 0 && (
        <ProductMarqueeSection
          title="Best Sellers"
          bengaliSubtitle="অভিভাবকদের সবচেয়ে পছন্দের সেরা খেলনাসমূহ"
          subtitle="Customer favorite top-selling toys and learning essentials"
          viewAllHref="/products?sort=popular"
          products={bestSellers}
          direction="rtl"
          badgeIcon={<Flame className="w-3.5 h-3.5" />}
          badgeText="Top Rated & Trending"
          badgeColor="text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 dark:text-amber-300"
        />
      )}

      {/* 4. Special Offers (Marquee - Slides Left to Right) */}
      {specialOffers.length > 0 && (
        <ProductMarqueeSection
          title="Special Offers"
          bengaliSubtitle="সীমিত সময়ের দারুণ সব ডিসকাউন্ট ও স্পেশাল ডিল"
          subtitle="Exclusive limited-time savings and bundled discounts"
          viewAllHref="/products?deals=true"
          products={specialOffers}
          direction="ltr"
          badgeIcon={<Tag className="w-3.5 h-3.5" />}
          badgeText="Mega Savings • Up to 40% OFF"
          badgeColor="text-[#FF3E78] bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 dark:text-rose-300"
        />
      )}

      {/* 5. Category Showcase Grid */}
      <HomeCategoriesGrid />
    </>
  );
}
