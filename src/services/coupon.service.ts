import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";

export interface BannerCoupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_DELIVERY";
  value: number;
  minimumOrderAmount?: number | null;
  displayText: string;
  startDate: string;
  endDate: string;
}

export interface CouponItem {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_DELIVERY";
  value: number;
  minimumOrderAmount?: number | null;
  maximumDiscount?: number | null;
  usageLimit?: number | null;
  perUserLimit?: number | null;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  _count?: {
    usages: number;
  };
}

export interface CreateCouponPayload {
  code: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_DELIVERY";
  value: number;
  minimumOrderAmount?: number | null;
  maximumDiscount?: number | null;
  usageLimit?: number | null;
  perUserLimit?: number | null;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export const couponService = {
  // Public: Get active coupon banner for top announcement bar
  async getBannerCoupon(): Promise<BannerCoupon | null> {
    try {
      const res = await apiClient.get<ApiResponse<BannerCoupon>>("/coupons/banner");
      return res.data?.data || null;
    } catch {
      return null;
    }
  },

  // Admin: List all coupons
  async listAdminCoupons(): Promise<CouponItem[]> {
    const res = await apiClient.get<ApiResponse<{ coupons: CouponItem[] }>>("/admin/coupons");
    return res.data?.data?.coupons || [];
  },

  // Admin: Create new coupon
  async createCoupon(payload: CreateCouponPayload): Promise<CouponItem> {
    const res = await apiClient.post<ApiResponse<CouponItem>>("/admin/coupons", payload);
    return res.data?.data;
  },

  // Admin: Update coupon
  async updateCoupon(id: string, payload: Partial<CreateCouponPayload>): Promise<CouponItem> {
    const res = await apiClient.patch<ApiResponse<CouponItem>>(`/admin/coupons/${id}`, payload);
    return res.data?.data;
  },

  // Admin: Delete coupon
  async deleteCoupon(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/admin/coupons/${id}`);
  },
};
