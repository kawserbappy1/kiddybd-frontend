"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Boxes,
  Loader2,
  Package,
} from "lucide-react";
import { catalogService, type Category } from "@/services/catalog.service";
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<
    (Category & { _count?: { products: number } })[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Modals state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = React.useState<Category | null>(null);

  // Form inputs
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
  });

  const loadCategories = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await catalogService.getCategories();
      if (res.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch {
      toast.error("Failed to load categories from database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setDeletingCategory(category);
    setIsDeletingOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const res = await catalogService.updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
        });
        if (res.success) {
          toast.success(`Category "${formData.name}" updated successfully!`);
          setIsFormOpen(false);
          loadCategories();
        } else {
          toast.error("Failed to update category");
        }
      } else {
        const res = await catalogService.createCategory({
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
        });
        if (res.success) {
          toast.success(`Category "${formData.name}" added to database!`);
          setIsFormOpen(false);
          loadCategories();
        } else {
          toast.error("Failed to create category");
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsSubmitting(true);
    try {
      const res = await catalogService.deleteCategory(deletingCategory.id);
      if (res.success) {
        toast.success(`Deleted category "${deletingCategory.name}"`);
        setIsDeletingOpen(false);
        setDeletingCategory(null);
        loadCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (err: any) {
      toast.error("Cannot delete category if it is linked to active products.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Categories Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create, edit, and organize product categories. Categories appear in the Product creation dropdown and storefront navigation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCategories}
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
            <span>Add New Category</span>
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <Card className="rounded-xl border border-border shadow-2xs">
        <CardContent className="p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search category name or slug..."
              className="pl-9 h-9 text-xs bg-muted/30"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="rounded-xl border border-border shadow-2xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                All Categories ({filteredCategories.length})
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Saved in PostgreSQL database and synced with Product dropdown.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-xs">Fetching categories from database...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <FolderTree className="h-12 w-12 stroke-1 mb-3 text-muted-foreground/60" />
              <h3 className="text-sm font-semibold text-foreground">No Categories Found</h3>
              <p className="text-xs max-w-sm mt-1">
                You have not created any categories matching your search.
              </p>
              <Button size="sm" onClick={handleOpenCreate} className="mt-4 gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Category Now
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-y border-border bg-muted/40 text-muted-foreground font-medium uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Category Name</th>
                    <th className="py-2.5 px-4 font-semibold">Slug (URL identifier)</th>
                    <th className="py-2.5 px-4 font-semibold">Linked Products</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCategories.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5 font-semibold text-foreground">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{c.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-muted-foreground text-[11px]">
                        {c.slug}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-[11px] font-semibold">
                          <Package className="h-3 w-3 mr-1" />
                          {c._count?.products ?? 0} Products
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(c)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title="Edit Category"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(c)}
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                            title="Delete Category"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE & EDIT CATEGORY MODAL */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editingCategory
                ? "Update category title or slug identifier in database."
                : "Create a new category. This will immediately show in the Add Product dropdown."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Category Name *
              </label>
              <Input
                required
                placeholder="e.g. Wooden Puzzles, STEM Kits..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Slug (Optional, auto-generated)
              </label>
              <Input
                placeholder="e.g. wooden-puzzles"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="text-xs font-mono"
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
                <span>{editingCategory ? "Update Category" : "Save Category"}</span>
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
              <DialogTitle className="text-base font-bold">Delete Category?</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">&quot;{deletingCategory?.name}&quot;</strong>?
              Note: If this category has active products attached to it, delete may be blocked to protect product data.
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
              <span>Delete Category</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
