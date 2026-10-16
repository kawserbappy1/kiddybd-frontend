import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  AdminKPIMetrics,
  AdminOrder,
  AdminInventoryItem,
  AdminReturnRequest,
  AdminCustomer,
  AdminOrderStatus,
  CourierProvider,
} from "@/types/admin.types";
import {
  mockAdminKPIMetrics,
  mockAdminOrders,
  mockAdminInventory,
  mockAdminReturns,
  mockAdminCustomers,
} from "./admin-data";

export const adminService = {
  // 1. KPI Dashboard Metrics
  async getMetrics(): Promise<ApiResponse<AdminKPIMetrics>> {
    try {
      const res = await apiClient.get<ApiResponse<AdminKPIMetrics>>("/admin/metrics");
      return res.data;
    } catch {
      return {
        success: true,
        message: "Loaded",
        data: {
          totalRevenue: 0,
          revenueChangePercent: 0,
          todayOrdersCount: 0,
          todayOrdersChangePercent: 0,
          rtoRatePercent: 0,
          codToOnlineRatio: { codPercent: 100, onlinePercent: 0 },
          ordersRequiringVerification: 0,
          lowStockAlertCount: 0,
        },
      };
    }
  },

  // 2. Orders List
  async getOrders(params?: { status?: string; search?: string }): Promise<ApiResponse<AdminOrder[]>> {
    try {
      const res = await apiClient.get<ApiResponse<AdminOrder[]>>("/admin/orders", { params });
      return res.data;
    } catch {
      return {
        success: true,
        message: "No orders found",
        data: [],
      };
    }
  },

  // 3. Single Order by ID
  async getOrderById(id: string): Promise<ApiResponse<AdminOrder | null>> {
    try {
      const res = await apiClient.get<ApiResponse<AdminOrder>>(`/admin/orders/${id}`);
      return res.data;
    } catch {
      return {
        success: false,
        message: "Order not found",
        data: null,
      };
    }
  },

  // 4. Update Order Status
  async updateOrderStatus(id: string, status: AdminOrderStatus): Promise<ApiResponse<AdminOrder>> {
    try {
      const res = await apiClient.patch<ApiResponse<AdminOrder>>(`/admin/orders/${id}/status`, { status });
      return res.data;
    } catch {
      return {
        success: false,
        message: `Failed to update order status to ${status}`,
        data: null as any,
      };
    }
  },

  // 5. Assign Courier
  async assignCourier(
    id: string,
    courier: CourierProvider,
    trackingCode: string
  ): Promise<ApiResponse<AdminOrder>> {
    try {
      const res = await apiClient.post<ApiResponse<AdminOrder>>(`/admin/orders/${id}/assign-courier`, {
        courier,
        trackingCode,
      });
      return res.data;
    } catch {
      return {
        success: false,
        message: `Failed to assign courier ${courier}`,
        data: null as any,
      };
    }
  },

  // 6. Inventory List
  async getInventory(): Promise<ApiResponse<AdminInventoryItem[]>> {
    try {
      const res = await apiClient.get<ApiResponse<AdminInventoryItem[]>>("/admin/inventory");
      return res.data;
    } catch {
      return {
        success: true,
        message: "No inventory items found",
        data: [],
      };
    }
  },

  // 7. Adjust Stock
  async adjustStock(
    variantId: string,
    adjustmentQuantity: number,
    auditReason: string
  ): Promise<ApiResponse<AdminInventoryItem>> {
    try {
      const res = await apiClient.patch<ApiResponse<AdminInventoryItem>>(`/admin/inventory/${variantId}`, {
        adjustment: adjustmentQuantity,
        reason: auditReason,
      });
      return res.data;
    } catch {
      return {
        success: false,
        message: "Failed to adjust stock in database",
        data: null as any,
      };
    }
  },

  // 8. Return Requests
  async getReturns(): Promise<ApiResponse<AdminReturnRequest[]>> {
    try {
      const res = await apiClient.get<ApiResponse<AdminReturnRequest[]>>("/admin/returns");
      return res.data;
    } catch {
      return {
        success: true,
        message: "No returns found",
        data: [],
      };
    }
  },

  async approveReturn(id: string, refundMethod: string = "bKash"): Promise<ApiResponse<AdminReturnRequest>> {
    try {
      const res = await apiClient.post<ApiResponse<AdminReturnRequest>>(`/admin/returns/${id}/approve`, {
        refundMethod,
      });
      return res.data;
    } catch {
      return {
        success: false,
        message: "Failed to approve return in database",
        data: null as any,
      };
    }
  },

  async rejectReturn(id: string, reasonNote: string): Promise<ApiResponse<AdminReturnRequest>> {
    try {
      const res = await apiClient.post<ApiResponse<AdminReturnRequest>>(`/admin/returns/${id}/reject`, {
        reason: reasonNote,
      });
      return res.data;
    } catch {
      return {
        success: false,
        message: "Failed to reject return in database",
        data: null as any,
      };
    }
  },

  // 9. Customers & Risk Blacklist
  // 9. Customers & Risk Blacklist
  async getCustomers(): Promise<ApiResponse<AdminCustomer[]>> {
    try {
      const res = await apiClient.get<ApiResponse<AdminCustomer[]>>("/admin/customers");
      return res.data;
    } catch {
      return {
        success: true,
        message: "No customers found",
        data: [],
      };
    }
  },

  async updateCustomerStatus(
    id: string,
    status: "ACTIVE" | "SUSPENDED" | "BLOCKED"
  ): Promise<ApiResponse<AdminCustomer>> {
    try {
      const res = await apiClient.patch<ApiResponse<AdminCustomer>>(`/admin/customers/${id}/status`, {
        status,
      });
      return res.data;
    } catch {
      return {
        success: false,
        message: `Failed to update customer status to ${status}`,
        data: null as any,
      };
    }
  },

  // 10. Staff & Role Management (SUPER_ADMIN)
  async getStaffUsers(): Promise<ApiResponse<import("@/types/admin.types").AdminStaffUser[]>> {
    try {
      const res = await apiClient.get<ApiResponse<import("@/types/admin.types").AdminStaffUser[]>>(
        "/admin/staff"
      );
      return res.data;
    } catch {
      return {
        success: false,
        message: "Failed to load admin staff",
        data: [],
      };
    }
  },

  async createStaffUser(data: {
    name: string;
    email: string;
    phone?: string;
    role: import("@/types/admin.types").AdminRole;
    password?: string;
  }): Promise<ApiResponse<import("@/types/admin.types").AdminStaffUser>> {
    try {
      const res = await apiClient.post<ApiResponse<import("@/types/admin.types").AdminStaffUser>>(
        "/admin/staff",
        data
      );
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || "Failed to create/assign admin user",
        data: null as any,
      };
    }
  },

  async updateStaffRole(
    id: string,
    role: import("@/types/admin.types").AdminRole,
    status?: "ACTIVE" | "SUSPENDED" | "BLOCKED"
  ): Promise<ApiResponse<import("@/types/admin.types").AdminStaffUser>> {
    try {
      const res = await apiClient.patch<ApiResponse<import("@/types/admin.types").AdminStaffUser>>(
        `/admin/staff/${id}/role`,
        { role, status }
      );
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || "Failed to update admin role",
        data: null as any,
      };
    }
  },

  // 11. Super Admin Audit Logs
  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    entity?: string;
  }): Promise<ApiResponse<import("@/types/admin.types").AdminAuditLog[]> & { meta?: any }> {
    try {
      const res = await apiClient.get<
        ApiResponse<import("@/types/admin.types").AdminAuditLog[]> & { meta?: any }
      >("/admin/audit-logs", { params });
      return res.data;
    } catch {
      return {
        success: false,
        message: "Failed to load audit logs",
        data: [],
      };
    }
  },
};
