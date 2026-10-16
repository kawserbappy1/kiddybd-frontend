export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: Array<{ field?: string; message: string }>;
  };
}

export class AppError extends Error {
  code: string;
  details?: Array<{ field?: string; message: string }>;
  statusCode?: number;

  constructor(
    message: string,
    code: string = "INTERNAL_ERROR",
    details?: Array<{ field?: string; message: string }>,
    statusCode?: number
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
  }
}

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "ORDER_MANAGER"
  | "INVENTORY_MANAGER"
  | "CUSTOMER_SUPPORT"
  | "CONTENT_MANAGER"
  | "FINANCE_MANAGER"
  | "CUSTOMER";

export interface User {
  id: string;
  phone?: string | null;
  email?: string | null;
  name?: string | null;
  role: Role;
  avatarUrl?: string | null;
  phoneVerifiedAt?: string | null;
  emailVerifiedAt?: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}
