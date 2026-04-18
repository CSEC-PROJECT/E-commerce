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

  // Per-query result cache: { [cacheKey]: { products, total, ts } }
  _cache: {},

  // In-flight controllers
  _latestController: null,
  _productsController: null,

  // ── Helpers ────────────────────────────────────────────────────────────────
  _isCacheFresh: (key) => {
    const entry = get()._cache[key];
    return entry && Date.now() - entry.ts < CACHE_TTL;
  },

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

    // ── 1. Cache hit → instant return ────────────────────────────────────────
    if (state._isCacheFresh(key)) {
      const { products, total } = state._cache[key];
      set({ products, totalProducts: total, loading: false, isFetching: false, error: null });
      return products;
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

  /** Invalidate the entire products cache (useful after create/update/delete) */
  invalidateCache: () => set({ _cache: {} }),

  cancelRequests: () => {
    const state = get();
    if (state._latestController)   state._latestController.abort();
    if (state._productsController) state._productsController.abort();
    set({ _latestController: null, _productsController: null });
  },
}));
