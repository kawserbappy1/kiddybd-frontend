"use client";

import * as React from "react";
import Image from "next/image";
import {
  Settings,
  Globe,
  Upload,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Share2,
  FileText,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { settingsService, type SystemSettings } from "@/services/settings.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [uploadingField, setUploadingField] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<SystemSettings>({
    siteName: "KiddyBD",
    logoUrl: "/logo-bd.png",
    faviconUrl: "/favicon.ico",
    footerLogoUrl: "/logo-bd.png",
    footerContent:
      "Quality products for every stage of childhood. Because happy kids build a brighter tomorrow.",
    contactPhone: "+880 1893-590140",
    contactPhoneSecondary: "+880 1729-993873",
    contactEmail: "kiddybd1@gmail.com",
    contactAddress: "House 12, Road 4, Block-C, Banasree, Dhaka - 1219, Bangladesh",
    socialFacebook: "https://www.facebook.com/kiddybd1",
    socialInstagram: "https://www.instagram.com/kiddybd1/",
    socialYoutube: "",
    socialTiktok: "",
    socialLinkedin: "",
    socialX: "",
  });

  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const faviconInputRef = React.useRef<HTMLInputElement>(null);
  const footerLogoInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await settingsService.getSettings();
        if (res.data) {
          setFormData((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logoUrl" | "faviconUrl" | "footerLogoUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    const toastId = toast.loading(`Uploading ${field} to Cloudinary...`);
    try {
      const url = await settingsService.uploadAsset(file);
      setFormData((prev) => ({ ...prev, [field]: url }));
      toast.success("Asset uploaded successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload asset", { id: toastId });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      toast.error("Only Super Admin can update store settings and branding.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving store settings...");
    try {
      const res = await settingsService.updateSettings(formData);
      if (res.success) {
        toast.success("Store settings & branding updated successfully!", { id: toastId });
      } else {
        toast.error(res.message || "Failed to save settings", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>Loading store preferences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Store Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            Branding, Contact & Social Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure your official store logo, favicon, footer branding, contact hotline and social links.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || !isSuperAdmin}
          className="rounded-full px-6 h-11 bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-2 shadow-md cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </Button>
      </div>

      {!isSuperAdmin && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium">
          🔒 View-Only Mode: Only Super Admin has authorization to edit and update store settings.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Logos & Visual Identity */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Logos & Visual Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Header Logo */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Main Header Logo
              </span>
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 relative">
                {formData.logoUrl ? (
                  <Image
                    src={formData.logoUrl}
                    alt="Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Globe className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "logoUrl")}
                disabled={!isSuperAdmin}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingField === "logoUrl" || !isSuperAdmin}
                className="rounded-full text-xs font-bold gap-1.5 w-full cursor-pointer"
              >
                {uploadingField === "logoUrl" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload Logo</span>
              </Button>
              <Input
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="Or paste image URL"
                disabled={!isSuperAdmin}
                className="text-[11px] h-8 rounded-lg"
              />
            </div>

            {/* Favicon */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Browser Favicon (.ico / .png)
              </span>
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 relative">
                {formData.faviconUrl ? (
                  <Image
                    src={formData.faviconUrl}
                    alt="Favicon"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <Globe className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/*,.ico"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "faviconUrl")}
                disabled={!isSuperAdmin}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => faviconInputRef.current?.click()}
                disabled={uploadingField === "faviconUrl" || !isSuperAdmin}
                className="rounded-full text-xs font-bold gap-1.5 w-full cursor-pointer"
              >
                {uploadingField === "faviconUrl" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload Favicon</span>
              </Button>
              <Input
                value={formData.faviconUrl}
                onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                placeholder="Or paste favicon URL"
                disabled={!isSuperAdmin}
                className="text-[11px] h-8 rounded-lg"
              />
            </div>

            {/* Footer Logo */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Footer Brand Logo
              </span>
              <div className="w-20 h-20 rounded-2xl bg-[#111D2E] flex items-center justify-center overflow-hidden border border-slate-700 relative">
                {formData.footerLogoUrl ? (
                  <Image
                    src={formData.footerLogoUrl}
                    alt="Footer Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Globe className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <input
                ref={footerLogoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "footerLogoUrl")}
                disabled={!isSuperAdmin}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => footerLogoInputRef.current?.click()}
                disabled={uploadingField === "footerLogoUrl" || !isSuperAdmin}
                className="rounded-full text-xs font-bold gap-1.5 w-full cursor-pointer"
              >
                {uploadingField === "footerLogoUrl" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload Footer Logo</span>
              </Button>
              <Input
                value={formData.footerLogoUrl}
                onChange={(e) => setFormData({ ...formData, footerLogoUrl: e.target.value })}
                placeholder="Or paste image URL"
                disabled={!isSuperAdmin}
                className="text-[11px] h-8 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 2. Official Contact Information */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Phone className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Official Contact & Hotline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Primary Contact Phone (Hotline 1)</span>
              </label>
              <Input
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+880 1893-590140"
                disabled={!isSuperAdmin}
                className="h-10 text-xs rounded-xl"
              />
              <p className="text-[11px] text-slate-400">
                Primary hotline shown in topbar, footer and WhatsApp links.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-500" />
                <span>Secondary Contact Phone (Hotline 2)</span>
              </label>
              <Input
                value={formData.contactPhoneSecondary}
                onChange={(e) => setFormData({ ...formData, contactPhoneSecondary: e.target.value })}
                placeholder="+880 1729-993873"
                disabled={!isSuperAdmin}
                className="h-10 text-xs rounded-xl"
              />
              <p className="text-[11px] text-slate-400">
                Alternate support number shown in Track Order and Returns & Refunds page.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-500" />
                <span>Official Email Address</span>
              </label>
              <Input
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="kiddybd1@gmail.com"
                disabled={!isSuperAdmin}
                className="h-10 text-xs rounded-xl"
              />
              <p className="text-[11px] text-slate-400">
                Official support email shown on invoices, emails and contact page.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Store / Head Office Physical Address</span>
              </label>
              <Input
                value={formData.contactAddress}
                onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                placeholder="House 12, Road 4, Block-C, Banasree, Dhaka - 1219, Bangladesh"
                disabled={!isSuperAdmin}
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 3. Footer Content & Mission */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Footer Content & Brand Description
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Footer Intro Text
            </label>
            <textarea
              rows={3}
              value={formData.footerContent}
              onChange={(e) => setFormData({ ...formData, footerContent: e.target.value })}
              placeholder="Write a brief intro about your store for the website footer..."
              disabled={!isSuperAdmin}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* 4. Social Media Channels */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Share2 className="w-5 h-5 text-pink-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Social Media Channels & Handles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Facebook */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Facebook Page URL</span>
                {formData.socialFacebook && (
                  <a
                    href={formData.socialFacebook}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5"
                  >
                    <span>Test link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <Input
                value={formData.socialFacebook}
                onChange={(e) => setFormData({ ...formData, socialFacebook: e.target.value })}
                placeholder="https://www.facebook.com/kiddybd1"
                disabled={!isSuperAdmin}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            {/* Instagram */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Instagram Profile URL</span>
                {formData.socialInstagram && (
                  <a
                    href={formData.socialInstagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-pink-500 hover:underline flex items-center gap-0.5"
                  >
                    <span>Test link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <Input
                value={formData.socialInstagram}
                onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
                placeholder="https://www.instagram.com/kiddybd1/"
                disabled={!isSuperAdmin}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            {/* YouTube */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                YouTube Channel URL
              </label>
              <Input
                value={formData.socialYoutube}
                onChange={(e) => setFormData({ ...formData, socialYoutube: e.target.value })}
                placeholder="https://www.youtube.com/@kiddybd"
                disabled={!isSuperAdmin}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            {/* TikTok */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                TikTok Profile URL
              </label>
              <Input
                value={formData.socialTiktok}
                onChange={(e) => setFormData({ ...formData, socialTiktok: e.target.value })}
                placeholder="https://www.tiktok.com/@kiddybd"
                disabled={!isSuperAdmin}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                LinkedIn Company Page URL
              </label>
              <Input
                value={formData.socialLinkedin}
                onChange={(e) => setFormData({ ...formData, socialLinkedin: e.target.value })}
                placeholder="https://www.linkedin.com/company/kiddybd"
                disabled={!isSuperAdmin}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            {/* X / Twitter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                X (Twitter) Profile URL
              </label>
              <Input
                value={formData.socialX}
                onChange={(e) => setFormData({ ...formData, socialX: e.target.value })}
                placeholder="https://x.com/kiddybd"
                disabled={!isSuperAdmin}
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={saving || !isSuperAdmin}
            className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-white font-bold text-sm gap-2 shadow-lg cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Save All Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
