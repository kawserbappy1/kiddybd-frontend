import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

export default function NotFound() {
  const POPULAR_CATEGORIES = [
    { label: "🧸 Toys & Games", href: "/products?category=Toys%20%26%20Games" },
    { label: "🍼 Baby Essentials", href: "/products?category=Baby%20Essentials" },
    { label: "🔬 STEM & Learning", href: "/products?skill=STEM%20%26%20Science" },
    { label: "👕 Kids Fashion", href: "/products?category=Kids%20Fashion" },
    { label: "🎨 Arts & Crafts", href: "/products?category=Arts%20%26%20Crafts" },
    { label: "🏷️ Special Offers", href: "/products?deals=true" },
  ];

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      {/* Playful 404 Mascot */}
      <div className="relative mb-5">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-amber-100 dark:bg-amber-950/40 border-4 border-amber-300 dark:border-amber-700/50 flex items-center justify-center text-6xl shadow-inner animate-bounce duration-1000">
          🧸
        </div>
        <div className="absolute -bottom-1 -right-1 px-3 py-1 rounded-full bg-primary text-white text-xs font-black shadow-md">
          404
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-black font-display text-foreground tracking-tight">
        Oops! Page Wandered Off
      </h1>

      <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
        The toy chest you&apos;re looking for couldn&apos;t be found. It might have been moved, renamed, or is taking a nap!
      </p>

      {/* Quick Links Back to Popular Categories */}
      <div className="mt-8 space-y-3 w-full max-w-lg">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Popular Departments to Explore:
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {POPULAR_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="text-xs font-bold px-3.5 py-2 rounded-2xl bg-card border border-border/80 hover:border-primary text-foreground hover:text-primary transition-all shadow-2xs hover:scale-105"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Return to Home CTA */}
      <div className="flex gap-3 mt-8">
        <Button
          asChild
          className="rounded-full px-6 h-11 font-bold text-xs gap-2 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href="/">
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="rounded-full px-6 h-11 font-bold text-xs gap-2"
        >
          <Link href="/products">
            <ShoppingBag className="w-4 h-4" /> Browse Catalog
          </Link>
        </Button>
      </div>
    </div>
  );
}
