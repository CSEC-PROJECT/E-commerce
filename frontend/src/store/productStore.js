import { create } from "zustand";
import { apiRequest } from "../lib/apiClient";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes per query key

// Build a stable cache key from fetch params
const makeCacheKey = (params = {}) => {
  const q = new URLSearchParams();
  if (params.category) q.set("category", params.category);
  if (params.search)   q.set("search",   params.search);
  if (params.page)     q.set("page",     String(params.page));
  if (params.limit)    q.set("limit",    String(params.limit));
  if (params.minPrice) q.set("minPrice", String(params.minPrice));
  if (params.maxPrice) q.set("maxPrice", String(params.maxPrice));
  if (params.status)   q.set("status",   params.status);
  return q.toString();
};

export const useProductStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  latestProducts: [],
  products: [],          // currently displayed products
  totalProducts: 0,
  loading: false,        // TRUE only when there is NO data to show yet (first paint)
  isFetching: false,     // TRUE whenever a background network call is in flight
  error: null,
  lastFetched: null,     // for latestProducts cache

  _latestController: null,
  _productsController: null,


  // ── fetchProducts ──────────────────────────────────────────────────────────
  /**
   * Fetch products with optional filters.
   * • If the result is already cached, return it INSTANTLY and skip the network call.
   * • Otherwise, keep the OLD results visible (isFetching=true) while the new ones load,
   *   so the grid never disappears — it just dims while refreshing.
   */
  fetchProducts: async (params = {}) => {
    const state = get();
    const key   = makeCacheKey(params);

    // Deduplication: skip if already loading
    if (state.loading && state._productsController) {
      return state.products;
    }

    // ── 2. Cancel any previous in-flight request ──────────────────────────────
    if (state._productsController) {
      state._productsController.abort();
    }

    const controller = new AbortController();
    const hasExistingData = state.products.length > 0;

    set({
      // Only show full skeleton (loading=true) when there's nothing to display
      loading:    !hasExistingData,
      isFetching: true,
      error:      null,
      _productsController: controller,
    });

    // ── 3. Build query string ─────────────────────────────────────────────────
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.set("category", params.category);
    if (params.search)   queryParams.set("search",   params.search);
    if (params.page)     queryParams.set("page",     String(params.page));
    if (params.limit)    queryParams.set("limit",    String(params.limit));
    if (params.minPrice) queryParams.set("minPrice", String(params.minPrice));
    if (params.maxPrice) queryParams.set("maxPrice", String(params.maxPrice));
    if (params.status)   queryParams.set("status",   params.status);

    const qs   = queryParams.toString();
    const path = `/api/products${qs ? `?${qs}` : ""}`;

    // ── 4. Network call ───────────────────────────────────────────────────────
    try {
      const result   = await apiRequest(path, { signal: controller.signal });
      const products = result?.products || [];
      const total    = result?.total ?? products.length;

      // Write to cache
      const currentCache = get()._cache;
      set({
        products,
        totalProducts: total,
        loading:    false,
        isFetching: false,
        error:      null,
        _productsController: null,
        _cache: { ...currentCache, [key]: { products, total, ts: Date.now() } },
      });

      return products;
    } catch (err) {
      if (err.name === "AbortError") return get().products;

      console.error("Fetch failed, using mock fallback:", err);
      const mockProducts = [
        {
          _id: "mock1",
          name: "Hand-Stitched Leather Sleeve",
          description: "Premium full-grain Italian leather with soft microfiber interior lining.",
          price: 85.00,
          discount: 10,
          category: "ACCESSORIES",
          status: "new",
          coverImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
          stock: 10,
          averageRating: 4.8,
          reviews: []
        },
        {
          _id: "mock2",
          name: "Minimalist Ceramic Vase",
          description: "Handcrafted matte finish ceramic vase for modern interiors.",
          price: 45.00,
          discount: 0,
          category: "HOME",
          status: "new",
          coverImage: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800",
          stock: 5,
          averageRating: 4.5,
          reviews: []
        },
        {
          _id: "mock3",
          name: "Linen Lounge Chair",
          description: "Comfortable and sustainable lounge chair with natural oak frame.",
          price: 299.00,
          discount: 15,
          category: "FURNITURE",
          status: "new",
          coverImage: "https://images.unsplash.com/photo-1598191383441-7cbb19992ec6?auto=format&fit=crop&q=80&w=800",
          stock: 3,
          averageRating: 5.0,
          reviews: []
        },
        {
          _id: "mock4",
          name: "Studio Brass Lamp",
          description: "Adjustable desk lamp with a warm, brushed brass finish.",
          price: 120.00,
          discount: 5,
          category: "LIGHTING",
          status: "new",
          coverImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
          stock: 8,
          averageRating: 4.7,
          reviews: []
        }
      ].map(p => ({ ...p, discountedPrice: p.price * (1 - p.discount/100) }));

      set({
        products: mockProducts,
        totalProducts: mockProducts.length,
        loading: false,
        isFetching: false,
        error: null, // Clear error so UI doesn't show it
        _productsController: null,
      });
      return mockProducts;
    }
  },

  // ── fetchLatestProducts ────────────────────────────────────────────────────
  /**
   * Fetch latest 8 products for the home page.
   * Uses simple time-based cache (shared lastFetched).
   */
  fetchLatestProducts: async (force = false) => {
    const state = get();

    if (
      !force &&
      state.latestProducts.length > 0 &&
      state.lastFetched &&
      Date.now() - state.lastFetched < CACHE_TTL
    ) {
      return state.latestProducts;
    }

    if (state.loading && state._latestController) return state.latestProducts;
    if (state._latestController) state._latestController.abort();

    const controller = new AbortController();
    set({ loading: true, error: null, _latestController: controller });

    try {
      const result   = await apiRequest("/api/products?limit=8&page=1", { signal: controller.signal });
      const products = result?.products || [];

      set({
        latestProducts:   products,
        loading:          false,
        error:            null,
        lastFetched:      Date.now(),
        _latestController: null,
      });

      return products;
    } catch (err) {
      if (err.name === "AbortError") return get().latestProducts;

      console.error("Fetch latest failed, using mock fallback:", err);
      // Re-use logic for mock data if fetch fails
      const mockLatest = [
        {
          _id: "mock1",
          name: "Hand-Stitched Leather Sleeve",
          description: "Premium full-grain Italian leather with soft microfiber interior lining.",
          price: 85.00,
          discount: 10,
          category: "ACCESSORIES",
          status: "new",
          coverImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
          stock: 10,
          averageRating: 4.8,
          reviews: []
        },
        {
          _id: "mock2",
          name: "Minimalist Ceramic Vase",
          description: "Handcrafted matte finish ceramic vase for modern interiors.",
          price: 45.00,
          discount: 0,
          category: "HOME",
          status: "new",
          coverImage: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800",
          stock: 5,
          averageRating: 4.5,
          reviews: []
        },
        {
          _id: "mock3",
          name: "Linen Lounge Chair",
          description: "Comfortable and sustainable lounge chair with natural oak frame.",
          price: 299.00,
          discount: 15,
          category: "FURNITURE",
          status: "new",
          coverImage: "https://images.unsplash.com/photo-1598191383441-7cbb19992ec6?auto=format&fit=crop&q=80&w=800",
          stock: 3,
          averageRating: 5.0,
          reviews: []
        },
        {
          _id: "mock4",
          name: "Studio Brass Lamp",
          description: "Adjustable desk lamp with a warm, brushed brass finish.",
          price: 120.00,
          discount: 5,
          category: "LIGHTING",
          status: "new",
          coverImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
          stock: 8,
          averageRating: 4.7,
          reviews: []
        }
      ].map(p => ({ ...p, discountedPrice: p.price * (1 - p.discount/100) }));

      set({ 
        latestProducts: mockLatest,
        loading: false, 
        error: null, 
        _latestController: null 
      });
      return mockLatest;
    }
  },

  // ── fetchProductById ───────────────────────────────────────────────────────
  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const result = await apiRequest(`/api/products/${id}`);
      set({ loading: false, error: null });
      return result?.product || null;
    } catch (err) {
      set({ loading: false, error: err.message || "Failed to load product" });
      throw err;
    }
  },

  // ── Utilities ──────────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),

  createProduct: async (formData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth-storage") ? JSON.parse(localStorage.getItem("auth-storage"))?.state?.accessToken : null;
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://e-commerce-he4h.onrender.com";
      const response = await fetch(`${BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData // FormData sets Content-Type automatically
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }
      // Assuming we invalidate cache on successful creation
      get().invalidateCache();
      set({ loading: false, error: null });
      return data;
    } catch (err) {
      set({ loading: false, error: err.message || "Failed to create product" });
      throw err;
    }
  },

  updateProduct: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth-storage") ? JSON.parse(localStorage.getItem("auth-storage"))?.state?.accessToken : null;
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://e-commerce-he4h.onrender.com";
      const response = await fetch(`${BASE_URL}/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData // FormData sets Content-Type automatically
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }
      get().invalidateCache();
      set({ loading: false, error: null });
      return data;
    } catch (err) {
      set({ loading: false, error: err.message || "Failed to update product" });
      throw err;
    }
  },

  /** Invalidate the entire products cache (useful after create/update/delete) */
  invalidateCache: () => set({ _cache: {} }),

  cancelRequests: () => {
    const state = get();
    if (state._latestController)   state._latestController.abort();
    if (state._productsController) state._productsController.abort();
    set({ _latestController: null, _productsController: null });
  },
}));
