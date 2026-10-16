import { create } from "zustand";

interface ReviewSyncState {
  // Map of productId or slug to added reviews
  extraReviews: Record<string, any[]>;
  addReview: (productIdentifier: string, review: any) => void;
  getExtraReviews: (productIdentifier: string) => any[];
}

const EMPTY_REVIEWS: any[] = [];

export const useReviewSyncStore = create<ReviewSyncState>((set, get) => ({
  extraReviews: {},
  addReview: (productIdentifier, review) => {
    set((state) => {
      const existing = state.extraReviews[productIdentifier] || EMPTY_REVIEWS;
      // Prevent duplicate review IDs
      if (existing.some((r) => r.id === review.id)) {
        return state;
      }
      return {
        extraReviews: {
          ...state.extraReviews,
          [productIdentifier]: [review, ...existing],
        },
      };
    });
  },
  getExtraReviews: (productIdentifier) => {
    return get().extraReviews[productIdentifier] || EMPTY_REVIEWS;
  },
}));

export { EMPTY_REVIEWS };

