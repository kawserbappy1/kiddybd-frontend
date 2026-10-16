import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";

export interface AdminRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface AdminRecentReturn {
  id: string;
  orderId: string;
  orderNumber: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface AdminInAppNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  status: string;
  readAt?: string | null;
  createdAt: string;
  metadata?: any;
}

export interface AdminNotificationMetrics {
  pendingOrdersCount: number;
  pendingReturnsCount: number;
  totalPending: number;
  unreadNotificationsCount: number;
  totalUnread?: number;
  recentOrders: AdminRecentOrder[];
  recentReturns: AdminRecentReturn[];
  notifications: AdminInAppNotification[];
  dbNotifications?: AdminInAppNotification[];
}

export const adminNotificationService = {
  async getMetrics(): Promise<AdminNotificationMetrics> {
    try {
      const res = await apiClient.get<ApiResponse<AdminNotificationMetrics>>(
        "/admin/notifications/metrics"
      );
      const data = res.data?.data;
      return {
        pendingOrdersCount: data?.pendingOrdersCount ?? 0,
        pendingReturnsCount: data?.pendingReturnsCount ?? 0,
        totalPending: data?.totalPending ?? 0,
        unreadNotificationsCount: data?.unreadNotificationsCount ?? 0,
        totalUnread: data?.totalUnread ?? 0,
        recentOrders: data?.recentOrders ?? [],
        recentReturns: data?.recentReturns ?? [],
        notifications: data?.notifications ?? data?.dbNotifications ?? [],
      };
    } catch {
      return {
        pendingOrdersCount: 0,
        pendingReturnsCount: 0,
        totalPending: 0,
        unreadNotificationsCount: 0,
        totalUnread: 0,
        recentOrders: [],
        recentReturns: [],
        notifications: [],
      };
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.post("/admin/notifications/mark-all-read");
    } catch {
      // Gracefully ignore
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch {
      // Gracefully ignore
    }
  },
};
