"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Zap,
  Heart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Baby,
  Brain,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogProduct, ProductVariantGroup } from "@/lib/catalog-data";
import { useCartStore } from "@/stores/use-cart-store";
import { useWishlistStore } from "@/stores/use-wishlist-store";
import { useReviewSyncStore, EMPTY_REVIEWS } from "@/stores/use-review-sync-store";

interface ProductBuyBoxProps {
  product: CatalogProduct;
}

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);
  const [added, setAdded] = React.useState(false);

  // Selected variant state
  const [selectedVariants, setSelectedVariants] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach((group) => {
        if (group.options.length > 0) {
          initial[group.name] = group.options[0].label;
        }
      });
    }
    return initial;
  });

  // Calculate dynamic price based on variant options
  const basePrice = product.price;
  const originalBasePrice = product.originalPrice;

  const extraCost = React.useMemo(() => {
    let extra = 0;
    if (product.variants) {
      product.variants.forEach((group) => {
        const selectedLabel = selectedVariants[group.name];
        const option = group.options.find((opt) => opt.label === selectedLabel);
        if (option && option.priceModifier) {
          extra += option.priceModifier;
        }
      });
    }
    return extra;
  }, [product.variants, selectedVariants]);

  const currentPrice = basePrice + extraCost;
  const currentOriginalPrice = originalBasePrice ? originalBasePrice + extraCost : undefined;

  const discountPercent = currentOriginalPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  // Quantity controls
  const maxStock = product.stockCount || 10;
  const [quantity, setQuantity] = React.useState(1);

  const handleQuantityMinus = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityPlus = () => {
    setQuantity((prev) => Math.min(maxStock, prev + 1));
  };

  const handleAddToCart = () => {
    const variantSummary = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    addItem(
      {
        id: `cart-${product.id}-${Object.values(selectedVariants).join("-")}`,
        productId: product.id,
        title: variantSummary ? `${product.name} (${variantSummary})` : product.name,
        slug: product.slug,
        price: currentPrice,
        originalPrice: currentOriginalPrice,
        imageUrl: product.image,
        ageGroup: product.ageLabel,
      },
      quantity
    );

    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      title: product.name,
      slug: product.slug,
      price: currentPrice,
      imageUrl: product.image,
    });
  };

  const extraReviewsMap = useReviewSyncStore((state) => state.extraReviews);

  const extraReviews = React.useMemo(() => {
    const byId = extraReviewsMap[product.id] || EMPTY_REVIEWS;
    const bySlug = product.slug ? extraReviewsMap[product.slug] || EMPTY_REVIEWS : EMPTY_REVIEWS;
    if (byId.length === 0 && bySlug.length === 0) return EMPTY_REVIEWS;
    const map = new Map<string, any>();
    [...byId, ...bySlug].forEach((r) => map.set(r.id, r));
    return Array.from(map.values());
  }, [extraReviewsMap, product.id, product.slug]);

  const initialReviews = product.reviews || [];
  const allReviews = React.useMemo(() => {
    const map = new Map<string, any>();
    extraReviews.forEach((r) => map.set(r.id, r));
    initialReviews.forEach((r) => {
      if (!map.has(r.id)) {
        map.set(r.id, r);
      }
    });
    return Array.from(map.values());
  }, [extraReviews, initialReviews]);
  const liveReviewCount = allReviews.length;
  const liveRating =
    liveReviewCount > 0
      ? Number(
          (
            allReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) /
            liveReviewCount
          ).toFixed(1)
        )
      : 5.0;

  return (
    <div className="space-y-6">
      {/* 1. Brand, Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
          <Link
            href={`/products?brand=${encodeURIComponent(product.brand)}`}
            className="hover:underline"
          >
            {product.brand}
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="text-muted-foreground hover:text-foreground transition-colors lowercase first-letter:uppercase"
          >
            {product.category}
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-foreground tracking-tight leading-tight">
          {product.name}
        </h1>

        {/* Rating summary */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-xl text-amber-600 dark:text-amber-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-black text-sm">{liveRating.toFixed(1)}</span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            ({liveReviewCount} Verified Parent Reviews)
          </span>
          <span className="text-muted-foreground text-xs">•</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> In Stock & Ready to Ship
          </span>
        </div>
      </div>

      {/* 2. Price Display */}
      <div className="p-4 sm:p-5 rounded-3xl bg-muted/40 border border-border/70 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black font-display text-foreground tracking-tight">
              ৳{currentPrice.toLocaleString()}
            </span>
            {currentOriginalPrice && (
              <span className="text-base sm:text-lg font-semibold text-muted-foreground line-through">
                ৳{currentOriginalPrice.toLocaleString()}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-xs">
                Save {discountPercent}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">
            VAT included. Free shipping on orders over ৳1,500
          </p>
        </div>

        {/* Urgent Low Stock indicator */}
        <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-3 py-1.5 rounded-2xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-black text-rose-600 dark:text-rose-400">
            Only {product.stockCount || 4} left in stock!
          </span>
        </div>
      </div>

      {/* 3. Variant Selectors */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-4 pt-1">
          {product.variants.map((group) => (
            <div key={group.name} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">
                  Select {group.name}:{" "}
                  <span className="text-primary font-black">
                    {selectedVariants[group.name]}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {group.options.map((opt) => {
                  const isSelected = selectedVariants[group.name] === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() =>
                        setSelectedVariants((prev) => ({
                          ...prev,
                          [group.name]: opt.label,
                        }))
                      }
                      className={`h-11 px-4 rounded-2xl text-xs font-bold border-2 transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-xs"
                          : "border-border/70 bg-card hover:border-primary/40 text-foreground"
                      }`}
                    >
                      {opt.colorHex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner"
                          style={{ backgroundColor: opt.colorHex }}
                        />
                      )}
                      <span>{opt.label}</span>
                      {opt.priceModifier ? (
                        <span className="text-[10px] opacity-75 font-normal">
                          (+৳{opt.priceModifier})
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Quantity and Action Buttons Row */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-muted/60 border border-border/80 rounded-2xl p-1 shrink-0">
            <button
              type="button"
              onClick={handleQuantityMinus}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground hover:bg-card disabled:opacity-30 transition-all cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-black text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleQuantityPlus}
              disabled={quantity >= maxStock}
              aria-label="Increase quantity"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground hover:bg-card disabled:opacity-30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Main Add to Cart Button (Pink #FF3E78) */}
          <Button
            onClick={handleAddToCart}
            className={`flex-1 h-12 rounded-2xl font-bold text-sm tracking-wide gap-2 text-white shadow-lg transition-all duration-300 ${
              added
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
                : "bg-[#FF3E78] hover:bg-[#e63069] shadow-[#FF3E78]/30 active:scale-98"
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" /> Added to Bag!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Add to Cart (৳
                {(currentPrice * quantity).toLocaleString()})
              </>
            )}
          </Button>

          {/* Wishlist toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleWishlist}
            aria-label="Wishlist toggle"
            className={`w-12 h-12 rounded-2xl border-border/80 transition-all shrink-0 ${
              isWishlisted
                ? "bg-rose-500 border-rose-500 text-white hover:bg-rose-600"
                : "hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
          </Button>
        </div>

        {/* Instant Buy Now Button */}
        <Button
          onClick={handleBuyNow}
          variant="secondary"
          className="w-full h-11 rounded-2xl font-black text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-500 text-amber-950 gap-2 shadow-md transition-all active:scale-98"
        >
          <Zap className="w-4 h-4 fill-amber-950" /> Instant Buy Now with 1-Click
        </Button>
      </div>

      {/* 5. Developmental Skill & Age Specification Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black font-display text-foreground">
              What your child learns from this toy
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white">
            <Baby className="w-3 h-3" />
            {product.ageLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {product.skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 text-xs font-semibold text-foreground bg-card/80 p-2 rounded-xl border border-border/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Delivery & Assurance Perks */}
      <div className="p-4 rounded-3xl bg-muted/30 border border-border/60 divide-y divide-border/50">
        <div className="flex items-center gap-3 pb-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">
              Fast Nationwide Express Delivery
            </div>
            <div className="text-[11px] text-muted-foreground">
              Dhaka inside 24-48 hours · Outside Dhaka 3-4 days
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">
              Cash on Delivery & Safe Payment
            </div>
            <div className="text-[11px] text-muted-foreground">
              bKash, Nagad, Visa, Mastercard or Pay upon inspection at doorstep
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">
              7 Days Hassle-Free Returns
            </div>
            <div className="text-[11px] text-muted-foreground">
              100% money back guarantee if damaged or not matching description
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
