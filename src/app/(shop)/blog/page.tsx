"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  ArrowRight,
  BookOpen,
  Search,
  User,
  Calendar,
  ChevronRight,
  Home,
  Tag,
  Frown,
  RotateCcw,
} from "lucide-react";
import { catalogService, ArticleItem } from "@/services/catalog.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlogListingPage() {
  const [articles, setArticles] = React.useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    let isMounted = true;
    async function fetchArticles() {
      setIsLoading(true);
      try {
        const res = await catalogService.getArticles();
        if (res.data?.articles && isMounted) {
          setArticles(res.data.articles);
        }
      } catch (err) {
        console.error("Failed to fetch blog articles:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute unique categories from articles
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [articles]);

  // Filtered articles based on search & category
  const filteredArticles = React.useMemo(() => {
    return articles.filter((a) => {
      if (selectedCategory !== "ALL" && a.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = a.title?.toLowerCase().includes(q);
        const matchesSummary = a.summary?.toLowerCase().includes(q);
        const matchesCategory = a.category?.toLowerCase().includes(q);
        const matchesAuthor = a.author?.toLowerCase().includes(q);
        return matchesTitle || matchesSummary || matchesCategory || matchesAuthor;
      }
      return true;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = articles.length > 0 ? articles[0] : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            className="hover:text-primary flex items-center gap-1 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            Little Moments Blog
          </span>
        </nav>

        {/* Hero Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-sky-500 via-sky-600 to-indigo-600 p-8 sm:p-12 text-white shadow-xl shadow-sky-500/10">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Little Moments Parenting &amp; Growth</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight leading-tight">
              শিশুর বিকাশ, প্যারেন্টিং ও আনন্দের গল্প
            </h1>
            <p className="text-sm sm:text-base text-sky-100 leading-relaxed font-medium">
              শিশুর সঠিক মানসিক ও শারীরিক বিকাশের কৌশল, শিক্ষণীয় খেলনা নির্বাচনের গাইডলাইন এবং ইতিবাচক প্যারেন্টিং টিপস নিয়ে সাজানো আমাদের ব্লগ।
            </p>
          </div>

          {/* Decorative Background Circles */}
          <div className="absolute -right-12 -bottom-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute right-20 -top-12 w-48 h-48 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("ALL")}
              type="button"
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === "ALL"
                  ? "bg-[#0EA5E9] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Articles ({articles.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                type="button"
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0EA5E9] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3 animate-pulse"
              >
                <div className="aspect-16/10 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/40 border-4 border-amber-300 dark:border-amber-700 flex items-center justify-center text-4xl mx-auto mb-4">
              📚
            </div>
            <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
              No articles found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto">
              {searchQuery
                ? `No articles match your search "${searchQuery}". Try a different keyword.`
                : "No articles are available in this category yet."}
            </p>
            <div className="mt-5">
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                }}
                className="rounded-full px-5 h-9 text-xs font-bold gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          /* Articles Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 hover:shadow-xl hover:-translate-y-1 hover:border-[#0EA5E9]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Article Thumbnail */}
                  <Link
                    href={`/blog/${article.slug}`}
                    className="block aspect-16/10 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative mb-4"
                  >
                    {article.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen className="w-10 h-10 opacity-30" />
                      </div>
                    )}
                    {/* Category pill on image */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 text-[#0284C7] dark:text-sky-300 backdrop-blur-md shadow-xs border border-white/40">
                        {article.category}
                      </span>
                    </div>
                  </Link>

                  {/* Metadata Row: Reading time & Date */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{article.readTime || "4 min read"}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-bengali text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#0EA5E9] transition-colors mb-2">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h2>

                  {/* Summary / Snippet */}
                  {article.summary && (
                    <p className="font-bengali text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                      {article.summary}
                    </p>
                  )}
                </div>

                {/* Footer: Author & Read Link */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                  {article.author ? (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-950 text-[#0284C7] dark:text-sky-300 flex items-center justify-center font-bold text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                        {article.author}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">KiddyBD Editorial</span>
                  )}

                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0EA5E9] hover:text-[#0284c7] group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
