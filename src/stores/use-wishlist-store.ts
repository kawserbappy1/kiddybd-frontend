import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { wishlistService } from "@/services/wishlist.service";

export interface WishlistItem {
  productId: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  category?: string;
  inStock?: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  getCount: () => number;
  syncWithBackend: (isAuthenticated: boolean) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      toggleWishlist: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== item.productId),
          }));
          wishlistService.removeFromWishlist(item.productId).catch(() => {});
        } else {
          set((state) => ({
            items: [...state.items, item],
          }));
          wishlistService.addToWishlist(item).catch(() => {});
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
        wishlistService.removeFromWishlist(productId).catch(() => {});
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getCount: () => {
        return get().items.length;
      },

      syncWithBackend: async (isAuthenticated: boolean) => {
        if (!isAuthenticated) return;
        set({ isLoading: true });
        try {
          const currentItems = get().items;
          const remoteItems = await wishlistService.syncWishlist(currentItems);
          if (Array.isArray(remoteItems) && remoteItems.length > 0) {
            set({ items: remoteItems, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch {
          // If backend unavailable or 404, fallback to local storage
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "kiddy_wishlist_store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
