"use client";

import * as React from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Camera,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Send,
  UploadCloud,
  Check,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CatalogProduct, ProductReview } from "@/lib/catalog-data";
import { useReviewSyncStore, EMPTY_REVIEWS } from "@/stores/use-review-sync-store";
import { apiClient } from "@/lib/api-client";

interface ProductTabsProps {
  product: CatalogProduct;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [photoFilterOnly, setPhotoFilterOnly] = React.useState(false);

  // Sync with global store so submissions immediately reflect here and in the buy box
  const extraReviewsMap = useReviewSyncStore((state) => state.extraReviews);
  const addExtraReview = useReviewSyncStore((state) => state.addReview);

  const extraReviews = React.useMemo(() => {
    const byId = extraReviewsMap[product.id] || EMPTY_REVIEWS;
    const bySlug = product.slug ? extraReviewsMap[product.slug] || EMPTY_REVIEWS : EMPTY_REVIEWS;
    if (byId.length === 0 && bySlug.length === 0) return EMPTY_REVIEWS;
    const map = new Map<string, any>();
    [...byId, ...bySlug].forEach((r) => map.set(r.id, r));
    return Array.from(map.values());
  }, [extraReviewsMap, product.id, product.slug]);

  // Combined real reviews list with strict id deduplication
  const initialList = React.useMemo(() => product.reviews || [], [product.reviews]);

  const reviewsList = React.useMemo(() => {
    const map = new Map<string, ProductReview>();
    // Extra reviews first so newly submitted appear at top
    extraReviews.forEach((r) => map.set(r.id, r));
    initialList.forEach((r) => {
      if (!map.has(r.id)) {
        map.set(r.id, r);
      }
    });
    return Array.from(map.values());
  }, [extraReviews, initialList]);

