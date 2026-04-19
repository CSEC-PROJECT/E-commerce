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

    if (
      !force &&
      state.latestProducts.length > 0 &&
      state.lastFetched &&
      Date.now() - state.lastFetched < CACHE_DURATION
    ) {
      return state.latestProducts;
    }

    // Deduplication: skip if already loading
    if (state.loading && state._latestController) {
      return state.latestProducts;
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

      set({
        loading:    false,
        isFetching: false,
        error:      err.message || "Failed to load products",
        _productsController: null,
      });
      throw err;
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

      set({ loading: false, error: err.message || "Failed to load products", _latestController: null });
      throw err;
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

  /** Invalidate the entire products cache (useful after create/update/delete) */
  invalidateCache: () => set({ _cache: {} }),

  cancelRequests: () => {
    const state = get();
    if (state._latestController)   state._latestController.abort();
    if (state._productsController) state._productsController.abort();
    set({ _latestController: null, _productsController: null });
  },
}));
