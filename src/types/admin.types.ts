// Admin types and mock interfaces matching enterprise backend API specifications

export interface AdminKPIMetrics {
  totalRevenue: number;
  revenueChangePercent: number;
  todayOrdersCount: number;
  todayOrdersChangePercent: number;
  rtoRatePercent: number;
  codToOnlineRatio: {
    codPercent: number;
    onlinePercent: number;
  };
  ordersRequiringVerification: number;
  lowStockAlertCount: number;
  totalOrders?: number;
  completedOrders?: number;
  overallSlaPercent?: number;
  courierStats?: Record<string, {
    total: number;
    delivered: number;
    returned: number;
    active: number;
    successRate: number;
  }>;
  riskBreakdown?: {
    autoApprovedPercent: number;
    advanceDepositPercent: number;
    highRiskPercent: number;
    autoApprovedCount: number;
    advanceDepositCount: number;
    highRiskCount: number;
  };
  orderStatusCounts?: {
    delivered: number;
    shipped: number;
    processing: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    rto: number;
  };
}

export type AdminOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type CourierProvider = "Pathao" | "Steadfast" | "RedX" | "Paperfly";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: {
    street: string;
    thana: string;
    district: string;
    division: string;
  };
  status: AdminOrderStatus;
  paymentMethod: "COD" | "BKASH" | "NAGAD" | "CARD";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  items: Array<{
    id: string;
    title: string;
    sku: string;
    variant: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl: string;
  }>;
  riskScore: "LOW" | "MEDIUM" | "HIGH";
  riskReasons: string[];
  pastRtoCount: number;
  deviceFingerprintMismatch: boolean;
  courierProvider?: CourierProvider;
  courierTrackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminInventoryItem {
  id: string;
  productId: string;
  productTitle: string;
  sku: string;
  category: string;
  variantName: string;
  imageUrl: string;
  baseStock: number;
  reservedStock: number;
  availableStock: number;
  priceBDT: number;
  reorderLevel: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  lastAdjustedAt: string;
}

export interface AdminReturnRequest {
  id: string;
  returnNumber: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productTitle: string;
  productSku: string;
  productImage: string;
  priceBDT: number;
  reason: "DAMAGED" | "WRONG_ITEM" | "DEFECTIVE" | "QUALITY_ISSUE" | "SIZE_MISMATCH";
  reasonDetails: string;
  evidenceImages: string[];
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "REFUNDED";
  adminNote?: string;
  requestedAt: string;
  resolvedAt?: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  totalOrders: number;
  completedOrders: number;
  rtoCount: number;
  totalSpentBDT: number;
  riskRating: "LOW" | "MEDIUM" | "HIGH";
  status: "ACTIVE" | "SUSPENDED" | "BLOCKED";
  joinedDate: string;
  lastOrderDate: string;
}

export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "ORDER_MANAGER"
  | "INVENTORY_MANAGER"
  | "CONTENT_MANAGER"
  | "CUSTOMER_SUPPORT"
  | "FINANCE_MANAGER";

export interface AdminStaffUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatarUrl?: string | null;
  role: AdminRole;
  status: "ACTIVE" | "SUSPENDED" | "BLOCKED" | "DELETED";
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ip: string;
  userAgent: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string | null;
    role: string;
  };
}
