import * as React from "react";
import { Metadata } from "next";
import { getOrderByNumber } from "@/lib/order-tracking-data";
import { OrderTrackingClient } from "@/components/orders/order-tracking-client";


interface OrderPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order Tracking #${orderNumber} | KiddyBD`,
    description: `Track live fulfillment progress and courier updates for order #${orderNumber} on KiddyBD.`,
  };
}

export default async function OrderTrackingPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  const order = getOrderByNumber(orderNumber);

  return <OrderTrackingClient order={order} />;
}
