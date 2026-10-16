"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Eye, Star, Flame, Sparkles } from "lucide-react";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import { useCartStore } from "@/stores/use-cart-store";
import { toast } from "sonner";
import type { ShelfProductItem } from "./product-shelf-section";

interface ProductMarqueeSectionProps {
  title: string;
  bengaliSubtitle?: string;
  subtitle: string;
  viewAllHref: string;
  products: ShelfProductItem[];
  direction?: "rtl" | "ltr"; // rtl = right-to-left, ltr = left-to-right
  badgeIcon?: React.ReactNode;
  badgeText?: string;
  badgeColor?: string;
}

export function ProductMarqueeSection({
  title,
  bengaliSubtitle,
  subtitle,
  viewAllHref,
  products,
  direction = "rtl",
  badgeIcon,
  badgeText,
  badgeColor = "text-[#FF3E78] bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900",
}: ProductMarqueeSectionProps) {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  // Pick exactly 4 products (repeat if needed)
  const baseItems = React.useMemo(() => {
    if (products.length >= 4) {
      return products.slice(0, 4);
    }
    if (products.length === 0) return [];
    // If fewer than 4, pad to 4
    const padded = [...products];
    while (padded.length < 4) {
      padded.push(...products);
    }
    return padded.slice(0, 4);
  }, [products]);

  const handleAddToCart = (product: ShelfProductItem) => {
    addItem({
      id: `cart-${product.id}`,
      productId: product.id,
      title: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.image,
      ageGroup: "Curated",
    });
    toast.success(`Added ${product.name} to your bag! 🛍️`);
  };

  if (baseItems.length === 0) return null;

  // We duplicate base items 3 times for completely seamless infinite loop
  const marqueeItems = [...baseItems, ...baseItems, ...baseItems];

  const animationClass =
    direction === "ltr" ? "animate-marquee-ltr" : "animate-marquee-rtl";

  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          {badgeText && (
            <div
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mb-2 shadow-2xs ${badgeColor}`}
            >
              {badgeIcon}
              <span className="uppercase tracking-wider">{badgeText}</span>
            </div>
          )}
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {bengaliSubtitle && (
              <span className="font-bengali text-xs sm:text-sm font-semibold text-[#FF3E78] dark:text-rose-400">
                {bengaliSubtitle}
              </span>
            )}
            {bengaliSubtitle && (
              <span className="text-xs text-slate-300 dark:text-slate-700">
                •
              </span>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        <Link
          href={viewAllHref}
          className="text-xs font-bold text-[#0EA5E9] hover:underline flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>View Collection</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Infinite Seamless Marquee Container bounded within the section width */}
      <div className="relative w-full overflow-hidden rounded-3xl pause-on-hover">
        {/* Soft edge blur gradient masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-white dark:from-slate-900 sm:from-[#FAFAFA] sm:dark:from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-white dark:from-slate-900 sm:from-[#FAFAFA] sm:dark:from-slate-950 to-transparent" />

        <div className={animationClass}>
          <div className="flex items-stretch gap-5 sm:gap-6 py-2">
            {marqueeItems.map((product, idx) => {
              const isFav = isInWishlist(product.id);
              const discountPercent =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )
                  : null;

              return (
                <div
                  key={`${product.id}-${idx}`}
                  className="w-[280px] sm:w-[310px] shrink-0 group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 hover:shadow-xl hover:-translate-y-1 hover:border-[#FF3E78]/40 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Wishlist Heart Icon */}
                  <button
                    onClick={() =>
                      toggleWishlist({
                        productId: product.id,
                        title: product.name,
                        slug: product.slug,
                        price: product.price,
                        imageUrl: product.image,
                      })
                    }
                    className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md flex items-center justify-center text-slate-400 hover:text-[#FF3E78] transition-colors cursor-pointer"
                    aria-label="Save to Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? "fill-[#FF3E78] text-[#FF3E78]" : ""
                      }`}
                    />
                  </button>

                  {/* Category & Badges */}
                  <div className="absolute top-5 left-5 z-20 flex flex-col gap-1 items-start pointer-events-none">
                    <span className="text-[10px] font-bold bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full shadow-xs border border-slate-200/60 dark:border-slate-700">
                      {product.category}
                    </span>

                    {discountPercent && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                        SAVE {discountPercent}%
                      </span>
                    )}

                    {product.isBestSeller && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> Best Seller
                      </span>
                    )}
                  </div>

                  {/* Product Thumbnail with Hover Quick Action Bar */}
                  <div className="aspect-4/3 w-full rounded-2xl bg-slate-50 dark:bg-slate-800/60 overflow-hidden relative mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    />

                    {/* Quick action buttons on hover */}
                    <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-20">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 h-9 rounded-full bg-[#FF3E78] hover:bg-[#e62e66] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                      <Link
                        href={`/products/${product.slug}`}
                        className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center hover:bg-slate-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Product Title & Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating || 5)
                                  ? "fill-current"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {product.rating?.toFixed(1) || "5.0"}
                        </span>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="block font-bold text-slate-900 dark:text-slate-100 text-sm hover:text-[#0EA5E9] dark:hover:text-[#38bdf8] transition-colors line-clamp-2 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </Link>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ৳{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                        title="Quick Add"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
