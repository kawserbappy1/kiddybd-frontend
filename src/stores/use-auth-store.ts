import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/api.types";
import { authService } from "@/services/auth.service";
import { setAccessToken } from "@/lib/api-client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  isAuthModalOpen: boolean;
  setHydrated: (hydrated: boolean) => void;
  setUser: (user: User | null) => void;
  setAuthModalOpen: (open: boolean) => void;
  loginSuccess: (user: User, accessToken: string) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      isAuthModalOpen: false,

      setHydrated: (isHydrated) => set({ isHydrated }),

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setAuthModalOpen: (open) => {
        set({ isAuthModalOpen: open });
      },

      loginSuccess: (user, accessToken) => {
        setAccessToken(accessToken);
        set({
          user,
          isAuthenticated: true,
          isAuthModalOpen: false,
        });
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } finally {
          setAccessToken(null);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      checkSession: async () => {
        if (!get().isAuthenticated && !localStorage.getItem("kiddy_access_token")) {
          return;
        }
        set({ isLoading: true });
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            set({ user: res.data, isAuthenticated: true });
          }
        } catch (err: any) {
          // Only clear session if explicitly unauthenticated (401)
          if (err?.statusCode === 401 || err?.response?.status === 401) {
            get().logout();
          }
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "kiddy_auth_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Ensure hydration state is tracked immediately on client
if (typeof window !== "undefined") {
  if (useAuthStore.persist.hasHydrated()) {
    useAuthStore.getState().setHydrated(true);
  } else {
    useAuthStore.persist.onFinishHydration(() => {
      useAuthStore.getState().setHydrated(true);
    });
  }

  // Listen to session expiry events dispatched by axios interceptor
  window.addEventListener("kiddy_auth_expired", () => {
    useAuthStore.getState().logout();
  });
}

