import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { AdminStaffUser, AdminAuditLog, AdminRole } from "@/types/admin.types";

export const adminStaffService = {
  async getStaffUsers(): Promise<ApiResponse<AdminStaffUser[]>> {
    try {
      const res = await apiClient.get<ApiResponse<AdminStaffUser[]>>("/admin/staff");
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
    role: AdminRole;
    password?: string;
  }): Promise<ApiResponse<AdminStaffUser>> {
    try {
      const res = await apiClient.post<ApiResponse<AdminStaffUser>>("/admin/staff", data);
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
    role: AdminRole,
    status?: "ACTIVE" | "SUSPENDED" | "BLOCKED",
    password?: string
  ): Promise<ApiResponse<AdminStaffUser>> {
    try {
      const res = await apiClient.patch<ApiResponse<AdminStaffUser>>(`/admin/staff/${id}/role`, {
        role,
        status,
        password,
      });
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || "Failed to update admin role",
        data: null as any,
      };
    }
  },

  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    entity?: string;
  }): Promise<ApiResponse<AdminAuditLog[]> & { meta?: any }> {
    try {
      const res = await apiClient.get<ApiResponse<AdminAuditLog[]> & { meta?: any }>(
        "/admin/audit-logs",
        { params }
      );
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
