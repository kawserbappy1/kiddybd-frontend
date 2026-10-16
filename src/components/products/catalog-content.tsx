"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  CatalogProduct,
  AGE_GROUPS,
  SKILL_BENEFITS,
  SORT_OPTIONS,
} from "@/lib/catalog-data";
import { catalogService, type ProductItem } from "@/services/catalog.service";
import { ProductFilterSidebar } from "@/components/products/product-filter-sidebar";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutGrid,
  Grid3X3,
  List as ListIcon,
  SlidersHorizontal,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Frown,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";

export function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Loading skeleton animation state for smooth filter transitions
  const [isLoading, setIsLoading] = React.useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [dbProducts, setDbProducts] = React.useState<CatalogProduct[]>([]);

  // Fetch real products from PostgreSQL database via catalogService
  React.useEffect(() => {
    let isMounted = true;
    async function loadDbCatalog() {
      setIsLoading(true);
      try {
        const res = await catalogService.listProducts({ limit: 100 });
        if (res.data?.products && res.data.products.length > 0) {
          const mapped: CatalogProduct[] = res.data.products.map((p) => {
            const v = p.variants?.[0];
            const m = p.media?.[0];

            const dbAgeGroup = p.ageGroups?.[0]?.ageGroup?.rangeLabel;
            const ageKey: "0-12m" | "1-3y" | "3-5y" | "5-8y" | "8+" =
              dbAgeGroup?.includes("0-12") || p.recommendedAge?.includes("0-12") || p.recommendedAge?.includes("0-6")
                ? "0-12m"
                : dbAgeGroup?.includes("1-3") || p.recommendedAge?.includes("1-3") || p.recommendedAge?.includes("1+")
                ? "1-3y"
                : dbAgeGroup?.includes("5-8") || p.recommendedAge?.includes("5+") || p.recommendedAge?.includes("6+")
                ? "5-8y"
                : dbAgeGroup?.includes("8+") || p.recommendedAge?.includes("8+")
                ? "8+"
                : "3-5y";

            const dbSkills =
              p.skills && p.skills.length > 0
                ? p.skills.map((s) => s.skill.name)
                : ["Cognitive & Problem Solving"];

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
              brand: p.brand?.name || "KiddoJoy",
              category: p.category?.name || "Toys & Games",
              categorySlug: p.category?.slug || "toys-games",
              ageGroup: ageKey,
              ageLabel: dbAgeGroup || p.recommendedAge || "3+ Years",
              skills: dbSkills,
              price: Number(v?.price || 990),
              originalPrice: v?.discountPrice ? Number(v.discountPrice) : undefined,
              rating: realRating,
              reviewCount: realReviewCount,
              inStock: (v?.inventory?.quantity ?? 10) > 0,
              stockCount: v?.inventory?.quantity ?? 10,
              isSpecialOffer: Boolean(v?.discountPrice),
              isFeatured: Boolean(p.isFeatured),
              isBestSeller: Boolean(p.isBestSeller),
              image: m?.url || "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=80",
              description: p.description,
              features: [p.material, p.origin, p.recommendedAge].filter(Boolean) as string[],
            };
          });
          if (isMounted) setDbProducts(mapped);
        } else {
          if (isMounted) setDbProducts([]);
        }
      } catch (err) {
        if (isMounted) setDbProducts([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDbCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Parse state from URL params
  const selectedAges = React.useMemo(() => {
    const val = searchParams.get("age");
    return val ? val.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedSkills = React.useMemo(() => {
    const val = searchParams.get("skill");
    return val ? val.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedCategories = React.useMemo(() => {
    const val = searchParams.get("category");
    return val ? val.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedBrands = React.useMemo(() => {
    const val = searchParams.get("brand");
    return val ? val.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const minPrice = React.useMemo(() => {
    const val = searchParams.get("minPrice");
    return val ? parseInt(val) : 0;
  }, [searchParams]);

  const maxPrice = React.useMemo(() => {
    const val = searchParams.get("maxPrice");
    return val ? parseInt(val) : 10000;
  }, [searchParams]);

  const inStockOnly = searchParams.get("inStock") === "true";
  const specialOffersOnly = searchParams.get("deals") === "true";
  const sort = searchParams.get("sort") || "recommended";
  const searchQuery = searchParams.get("q") || "";
  const [viewMode, setViewMode] = React.useState<"grid3" | "grid4" | "list">("grid4");

  // Helper to update URL params
  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      setIsLoading(true);
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "" || val === undefined) {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });

      // Always reset to page 1 on filter change
      if (!updates.page) {
        params.delete("page");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setTimeout(() => setIsLoading(false), 200);
    },
    [router, pathname, searchParams]
  );

  // Toggle helpers
  const toggleFilter = (
    currentList: string[],
    item: string,
    paramName: string
  ) => {
    const next = currentList.includes(item)
      ? currentList.filter((x) => x !== item)
      : [...currentList, item];
    updateParams({ [paramName]: next.length > 0 ? next.join(",") : null });
  };

  const handlePriceChange = (range: [number, number]) => {
    updateParams({
      minPrice: range[0] > 0 ? range[0].toString() : null,
      maxPrice: range[1] < 10000 ? range[1].toString() : null,
    });
  };

  const handleResetAll = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setTimeout(() => setIsLoading(false), 200);
  };

  // Pure database products strictly
  const allProducts = dbProducts;

  // Compute available categories and brands with counts
  const { availableCategories, availableBrands, ageCounts, skillCounts } =
    React.useMemo(() => {
      const catMap: Record<string, number> = {};
      const brandMap: Record<string, number> = {};
      const aMap: Record<string, number> = {};
      const sMap: Record<string, number> = {};

      allProducts.forEach((p) => {
        catMap[p.category] = (catMap[p.category] || 0) + 1;
        brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
        aMap[p.ageGroup] = (aMap[p.ageGroup] || 0) + 1;
        p.skills.forEach((s) => {
          sMap[s] = (sMap[s] || 0) + 1;
        });
      });

      return {
        availableCategories: Object.entries(catMap).map(([name, count]) => ({
          name,
          count,
        })),
        availableBrands: Object.entries(brandMap).map(([name, count]) => ({
          name,
          count,
        })),
        ageCounts: aMap,
        skillCounts: sMap,
      };
    }, [allProducts]);

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    return allProducts.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesSkills = product.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesCat && !matchesSkills) {
          return false;
        }
      }

      // 2. Age filter
      if (selectedAges.length > 0 && !selectedAges.includes(product.ageGroup)) {
        return false;
      }

      // 3. Skill filter (match any of the selected skills)
      if (
        selectedSkills.length > 0 &&
        !selectedSkills.some((s) => product.skills.includes(s))
      ) {
        return false;
      }

      // 4. Category filter (supports exact name, categorySlug, or partial match)
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.some(
          (c) =>
            c.toLowerCase() === product.category.toLowerCase() ||
            c.toLowerCase() === product.categorySlug?.toLowerCase() ||
            product.category.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(product.category.toLowerCase())
        )
      ) {
        return false;
      }

      // 5. Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // 6. Price Range
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // 7. In stock
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // 8. Special Offers
      if (specialOffersOnly && !product.isSpecialOffer) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "rating_desc") return b.rating - a.rating;
      if (sort === "newest") return b.id.localeCompare(a.id);
      // "recommended" default: special offers and higher ratings first
      return (b.isSpecialOffer ? 1 : 0) - (a.isSpecialOffer ? 1 : 0) || b.rating - a.rating;
    });
  }, [
    allProducts,
    searchQuery,
    selectedAges,
    selectedSkills,
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    inStockOnly,
    specialOffersOnly,
    sort,
  ]);

  // Active filters count
  const activeFilterCount =
    selectedAges.length +
    selectedSkills.length +
    selectedCategories.length +
    selectedBrands.length +
    (minPrice > 0 || maxPrice < 10000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (specialOffersOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>Home</span>
              <span>/</span>
              <span className="font-semibold text-primary">Toy Catalog & Learning Kits</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-foreground tracking-tight flex items-center gap-3">
              Explore Toys & Gear
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                Curated for Development
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Filter by child age group, STEM & creative skills, verified brands, and safe non-toxic materials.
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search catalog toys..."
              defaultValue={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                const timer = setTimeout(() => {
                  updateParams({ q: val.trim() ? val : null });
                }, 400);
                return () => clearTimeout(timer);
              }}
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-card border border-border/80 text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors placeholder:text-muted-foreground/70 shadow-xs"
            />
          </div>
        </div>

        {/* Main 2-Column Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Left Sidebar (1/4 width) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <ProductFilterSidebar
              selectedAges={selectedAges}
              onToggleAge={(age) => toggleFilter(selectedAges, age, "age")}
              selectedSkills={selectedSkills}
              onToggleSkill={(skill) => toggleFilter(selectedSkills, skill, "skill")}
              selectedCategories={selectedCategories}
              onToggleCategory={(cat) => toggleFilter(selectedCategories, cat, "category")}
              selectedBrands={selectedBrands}
              onToggleBrand={(brand) => toggleFilter(selectedBrands, brand, "brand")}
              priceRange={[minPrice, maxPrice]}
              onPriceChange={handlePriceChange}
              inStockOnly={inStockOnly}
              onToggleInStock={(val) => updateParams({ inStock: val ? "true" : null })}
              specialOffersOnly={specialOffersOnly}
              onToggleSpecialOffers={(val) => updateParams({ deals: val ? "true" : null })}
              onResetFilters={handleResetAll}
              activeFilterCount={activeFilterCount}
              availableCategories={availableCategories}
              availableBrands={availableBrands}
              ageCounts={ageCounts}
              skillCounts={skillCounts}
            />
          </div>

          {/* Right Product Grid Area (3/4 width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Catalog Controls Bar */}
            <div className="bg-card border border-border/70 rounded-3xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              {/* Left: Mobile Filters button & count */}
              <div className="flex items-center gap-3">
                {/* Mobile Filter Sheet Trigger */}
                <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden rounded-2xl h-10 px-4 gap-2 font-bold text-xs"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-primary" />
                      Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[85vw] sm:max-w-md overflow-y-auto p-4">
                    <SheetHeader className="mb-4">
                      <SheetTitle className="text-left font-display">Filter Products</SheetTitle>
                    </SheetHeader>
                    <ProductFilterSidebar
                      selectedAges={selectedAges}
                      onToggleAge={(age) => toggleFilter(selectedAges, age, "age")}
                      selectedSkills={selectedSkills}
                      onToggleSkill={(skill) => toggleFilter(selectedSkills, skill, "skill")}
                      selectedCategories={selectedCategories}
                      onToggleCategory={(cat) => toggleFilter(selectedCategories, cat, "category")}
                      selectedBrands={selectedBrands}
                      onToggleBrand={(brand) => toggleFilter(selectedBrands, brand, "brand")}
                      priceRange={[minPrice, maxPrice]}
                      onPriceChange={handlePriceChange}
                      inStockOnly={inStockOnly}
                      onToggleInStock={(val) => updateParams({ inStock: val ? "true" : null })}
                      specialOffersOnly={specialOffersOnly}
                      onToggleSpecialOffers={(val) => updateParams({ deals: val ? "true" : null })}
                      onResetFilters={handleResetAll}
                      activeFilterCount={activeFilterCount}
                      availableCategories={availableCategories}
                      availableBrands={availableBrands}
                      ageCounts={ageCounts}
                      skillCounts={skillCounts}
                      className="border-none p-0 shadow-none"
                    />
                  </SheetContent>
                </Sheet>

                <div className="text-xs font-semibold text-muted-foreground">
                  Showing{" "}
                  <span className="text-foreground font-black text-sm">
                    {filteredProducts.length}
                  </span>{" "}
                  of {allProducts.length} toys
                </div>
              </div>

              {/* Right: Sort Dropdown & Layout Toggles */}
              <div className="flex items-center gap-3 ml-auto">
                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-xs font-bold text-muted-foreground flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                  </span>
                  <Select
                    value={sort}
                    onValueChange={(val) => updateParams({ sort: val === "recommended" ? null : val })}
                  >
                    <SelectTrigger className="w-[170px] h-10 rounded-2xl text-xs font-bold">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl shadow-xl">
                      {SORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs font-medium">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Switchers */}
                <div className="hidden sm:flex items-center bg-muted/60 p-1 rounded-2xl border border-border/60">
                  <button
                    type="button"
                    title="4 Columns Grid"
                    onClick={() => setViewMode("grid4")}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      viewMode === "grid4"
                        ? "bg-card text-primary shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="3 Columns Grid"
                    onClick={() => setViewMode("grid3")}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      viewMode === "grid3"
                        ? "bg-card text-primary shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="List View"
                    onClick={() => setViewMode("list")}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      viewMode === "list"
                        ? "bg-card text-primary shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Chip Bar */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                <span className="text-xs font-bold text-muted-foreground mr-1">
                  Active Filters:
                </span>

                {/* Age Chips */}
                {selectedAges.map((age) => (
                  <span
                    key={age}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                  >
                    Age: {AGE_GROUPS.find((a) => a.id === age)?.label || age}
                    <button
                      onClick={() => toggleFilter(selectedAges, age, "age")}
                      className="hover:opacity-75"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                {/* Skill Chips */}
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/15 text-primary dark:text-pink-300 border border-primary/30"
                  >
                    Skill: {skill}
                    <button
                      onClick={() => toggleFilter(selectedSkills, skill, "skill")}
                      className="hover:opacity-75"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                {/* Category Chips */}
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30"
                  >
                    {cat}
                    <button
                      onClick={() => toggleFilter(selectedCategories, cat, "category")}
                      className="hover:opacity-75"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                {/* Brand Chips */}
                {selectedBrands.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                  >
                    Brand: {b}
                    <button
                      onClick={() => toggleFilter(selectedBrands, b, "brand")}
                      className="hover:opacity-75"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                {/* Price Chip */}
                {(minPrice > 0 || maxPrice < 10000) && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    Price: ৳{minPrice.toLocaleString()} - ৳{maxPrice.toLocaleString()}
                    <button
                      onClick={() => updateParams({ minPrice: null, maxPrice: null })}
                      className="hover:opacity-75"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {/* In Stock Chip */}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    In Stock Only
                    <button
                      onClick={() => updateParams({ inStock: null })}
                      className="hover:opacity-75"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {/* Special Offers Chip */}
                {specialOffersOnly && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                    Special Offers Only
                    <button
                      onClick={() => updateParams({ deals: null })}
                      className="hover:opacity-75"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {/* Clear all button */}
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 underline ml-2 cursor-pointer transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Loading Skeleton Placeholder */}
            {isLoading ? (
              <div
                className={
                  viewMode === "list"
                    ? "flex flex-col gap-4"
                    : viewMode === "grid3"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                }
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-3xl border border-border/60 bg-card space-y-3"
                  >
                    <Skeleton className="w-full aspect-square rounded-2xl" />
                    <Skeleton className="h-4 w-2/3 rounded-lg" />
                    <Skeleton className="h-6 w-full rounded-lg" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-5 w-20 rounded-lg" />
                      <Skeleton className="h-8 w-20 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Playful Empty State with Cute Mascot */
              <div className="bg-card border border-border/70 rounded-3xl p-10 sm:p-14 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-xs my-8 animate-in fade-in-50">
                {/* Mascot Icon Container */}
                <div className="relative mb-5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-100 dark:bg-amber-950/40 border-4 border-amber-300 dark:border-amber-700/50 flex items-center justify-center text-4xl shadow-inner">
                    🧸
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                    <Frown className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black font-display text-foreground tracking-tight">
                  Oops! No toys found for these filters
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
                  We couldn't find any products matching your specific selection. Try clearing some filters or loosening the price slider to discover exciting toys!
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <Button
                    onClick={handleResetAll}
                    className="rounded-full px-6 h-11 font-bold text-sm shadow-md gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              /* Products Grid or List */
              <div
                className={
                  viewMode === "list"
                    ? "flex flex-col gap-4"
                    : viewMode === "grid3"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode === "list" ? "list" : "grid"}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-between border-t border-border/60 pt-6 mt-8 flex-wrap gap-4">
                <span className="text-xs text-muted-foreground font-semibold">
                  Showing 1 to {filteredProducts.length} of {filteredProducts.length} toys
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="rounded-xl h-9 px-3 gap-1 text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-xl h-9 w-9 p-0 text-xs font-bold"
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="rounded-xl h-9 px-3 gap-1 text-xs"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
