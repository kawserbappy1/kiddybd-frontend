import { apiClient } from "@/lib/api-client";
import { WishlistItem } from "@/stores/use-wishlist-store";

export const wishlistService = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const res = await apiClient.get<{ success: boolean; data: WishlistItem[] }>("/wishlist");
    return res.data.data;
  },

  addToWishlist: async (item: WishlistItem): Promise<WishlistItem> => {
    const res = await apiClient.post<{ success: boolean; data: WishlistItem }>("/wishlist", item);
    return res.data.data;
  },

  removeFromWishlist: async (productId: string): Promise<void> => {
    await apiClient.delete(`/wishlist/${productId}`);
  },

  syncWishlist: async (items: WishlistItem[]): Promise<WishlistItem[]> => {
    const res = await apiClient.post<{ success: boolean; data: WishlistItem[] }>("/wishlist/sync", { items });
    return res.data.data;
  },
};
