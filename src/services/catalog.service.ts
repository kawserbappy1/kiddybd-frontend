import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface AgeGroup {
  id: string;
  rangeLabel: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface ProductAgeGroup {
  productId: string;
  ageGroupId: string;
  ageGroup: AgeGroup;
}

export interface ProductSkill {
  productId: string;
  skillId: string;
  skill: Skill;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  price: number | string;
  discountPrice?: number | string | null;
  isActive: boolean;
  inventory?: {
    quantity: number;
    reservedQuantity: number;
  };
}

export interface ProductMedia {
  id: string;
  url: string;
  type: string;
  isPrimary: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  brandId?: string | null;
  status: "ACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED";
  material: string;
  origin: string;
  recommendedAge: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
  category?: Category;
  brand?: Brand | null;
  ageGroups?: ProductAgeGroup[];
  skills?: ProductSkill[];
  variants: ProductVariant[];
  media: ProductMedia[];
  reviews?: Array<{ rating: number | string }>;
}

export interface ProductListResponse {
  products: ProductItem[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  categoryId: string;
  brandId?: string;
  status?: "ACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED";
  material?: string;
  origin?: string;
  recommendedAge?: string;
  ageGroupIds?: string[];
  skillIds?: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  price: number;
  discountPrice?: number;
  quantity: number;
  imageUrl?: string;
  images?: string[];
  videoUrl?: string;
  sku?: string;
}

export interface UpdateProductPayload {
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  brandId?: string;
  status?: "ACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED";
  material?: string;
  origin?: string;
  recommendedAge?: string;
  ageGroupIds?: string[];
  skillIds?: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  price?: number;
  discountPrice?: number;
  quantity?: number;
  imageUrl?: string;
  images?: string[];
  videoUrl?: string;
}

export const catalogService = {
  // 1. List Products
  async listProducts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    categoryId?: string;
    brandId?: string;
    ageGroupId?: string;
    ageGroup?: string;
    skillId?: string;
    skill?: string;
    search?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
  }): Promise<ApiResponse<ProductListResponse>> {
    const res = await apiClient.get<ApiResponse<ProductListResponse>>("/products", {
      params,
    });
    return res.data;
  },

  // Age Groups & Skills
  async getAgeGroups(): Promise<ApiResponse<{ ageGroups: AgeGroup[] }>> {
    const res = await apiClient.get<ApiResponse<{ ageGroups: AgeGroup[] }>>("/age-groups");
    return res.data;
  },

  async createAgeGroup(payload: { rangeLabel: string }): Promise<ApiResponse<{ ageGroup: AgeGroup }>> {
    const res = await apiClient.post<ApiResponse<{ ageGroup: AgeGroup }>>("/admin/age-groups", payload);
    return res.data;
  },

  async getSkills(): Promise<ApiResponse<{ skills: Skill[] }>> {
    const res = await apiClient.get<ApiResponse<{ skills: Skill[] }>>("/skills");
    return res.data;
  },

  async createSkill(payload: { name: string }): Promise<ApiResponse<{ skill: Skill }>> {
    const res = await apiClient.post<ApiResponse<{ skill: Skill }>>("/admin/skills", payload);
    return res.data;
  },

  // 2. Get Product By Id
  async getProductById(id: string): Promise<ApiResponse<{ product: ProductItem }>> {
    const res = await apiClient.get<ApiResponse<{ product: ProductItem }>>(
      `/admin/products/${id}`
    );
    return res.data;
  },

  // 3. Create Product
  async createProduct(
    payload: CreateProductPayload
  ): Promise<ApiResponse<{ product: ProductItem }>> {
    const res = await apiClient.post<ApiResponse<{ product: ProductItem }>>(
      "/admin/products",
      payload
    );
    return res.data;
  },

  // 4. Update Product
  async updateProduct(
    id: string,
    payload: UpdateProductPayload
  ): Promise<ApiResponse<{ product: ProductItem }>> {
    const res = await apiClient.patch<ApiResponse<{ product: ProductItem }>>(
      `/admin/products/${id}`,
      payload
    );
    return res.data;
  },

  // 5. Delete Product
  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    const res = await apiClient.delete<ApiResponse<null>>(`/admin/products/${id}`);
    return res.data;
  },

  // 6. Get Categories & Brands
  async getCategories(): Promise<ApiResponse<{ categories: (Category & { _count?: { products: number } })[] }>> {
    const res = await apiClient.get<ApiResponse<{ categories: (Category & { _count?: { products: number } })[] }>>("/categories");
    return res.data;
  },

  async createCategory(payload: {
    name: string;
    slug?: string;
  }): Promise<ApiResponse<{ category: Category }>> {
    const res = await apiClient.post<ApiResponse<{ category: Category }>>(
      "/admin/categories",
      payload
    );
    return res.data;
  },

  async updateCategory(
    id: string,
    payload: { name: string; slug?: string }
  ): Promise<ApiResponse<{ category: Category }>> {
    const res = await apiClient.patch<ApiResponse<{ category: Category }>>(
      `/admin/categories/${id}`,
      payload
    );
    return res.data;
  },

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    const res = await apiClient.delete<ApiResponse<null>>(`/admin/categories/${id}`);
    return res.data;
  },

  async getBrands(): Promise<ApiResponse<{ brands: (Brand & { _count?: { products: number } })[] }>> {
    const res = await apiClient.get<ApiResponse<{ brands: (Brand & { _count?: { products: number } })[] }>>("/brands");
    return res.data;
  },

  async createBrand(payload: {
    name: string;
    slug?: string;
  }): Promise<ApiResponse<{ brand: Brand }>> {
    const res = await apiClient.post<ApiResponse<{ brand: Brand }>>(
      "/admin/brands",
      payload
    );
    return res.data;
  },

  async updateBrand(
    id: string,
    payload: { name: string; slug?: string }
  ): Promise<ApiResponse<{ brand: Brand }>> {
    const res = await apiClient.patch<ApiResponse<{ brand: Brand }>>(
      `/admin/brands/${id}`,
      payload
    );
    return res.data;
  },

  async deleteBrand(id: string): Promise<ApiResponse<null>> {
    const res = await apiClient.delete<ApiResponse<null>>(`/admin/brands/${id}`);
    return res.data;
  },

  // 7. Image Upload via Multer & Cloudinary
  async uploadImage(
    file: File,
    folder: "products" | "avatars" = "products"
  ): Promise<ApiResponse<{ url: string; publicId?: string }>> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<ApiResponse<{ url: string; publicId?: string }>>(
      `/upload?folder=${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },

  // 8. Articles & Blog Management
  async getArticles(all: boolean = false): Promise<ApiResponse<{ articles: ArticleItem[] }>> {
    const res = await apiClient.get<ApiResponse<{ articles: ArticleItem[] }>>(
      `/articles${all ? "?all=true" : ""}`
    );
    return res.data;
  },

  async getArticleBySlug(slug: string): Promise<ApiResponse<{ article: ArticleItem }>> {
    const res = await apiClient.get<ApiResponse<{ article: ArticleItem }>>(`/articles/${slug}`);
    return res.data;
  },

  async createArticle(payload: {
    title: string;
    slug?: string;
    summary?: string;
    content?: string;
    image?: string;
    category?: string;
    readTime?: string;
    isPublished?: boolean;
    author?: string;
  }): Promise<ApiResponse<{ article: ArticleItem }>> {
    const res = await apiClient.post<ApiResponse<{ article: ArticleItem }>>(
      "/admin/articles",
      payload
    );
    return res.data;
  },

  async updateArticle(
    id: string,
    payload: Partial<{
      title: string;
      slug: string;
      summary: string;
      content: string;
      image: string;
      category: string;
      readTime: string;
      isPublished: boolean;
      author: string;
    }>
  ): Promise<ApiResponse<{ article: ArticleItem }>> {
    const res = await apiClient.patch<ApiResponse<{ article: ArticleItem }>>(
      `/admin/articles/${id}`,
      payload
    );
    return res.data;
  },

  async deleteArticle(id: string): Promise<ApiResponse<null>> {
    const res = await apiClient.delete<ApiResponse<null>>(`/admin/articles/${id}`);
    return res.data;
  },
};

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  image?: string | null;
  category: string;
  readTime: string;
  isPublished: boolean;
  author?: string | null;
  createdAt: string;
  updatedAt: string;
}

