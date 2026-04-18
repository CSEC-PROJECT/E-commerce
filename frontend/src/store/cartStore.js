import { create } from "zustand";
import { apiRequest } from "../lib/apiClient";

export const useCartStore = create((set, get) => ({
  items: [],
  cartCount: 0,
  loading: false,
  error: null,

  /**
   * Fetch the current user's cart from the backend.
   * Requires the user to be authenticated (cookie-based auth).
   */
  fetchCart: async () => {
    const state = get();
    if (state.loading) return;

    set({ loading: true, error: null });
    try {
      const data = await apiRequest("/api/user/cart");
      // Backend returns { cart: { items: [...] } } or { items: [...] }
      const items = data?.cart?.items ?? data?.items ?? [];
      set({
        items,
        cartCount: items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
        loading: false,
      });
    } catch (err) {
      // If 401 (not logged in) just silently clear the cart
      set({ items: [], cartCount: 0, loading: false, error: null });
    }
  },

  /** Reset cart state (e.g. on logout) */
  clearCart: () => set({ items: [], cartCount: 0, error: null }),
}));
