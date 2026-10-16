import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";

export interface SystemSettings {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  footerLogoUrl: string;
  footerContent: string;
  contactPhone: string;
  contactPhoneSecondary: string;
  contactEmail: string;
  contactAddress: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialTiktok: string;
  socialLinkedin: string;
  socialX: string;
}

export const settingsService = {
  async getSettings(): Promise<ApiResponse<SystemSettings>> {
    try {
      const res = await apiClient.get<ApiResponse<SystemSettings>>("/settings");
      return res.data;
    } catch {
      return {
        success: true,
        message: "OK",
        data: {
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
        },
      };
    }
  },

  async updateSettings(data: Partial<SystemSettings>): Promise<ApiResponse<SystemSettings>> {
    try {
      const res = await apiClient.patch<ApiResponse<SystemSettings>>("/settings", data);
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || "Failed to update settings",
        data: null as any,
      };
    }
  },

  async uploadAsset(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await apiClient.post<ApiResponse<{ url: string }>>("/upload?folder=branding", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.data?.url) {
      return res.data.data.url;
    }
    throw new Error(res.data.message || "Failed to upload file to Cloudinary");
  },
};
