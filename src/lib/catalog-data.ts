export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  photos?: string[];
  verifiedBuyer: boolean;
  helpfulCount: number;
}

export interface ProductVariantOption {
  label: string;
  colorHex?: string;
  priceModifier?: number;
  inStock?: boolean;
}

export interface ProductVariantGroup {
  name: string;
  options: ProductVariantOption[];
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  categorySlug: string;
  ageGroup: "0-12m" | "1-3y" | "3-5y" | "5-8y" | "8+";
  ageLabel: string;
  skills: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  isSpecialOffer: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  image: string;
  images?: string[];
  hasVideo?: boolean;
  videoUrl?: string;
  description: string;
  features: string[];
  safetyCertifications?: string[];
  specifications?: { label: string; value: string }[];
  variants?: ProductVariantGroup[];
  reviews?: ProductReview[];
}

export const MOCK_CATALOG_PRODUCTS: CatalogProduct[] = [];

export const AGE_GROUPS = [
  { id: "0-12m", label: "0-12 Months", subtitle: "Infants" },
  { id: "1-3y", label: "1-3 Years", subtitle: "Toddlers" },
  { id: "3-5y", label: "3-5 Years", subtitle: "Preschool" },
  { id: "5-8y", label: "5-8 Years", subtitle: "Early School" },
  { id: "8+", label: "8+ Years", subtitle: "Pre-teens" },
] as const;

export const SKILL_BENEFITS = [
  { id: "Cognitive & Problem Solving", label: "Cognitive & Problem Solving", icon: "Brain" },
  { id: "Motor Skills & Coordination", label: "Motor Skills & Coordination", icon: "Activity" },
  { id: "STEM & Science", label: "STEM & Science", icon: "Atom" },
  { id: "Language & Speech", label: "Language & Speech", icon: "MessageSquare" },
  { id: "Creativity & Art", label: "Creativity & Art", icon: "Palette" },
  { id: "Social & Emotional", label: "Social & Emotional", icon: "Heart" },
] as const;

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating_desc", label: "Top Rated" },
] as const;

export const SLUG_ALIASES: Record<string, string> = {
  "cute-teddy-backpack": "prod-1",
  "dinosaur-play-set": "prod-2",
  "kids-sneakers": "prod-6",
  "building-blocks": "prod-2",
  "building-blocks-deluxe": "prod-2",
  "ride-on-car": "prod-13",
  "baby-stroller": "prod-8",
  "kids-smart-watch": "prod-14",
  "plush-bunny": "prod-1",
  "girls-floral-dress": "prod-10",
};

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  let prod = MOCK_CATALOG_PRODUCTS.find((p) => p.slug === slug);
  if (!prod && SLUG_ALIASES[slug]) {
    prod = MOCK_CATALOG_PRODUCTS.find((p) => p.id === SLUG_ALIASES[slug]);
  }
  if (!prod) {
    // If slug still not matched, check if any product slug contains the string
    prod = MOCK_CATALOG_PRODUCTS.find((p) => p.slug.includes(slug) || slug.includes(p.slug));
  }
  if (!prod) return undefined;

  // Enrich with gallery images, reviews, specs, and variants if not already present
  const images = prod.images || [
    prod.image,
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80",
  ];

  const variants: ProductVariantGroup[] = prod.variants || [
    {
      name: "Edition / Color",
      options: [
        { label: "Classic Pastel", colorHex: "#FFB5A7", priceModifier: 0, inStock: true },
        { label: "Vibrant Rainbow", colorHex: "#70D6FF", priceModifier: 150, inStock: true },
        { label: "Natural Timber", colorHex: "#E7CBA9", priceModifier: 0, inStock: true },
      ],
    },
    {
      name: "Package Size",
      options: [
        { label: "Starter Set", priceModifier: 0, inStock: true },
        { label: "Deluxe Explorer (+50%)", priceModifier: 650, inStock: true },
      ],
    },
  ];

  const safetyCertifications = prod.safetyCertifications || [
    "Certified 100% Non-Toxic & Lead-Free",
    "BPA, Phthalate & PVC Free",
    "EN71 & ASTM F963 International Toy Safety Certified",
    "Smooth Rounded Anti-Choke Edges",
  ];

  const specifications = prod.specifications || [
    { label: "Brand", value: prod.brand },
    { label: "Department", value: prod.category },
    { label: "Target Age Range", value: prod.ageLabel },
    { label: "Primary Material", value: "FSC Certified Sustainable Beechwood & Food-Grade Silicone" },
    { label: "Weight", value: "650 grams" },
    { label: "Box Dimensions", value: "28cm × 18cm × 10cm" },
    { label: "Country of Origin", value: "Imported (Designed in EU)" },
    { label: "Cleaning Instructions", value: "Wipe with damp cloth and mild baby soap. Do not submerge solid wood." },
  ];

  const reviews: ProductReview[] = prod.reviews || [];

  return {
    ...prod,
    images,
    variants,
    safetyCertifications,
    specifications,
    reviews,
    stockCount: prod.stockCount ?? 4,
    hasVideo: true,
  };
}

export function getRelatedProducts(currentId: string, limit = 4): CatalogProduct[] {
  return [];
}

export function getMoreForAge(ageGroup: string, currentId: string, limit = 4): CatalogProduct[] {
  return [];
}

