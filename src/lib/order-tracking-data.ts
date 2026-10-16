import { apiClient } from "@/lib/api-client";

export type OrderTimelineStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export interface OrderDetailItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  createdAt: string;
  estimatedDeliveryDate: string;
  status: OrderTimelineStatus;
  paymentMethod: "COD" | "BKASH" | "NAGAD" | "SSLCOMMERZ";
  paymentStatus: "PENDING" | "PAID";
  recipientName: string;
  phone: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  courierPartner: {
    name: "Steadfast" | "Pathao" | "RedX";
    trackingCode: string;
    trackingUrl: string;
  };
  items: OrderDetailItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  deliveredAt?: string;
}

export interface ReturnRequestItem {
  orderItemId: string;
  title: string;
  reason: "DAMAGED" | "DEFECTIVE" | "WRONG_PRODUCT" | "SIZE_ISSUE";
  quantity: number;
  comment: string;
  photoUrls?: string[];
}

export type ReturnStatus =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "PICKUP_SCHEDULED"
  | "REFUND_COMPLETED";

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderNumber: string;
  status: ReturnStatus;
  createdAt: string;
  items: ReturnRequestItem[];
  refundAmount: number;
  notes?: string;
}

// Mock database of orders for realistic demo & tracking
export const MOCK_ORDERS: OrderDetail[] = [];
export const MOCK_RETURNS: ReturnRequest[] = [];

export function getOrderByNumber(orderNumber: string): OrderDetail {
  const existing = MOCK_ORDERS.find(
    (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()
  );
  if (existing) return existing;

  // Generate static fallback order for static prerendering
  return {
    id: `ord_${orderNumber}`,
    orderNumber,
    createdAt: "October 12, 2026",
    estimatedDeliveryDate: "October 14, 2026",
    status: "CONFIRMED",
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    recipientName: "Customer",
    phone: "017XXXXXXXX",
    deliveryAddress: "Dhaka, Bangladesh",
    courierPartner: {
      name: "Steadfast",
      trackingCode: `STF-${orderNumber.replace(/\D/g, "") || "882910"}`,
      trackingUrl: `https://steadfast.com.bd/t/STF-${
        orderNumber.replace(/\D/g, "") || "882910"
      }`,
    },
    items: [],
    subtotal: 0,
    deliveryFee: 60,
    discountAmount: 0,
    total: 60,
  };
}
