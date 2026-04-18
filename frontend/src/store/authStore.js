import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "../lib/apiClient";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      register: async ({ name, email, password }) => {
        set({ loading: true, error: null });
        try {
          const result = await apiRequest("/api/auth/register", {
            method: "POST",
            body: { name, email, password },
          });

          set({
            user: result?.data || null,
            accessToken: result?.accessToken || null,
            refreshToken: result?.refreshToken || null,
            loading: false,
            error: null,
          });

          return result;
        } catch (err) {
          set({ loading: false, error: err.message || "Registration failed" });
          throw err;
        }
      },

      login: async ({ email, password }) => {
        set({ loading: true, error: null });
        try {
          const result = await apiRequest("/api/auth/login", {
            method: "POST",
            body: { email, password },
          });

          set({
            user: result?.data || null,
            accessToken: result?.accessToken || null,
            refreshToken: result?.refreshToken || null,
            loading: false,
            error: null,
          });

          return result;
        } catch (err) {
          set({ loading: false, error: err.message || "Login failed" });
          throw err;
        }
      },

      refresh: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return null;

        try {
          const result = await apiRequest("/api/auth/refresh", {
            method: "POST",
            body: { refreshToken },
          });

          set({
            accessToken: result?.accessToken || null,
            refreshToken: result?.refreshToken || null,
          });

          return result;
        } catch (_err) {
          set({ accessToken: null, refreshToken: null });
          return null;
        }
      },

      initializeAuth: async () => {
        const { accessToken, refreshToken, refresh } = get();
        if (accessToken || !refreshToken) return;
        await refresh();
      },

      verifyEmail: async (token) => {
        if (!token) throw new Error("Missing verification token");
        return apiRequest(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
          method: "GET",
        });
      },


      logout: async () => {
        const { refreshToken } = get();
        try {
          await apiRequest("/api/auth/logout", {
            method: "POST",
            body: refreshToken ? { refreshToken } : undefined,
          });
        } catch (_err) {
          // ignore logout errors
        }
        set({ ...initialState });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

