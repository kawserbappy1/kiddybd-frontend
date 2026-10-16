"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Boxes,
  Tag,
  Loader2,
  Image as ImageIcon,
  Upload,
  Link2,
  Video,
  Film,
  X,
} from "lucide-react";
import {
  catalogService,
  type ProductItem,
  type Category,
  type Brand,
  type AgeGroup,
  type Skill,
  type CreateProductPayload,
  type UpdateProductPayload,
} from "@/services/catalog.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<ProductItem[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [ageGroups, setAgeGroups] = React.useState<AgeGroup[]>([]);
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  // Modal states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<ProductItem | null>(null);
  const [deletingProduct, setDeletingProduct] = React.useState<ProductItem | null>(null);
  const [imageSourceMode, setImageSourceMode] = React.useState<"UPLOAD" | "URL">("UPLOAD");
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  // Form Fields
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    categoryId: "",
    brandId: "",
    price: 990,
    discountPrice: 0,
    quantity: 25,
    sku: "",
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
    images: [] as string[],
    additionalImageUrl: "",
    videoUrl: "",
    description: "",
    material: "Non-Toxic ABS Plastic & Natural Wood",
    origin: "Bangladesh",
    recommendedAge: "3+ Years",
    ageGroupIds: [] as string[],
    skillIds: [] as string[],
    status: "ACTIVE" as "ACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED",
    isFeatured: false,
    isBestSeller: false,
  });

  // Load initial data
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes, bRes, agRes, skRes] = await Promise.all([
        catalogService.listProducts({
          status: statusFilter === "ALL" ? undefined : statusFilter,
          search: searchTerm || undefined,
          limit: 100,
        }),
        catalogService.getCategories(),
        catalogService.getBrands(),
        catalogService.getAgeGroups(),
        catalogService.getSkills(),
      ]);

      if (pRes.data?.products) {
        setProducts(pRes.data.products);
      }
      if (cRes.data?.categories) {
        setCategories(cRes.data.categories);
        if (!formData.categoryId && cRes.data.categories.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: cRes.data.categories[0].id }));
        }
      }
      if (bRes.data?.brands) {
        setBrands(bRes.data.brands);
      }
      if (agRes.data?.ageGroups) {
        setAgeGroups(agRes.data.ageGroups);
      }
      if (skRes.data?.skills) {
        setSkills(skRes.data.skills);
      }
    } catch (err) {
      toast.error("Failed to load products from database");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchTerm]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      categoryId: categories[0]?.id || "",
      brandId: brands[0]?.id || "",
      price: 1250,
      discountPrice: 0,
      quantity: 30,
      sku: "",
      imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      images: [],
      additionalImageUrl: "",
      videoUrl: "",
      description: "Montessori inspired child educational toy made with certified eco-friendly materials.",
      material: "Non-Toxic Natural Wood",
      origin: "Bangladesh",
      recommendedAge: "3+ Years",
      ageGroupIds: ageGroups[2]?.id ? [ageGroups[2].id] : [],
      skillIds: skills.slice(0, 2).map((s) => s.id),
      status: "ACTIVE",
      isFeatured: false,
      isBestSeller: false,
    });
    setIsFormOpen(true);
  };

  // Image Upload handler (Multer + Cloudinary)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setIsUploadingImage(true);
    const toastId = toast.loading("Uploading image to Cloudinary via backend...");
    try {
      const res = await catalogService.uploadImage(file, "products");
      if (res.data?.url) {
        if (isGallery) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, res.data.url],
          }));
          toast.success("Additional image added to gallery!", { id: toastId });
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
          toast.success("Primary image uploaded successfully!", { id: toastId });
        }
      } else {
        toast.error("Failed to upload image", { id: toastId });
      }
    } catch {
      toast.error("Image upload failed. Please try again.", { id: toastId });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct(product);
    const primaryVariant = product.variants?.[0];
    const mediaList = product.media || [];
    const imageMedia = mediaList.filter((m) => m.type === "IMAGE" || !m.type);
    const videoMedia = mediaList.find((m) => m.type === "VIDEO");

    const primaryImg = imageMedia.find((m) => m.isPrimary)?.url || imageMedia[0]?.url || "";
    const secondaryImages = imageMedia
      .map((m) => m.url)
      .filter((u) => u && u !== primaryImg);

    setFormData({
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId,
      brandId: product.brandId || "",
      price: primaryVariant ? Number(primaryVariant.price) : 0,
      discountPrice: primaryVariant?.discountPrice ? Number(primaryVariant.discountPrice) : 0,
      quantity: primaryVariant?.inventory?.quantity ?? 10,
      sku: primaryVariant?.sku || "",
      imageUrl: primaryImg,
      images: secondaryImages,
      additionalImageUrl: "",
      videoUrl: videoMedia?.url || "",
      description: product.description,
      material: product.material,
      origin: product.origin,
      recommendedAge: product.recommendedAge,
      ageGroupIds: product.ageGroups?.map((ag) => ag.ageGroupId) || [],
      skillIds: product.skills?.map((s) => s.skillId) || [],
      status: product.status,
      isFeatured: Boolean(product.isFeatured),
      isBestSeller: Boolean(product.isBestSeller),
    });
    setIsFormOpen(true);
  };

  // Submit Create or Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    const compiledImages: string[] = [];
    if (formData.imageUrl.trim()) {
      compiledImages.push(formData.imageUrl.trim());
    }
    formData.images.forEach((img) => {
      if (img.trim() && !compiledImages.includes(img.trim())) {
        compiledImages.push(img.trim());
      }
    });

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // UPDATE
        const updatePayload: UpdateProductPayload = {
          name: formData.name,
          slug: formData.slug || undefined,
          categoryId: formData.categoryId,
          brandId: formData.brandId || undefined,
          price: Number(formData.price),
          discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
          quantity: Number(formData.quantity),
          imageUrl: formData.imageUrl,
          images: compiledImages,
          videoUrl: formData.videoUrl.trim() || undefined,
          description: formData.description,
          material: formData.material,
          origin: formData.origin,
          recommendedAge: formData.recommendedAge,
          ageGroupIds: formData.ageGroupIds,
          skillIds: formData.skillIds,
          status: formData.status,
          isFeatured: formData.isFeatured,
          isBestSeller: formData.isBestSeller,
        };

        const res = await catalogService.updateProduct(editingProduct.id, updatePayload);
        if (res.success) {
          toast.success(`Product "${formData.name}" updated successfully!`);
          setIsFormOpen(false);
          loadData();
        } else {
          toast.error(res.message || "Failed to update product");
        }
      } else {
        // CREATE
        const createPayload: CreateProductPayload = {
          name: formData.name,
          slug: formData.slug || undefined,
          categoryId: formData.categoryId,
          brandId: formData.brandId || undefined,
          price: Number(formData.price),
          discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
          quantity: Number(formData.quantity),
          sku: formData.sku || undefined,
          imageUrl: formData.imageUrl,
          images: compiledImages,
          videoUrl: formData.videoUrl.trim() || undefined,
          description: formData.description,
          material: formData.material,
          origin: formData.origin,
          recommendedAge: formData.recommendedAge,
          ageGroupIds: formData.ageGroupIds,
          skillIds: formData.skillIds,
          status: formData.status,
          isFeatured: formData.isFeatured,
          isBestSeller: formData.isBestSeller,
        };

        const res = await catalogService.createProduct(createPayload);
        if (res.success) {
          toast.success(`Product "${formData.name}" added to database and live storefront!`);
          setIsFormOpen(false);
          loadData();
        } else {
          toast.error(res.message || "Failed to create product");
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (product: ProductItem) => {
    setDeletingProduct(product);
    setIsDeletingOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsSubmitting(true);
    try {
      const res = await catalogService.deleteProduct(deletingProduct.id);
      if (res.success) {
        toast.success(res.message || `Deleted product "${deletingProduct.name}" from database.`);
        setIsDeletingOpen(false);
        setDeletingProduct(null);
        loadData();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to delete product from database";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Products Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add new products to your store, manage pricing, and execute real-time updates to database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData()}
            className="h-9 gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-9 gap-1.5 text-xs shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="rounded-xl border border-border shadow-2xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title, description..."
              className="pl-9 h-9 text-xs bg-muted/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-hidden"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="DRAFT">Draft</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="rounded-xl border border-border shadow-2xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                All Products ({products.length})
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Directly connected to PostgreSQL Database & KiddyBD Storefront
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-xs">Fetching catalog from database...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Package className="h-12 w-12 stroke-1 mb-3 text-muted-foreground/60" />
              <h3 className="text-sm font-semibold text-foreground">No Products Found</h3>
              <p className="text-xs max-w-sm mt-1">
                Your database does not have any products yet. Click &quot;Add New Product&quot; to add your first item!
              </p>
              <Button size="sm" onClick={handleOpenCreate} className="mt-4 gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Product Now
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-y border-border bg-muted/40 text-muted-foreground font-medium uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Product</th>
                    <th className="py-2.5 px-4 font-semibold">Category</th>
                    <th className="py-2.5 px-4 font-semibold">Price</th>
                    <th className="py-2.5 px-4 font-semibold">Stock</th>
                    <th className="py-2.5 px-4 font-semibold">Badges</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {products.map((item) => {
                    const variant = item.variants?.[0];
                    const media = item.media?.[0];
                    const stock = variant?.inventory?.quantity ?? 0;

                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        {/* Product Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                              {media?.url ? (
                                <img
                                  src={media.url}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                  <ImageIcon className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-foreground truncate max-w-xs sm:max-w-sm">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                                <span className="font-mono">{variant?.sku || "NO-SKU"}</span>
                                <span>•</span>
                                <span>{item.recommendedAge}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[11px] font-normal">
                            {item.category?.name || "General"}
                          </Badge>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground">
                            ৳{Number(variant?.price || 0).toLocaleString()}
                          </div>
                          {variant?.discountPrice && (
                            <div className="text-[10px] text-muted-foreground line-through">
                              ৳{Number(variant.discountPrice).toLocaleString()}
                            </div>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              stock <= 5 ? "text-rose-600 dark:text-rose-400" : "text-foreground"
                            }`}
                          >
                            {stock} units
                          </span>
                        </td>

                        {/* Badges */}
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[160px]">
                            {item.isFeatured && (
                              <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                ⭐ Featured
                              </span>
                            )}
                            {item.isBestSeller && (
                              <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                                🔥 Best Seller
                              </span>
                            )}
                            {variant?.discountPrice && (
                              <span className="text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded">
                                🏷️ Deal
                              </span>
                            )}
                            {!item.isFeatured && !item.isBestSeller && !variant?.discountPrice && (
                              <span className="text-[10px] text-muted-foreground">Standard</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-semibold ${
                              item.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : item.status === "OUT_OF_STOCK"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </td>

                        {/* Actions: Edit & Delete */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(item)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              title="Edit Product"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDelete(item)}
                              className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                              title="Delete Product"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE & EDIT PRODUCT MODAL */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editingProduct
                ? "Update product specifications, price or inventory in database."
                : "Enter product details. This will be automatically published to the store."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 py-2">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Product Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Montessori Geometric Wooden Blocks"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Slug (Auto-generated if empty)
                </label>
                <Input
                  placeholder="e.g. montessori-wooden-blocks"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Category *
                  </label>
                  <Link
                    href="/admin/categories"
                    target="_blank"
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    + Manage Categories
                  </Link>
                </div>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-hidden"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Brand (Optional)
                  </label>
                  <Link
                    href="/admin/brands"
                    target="_blank"
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    + Manage Brands
                  </Link>
                </div>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-hidden"
                >
                  <option value="">No Brand (Generic / In-house)</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price, Discount & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Price (৳) *
                </label>
                <Input
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Original / Strikethrough Price (৳)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={formData.discountPrice || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPrice: e.target.value ? Number(e.target.value) : 0,
                    })
                  }
                  placeholder="Optional"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Available Quantity (Stock) *
                </label>
                <Input
                  type="number"
                  required
                  min={0}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Product Image: Dual Option (Upload File via Multer/Cloudinary OR Image URL) */}
            <div className="space-y-2 p-3 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-primary" />
                  Primary Product Picture *
                </label>
                <div className="flex items-center p-0.5 rounded-lg border border-border bg-background">
                  <button
                    type="button"
                    onClick={() => setImageSourceMode("UPLOAD")}
                    className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                      imageSourceMode === "UPLOAD"
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Upload className="h-3 w-3" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSourceMode("URL")}
                    className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                      imageSourceMode === "URL"
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Link2 className="h-3 w-3" />
                    Image URL
                  </button>
                </div>
              </div>

              {imageSourceMode === "UPLOAD" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/60 hover:bg-muted/40 transition-colors text-center">
                      <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-xs font-semibold text-foreground">
                        {isUploadingImage ? "Uploading to Cloudinary..." : "Click to browse & upload primary image"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Supports PNG, JPG, WEBP (Max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingImage}
                        onChange={(e) => handleImageFileUpload(e, false)}
                        className="hidden"
                      />
                    </label>

                    {formData.imageUrl && (
                      <div className="relative h-16 w-16 rounded-xl border border-border overflow-hidden shrink-0 bg-background shadow-xs">
                        <img
                          src={formData.imageUrl}
                          alt="Primary Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://images.unsplash.com/photo-... or primary image URL"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="text-xs flex-1"
                    />
                    {formData.imageUrl && (
                      <div className="relative h-9 w-9 rounded-md border border-border overflow-hidden shrink-0 bg-background shadow-xs">
                        <img
                          src={formData.imageUrl}
                          alt="URL Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Multiple Gallery Images */}
            <div className="space-y-2.5 p-3 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Boxes className="h-3.5 w-3.5 text-sky-500" />
                    Additional Gallery Images (Multiple)
                  </label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Customers can browse and click these thumbnails on the product page.
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {formData.images.length} Extra Images
                </Badge>
              </div>

              {/* Add Image by URL or Upload */}
              <div className="flex gap-2">
                <Input
                  placeholder="Paste extra image URL..."
                  value={formData.additionalImageUrl}
                  onChange={(e) => setFormData({ ...formData, additionalImageUrl: e.target.value })}
                  className="text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (formData.additionalImageUrl.trim()) {
                      setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, prev.additionalImageUrl.trim()],
                        additionalImageUrl: "",
                      }));
                      toast.success("Image added to gallery!");
                    }
                  }}
                  className="text-xs h-9 shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add URL
                </Button>

                <label className="inline-flex items-center justify-center px-3 h-9 rounded-md border border-border bg-background hover:bg-muted text-foreground text-xs font-medium cursor-pointer shrink-0">
                  <Upload className="h-3.5 w-3.5 mr-1 text-primary" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={(e) => handleImageFileUpload(e, true)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Gallery Image Previews */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.images.map((imgUrl, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="group relative h-14 w-14 rounded-lg border border-border overflow-hidden bg-background shadow-2xs"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery ${imgIdx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== imgIdx),
                          }))
                        }
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Demonstration URL (YouTube / Video Link) */}
            <div className="space-y-1.5 p-3 rounded-xl border border-border bg-muted/20">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-rose-500" />
                Product Demo Video URL (Optional)
              </label>
              <Input
                placeholder="e.g. https://www.youtube.com/watch?v=ScMzIvxBSi4 or youtu.be link"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                If provided, a &ldquo;Demo Video&rdquo; button &amp; thumbnail will appear on the product page. Leave blank if no video is available.
              </p>
            </div>

            {/* Age, Material & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Recommended Age
                </label>
                <Input
                  value={formData.recommendedAge}
                  onChange={(e) => setFormData({ ...formData, recommendedAge: e.target.value })}
                  placeholder="e.g. 2-5 Years"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Material
                </label>
                <Input
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g. Eco Wood, Silicone"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Publish Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-hidden"
                >
                  <option value="ACTIVE">ACTIVE (Live in Store)</option>
                  <option value="DRAFT">DRAFT (Hidden)</option>
                  <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                </select>
              </div>
            </div>

            {/* Target Age Groups & Developmental Skills Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl border border-border bg-muted/20">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary" />
                  Target Age Group
                </label>
                <select
                  value={formData.ageGroupIds[0] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageGroupIds: e.target.value ? [e.target.value] : [],
                    })
                  }
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-hidden"
                >
                  <option value="">Select Age Group (Optional)</option>
                  {ageGroups.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.rangeLabel}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground">
                  Enables storefront &ldquo;Shop by Age&rdquo; filtering for this toy.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Boxes className="h-3.5 w-3.5 text-amber-500" />
                  Developmental Skills
                </label>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {skills.map((sk) => {
                    const isSelected = formData.skillIds.includes(sk.id);
                    return (
                      <button
                        key={sk.id}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            skillIds: isSelected
                              ? formData.skillIds.filter((id) => id !== sk.id)
                              : [...formData.skillIds, sk.id],
                          });
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary font-medium"
                            : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                        }`}
                      >
                        {sk.name}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Click to tag the developmental skills this toy fosters.
                </p>
              </div>
            </div>

            {/* Badges / Promotion Toggles */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>Promotional Badges (Storefront Highlighting)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2.5 p-2 rounded-lg border border-border/60 bg-background cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground block">⭐ Featured Product</span>
                    <span className="text-[10px] text-muted-foreground block">
                      Promotes this item in Homepage Featured Shelf
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg border border-border/60 bg-background cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground block">🔥 Best Seller</span>
                    <span className="text-[10px] text-muted-foreground block">
                      Displays a verified Best Seller badge on UI
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product safety instructions, features, learning benefits..."
                className="w-full rounded-md border border-border bg-background p-2.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsFormOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs gap-1.5"
              >
                {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{editingProduct ? "Update Product" : "Save to Database"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeletingOpen} onOpenChange={setIsDeletingOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-base font-bold">Delete Product?</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">&quot;{deletingProduct?.name}&quot;</strong>?
              This will remove the item, its variants, and stock from both the database and storefront.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeletingOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isSubmitting}
              onClick={handleConfirmDelete}
              className="text-xs gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Delete Permanently</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
