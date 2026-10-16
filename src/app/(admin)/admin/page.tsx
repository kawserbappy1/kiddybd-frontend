"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  CreditCard,
  Activity,
  ArrowUpRight,
  Package,
  RotateCcw,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Download,
  Calendar,
  ChevronRight,
  Eye,
  Filter,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import type { AdminKPIMetrics, AdminOrder } from "@/types/admin.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = React.useState<AdminKPIMetrics | null>(null);
  const [recentOrders, setRecentOrders] = React.useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [mRes, oRes] = await Promise.all([
        adminService.getMetrics(),
        adminService.getOrders(),
      ]);
      if (mRes.data) setMetrics(mRes.data);
      if (oRes.data) setRecentOrders(oRes.data.slice(0, 6));
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar (Shadcn Acme Inc. Style) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time fulfillment metrics, revenue tracking, and order intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Oct 11 - Today</span>
          </Button>
          <Button size="sm" className="h-9 gap-1.5 text-xs shadow-xs" asChild>
            <Link href="/admin/orders">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Dispatch Orders</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 4 Stat Metric Cards (Shadcn Dashboard Cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Revenue */}
        <Card className="rounded-xl border border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
              ৳
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              ৳{(metrics?.totalRevenue ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                <ArrowUpRight className="h-3.5 w-3.5" /> +{metrics?.revenueChangePercent ?? 0}%
              </span>
              <span>from last month</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Orders */}
        <Card className="rounded-xl border border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders Today
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
              <ShoppingBag className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              +{metrics?.todayOrdersCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                <ArrowUpRight className="h-3.5 w-3.5" /> Total: {(metrics as any)?.totalOrders ?? 0}
              </span>
              <span>lifetime orders</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 3: RTO / Return Rate */}
        <Card className="rounded-xl border border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              RTO (Return) Rate
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
              <RotateCcw className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {metrics?.rtoRatePercent ?? 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
              <span>COD: {metrics?.codToOnlineRatio?.codPercent ?? 100}%</span>
              <span>Prepaid: {metrics?.codToOnlineRatio?.onlinePercent ?? 0}%</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Active Verification Alerts */}
        <Card className="rounded-xl border border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock & Verification
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {metrics?.ordersRequiringVerification ?? 0} Pending
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.lowStockAlertCount ?? 0} variants low on inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Grid: Courier SLA Pipeline & COD Fraud Shield */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Logistics Courier Network Status (Span 4) */}
        <Card className="rounded-xl border border-border shadow-2xs lg:col-span-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Logistics & Courier Dispatch Network
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Real-time SLA fulfillment for Pathao, Steadfast, and RedX networks
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">
                {metrics?.overallSlaPercent ?? 100}% Fulfillment
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="space-y-3">
              {/* Pathao */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-foreground font-semibold">
                    <Truck className="h-3.5 w-3.5 text-muted-foreground" /> Pathao Express
                  </span>
                  <span className="text-emerald-600 font-semibold">
                    {metrics?.courierStats?.["Pathao"]?.total ?? 0} Dispatched ({metrics?.courierStats?.["Pathao"]?.active ?? 0} In-Transit)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max((metrics?.courierStats?.["Pathao"]?.total ?? 0) > 0 ? 50 : 0, (metrics?.courierStats?.["Pathao"]?.total ?? 0) * 35))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Inside Dhaka Hubs</span>
                  <span>{metrics?.courierStats?.["Pathao"]?.successRate ?? 100}% SLA</span>
                </div>
              </div>

              {/* Steadfast */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-foreground font-semibold">
                    <Truck className="h-3.5 w-3.5 text-muted-foreground" /> Steadfast Courier
                  </span>
                  <span className="text-amber-600 font-semibold">
                    {metrics?.courierStats?.["Steadfast"]?.total ?? 0} Dispatched ({metrics?.courierStats?.["Steadfast"]?.active ?? 0} In-Transit)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max((metrics?.courierStats?.["Steadfast"]?.total ?? 0) > 0 ? 50 : 0, (metrics?.courierStats?.["Steadfast"]?.total ?? 0) * 35))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>District Headquarters & Suburban</span>
                  <span>{metrics?.courierStats?.["Steadfast"]?.successRate ?? 100}% SLA</span>
                </div>
              </div>

              {/* RedX */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-foreground font-semibold">
                    <Truck className="h-3.5 w-3.5 text-muted-foreground" /> RedX Logistics
                  </span>
                  <span className="text-emerald-600 font-semibold">
                    {metrics?.courierStats?.["RedX"]?.total ?? 0} Dispatched ({metrics?.courierStats?.["RedX"]?.active ?? 0} In-Transit)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max((metrics?.courierStats?.["RedX"]?.total ?? 0) > 0 ? 50 : 0, (metrics?.courierStats?.["RedX"]?.total ?? 0) * 35))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Remote Upazila & Thana Hubs</span>
                  <span>{metrics?.courierStats?.["RedX"]?.successRate ?? 100}% SLA</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COD Risk Engine Summary (Span 3) */}
        <Card className="rounded-xl border border-border shadow-2xs lg:col-span-3 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold text-foreground">
                Safe COD Risk Engine
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Automated high-risk scoring and verification thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-muted-foreground">Auto-Approved Orders</span>
                <span className="font-semibold text-emerald-600">
                  {metrics?.riskBreakdown?.autoApprovedPercent ?? 80}% ({metrics?.riskBreakdown?.autoApprovedCount ?? 0})
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/60">
                <span className="text-muted-foreground">Advance Deposit Req.</span>
                <span className="font-semibold text-amber-600">
                  {metrics?.riskBreakdown?.advanceDepositPercent ?? 0}% ({metrics?.riskBreakdown?.advanceDepositCount ?? 0})
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Flagged / Cancelled</span>
                <span className="font-semibold text-rose-600">
                  {metrics?.riskBreakdown?.highRiskPercent ?? 20}% ({metrics?.riskBreakdown?.highRiskCount ?? 0})
                </span>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="w-full justify-between text-xs h-8 text-muted-foreground hover:text-foreground" asChild>
              <Link href="/admin/orders">
                <span>Inspect flagged orders</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Order Progression Pipeline / Fulfillment Breakdown */}
      <Card className="rounded-xl border border-border shadow-2xs">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Fulfillment & Order Pipeline Distribution
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Live progression of all {(metrics as any)?.totalOrders ?? 0} store orders from placement to final delivery.
              </CardDescription>
            </div>
            <div className="text-xs font-semibold text-muted-foreground">
              {metrics?.orderStatusCounts?.delivered ?? 0} Delivered / {(metrics as any)?.totalOrders ?? 0} Total
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-1">
          {/* Multi-segment progress bar */}
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
            {metrics?.totalOrders && metrics.totalOrders > 0 ? (
              <>
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${((metrics.orderStatusCounts?.delivered ?? 0) / metrics.totalOrders) * 100}%` }}
                  title={`Delivered: ${metrics.orderStatusCounts?.delivered ?? 0}`}
                />
                <div
                  className="bg-blue-500 h-full transition-all"
                  style={{ width: `${((metrics.orderStatusCounts?.shipped ?? 0) / metrics.totalOrders) * 100}%` }}
                  title={`In Transit: ${metrics.orderStatusCounts?.shipped ?? 0}`}
                />
                <div
                  className="bg-purple-500 h-full transition-all"
                  style={{ width: `${((metrics.orderStatusCounts?.processing ?? 0) / metrics.totalOrders) * 100}%` }}
                  title={`Processing: ${metrics.orderStatusCounts?.processing ?? 0}`}
                />
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${((metrics.orderStatusCounts?.pending ?? 0) / metrics.totalOrders) * 100}%` }}
                  title={`Pending: ${metrics.orderStatusCounts?.pending ?? 0}`}
                />
                <div
                  className="bg-rose-500 h-full transition-all"
                  style={{ width: `${((metrics.orderStatusCounts?.cancelled ?? 0) / metrics.totalOrders) * 100}%` }}
                  title={`Cancelled: ${metrics.orderStatusCounts?.cancelled ?? 0}`}
                />
              </>
            ) : (
              <div className="bg-muted h-full w-full" />
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Delivered:</span>
              <span className="font-semibold text-foreground">{metrics?.orderStatusCounts?.delivered ?? 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">In Transit:</span>
              <span className="font-semibold text-foreground">{metrics?.orderStatusCounts?.shipped ?? 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">Processing:</span>
              <span className="font-semibold text-foreground">{metrics?.orderStatusCounts?.processing ?? 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Pending:</span>
              <span className="font-semibold text-foreground">{metrics?.orderStatusCounts?.pending ?? 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-muted-foreground">Cancelled:</span>
              <span className="font-semibold text-foreground">{metrics?.orderStatusCounts?.cancelled ?? 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders Table (Shadcn Data Table Style) */}
      <Card className="rounded-xl border border-border shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Recent Orders Pipeline
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Incoming fulfillment requests and live delivery progression.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1" asChild>
            <Link href="/admin/orders">
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-border bg-muted/40 text-muted-foreground font-medium uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Order</th>
                  <th className="py-2.5 px-4 font-semibold">Customer</th>
                  <th className="py-2.5 px-4 font-semibold">Destination</th>
                  <th className="py-2.5 px-4 font-semibold">Method</th>
                  <th className="py-2.5 px-4 font-semibold">Amount</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold">Risk</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">{order.customerName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {order.deliveryAddress?.thana || (order.deliveryAddress as any)?.district || "Dhaka"}
                      {order.deliveryAddress?.district ? `, ${order.deliveryAddress.district}` : ""}
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground">
                      ৳{Number(order.totalAmount ?? (order as any).total ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-semibold ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : order.status === "SHIPPED"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : order.status === "PROCESSING"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            : order.status === "CONFIRMED"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          order.riskScore === "HIGH"
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {order.riskScore === "HIGH" && <AlertTriangle className="h-3 w-3" />}
                        {order.riskScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          <span>View</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
