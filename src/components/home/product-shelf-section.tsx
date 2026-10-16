"use client";

import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import { useCartStore } from "@/stores/use-cart-store";
import { toast } from "sonner";

export interface ShelfProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
}

interface ProductShelfProps {
  title: string;
  subtitle: string;
  viewAllHref: string;
  products: ShelfProductItem[];
}

export function ProductShelfSection({
  title,
  subtitle,
  viewAllHref,
  products,
}: ProductShelfProps) {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

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

  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
      {/* Shelf Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <Link
          href={viewAllHref}
          className="text-xs font-bold text-[#0EA5E9] hover:underline flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4-Card Grid with high-converting features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isFav = isInWishlist(product.id);
          return (
            <div
              key={product.id}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 hover:shadow-xl hover:-translate-y-1 hover:border-[#FF3E78]/40 transition-all duration-300 flex flex-col overflow-hidden"
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

              {/* Category & Promotional Pill Badges */}
              <div className="absolute top-5 left-5 z-20 flex flex-col gap-1 items-start pointer-events-none">
                <span className="text-[10px] font-bold bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full shadow-xs border border-slate-200/60 dark:border-slate-700">
                  {product.category}
                </span>

                {product.isBestSeller && (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <span>🔥</span> Best Seller
                  </span>
                )}

                {product.isFeatured && (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <span>⭐</span> Featured
                  </span>
                )}

                {product.isSpecialOffer && (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <span>🏷️</span> Deal
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

                {/* Hover Quick Action Buttons */}
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
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                    title="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-auto space-y-1.5">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {product.rating || 4.9}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({product.reviewCount ?? 0})
                  </span>
                </div>

                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 hover:text-[#FF3E78] transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="text-base font-black text-[#FF3E78]">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs font-semibold line-through text-slate-400">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
