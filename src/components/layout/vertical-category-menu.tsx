"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Loader2, Sparkles, FolderPlus } from "lucide-react";
import { catalogService, type Category } from "@/services/catalog.service";

export interface DbCategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  icon?: string;
  _count?: {
    products: number;
  };
  subcategories?: DbCategoryItem[];
}

/**
 * Intelligent icon resolver for categories created via Admin Dashboard.
 * Maps category keywords to relevant, playful emojis.
 */
export function getCategoryIcon(name: string, slug?: string): string {
  const text = `${name || ""} ${slug || ""}`.toLowerCase();
  if (text.includes("toy") || text.includes("game")) return "🧸";
  if (text.includes("baby") || text.includes("infant") || text.includes("essential")) return "🍼";
  if (text.includes("brain") || text.includes("develop") || text.includes("mind")) return "🧠";
  if (text.includes("fashion") || text.includes("cloth") || text.includes("wear") || text.includes("dress")) return "👕";
  if (text.includes("learn") || text.includes("book") || text.includes("read") || text.includes("story")) return "📚";
  if (text.includes("stem") || text.includes("robot") || text.includes("tech") || text.includes("science")) return "🤖";
  if (text.includes("montessori") || text.includes("sensory") || text.includes("wooden") || text.includes("puzzle")) return "🧩";
  if (text.includes("nursery") || text.includes("room") || text.includes("bed") || text.includes("decor")) return "🛋️";
  if (text.includes("outdoor") || text.includes("sport") || text.includes("ride") || text.includes("ball")) return "⚽";
  if (text.includes("art") || text.includes("craft") || text.includes("paint") || text.includes("color") || text.includes("draw")) return "🎨";
  if (text.includes("feed") || text.includes("food") || text.includes("bowl") || text.includes("bottle")) return "🥣";
  if (text.includes("travel") || text.includes("car") || text.includes("stroller") || text.includes("safety")) return "🚗";
  if (text.includes("gift") || text.includes("party") || text.includes("birthday")) return "🎁";
  if (text.includes("music") || text.includes("sound") || text.includes("instrument")) return "🎵";
  if (text.includes("electronic") || text.includes("gadget")) return "🎮";
  return "✨";
}

interface VerticalCategoryMenuProps {
  className?: string;
  onSelectCategory?: () => void;
}

export function VerticalCategoryMenu({
  className = "",
  onSelectCategory,
}: VerticalCategoryMenuProps) {
  const [categories, setCategories] = React.useState<DbCategoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState<DbCategoryItem | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const res = await catalogService.getCategories();
        if (res.data?.categories && isMounted) {
          const raw = res.data.categories as (Category & {
            parentId?: string | null;
            _count?: { products: number };
          })[];

          // Organize categories with parentId into parent-child hierarchy
          const parents = raw.filter((c) => !c.parentId);
          const children = raw.filter((c) => Boolean(c.parentId));

          const tree: DbCategoryItem[] = parents.map((parent) => ({
            id: parent.id,
            name: parent.name,
            slug: parent.slug,
            icon: getCategoryIcon(parent.name, parent.slug),
            _count: parent._count,
            subcategories: children
              .filter((ch) => ch.parentId === parent.id)
              .map((ch) => ({
                id: ch.id,
                name: ch.name,
                slug: ch.slug,
                icon: getCategoryIcon(ch.name, ch.slug),
                _count: ch._count,
              })),
          }));

          // If no hierarchy is setup yet, use all categories as top-level items
          if (tree.length === 0 && raw.length > 0) {
            setCategories(
              raw.map((c) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                icon: getCategoryIcon(c.name, c.slug),
                _count: c._count,
              }))
            );
          } else {
            setCategories(tree);
          }
        }
      } catch (err) {
        console.error("Failed to load categories for vertical menu:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className={`relative w-64 bg-white dark:bg-slate-900 border-x border-b border-slate-200 dark:border-slate-800 shadow-sm rounded-b-xl z-20 ${className}`}
      onMouseLeave={() => setActiveCategory(null)}
    >
      {isLoading ? (
        <div className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="p-5 text-center space-y-2">
          <p className="text-xs text-muted-foreground">No categories found in database.</p>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Add from Admin</span>
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {categories.map((cat) => {
            const hasSubcategories = Boolean(
              cat.subcategories && cat.subcategories.length > 0
            );

            return (
              <li
                key={cat.id}
                onMouseEnter={() => setActiveCategory(hasSubcategories ? cat : null)}
                className="group"
              >
                <Link
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  onClick={onSelectCategory}
                  className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors ${
                    activeCategory?.id === cat.id
                      ? "bg-slate-50 dark:bg-slate-800 text-[#0EA5E9]"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#0EA5E9]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm select-none shrink-0">{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  {hasSubcategories ? (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0EA5E9] shrink-0" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Flyout Submenu Panel for subcategories */}
      {activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
        <div
          onMouseEnter={() => setActiveCategory(activeCategory)}
          onMouseLeave={() => setActiveCategory(null)}
          className="absolute left-full top-0 ml-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-4 z-50 animate-in fade-in-0 slide-in-from-left-2 duration-150"
        >
          <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-base">{activeCategory.icon}</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-display">
              {activeCategory.name}
            </h4>
          </div>

          <ul className="space-y-1.5">
            {activeCategory.subcategories.map((sub) => (
              <li key={sub.id}>
                <Link
                  href={`/products?category=${encodeURIComponent(sub.name)}`}
                  onClick={onSelectCategory}
                  className="block text-xs text-slate-600 dark:text-slate-400 hover:text-[#FF3E78] py-1 px-2 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/40 font-medium transition-colors"
                >
                  {sub.icon} {sub.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href={`/products?category=${encodeURIComponent(activeCategory.name)}`}
              onClick={onSelectCategory}
              className="text-[11px] font-bold text-[#0EA5E9] hover:underline flex items-center justify-between"
            >
              <span>View all in {activeCategory.name}</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
