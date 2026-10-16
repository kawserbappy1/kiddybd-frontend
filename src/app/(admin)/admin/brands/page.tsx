"use client";

import * as React from "react";
import Link from "next/link";
import {
  Award,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Package,
  Layers,
} from "lucide-react";
import { catalogService, type Brand } from "@/services/catalog.service";
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

export default function AdminBrandsPage() {
  const [brands, setBrands] = React.useState<
    (Brand & { _count?: { products: number } })[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Modals state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = React.useState<Brand | null>(null);

  // Form inputs
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
  });

  const loadBrands = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await catalogService.getBrands();
      if (res.data?.brands) {
        setBrands(res.data.brands);
      }
    } catch {
      toast.error("Failed to load brands from database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setFormData({ name: "", slug: "" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, slug: brand.slug });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (brand: Brand) => {
    setDeletingBrand(brand);
    setIsDeletingOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBrand) {
        const res = await catalogService.updateBrand(editingBrand.id, {
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
        });
        if (res.success) {
          toast.success(`Brand "${formData.name}" updated successfully!`);
          setIsFormOpen(false);
          loadBrands();
        } else {
          toast.error("Failed to update brand");
        }
      } else {
        const res = await catalogService.createBrand({
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
        });
        if (res.success) {
          toast.success(`Brand "${formData.name}" added to database!`);
          setIsFormOpen(false);
          loadBrands();
        } else {
          toast.error("Failed to create brand");
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBrand) return;
    setIsSubmitting(true);
    try {
      const res = await catalogService.deleteBrand(deletingBrand.id);
      if (res.success) {
        toast.success(`Deleted brand "${deletingBrand.name}"`);
        setIsDeletingOpen(false);
        setDeletingBrand(null);
        loadBrands();
      } else {
        toast.error("Failed to delete brand");
      }
    } catch (err: any) {
      toast.error("Cannot delete brand if it is linked to active products.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
              Brands Management
            </h1>
            <Badge variant="secondary" className="text-xs">
              {brands.length} Brands
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Create and curate authentic brands. These will be available in the Product Create form and showcased on the Homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadBrands}
            disabled={isLoading}
            className="text-xs gap-1.5 h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="text-xs gap-1.5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Brand</span>
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="p-4 sm:p-5 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold">Store Brands</CardTitle>
              <CardDescription className="text-xs">
                Real database brand registry with linked product counts.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs bg-background"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Loading brands from database...</p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
                <Award className="h-6 w-6 stroke-1" />
              </div>
              <h3 className="text-sm font-bold text-foreground">No brands found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
                {searchTerm
                  ? `No brands matching "${searchTerm}". Try another search term.`
                  : "You have not added any brand to your store yet."}
              </p>
              {!searchTerm && (
                <Button size="sm" onClick={handleOpenCreate} className="text-xs gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Your First Brand</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40 font-semibold text-muted-foreground">
                    <th className="py-3 px-4">Brand Name</th>
                    <th className="py-3 px-4">Slug Identifier</th>
                    <th className="py-3 px-4 text-center">Linked Products</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredBrands.map((brand) => (
                    <tr
                      key={brand.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3 px-4 font-bold text-foreground flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#0EA5E9] dark:bg-sky-950/60 flex items-center justify-center font-bold text-xs uppercase">
                          {brand.name.slice(0, 2)}
                        </div>
                        <span>{brand.name}</span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                        {brand.slug}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant="secondary"
                          className="font-medium text-[11px] gap-1 px-2.5"
                        >
                          <Package className="h-3 w-3" />
                          <span>{brand._count?.products ?? 0}</span>
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(brand)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Edit Brand"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(brand)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            title="Delete Brand"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* CREATE & EDIT BRAND MODAL */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingBrand ? "Edit Brand" : "Add New Brand"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editingBrand
                ? "Update the brand title or slug in database."
                : "Enter the brand name. It will immediately be available in product creation and home page carousel."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Brand Name *
              </label>
              <Input
                required
                placeholder="e.g. LEGO, Fisher-Price, Chicco"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name: val,
                    slug: prev.slug === "" || !editingBrand
                      ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
                      : prev.slug,
                  }));
                }}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Slug (URL identifier)
              </label>
              <Input
                placeholder="e.g. lego, fisher-price"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="text-xs font-mono"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
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
                <span>{editingBrand ? "Save Changes" : "Create Brand"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeletingOpen} onOpenChange={setIsDeletingOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold">
              Delete Brand?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                &ldquo;{deletingBrand?.name}&rdquo;
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeletingOpen(false)}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="text-xs gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Delete</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
