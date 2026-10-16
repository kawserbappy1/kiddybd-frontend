import * as React from "react";
import { Metadata } from "next";
import { CatalogContent } from "@/components/products/catalog-content";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Shop Toys & Learning Kits | KiddyBD",
  description:
    "Explore educational toys, Montessori sets, baby care gear, and STEM kits sorted by child age and developmental skills.",
};

function CatalogSkeleton() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3 border-b border-border/60 pb-6">
          <Skeleton className="h-4 w-40 rounded-lg" />
          <Skeleton className="h-10 w-96 rounded-xl" />
          <Skeleton className="h-5 w-2/3 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Skeleton className="hidden lg:block h-[600px] rounded-3xl" />
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-16 w-full rounded-3xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-3/4 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent />
    </React.Suspense>
  );
}
