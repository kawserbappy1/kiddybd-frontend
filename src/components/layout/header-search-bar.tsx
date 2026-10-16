"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, X, Sparkles, TrendingUp } from "lucide-react";
import { useDebounce } from "@/lib/use-debounce";

interface SearchProductResult {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  inStock: boolean;
  thumbnail: string;
}

import { catalogService } from "@/services/catalog.service";

const POPULAR_SEARCHES = [
  "Building Blocks",
  "Teddy Backpack",
  "Dinosaur Toys",
  "Story Books",
  "Play Tent",
  "Baby Stroller",
];

export function HeaderSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchProductResult[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    let isCancelled = false;

    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    catalogService
      .listProducts({ search: debouncedQuery.trim(), limit: 8 })
      .then((res) => {
        if (isCancelled) return;
        if (res.data?.products) {
          const liveResults: SearchProductResult[] = res.data.products.map((p) => {
            const v = p.variants?.[0];
            const m = p.media?.[0];
            return {
              id: p.id,
              title: p.name,
              slug: p.slug,
              price: Number(v?.price || 0),
              originalPrice: v?.discountPrice ? Number(v.discountPrice) : undefined,
              category: p.category?.name || "Toys & Games",
              inStock: (v?.inventory?.quantity ?? 10) > 0,
              thumbnail:
                m?.url ||
                "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200&auto=format&fit=crop&q=80",
            };
          });
          setResults(liveResults);
        } else {
          setResults([]);
        }
      })
      .catch(() => {
        if (!isCancelled) setResults([]);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectPopular = (term: string) => {
    setQuery(term);
    router.push(`/products?q=${encodeURIComponent(term)}`);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-2xl mx-auto">
      {/* Light grey pill bar with pink right square button */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-center w-full"
      >
        <div className="relative w-full flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for toys, clothes, baby gear and more..."
            className="w-full h-11 pl-5 pr-14 rounded-full bg-[#F1F5F9] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-foreground placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF3E78]/30 transition-all"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* KiddoJoy rounded pink button inside search pill */}
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FF3E78] hover:bg-[#e62e66] text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Live autocomplete dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 text-foreground rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in-0 duration-150">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2.5 py-6 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF3E78]" />
              <span>Searching KiddoJoy catalog...</span>
            </div>
          ) : query.trim() ? (
            results.length > 0 ? (
              <div className="p-3">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Suggested Products</span>
                  <span className="text-[#FF3E78] font-semibold lowercase">
                    {results.length} found
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {results.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-[#FF3E78] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.category}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-[#FF3E78]">
                          ৳{item.price}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="w-full text-center py-1.5 text-xs font-bold text-[#FF3E78] hover:underline"
                  >
                    View all results for &ldquo;{query}&rdquo; →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center text-xs text-slate-500">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  No matching products found
                </p>
              </div>
            )
          ) : (
            <div className="p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <TrendingUp className="w-3.5 h-3.5 text-[#FF3E78]" />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectPopular(term)}
                    className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 hover:text-[#FF3E78] border border-slate-200 dark:border-slate-700 transition-colors font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#FFB703]" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
