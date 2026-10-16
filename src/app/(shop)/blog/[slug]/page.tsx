import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, ArrowLeft, Calendar, User } from "lucide-react";
import { catalogService } from "@/services/catalog.service";
import { notFound } from "next/navigation";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await catalogService.getArticleBySlug(slug);
    if (res.data?.article) {
      return {
        title: `${res.data.article.title} | KiddyBD Blog`,
        description:
          res.data.article.summary || "Parenting & Child Growth Articles",
      };
    }
  } catch {
    // fallback
  }

  return {
    title: "Article | KiddyBD Blog",
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;

  let article;
  try {
    const res = await catalogService.getArticleBySlug(slug);
    article = res.data?.article;
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Category Badge & Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs font-bold bg-[#FF3E78]/10 text-[#FF3E78] dark:bg-rose-950/60 dark:text-rose-300 px-3 py-1 rounded-full">
            {article.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Article Title */}
        <h1 className="font-bengali text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-tight mb-6">
          {article.title}
        </h1>

        {/* Author */}
        {article.author && (
          <div className="flex items-center gap-2 mb-8 pb-6 border-b border-border">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{article.author}</p>
              <p className="text-[11px] text-muted-foreground">Childhood &amp; Parenting Contributor</p>
            </div>
          </div>
        )}

        {/* Cover Image */}
        {article.image && (
          <div className="aspect-16/10 w-full rounded-3xl overflow-hidden mb-8 border border-border/80 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Summary Lead */}
        {article.summary && (
          <div className="font-bengali text-base sm:text-lg font-medium text-foreground/90 bg-muted/30 p-5 rounded-2xl border-l-4 border-primary mb-8 leading-relaxed">
            {article.summary}
          </div>
        )}

        {/* Full Content */}
        {article.content ? (
          <div className="font-bengali prose dark:prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
            {article.content}
          </div>
        ) : (
          <p className="font-bengali text-sm text-muted-foreground italic">
            Full content coming soon. Stay tuned for expert advice and tips!
          </p>
        )}
      </div>
    </article>
  );
}
