import { create } from "zustand";
import {
  adminNotificationService,
  type AdminNotificationMetrics,
} from "@/services/admin-notification.service";

// Simple Web Audio API ping sound generator (doesn't require external audio files)
function playDingSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

interface AdminNotificationState {
  metrics: AdminNotificationMetrics;
  readItemIds: string[];
  isManualDismissed: boolean;
  isLoading: boolean;
  lastFetched: number;
  fetchMetrics: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markItemAsRead: (id: string) => Promise<void>;
  hasUnreadNotifications: () => boolean;
}

export const useAdminNotificationStore = create<AdminNotificationState>((set, get) => ({
  metrics: {
    pendingOrdersCount: 0,
    pendingReturnsCount: 0,
    totalPending: 0,
    unreadNotificationsCount: 0,
    totalUnread: 0,
    recentOrders: [],
    recentReturns: [],
    notifications: [],
  },
  readItemIds: [],
  isManualDismissed: false,
  isLoading: false,
  lastFetched: 0,

  fetchMetrics: async () => {
    try {
      const prevMetrics = get().metrics;
      const data = await adminNotificationService.getMetrics();

      // Trigger audio ding if a new notification arrived or pending order came in
      const hasNewItem =
        data.notifications.length > 0 &&
        prevMetrics.notifications.length > 0 &&
        data.notifications[0]?.id !== prevMetrics.notifications[0]?.id &&
        data.notifications[0]?.status === "UNREAD";

      const hasMoreUnread =
        data.unreadNotificationsCount > (prevMetrics.unreadNotificationsCount || 0);

      const hasMorePending =
        prevMetrics.pendingOrdersCount !== undefined &&
        data.pendingOrdersCount > prevMetrics.pendingOrdersCount;

      if (hasNewItem || hasMoreUnread || hasMorePending) {
        playDingSound();
        set({ isManualDismissed: false });
      }

      set({
        metrics: data,
        lastFetched: Date.now(),
      });
    } catch {
      // Fallback silently
    }
  },

  markAllAsRead: async () => {
    const { metrics, readItemIds } = get();
    const allIds = Array.from(
      new Set([
        ...readItemIds,
        ...metrics.notifications.map((n) => n.id),
        ...metrics.recentOrders.map((o) => o.id),
        ...metrics.recentReturns.map((r) => r.id),
      ])
    );

    // Optimistic UI update
    set({
      readItemIds: allIds,
      isManualDismissed: true,
      metrics: {
        ...metrics,
        unreadNotificationsCount: 0,
        notifications: metrics.notifications.map((n) => ({
          ...n,
          status: "READ",
        })),
      },
    });

    // Call backend
    await adminNotificationService.markAllAsRead();
  },

  markItemAsRead: async (id: string) => {
    const { readItemIds, metrics } = get();
    if (!readItemIds.includes(id)) {
      set({
        readItemIds: [...readItemIds, id],
        metrics: {
          ...metrics,
          unreadNotificationsCount: Math.max(0, metrics.unreadNotificationsCount - 1),
          notifications: metrics.notifications.map((n) =>
            n.id === id ? { ...n, status: "READ" } : n
          ),
        },
      });
    }
    await adminNotificationService.markAsRead(id);
  },

  hasUnreadNotifications: () => {
    const { metrics, readItemIds, isManualDismissed } = get();

    // Check if any notification is genuinely unread and not manually dismissed
    const unreadFromList = metrics.notifications.filter(
      (n) => n.status === "UNREAD" && !readItemIds.includes(n.id)
    );

    if (unreadFromList.length > 0) return true;

    if (isManualDismissed) return false;

    return (
      metrics.pendingOrdersCount > 0 ||
      metrics.pendingReturnsCount > 0 ||
      metrics.unreadNotificationsCount > 0
    );
  },
}));
