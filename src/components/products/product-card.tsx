"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Check, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogProduct } from "@/lib/catalog-data";
import { useCartStore } from "@/stores/use-cart-store";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import { motion } from "motion/react";


interface ProductCardProps {
  product: CatalogProduct;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [added, setAdded] = React.useState(false);

  const isWishlisted = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `cart-${product.id}`,
      productId: product.id,
      title: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.image,
      ageGroup: product.ageLabel,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      title: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.image,
    });
  };

  if (viewMode === "list") {
    return (
      <div className="group relative bg-card border border-border/70 hover:border-primary/40 rounded-3xl p-4 md:p-5 transition-all duration-300 hover:shadow-lg flex flex-col sm:flex-row gap-5 items-stretch">
        {/* Image Container */}
        <div className="relative w-full sm:w-56 h-52 sm:h-auto shrink-0 rounded-2xl overflow-hidden bg-muted/40">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 240px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white shadow-xs">
                -{discountPercent}%
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-xs">
              {product.ageLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWishlisted
                ? "bg-rose-500 text-white shadow-md"
                : "bg-white/80 dark:bg-black/60 text-muted-foreground hover:text-rose-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Content Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {product.brand}
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs text-muted-foreground">{product.category}</span>
              {!product.inStock && (
                <span className="ml-auto text-[10px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <h3 className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h3>

            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
              {product.description}
            </p>

            {/* Skills Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary dark:text-pink-400 px-2.5 py-0.5 rounded-full"
                >
                  <Sparkles className="w-3 h-3" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Price & Action Row */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50 flex-wrap gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-foreground">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs font-semibold text-muted-foreground line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-xs">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="font-bold text-foreground">{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/products/${product.slug}`}>
                <Button variant="outline" size="sm" className="rounded-2xl h-10 px-3.5 gap-1.5">
                  <Eye className="w-4 h-4" />
                  Details
                </Button>
              </Link>
              <Button
                disabled={!product.inStock}
                onClick={handleAddToCart}
                size="sm"
                className={`rounded-2xl h-10 px-5 gap-2 font-bold transition-all shadow-md ${
                  added ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (KiddoJoy card layout)
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group relative bg-card border border-border/70 hover:border-primary/40 rounded-3xl p-3.5 md:p-4 transition-colors hover:shadow-xl flex flex-col justify-between"
    >
      {/* Top Badges & Image */}
      <div>
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted/40 mb-3.5">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs">
                -{discountPercent}% OFF
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white shadow-xs flex items-center gap-1">
                <span>🔥</span> Best Seller
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-xs flex items-center gap-1">
                <span>⭐</span> Featured
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 dark:bg-black/80 text-foreground border border-border/40 backdrop-blur-xs">
              {product.ageLabel || product.ageGroup}
            </span>
          </div>

          {/* Quick Wishlist */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWishlisted
                ? "bg-rose-500 text-white shadow-md scale-105"
                : "bg-white/85 dark:bg-black/60 text-muted-foreground hover:text-rose-500 backdrop-blur-xs"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
          </button>

          {!product.inStock && (
            <div className="absolute inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-rose-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-md">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
          <span className="font-bold text-primary uppercase tracking-wide">{product.brand}</span>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold text-foreground text-xs">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[40px] leading-snug">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Skill tag (1 key tag) */}
        {product.skills[0] && (
          <div className="mt-2">
            <span className="inline-block text-[10px] font-semibold bg-primary/10 text-primary dark:text-pink-400 px-2 py-0.5 rounded-full truncate max-w-full">
              🎯 {product.skills[0]}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Price & Button */}
      <div className="pt-3.5 mt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <div>
          <div className="text-base sm:text-lg font-black text-foreground">
            ৳{product.price.toLocaleString()}
          </div>
          {product.originalPrice && (
            <div className="text-[11px] font-semibold text-muted-foreground line-through">
              ৳{product.originalPrice.toLocaleString()}
            </div>
          )}
        </div>

        <Button
          disabled={!product.inStock}
          onClick={handleAddToCart}
          size="sm"
          className={`rounded-2xl h-9 px-3 gap-1.5 font-bold transition-all shadow-sm ${
            added
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
        >
          {added ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
