"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  ExternalLink,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { catalogService, type ArticleItem } from "@/services/catalog.service";
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

export default function AdminArticlesPage() {
  const [articles, setArticles] = React.useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Modals state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingArticle, setEditingArticle] = React.useState<ArticleItem | null>(null);
  const [deletingArticle, setDeletingArticle] = React.useState<ArticleItem | null>(null);

  // Form inputs
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    category: "Parenting Guide",
    readTime: "4 min read",
    author: "KiddyBD Team",
    image: "",
    summary: "",
    content: "",
    isPublished: true,
  });

  const loadArticles = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await catalogService.getArticles(true);
      if (res.data?.articles) {
        setArticles(res.data.articles);
      }
    } catch {
      toast.error("Failed to load articles from database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      category: "Parenting Guide",
      readTime: "4 min read",
      author: "KiddyBD Team",
      image: "",
      summary: "",
      content: "",
      isPublished: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (article: ArticleItem) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      category: article.category || "Parenting Guide",
      readTime: article.readTime || "4 min read",
      author: article.author || "KiddyBD Team",
      image: article.image || "",
      summary: article.summary || "",
      content: article.content || "",
      isPublished: article.isPublished,
    });
    setIsFormOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Article title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingArticle) {
        await catalogService.updateArticle(editingArticle.id, {
          title: formData.title.trim(),
          slug: formData.slug.trim() || undefined,
          category: formData.category,
          readTime: formData.readTime,
          author: formData.author,
          image: formData.image.trim() || undefined,
          summary: formData.summary.trim() || undefined,
          content: formData.content.trim() || undefined,
          isPublished: formData.isPublished,
        });
        toast.success("Article updated successfully!");
      } else {
        await catalogService.createArticle({
          title: formData.title.trim(),
          slug: formData.slug.trim() || undefined,
          category: formData.category,
          readTime: formData.readTime,
          author: formData.author,
          image: formData.image.trim() || undefined,
          summary: formData.summary.trim() || undefined,
          content: formData.content.trim() || undefined,
          isPublished: formData.isPublished,
        });
        toast.success("Article published successfully!");
      }

      setIsFormOpen(false);
      await loadArticles();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save article";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!deletingArticle) return;
    setIsSubmitting(true);
    try {
      await catalogService.deleteArticle(deletingArticle.id);
      toast.success("Article deleted successfully");
      setIsDeletingOpen(false);
      setDeletingArticle(null);
      await loadArticles();
    } catch {
      toast.error("Failed to delete article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.summary && a.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-foreground">
              Articles &amp; Blog Posts
            </h1>
            <Badge variant="secondary" className="font-bold">
              {articles.length} Total
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage parenting articles and blog posts for the homepage &amp; blog section.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadArticles}
            disabled={isLoading}
            className="gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by article title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-border/80"
          />
        </div>
      </div>

      {/* Articles Table Card */}
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span>All Published &amp; Draft Articles</span>
            <span className="text-xs font-normal text-muted-foreground">
              Showing {filteredArticles.length} of {articles.length}
            </span>
          </CardTitle>
          <CardDescription>
            These articles dynamically populate the &ldquo;Family Moments&rdquo; section on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <p className="text-xs">Loading articles from database...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground px-4">
              <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm font-semibold text-foreground">No articles found</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? "No articles matched your search query."
                  : "You haven't created any articles yet. Click 'Create Article' above to publish your first post!"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleOpenCreate}
                  size="sm"
                  className="mt-4 gap-2 bg-primary text-primary-foreground font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Article</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Article</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Read Time</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
                            {article.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <FileText className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bengali font-bold text-foreground line-clamp-1">
                              {article.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1 font-mono">
                              /blog/{article.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {article.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Published</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Draft</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(article)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingArticle(article);
                              setIsDeletingOpen(true);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Create / Edit Article Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg">
              {editingArticle ? "Edit Article" : "Create New Article"}
            </DialogTitle>
            <DialogDescription>
              {editingArticle
                ? "Update your article content and details."
                : "Fill in the details to publish a new article to the website."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveArticle} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Article Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. 5 Fun Learning Activities for Kids at Home"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Category
                </label>
                <Input
                  placeholder="e.g. Parenting Guide, Early Learning"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Read Time
                </label>
                <Input
                  placeholder="e.g. 4 min read"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Author Name
                </label>
                <Input
                  placeholder="KiddyBD Team"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Custom Slug (Optional)
                </label>
                <Input
                  placeholder="auto-generated-if-empty"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Cover Image URL (Direct image URL or Unsplash)
              </label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Short Summary (Displays on card preview)
              </label>
              <textarea
                rows={2}
                placeholder="Brief 1-2 sentence overview of the article..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Full Article Content
              </label>
              <textarea
                rows={5}
                placeholder="Write your article paragraphs here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="isPublished" className="text-xs font-medium cursor-pointer">
                Publish immediately to website
              </label>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 bg-primary font-bold text-primary-foreground"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{editingArticle ? "Save Changes" : "Publish Article"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeletingOpen} onOpenChange={setIsDeletingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-bold">
              <AlertTriangle className="h-5 w-5" />
              <span>Delete Article</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deletingArticle?.title}&rdquo;? This will remove the article from the website and homepage immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeletingOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteArticle}
              disabled={isSubmitting}
              className="gap-2 font-bold"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Delete Article</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
