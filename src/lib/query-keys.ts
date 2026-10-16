export const queryKeys = {
  // Auth & Profile
  auth: {
    me: ["auth", "me"] as const,
  },
  // Products & Catalog
  products: {
    all: ["products"] as const,
    list: (filters: Record<string, unknown>) => ["products", "list", filters] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
    featured: ["products", "featured"] as const,
    newArrivals: ["products", "new-arrivals"] as const,
    search: (query: string) => ["products", "search", query] as const,
  },
  // Taxonomy
  categories: {
    all: ["categories"] as const,
    tree: ["categories", "tree"] as const,
  },
  brands: {
    all: ["brands"] as const,
  },
  ageGroups: {
    all: ["age-groups"] as const,
  },
  skills: {
    all: ["skills"] as const,
  },
  // Cart & Wishlist
  cart: {
    current: ["cart"] as const,
  },
  wishlist: {
    current: ["wishlist"] as const,
  },
  // Orders & Tracking
  orders: {
    all: ["orders"] as const,
    list: (page: number) => ["orders", "list", page] as const,
    detail: (orderNumber: string) => ["orders", "detail", orderNumber] as const,
    track: (orderNumber: string) => ["orders", "track", orderNumber] as const,
  },
  // Addresses
  addresses: {
    all: ["addresses"] as const,
  },
  // Reviews
  reviews: {
    byProduct: (productId: string) => ["reviews", "product", productId] as const,
  },
} as const;
