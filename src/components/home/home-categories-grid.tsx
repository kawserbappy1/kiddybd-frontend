"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { catalogService, type Category } from "@/services/catalog.service";
import { getCategoryIcon } from "@/components/layout/vertical-category-menu";

interface CategoryWithMeta {
  id: string;
  name: string;
  slug: string;
  bengaliName?: string;
  icon: string;
  productCount: number;
  gradient: string;
  border: string;
  glow: string;
  circleBg: string;
  accentColor: string;
}

// Visual theme presets for circular category items
const CATEGORY_STYLE_PALETTE = [
  {
    gradient: "from-rose-500/20 via-pink-400/10 to-rose-500/30",
    border: "border-rose-300 dark:border-rose-700 hover:border-[#FF3E78]",
    glow: "hover:shadow-rose-500/25",
    circleBg: "bg-rose-100 text-[#FF3E78] dark:bg-rose-950/80 dark:text-rose-300",
    accentColor: "text-[#FF3E78]",
  },
  {
    gradient: "from-sky-500/20 via-cyan-400/10 to-sky-500/30",
    border: "border-sky-300 dark:border-sky-700 hover:border-[#0EA5E9]",
    glow: "hover:shadow-sky-500/25",
    circleBg: "bg-sky-100 text-[#0EA5E9] dark:bg-sky-950/80 dark:text-sky-300",
    accentColor: "text-[#0EA5E9]",
  },
  {
    gradient: "from-amber-500/20 via-orange-400/10 to-amber-500/30",
    border: "border-amber-300 dark:border-amber-700 hover:border-[#F59E0B]",
    glow: "hover:shadow-amber-500/25",
    circleBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-300",
    accentColor: "text-amber-600 dark:text-amber-400",
  },
  {
    gradient: "from-purple-500/20 via-indigo-400/10 to-purple-500/30",
    border: "border-purple-300 dark:border-purple-700 hover:border-purple-500",
    glow: "hover:shadow-purple-500/25",
    circleBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-300",
    accentColor: "text-purple-600 dark:text-purple-400",
  },
  {
    gradient: "from-emerald-500/20 via-teal-400/10 to-emerald-500/30",
    border: "border-emerald-300 dark:border-emerald-700 hover:border-emerald-500",
    glow: "hover:shadow-emerald-500/25",
    circleBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-300",
    accentColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    gradient: "from-blue-500/20 via-indigo-400/10 to-blue-500/30",
    border: "border-blue-300 dark:border-blue-700 hover:border-blue-500",
    glow: "hover:shadow-blue-500/25",
    circleBg: "bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-300",
    accentColor: "text-blue-600 dark:text-blue-400",
  },
  {
    gradient: "from-pink-500/20 via-rose-400/10 to-pink-500/30",
    border: "border-pink-300 dark:border-pink-700 hover:border-pink-500",
    glow: "hover:shadow-pink-500/25",
    circleBg: "bg-pink-100 text-pink-600 dark:bg-pink-950/80 dark:text-pink-300",
    accentColor: "text-pink-600 dark:text-pink-400",
  },
  {
    gradient: "from-teal-500/20 via-cyan-400/10 to-teal-500/30",
    border: "border-teal-300 dark:border-teal-700 hover:border-teal-500",
    glow: "hover:shadow-teal-500/25",
    circleBg: "bg-teal-100 text-teal-600 dark:bg-teal-950/80 dark:text-teal-300",
    accentColor: "text-teal-600 dark:text-teal-400",
  },
];

function getBengaliCategoryName(name: string): string {
  const t = name.toLowerCase();
  if (t.includes("toy") || t.includes("game")) return "খেলনা ও খেলাধুলা";
  if (t.includes("stem") || t.includes("robot")) return "রোবোটিক্স ও সায়েন্স";
  if (t.includes("brain") || t.includes("develop")) return "বুদ্ধিমত্তা ও মনোযোগ";
  if (t.includes("montessori")) return "মন্টেসরি অ্যাক্টিভিটি";
  if (t.includes("baby") || t.includes("essential")) return "নবজাতক ও বেবি কেয়ার";
  if (t.includes("book") || t.includes("read")) return "ছবির বই ও গল্প";
  if (t.includes("fashion") || t.includes("cloth")) return "কিডস পোশাক";
  if (t.includes("education") || t.includes("learn")) return "প্রাথমিক শিক্ষা";
  return "স্মার্ট লার্নিং টয়";
}

