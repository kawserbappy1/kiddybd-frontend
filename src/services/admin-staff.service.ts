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

  async updateStaffProfile(
    id: string,
    data: {
      role?: AdminRole;
      status?: "ACTIVE" | "SUSPENDED" | "BLOCKED";
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      avatarUrl?: string;
    }
  ): Promise<ApiResponse<AdminStaffUser>> {
    try {
      const res = await apiClient.patch<ApiResponse<AdminStaffUser>>(`/admin/staff/${id}/role`, data);
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || "Failed to update admin profile",
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
    return this.updateStaffProfile(id, { role, status, password });
  },

  async updateMyProfile(data: { name?: string; avatarUrl?: string }): Promise<ApiResponse<any>> {
    try {
      const res = await apiClient.patch<ApiResponse<any>>("/users/profile", data);
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || "Failed to update profile",
        data: null as any,
      };
    }
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await apiClient.post<ApiResponse<{ url: string }>>("/upload?folder=avatars", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.data?.url) {
      return res.data.data.url;
    }
    throw new Error(res.data.message || "Failed to upload image to Cloudinary");
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
