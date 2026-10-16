"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCartStore } from "@/stores/use-cart-store";
import { apiClient } from "@/lib/api-client";
import { OrderDetail } from "@/lib/order-tracking-data";
import { BD_LOCATIONS } from "@/lib/bd-locations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  ShoppingBag,
  MapPin,
  Baby,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";

interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  streetAddress: string;
  isDefault: boolean;
}

export interface AccountDashboardProps {
  initialTab?: "profile" | "orders" | "addresses";
}

export function AccountDashboardContent({ initialTab = "orders" }: AccountDashboardProps) {
  const { user, setUser } = useAuthStore();
  const { addItem, openCart } = useCartStore();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") as "profile" | "orders" | "addresses" | null;

  const [activeTab, setActiveTab] = React.useState<"profile" | "orders" | "addresses">(
    urlTab || initialTab
  );

  React.useEffect(() => {
    if (urlTab && ["profile", "orders", "addresses"].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  // 1. Profile State (Synced with authenticated user)
  const [name, setName] = React.useState(user?.name || "Parent User");
  const [email, setEmail] = React.useState(user?.email || "parent@kiddybd.com");
  const [phone, setPhone] = React.useState(user?.phone || "017XXXXXXXX");
  const [childBirthMonth, setChildBirthMonth] = React.useState("March");
  const [childBirthYear, setChildBirthYear] = React.useState("2023");
  const [childInterests, setChildInterests] = React.useState(["Montessori & Puzzles", "Art & Sensory"]);

  React.useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // 2. Orders State
  const [orders, setOrders] = React.useState<OrderDetail[]>([]);

  // Fetch real customer orders from backend
  React.useEffect(() => {
    async function loadRealOrders() {
      if (!user) return;
      try {
        const res = await apiClient.get<any>("/orders");
        if (res.data?.data && Array.isArray(res.data.data)) {
          const mapped: OrderDetail[] = res.data.data.map((o: any) => {
            const snap = o.shippingAddressSnapshot || {};
            return {
              id: o.id,
              orderNumber: o.orderNumber,
              status:
                o.status === "DELIVERED"
                  ? "DELIVERED"
                  : o.status === "SHIPPED"
                  ? "SHIPPED"
                  : o.status === "PROCESSING"
                  ? "PROCESSING"
                  : o.status === "CONFIRMED"
                  ? "CONFIRMED"
                  : o.status === "CANCELLED"
                  ? "CANCELLED"
                  : "PENDING",
              paymentStatus: o.paymentStatus || "PENDING",
              paymentMethod: o.paymentStatus === "PENDING" ? "COD" : "ONLINE",
              recipientName: snap.fullName || user?.name || "Customer",
              phone: snap.phone || user?.phone || "",
              deliveryAddress: `${snap.streetAddress || ""}, ${snap.thana || ""}, ${snap.district || ""}`,
              deliveryNotes: snap.deliveryNotes || "",
              subtotal: Number(o.subtotal || 0),
              deliveryFee: Number(o.deliveryCharge || 0),
              discountAmount: Number(o.discount || 0),
              total: Number(o.total || 0),
              createdAt: o.createdAt || new Date().toISOString(),
              items: (o.items || []).map((it: any) => ({
                id: it.id,
                productId: it.productId,
                title: it.productNameSnapshot || "Toy & Learning Item",
                slug: (it.productNameSnapshot || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                price: Number(it.unitPrice || 0),
                quantity: it.quantity || 1,
                imageUrl:
                  it.imageUrl ||
                  "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&auto=format&fit=crop&q=80",
              })),
              courierPartner: {
                name: (o.shipment?.courier?.name as any) || "Pathao",
                trackingCode:
                  o.shipment?.trackingId || `PTH-${o.orderNumber.replace(/\D/g, "") || "882910"}`,
                trackingUrl:
                  o.shipment?.courier?.name?.toLowerCase() === "steadfast"
                    ? `https://steadfast.com.bd/t/${o.shipment?.trackingId || ""}`
                    : o.shipment?.courier?.name?.toLowerCase() === "redx"
                    ? `https://redx.com.bd/track-parcel/?trackingId=${o.shipment?.trackingId || ""}`
                    : `https://pathao.com/courier/tracking?tracking_id=${
                        o.shipment?.trackingId || o.orderNumber
                      }`,
              },
            };
          });
          setOrders(mapped);
        }
      } catch {
        // Fallback to initial mock orders
      }
    }
    loadRealOrders();
  }, [user]);

  // 3. Addresses State (Dynamic & User-Specific, No Demo/Nusrat Jahan Mock Data)
  const [addresses, setAddresses] = React.useState<SavedAddress[]>([]);

  // Load saved addresses from localStorage or past orders
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const storageKey = user?.id ? `kiddybd_saved_addresses_${user.id}` : "kiddybd_saved_addresses";
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAddresses(parsed);
          return;
        }
      } catch {}
    }

    // If no localStorage addresses, check if user has addresses from past orders
    if (orders && orders.length > 0) {
      const fromOrders: SavedAddress[] = [];
      const seen = new Set<string>();

      for (const ord of orders) {
        if (!ord.deliveryAddress || seen.has(ord.deliveryAddress)) continue;
        seen.add(ord.deliveryAddress);

        const parts = ord.deliveryAddress.split(",").map((s) => s.trim());
        const street = parts[0] || ord.deliveryAddress;
        const thana = parts[1] || "Dhanmondi";
        const district = parts[2] || "Dhaka";

        fromOrders.push({
          id: `addr-ord-${ord.id}`,
          label: fromOrders.length === 0 ? "Default Shipping Address" : `Order Address (${ord.orderNumber})`,
          fullName: ord.recipientName || user?.name || "Customer",
          phone: ord.phone || user?.phone || "",
          division: "Dhaka",
          district,
          thana,
          streetAddress: street,
          isDefault: fromOrders.length === 0,
        });
      }

      if (fromOrders.length > 0) {
        setAddresses(fromOrders);
        localStorage.setItem(storageKey, JSON.stringify(fromOrders));
      }
    }
  }, [user, orders]);

  const persistAddresses = (updated: SavedAddress[]) => {
    setAddresses(updated);
    if (typeof window !== "undefined") {
      const storageKey = user?.id ? `kiddybd_saved_addresses_${user.id}` : "kiddybd_saved_addresses";
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [newLabel, setNewLabel] = React.useState("");
  const [newFullName, setNewFullName] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [newDivision, setNewDivision] = React.useState("Dhaka");
  const [newDistrict, setNewDistrict] = React.useState("Dhaka");
  const [newThana, setNewThana] = React.useState("Dhanmondi");
  const [newStreet, setNewStreet] = React.useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({ ...user, name, email, phone });
    }
    toast.success("Profile & Child developmental preferences saved! ✨");
  };

  const handleReorder = (order: OrderDetail) => {
    order.items.forEach((item) => {
      addItem({
        id: `cart-${item.productId}-${Date.now()}`,
        productId: item.productId,
        title: item.title,
        slug: item.slug,
        price: item.price,
        imageUrl: item.imageUrl,
        ageGroup: "Reordered Favorite",
      });
    });
    toast.success("Items re-added to your shopping bag! 🛍️");
    openCart();
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    persistAddresses(updated);
    toast.success("Default delivery address updated.");
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    persistAddresses(updated);
    toast.success("Address removed.");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newStreet) {
      toast.error("Please fill in all address fields.");
      return;
    }

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: newLabel.trim() || (addresses.length === 0 ? "Default Address" : "Delivery Address"),
      fullName: newFullName.trim(),
      phone: newPhone.trim(),
      division: newDivision,
      district: newDistrict,
      thana: newThana,
      streetAddress: newStreet.trim(),
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddr];
    persistAddresses(updated);
    setIsAddingAddress(false);
    setNewLabel("");
    setNewFullName("");
    setNewPhone("");
    setNewStreet("");
    toast.success("New delivery address saved! 📍");
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Profile Bar */}
        <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF3E78] to-pink-400 text-white flex items-center justify-center font-display font-black text-2xl shadow-md">
              {name.charAt(0) || "N"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black font-display text-foreground tracking-tight">
                  {name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary">
                  Verified Parent
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {email} • {phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/40 p-3 rounded-2xl border border-border/60">
            <Baby className="w-4 h-4 text-amber-500" />
            <span>
              Child Age: <strong className="text-foreground">~3.5 Years (Toddler)</strong>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-border/70 pb-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Order History ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4" /> My Profile & Child Preferences
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "addresses"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="w-4 h-4" /> Manage Addresses ({addresses.length})
          </button>
        </div>

        {/* Tab 1: Order History */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border/70 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 hover:border-primary/40 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-black font-display text-base text-foreground">
                        Order #{order.orderNumber}
                      </span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : order.status === "CONFIRMED"
                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                            : "bg-amber-500/15 text-amber-600"
                        }`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Placed on {order.createdAt} • Total:{" "}
                      <strong className="text-foreground">৳{order.total.toLocaleString()}</strong>
                    </p>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      asChild
                      size="sm"
                      className="rounded-xl h-9 px-3.5 text-xs font-bold gap-1.5"
                    >
                      <Link href={`/orders/${order.orderNumber}`}>
                        <ExternalLink className="w-3.5 h-3.5" /> Track Live
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReorder(order)}
                      className="rounded-xl h-9 px-3.5 text-xs font-bold gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Reorder
                    </Button>

                    {(order.status as string) !== "CANCELLED" && (
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="rounded-xl h-9 px-3.5 text-xs font-bold gap-1.5"
                      >
                        <Link href={`/account/returns?order=${order.orderNumber}`}>
                          <RotateCcw className="w-3.5 h-3.5" /> Return / Replacement
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2.5">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 p-2 rounded-2xl bg-muted/20"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted/60 shrink-0 border border-border/50">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            🧸
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[11px] text-muted-foreground">
                          Qty: {item.quantity} • ৳{item.price.toLocaleString()} each
                        </span>
                      </div>

                      <div className="text-xs font-black text-foreground">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Profile & Child Preferences */}
        {activeTab === "profile" && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 max-w-2xl"
          >
            <div>
              <h2 className="text-lg font-black font-display text-foreground tracking-tight">
                Parent Profile & Child Gift Tailoring
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                We use your child&apos;s birth month/year to recommend precisely age-matched toys for their developmental milestones.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-muted/50 border border-border text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-muted/50 border border-border text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-muted/50 border border-border text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-primary"
                required
              />
            </div>

            {/* Child Milestones Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Child Birthday & Developmental Interests
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Birth Month</label>
                  <select
                    value={childBirthMonth}
                    onChange={(e) => setChildBirthMonth(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-card border border-border text-xs font-bold text-foreground"
                  >
                    {[
                      "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December",
                    ].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Birth Year</label>
                  <select
                    value={childBirthYear}
                    onChange={(e) => setChildBirthYear(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-card border border-border text-xs font-bold text-foreground"
                  >
                    {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019"].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Button type="submit" className="rounded-2xl px-6 h-11 font-bold text-xs shadow-md">
              Save Profile Preferences
            </Button>
          </form>
        )}

        {/* Tab 3: Manage Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black font-display text-foreground tracking-tight">
                  Saved Delivery Addresses
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add or edit locations for fast 1-click checkout
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  if (!isAddingAddress) {
                    setNewFullName(user?.name || "");
                    setNewPhone(user?.phone || "");
                  }
                  setIsAddingAddress(!isAddingAddress);
                }}
                className="rounded-2xl px-4 h-9 font-bold text-xs gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </Button>
            </div>

            {/* Empty State when no addresses saved */}
            {addresses.length === 0 && !isAddingAddress && (
              <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-border/80 bg-muted/20 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-foreground">No saved addresses yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Add your delivery address for faster 1-click checkout and automated delivery tracking.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setNewFullName(user?.name || "");
                    setNewPhone(user?.phone || "");
                    setIsAddingAddress(true);
                  }}
                  className="rounded-2xl gap-2 font-bold text-xs shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </Button>
              </div>
            )}

            {/* Address Add Form Drawer */}
            {isAddingAddress && (
              <form
                onSubmit={handleAddAddress}
                className="p-5 sm:p-6 rounded-3xl bg-muted/40 border border-border/80 space-y-4 animate-in fade-in-50"
              >
                <h3 className="font-bold text-sm text-foreground">Add New Address</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Address Label (e.g. Home, Office)"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-card border border-border text-xs text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Recipient Full Name"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-card border border-border text-xs text-foreground"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Phone Number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-card border border-border text-xs text-foreground"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={newDivision}
                    onChange={(e) => setNewDivision(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-card border border-border text-xs text-foreground"
                  >
                    {BD_LOCATIONS.divisions.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="District (e.g. Dhaka)"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-card border border-border text-xs text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Thana (e.g. Dhanmondi)"
                    value={newThana}
                    onChange={(e) => setNewThana(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-card border border-border text-xs text-foreground"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Detailed House #, Road #, Area..."
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full p-3 rounded-xl bg-card border border-border text-xs text-foreground"
                  required
                />

                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="rounded-xl px-4 h-9 text-xs font-bold">
                    Save Address
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingAddress(false)}
                    className="rounded-xl h-9 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 rounded-3xl border-2 transition-all space-y-3 bg-card ${
                    addr.isDefault
                      ? "border-primary shadow-xs ring-2 ring-primary/20"
                      : "border-border/70"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">
                        {addr.fullName} • 📞 {addr.phone}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-muted-foreground hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {addr.streetAddress}, {addr.thana}, {addr.district}, {addr.division}
                  </p>

                  <div className="pt-2 border-t border-border/50">
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Set as Default Address
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountDashboardPage(props: AccountDashboardProps) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 text-sm text-muted-foreground">
          Loading account dashboard...
        </div>
      }
    >
      <AccountDashboardContent {...props} />
    </React.Suspense>
  );
}
