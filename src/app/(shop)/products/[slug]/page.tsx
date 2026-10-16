import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  type CatalogProduct,
} from "@/lib/catalog-data";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductBuyBox } from "@/components/products/product-buy-box";
import { ProductTabs } from "@/components/products/product-tabs";
import { ProductRecommendations } from "@/components/products/product-recommendations";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";


function mapDbProductToCatalog(p: any): any {
  const v = p.variants?.[0];
  const mediaList = p.media || [];
  
  // Separate images and video from media
  const imageMedia = mediaList.filter((x: any) => x.type === "IMAGE" || !x.type);
  const videoMedia = mediaList.find((x: any) => x.type === "VIDEO");

  const images = imageMedia.map((x: any) => x.url).filter(Boolean);
  const primaryImg =
    imageMedia.find((x: any) => x.isPrimary)?.url ||
    images[0] ||
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80";

  const videoUrl = videoMedia?.url || undefined;
  const hasVideo = Boolean(videoUrl);

  const rawReviews = Array.isArray(p.reviews) ? p.reviews : [];
  const mappedReviews = rawReviews.map((r: any) => ({
    id: r.id,
    author: r.customer?.name || "Verified Parent",
    location: "Verified Parent, BD",
    rating: Number(r.rating) || 5,
    date: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Recent",
    title: r.title || "Wonderful toy!",
    comment: r.comment || "",
    photos: Array.isArray(r.media) ? r.media.map((m: any) => m.url).filter(Boolean) : undefined,
    verifiedBuyer: Boolean(r.verifiedPurchase ?? true),
    helpfulCount: 1,
  }));

  const dynamicReviewCount = mappedReviews.length;
  const dynamicRating =
    dynamicReviewCount > 0
      ? Number(
          (
            mappedReviews.reduce((sum: number, rev: any) => sum + (Number(rev.rating) || 5), 0) /
            dynamicReviewCount
          ).toFixed(1)
        )
      : 5.0;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand?.name || "KiddyBD",
    category: p.category?.name || "Toys & Games",
    categorySlug: p.category?.slug || "toys-games",
    ageGroup: "3-5y",
    ageLabel: p.recommendedAge || "3+ Years",
    skills: ["Creativity", "Montessori & Problem Solving"],
    price: Number(v?.price || 990),
    originalPrice: v?.discountPrice ? Number(v.discountPrice) : undefined,
    rating: dynamicRating,
    reviewCount: dynamicReviewCount,
    reviews: mappedReviews,
    inStock: (v?.inventory?.quantity ?? 10) > 0,
    stockCount: v?.inventory?.quantity ?? 10,
    isSpecialOffer: Boolean(v?.discountPrice),
    image: primaryImg,
    images: images.length > 0 ? images : [primaryImg],
    hasVideo,
    videoUrl,
    description: p.description || p.shortDescription || "Safe, non-toxic child educational toy.",
    features: [
      p.material || "Certified Non-Toxic Material",
      p.origin || "Bangladesh",
      p.recommendedAge || "3+ Years",
    ],
  };
}

async function getDbProducts(): Promise<any[]> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kiddybd-backend.onrender.com/api/v1";
    const res = await fetch(`${backendUrl}/products`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const list = data.data?.products;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(mapDbProductToCatalog);
      }
    }
  } catch {}
  return [];
}

async function resolveProduct(slug: string): Promise<any> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kiddybd-backend.onrender.com/api/v1";
    const res = await fetch(`${backendUrl}/products/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const p = data.data?.product;
      if (p) {
        return mapDbProductToCatalog(p);
      }
    }
  } catch {}

  return undefined;
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | KiddyBD",
    };
  }

  return {
    title: `${product.name} — ৳${product.price.toLocaleString()} | KiddyBD`,
    description: `${product.description} Ideal for ${product.ageLabel}. Certified non-toxic child-safe toys delivered nationwide.`,
    openGraph: {
      title: `${product.name} | KiddyBD`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/40 border-4 border-amber-300 dark:border-amber-700/50 flex items-center justify-center text-4xl shadow-inner">
          🧸
        </div>
        <h1 className="text-2xl font-black font-display text-foreground tracking-tight">
          Product Not Found
        </h1>
        <p className="text-sm text-muted-foreground max-w-md">
          We couldn&apos;t find this toy. It may have been relocated or updated in our catalog.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/90 transition-all mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Product Catalog
        </Link>
      </div>
    );
  }

  // Recommendations: Load strictly from real database products
  const dbProducts = await getDbProducts();
  const dbRecommendations = dbProducts.filter(
    (p) => p.slug !== product.slug && p.id !== product.id
  );

  let relatedProducts: any[] = [];
  let moreForAgeProducts: any[] = [];

  if (dbRecommendations.length > 0) {
    // Zero mock demo products: display only actual products created in database
    relatedProducts = dbRecommendations.slice(0, 4);
    moreForAgeProducts = dbRecommendations.length > 4 ? dbRecommendations.slice(4, 8) : [];
  } else {
    relatedProducts = [];
    moreForAgeProducts = [];
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // JSON-LD Structured Data Schema for Google Rich Snippets
  const jsonLdProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images || [product.image],
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `https://kiddybd.com/products/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "KiddyBD",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kiddybd.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://kiddybd.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `https://kiddybd.com/products?category=${encodeURIComponent(product.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://kiddybd.com/products/${product.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-10">
      {/* Google Rich Snippets JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto py-1"
        >
          <Link
            href="/"
            className="hover:text-primary transition-colors flex items-center gap-1 shrink-0"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            href="/products"
            className="hover:text-primary transition-colors shrink-0"
          >
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-primary transition-colors shrink-0"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Top 2-Column Section: Gallery (Left) & Buy Box (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images || [product.image]}
              productName={product.name}
              ageLabel={product.ageLabel}
              hasVideo={product.hasVideo}
              videoUrl={product.videoUrl}
              discountPercent={discountPercent}
            />
          </div>

          <div className="lg:col-span-5">
            <ProductBuyBox product={product} />
          </div>
        </div>

        {/* Tabbed Product Specifications & Parent Reviews */}
        <ProductTabs product={product} />

        {/* Related & Recommended Products Shelf - strictly from database */}
        {(relatedProducts.length > 0 || moreForAgeProducts.length > 0) && (
          <ProductRecommendations
            relatedProducts={relatedProducts}
            moreForAgeProducts={moreForAgeProducts}
            ageLabel={product.ageLabel}
          />
        )}
      </div>
    </div>
  );
}
