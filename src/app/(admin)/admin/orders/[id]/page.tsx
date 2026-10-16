import * as React from "react";
import { mockAdminOrders } from "@/services/admin-data";
import { AdminOrderDetailClient } from "./order-detail-client";

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  return <AdminOrderDetailClient orderId={id} />;
}