export function HomeCategoriesGrid() {
  const [categories, setCategories] = React.useState<CategoryWithMeta[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const res = await catalogService.getCategories();
        if (res.data?.categories && isMounted) {
          const raw = res.data.categories as (Category & {
            parentId?: string | null;
            _count?: { products: number };
          })[];

          const parents = raw.filter((c) => !c.parentId);
          const list = parents.length > 0 ? parents : raw;

          const formatted: CategoryWithMeta[] = list.map((c, i) => {
            const palette =
              CATEGORY_STYLE_PALETTE[i % CATEGORY_STYLE_PALETTE.length];
            return {
              id: c.id,
              name: c.name,
              slug: c.slug,
              bengaliName: getBengaliCategoryName(c.name),
              icon: getCategoryIcon(c.name, c.slug),
              productCount: c._count?.products ?? 0,
              gradient: palette.gradient,
              border: palette.border,
              glow: palette.glow,
              circleBg: palette.circleBg,
              accentColor: palette.accentColor,
            };
          });

          setCategories(formatted);
        }
      } catch (err) {
        console.error("Failed to load categories for circle slider:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        <div className="h-6 w-48 bg-muted animate-pulse rounded-md mb-2" />
        <div className="h-4 w-64 bg-muted/60 animate-pulse rounded-md mb-6" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-24 h-24 rounded-full bg-muted/50 animate-pulse border border-border/50" />
              <div className="w-16 h-3 bg-muted/50 animate-pulse rounded-md" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  // Seamless infinite loop items for marquee + manual smooth scrollable track
  const duplicatedCategories = [...categories, ...categories, ...categories];

  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF3E78] dark:text-rose-400 uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Age-Wise &amp; Skill Curated</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Explore By Categories</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-[#FF3E78] dark:bg-rose-950/60 dark:text-rose-300 font-bold border border-rose-200/80 dark:border-rose-900">
              {categories.length} Collections
            </span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bengali text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
              শিশুর বয়স ও মেধা বিকাশের চাহিদা অনুযায়ী ক্যাটাগরি বেছে নিন
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Arrow navigation buttons for slider */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Previous Category"
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Next Category"
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-[#0EA5E9] hover:underline flex items-center gap-1 group ml-2"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Circle Sliding Marquee & Carousel Container */}
      <div className="relative w-full overflow-hidden rounded-3xl py-2 pause-on-hover">
        {/* Soft edge blur gradient masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-white dark:from-slate-900 sm:from-[#FAFAFA] sm:dark:from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-white dark:from-slate-900 sm:from-[#FAFAFA] sm:dark:from-slate-950 to-transparent" />

        {/* Continuous sliding marquee with circle avatars */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth"
        >
          <div className="animate-marquee-rtl flex items-center gap-6 sm:gap-8 py-3 px-2">
            {duplicatedCategories.map((cat, idx) => (
              <Link
                key={`${cat.id}-${idx}`}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center text-center shrink-0 w-28 sm:w-32 transition-all duration-300"
              >
                {/* Perfect Circle Avatar with Animated Ripple / Glow on Hover */}
                <div className="relative mb-2.5">
                  {/* Outer animated gradient ring */}
                  <div
                    className={`absolute -inset-1.5 rounded-full bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 group-hover:scale-105 blur-xs transition-all duration-300`}
                  />

                  {/* Main Circular Bubble */}
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full ${cat.circleBg} border-2 ${cat.border} shadow-md group-hover:shadow-xl ${cat.glow} flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:-translate-y-1`}
                  >
                    <span className="text-3xl sm:text-4xl group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300">
                      {cat.icon}
                    </span>
                  </div>
                </div>

                {/* Category Title */}
                <h3 className="font-display font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-1 leading-tight w-full">
                  {cat.name}
                </h3>

                {/* Bengali Subtitle with Hind Siliguri */}
                <p className="font-bengali text-[11px] font-semibold text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {cat.bengaliName}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
