import { create } from 'zustand';
import { apiRequest } from '../lib/apiClient';
import { useAuthStore } from './authStore';

const resolveProductId = (item) => item?.product?._id || item?.product || item?.productId?._id || item?.productId || item?.id || null;

const useCartStore = create((set, get) => ({
  cart: { items: [], totalPrice: 0 },
  loading: false,
  error: null,

  getCart: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().accessToken;
      const response = await apiRequest('/api/user/cart', { token });
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
      const items = currentCart ? [...(currentCart.items || [])] : [];
      const itemProductId = resolveProductId(item);
      if (!itemProductId) {
        throw new Error('Invalid product data');
      }
      const existingItemIndex = items.findIndex((i) => {
        const id = resolveProductId(i);
        return id === itemProductId;
      });

      if (existingItemIndex > -1) {
        items[existingItemIndex].quantity += item.quantity;
      } else {
        items.push(item);
      }

      const cleanItems = items.map(i => ({
        product: resolveProductId(i),
        quantity: i.quantity,
        price: i.price,
        color: i.color
      })).filter(i => i.product);
      const totalPrice = cleanItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

      const cartId = currentCart?._id;
      const endpoint = cartId ? `/api/user/cart/${cartId}` : '/api/user/cart';
      const method = cartId ? 'PUT' : 'POST';
      const token = useAuthStore.getState().accessToken;

      const response = await apiRequest(endpoint, { method, body: { items: cleanItems, totalPrice }, token });
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ error: error?.message || 'Failed to add to cart', loading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ loading: true, error: null });
    try {
      const currentCart = get().cart;
      const items = (currentCart?.items || []).map((item) => {
        const id = resolveProductId(item);
        return id === productId ? { ...item, quantity } : item;
      });
      const cleanItems = items.map(i => ({
        product: resolveProductId(i),
        quantity: i.quantity,
        price: i.price,
        color: i.color
      })).filter(i => i.product);
      const totalPrice = cleanItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

      const cartId = currentCart?._id;
      const endpoint = cartId ? `/api/user/cart/${cartId}` : '/api/user/cart';
      const method = cartId ? 'PUT' : 'POST';
      const token = useAuthStore.getState().accessToken;

      const response = await apiRequest(endpoint, { method, body: { items: cleanItems, totalPrice }, token });
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ error: error?.message || 'Failed to update quantity', loading: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ loading: true, error: null });
    try {
      const currentCart = get().cart;
      const items = (currentCart?.items || []).filter((item) => {
        const id = resolveProductId(item);
        return id !== productId;
      });
      const cleanItems = items.map(i => ({
        product: resolveProductId(i),
        quantity: i.quantity,
        price: i.price
      })).filter(i => i.product);
      const totalPrice = cleanItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

      const cartId = currentCart?._id;
      const endpoint = cartId ? `/api/user/cart/${cartId}` : '/api/user/cart';
      const method = cartId ? 'PUT' : 'POST';
      const token = useAuthStore.getState().accessToken;

      const response = await apiRequest(endpoint, { method, body: { items: cleanItems, totalPrice }, token });
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ error: error?.message || 'Failed to remove from cart', loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      const cartId = get().cart?._id;
      const token = useAuthStore.getState().accessToken;
      if (cartId) await apiRequest(`/api/user/cart/${cartId}`, { method: 'DELETE', token });
      set({ cart: { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ cart: { items: [], totalPrice: 0 }, error: null, loading: false });
    }
  },
}));

export default useCartStore;
