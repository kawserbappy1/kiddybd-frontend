"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { catalogService, ArticleItem } from "@/services/catalog.service";

export function FamilyMomentsBlogGrid() {
  const [articles, setArticles] = React.useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchArticles() {
      try {
        const res = await catalogService.getArticles();
        if (res.data?.articles && isMounted) {
          setArticles(res.data.articles);
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
        <div className="h-5 w-40 bg-muted animate-pulse rounded mb-2" />
        <div className="h-7 w-60 bg-muted animate-pulse rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted/30 border border-border/50 rounded-3xl p-4 h-64 animate-pulse flex flex-col justify-between"
            >
              <div className="aspect-16/10 w-full rounded-2xl bg-muted/60" />
              <div className="h-4 w-3/4 bg-muted/60 rounded mt-3" />
              <div className="h-3 w-1/2 bg-muted/60 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // If admin has not created any articles yet, render nothing so no static dummy content shows
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF3E78] dark:text-rose-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Parenting &amp; Child Growth</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Family Moments &amp; Articles</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-[#FF3E78] dark:bg-rose-950/60 dark:text-rose-300 font-bold border border-rose-200/80 dark:border-rose-900">
              {articles.length}
            </span>
          </h2>
          <p className="font-bengali text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
            শিশুর বিকাশ ও প্যারেন্টিং সংক্রান্ত তথ্যবহুল আর্টিকেলে নজর রাখুন
          </p>
        </div>
        <Link
          href="/blog"
          className="text-xs font-bold text-[#0EA5E9] hover:underline flex items-center gap-1 group"
        >
          <span>View All Articles</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 hover:shadow-xl hover:-translate-y-1 hover:border-[#0EA5E9]/40 transition-all duration-300 flex flex-col"
          >
            {/* Image */}
            <div className="aspect-16/10 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative mb-3.5">
              {article.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-rose-400" />
                </div>
              )}
              <span className="absolute top-3 left-3 text-[10px] font-bold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-full shadow-xs">
                {article.category}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between space-y-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </div>

                <Link href={`/blog/${article.slug}`}>
                  <h3 className="font-bengali text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#0EA5E9] transition-colors leading-snug">
                    {article.title}
                  </h3>
                </Link>

                {article.summary && (
                  <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-xs font-bold text-[#0EA5E9] group-hover:text-[#FF3E78] transition-colors inline-flex items-center gap-1"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
