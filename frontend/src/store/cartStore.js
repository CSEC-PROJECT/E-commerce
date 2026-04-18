import { create } from 'zustand';
import { apiRequest } from '../lib/apiClient';

const useCartStore = create((set, get) => ({
  cart: { items: [], totalPrice: 0 },
  loading: false,
  error: null,

  getCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiRequest('/api/user/cart');
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      const msg = error?.message || 'Failed to fetch cart';
      if (msg === 'Unauthorized') {
        set({ error: msg, loading: false });
      } else {
        set({ cart: { items: [], totalPrice: 0 }, loading: false });
      }
    }
  },

  addToCart: async (item) => {
    set({ loading: true, error: null });
    try {
      const currentCart = get().cart;
      const items = currentCart ? [...currentCart.items] : [];
      const existingItemIndex = items.findIndex((i) => i.product === item.product);

      if (existingItemIndex > -1) {
        items[existingItemIndex].quantity += item.quantity;
      } else {
        items.push(item);
      }

      const totalPrice = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

      const response = await apiRequest('/api/user/cart', { method: 'POST', body: { items, totalPrice } });
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ error: error?.message || 'Failed to add to cart', loading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ loading: true, error: null });
    try {
      const items = (get().cart.items || []).map((item) =>
        item.product === productId ? { ...item, quantity } : item
      );
      const totalPrice = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

      const response = await apiRequest('/api/user/cart', { method: 'POST', body: { items, totalPrice } });
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ error: error?.message || 'Failed to update quantity', loading: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ loading: true, error: null });
    try {
      const items = (get().cart.items || []).filter((item) => item.product !== productId);
      const totalPrice = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

      const response = await apiRequest('/api/user/cart', { method: 'POST', body: { items, totalPrice } });
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ error: error?.message || 'Failed to remove from cart', loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      const cartId = get().cart?._id;
      if (cartId) await apiRequest(`/api/user/cart/${cartId}`, { method: 'DELETE' });
      set({ cart: { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ error: error?.message || 'Failed to clear cart', loading: false });
    }
  },
}));

export default useCartStore;