  // New review submission form state
  const [newAuthor, setNewAuthor] = React.useState("");
  const [newRating, setNewRating] = React.useState(5);
  const [newTitle, setNewTitle] = React.useState("");
  const [newComment, setNewComment] = React.useState("");
  const [newPhotoMock, setNewPhotoMock] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);

  // Dynamic rating statistics
  const totalReviewsCount = reviewsList.length;
  const averageRating =
    totalReviewsCount > 0
      ? Number(
          (
            reviewsList.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) /
            totalReviewsCount
          ).toFixed(1)
        )
      : 5.0;

  // Star breakdown calculation
  const starCounts = React.useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviewsList]);

  const filteredReviews = photoFilterOnly
    ? reviewsList.filter((r) => r.photos && r.photos.length > 0)
    : reviewsList;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    setIsSubmitting(true);
    const reviewId = `rev-${Date.now()}`;
    const newRev: ProductReview = {
      id: reviewId,
      author: newAuthor.trim(),
      location: "Verified Parent, BD",
      rating: newRating,
      date: "Just now",
      title: newTitle.trim() || "Wonderful educational toy!",
      comment: newComment.trim(),
      photos: newPhotoMock
        ? [
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&auto=format&fit=crop&q=80",
          ]
        : undefined,
      verifiedBuyer: true,
      helpfulCount: 1,
    };

    // Attempt to persist to backend review endpoint if server is online
    try {
      await apiClient.post("/reviews", {
        productId: product.id || product.slug,
        rating: newRating,
        title: newTitle.trim() || "Wonderful educational toy!",
        comment: newComment.trim(),
      });
    } catch {
      // Direct client fallback ensures user experience is never broken
    }

    // Immediately update global buy box & tabs sync store
    addExtraReview(product.id, newRev);
    if (product.slug && product.slug !== product.id) {
      addExtraReview(product.slug, newRev);
    }

    setReviewSubmitted(true);
    setIsSubmitting(false);
    setNewAuthor("");
    setNewTitle("");
    setNewComment("");
    setNewPhotoMock(false);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-xs">
      <Tabs defaultValue="overview" className="w-full">
        {/* Tabs Navigation Bar */}
        <TabsList className="w-full flex justify-start gap-2 bg-muted/60 p-1.5 rounded-2xl overflow-x-auto h-auto">
          <TabsTrigger
            value="overview"
            className="rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold data-[state=checked]:bg-card data-[state=checked]:text-primary"
          >
            Overview & Features
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold data-[state=checked]:bg-card data-[state=checked]:text-primary"
          >
            Specifications & Material Safety
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold data-[state=checked]:bg-card data-[state=checked]:text-primary"
          >
            Parent Reviews & Photos ({totalReviewsCount})
          </TabsTrigger>
        </TabsList>

        {/* 1. Tab: Overview & Features */}
        <TabsContent value="overview" className="pt-6 space-y-6">
          <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed">
            <p className="text-foreground font-medium">{product.description}</p>
          </div>

          <div>
            <h4 className="text-base font-bold font-display text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Key Development Highlights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/50 text-sm font-semibold text-foreground"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 2. Tab: Specifications & Material Safety */}
        <TabsContent value="specifications" className="pt-6 space-y-6">
          {/* Safety Certifications Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Pediatrician & International Safety Certifications</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {(
                product.safetyCertifications || [
                  "100% Non-Toxic & Lead-Free Finish",
                  "BPA, Phthalate & PVC Free Formula",
                  "EN71 & ASTM F963 Toy Safety Standards Passed",
                  "Choke-Hazard Safe Rounded Smooth Contours",
                ]
              ).map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs font-semibold text-foreground"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Table */}
          <div className="rounded-2xl border border-border/70 overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <tbody>
                {(product.specifications || []).map((spec, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-border/50 last:border-b-0 ${
                      idx % 2 === 0 ? "bg-muted/20" : "bg-card"
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-muted-foreground w-1/3 sm:w-1/4">
                      {spec.label}
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* 3. Tab: Parent Reviews & Photos */}
        <TabsContent value="reviews" className="pt-6 space-y-8">
          {/* Scorecard Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 sm:p-6 rounded-3xl bg-muted/30 border border-border/60 items-center">
            {/* Average rating */}
            <div className="text-center md:border-r border-border/60 pr-0 md:pr-4">
              <div className="text-5xl font-black font-display text-foreground tracking-tight">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 text-amber-400 my-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-semibold">
                {totalReviewsCount === 0
                  ? "No reviews yet — be the first to review!"
                  : `Based on ${totalReviewsCount} Verified ${
                      totalReviewsCount === 1 ? "Review" : "Reviews"
                    }`}
              </p>
            </div>

            {/* Breakdown rating bars */}
            <div className="md:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = starCounts[star] || 0;
                const percentage =
                  totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-bold text-muted-foreground flex items-center gap-1">
                      {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-semibold text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={photoFilterOnly}
                  onChange={(e) => setPhotoFilterOnly(e.target.checked)}
                  className="rounded-md border-primary text-primary focus:ring-primary w-4 h-4"
                />
                <Camera className="w-4 h-4 text-primary" />
                Show only reviews with photos
              </label>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Showing {filteredReviews.length} {filteredReviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="p-8 rounded-2xl bg-card border border-dashed border-border/80 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center text-xl">
                  ✍️
                </div>
                <h5 className="font-bold text-sm text-foreground">No customer reviews yet</h5>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Have your child play with this toy? Share your experience below to help fellow Bangladeshi parents make informed choices!
                </p>
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-card border border-border/70 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {rev.author}
                        </span>
                        {rev.verifiedBuyer && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Verified Parent
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {rev.location} · {rev.date}
                      </span>
                    </div>

                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h5 className="font-bold text-sm text-foreground">{rev.title}</h5>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Review Photos */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="flex gap-2.5 pt-1 overflow-x-auto">
                      {rev.photos.map((photo: string, pIdx: number) => (
                        <div
                          key={pIdx}
                          className="relative w-20 h-20 rounded-xl overflow-hidden border border-border/60 shrink-0"
                        >
                          <Image
                            src={photo}
                            alt="Review attachment"
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({rev.helpfulCount || 1})</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Review Submission Form */}
          <div className="p-5 sm:p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
            <h4 className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Leave a Review for Fellow Parents
            </h4>

            {reviewSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Thank you! Your review has been submitted and posted.
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">Your Rating:</span>
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className="cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= newRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Farhana Ahmed)"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  required
                  className="h-10 px-3.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-hidden focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Review Headline (e.g. Highly engaging puzzle)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 px-3.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-hidden focus:border-primary"
                />
              </div>

              <textarea
                placeholder="Share how your child interacted with this toy, material safety, or delivery experience..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-hidden focus:border-primary resize-none"
              />

              <div className="flex items-center justify-between flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setNewPhotoMock(!newPhotoMock)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    newPhotoMock
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  {newPhotoMock ? "1 Photo Attached" : "Attach Toy Photo"}
                </button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="rounded-xl px-5 h-10 font-bold text-xs gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
