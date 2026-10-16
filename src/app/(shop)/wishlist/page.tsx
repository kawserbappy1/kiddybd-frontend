"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore, WishlistItem } from "@/stores/use-wishlist-store";
import { useCartStore } from "@/stores/use-cart-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Check,
} from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, syncWithBackend } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [movingId, setMovingId] = React.useState<string | null>(null);

  // Sync wishlist with backend on mount or authentication change
  React.useEffect(() => {
    syncWithBackend(isAuthenticated);
  }, [isAuthenticated, syncWithBackend]);

  const handleMoveToCart = (item: WishlistItem) => {
    setMovingId(item.productId);
    addItem({
      id: `cart-${item.productId}`,
      productId: item.productId,
      title: item.title,
      slug: item.slug,
      price: item.price,
      originalPrice: item.originalPrice,
      imageUrl: item.imageUrl,
      ageGroup: "Wishlist Favorite",
    });

    removeItem(item.productId);
    toast.success(`Moved ${item.title} to your cart! 🛍️`);
    openCart();
    setTimeout(() => setMovingId(null), 1000);
  };

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addItem({
        id: `cart-${item.productId}`,
        productId: item.productId,
        title: item.title,
        slug: item.slug,
        price: item.price,
        originalPrice: item.originalPrice,
        imageUrl: item.imageUrl,
        ageGroup: "Wishlist Favorite",
      });
    });
    clearWishlist();
    toast.success(`Moved all ${items.length} items to your shopping cart! 🎉`);
    openCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-rose-100 dark:bg-rose-950/40 border-4 border-rose-300 dark:border-rose-700/50 flex items-center justify-center text-4xl shadow-inner mb-4">
          ❤️
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
          Your Wishlist is Empty
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
          Save your favorite educational toys, Montessori kits, and developmental games here to buy them later or share with family!
        </p>
        <div className="flex gap-3 mt-6">
          <Button asChild className="rounded-full px-6 font-bold text-xs shadow-md">
            <Link href="/products">Explore All Toys</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-border/70 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="font-semibold text-primary">My Wishlist</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-foreground tracking-tight flex items-center gap-3">
              Saved Toys & Favorites
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                {items.length} Saved
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Items saved to your wishlist are kept safe. Move them to your cart anytime with one click.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleMoveAllToCart}
              size="sm"
              className="rounded-full px-5 h-10 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Move All to Cart
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearWishlist}
              className="rounded-full px-4 h-10 font-bold text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          </div>
        </div>

        {/* Wishlist Items Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="group relative bg-card border border-border/70 hover:border-primary/40 rounded-3xl p-4 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted/40 mb-3.5">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🧸
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/85 dark:bg-black/60 text-muted-foreground hover:text-rose-500 backdrop-blur-xs flex items-center justify-center transition-all shadow-xs cursor-pointer"
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {item.category && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[40px] leading-snug">
                  <Link href={`/products/${item.slug}`}>{item.title}</Link>
                </h3>
              </div>

              {/* Bottom Price & Move to Cart Button */}
              <div className="pt-3.5 mt-3 border-t border-border/50 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-lg font-black text-foreground">
                    ৳{item.price.toLocaleString()}
                  </div>
                  {item.originalPrice && (
                    <div className="text-xs font-semibold text-muted-foreground line-through">
                      ৳{item.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleMoveToCart(item)}
                  size="sm"
                  disabled={movingId === item.productId}
                  className="w-full h-10 rounded-2xl font-bold text-xs bg-[#FF3E78] hover:bg-[#e62e66] text-white shadow-md shadow-[#FF3E78]/20 gap-2 transition-all active:scale-98"
                >
                  {movingId === item.productId ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" /> Moving...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Move to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
