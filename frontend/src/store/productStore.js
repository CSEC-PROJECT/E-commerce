import { create } from "zustand";
import { apiRequest } from "../lib/apiClient";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProductStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────
  latestProducts: [],
  products: [],
  totalProducts: 0,
  loading: false,
  error: null,
  lastFetched: null,

  _latestController: null,
  _productsController: null,


  /**
   * Fetch the latest 8 products for the home page.
   * Uses stale-while-revalidate: skips fetch if data is < 5 min old.
   * @param {boolean} force - Force refetch ignoring cache
   */
  fetchLatestProducts: async (force = false) => {
    const state = get();

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

    // Cancel any previous in-flight request
    if (state._latestController) {
      state._latestController.abort();
    }

    const controller = new AbortController();
    set({ loading: true, error: null, _latestController: controller });

    try {
      const result = await apiRequest("/api/products?limit=8&page=1", {
        signal: controller.signal,
      });

      const products = result?.products || [];

      set({
        latestProducts: products,
        loading: false,
        error: null,
        lastFetched: Date.now(),
        _latestController: null,
      });

      return products;
    } catch (err) {
      // Don't set error state for aborted requests
      if (err.name === "AbortError") return get().latestProducts;

      set({
        loading: false,
        error: err.message || "Failed to load products",
        _latestController: null,
      });
      throw err;
    }
  },

  /**
   * Fetch products with optional filters (for products page).
   * @param {Object} params - Query parameters
   * @param {string} params.category - Filter by category
   * @param {string} params.search - Search term
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {number} params.minPrice - Min price filter
   * @param {number} params.maxPrice - Max price filter
   */
  fetchProducts: async (params = {}) => {
    const state = get();

    // Cancel any previous products request
    if (state._productsController) {
      state._productsController.abort();
    }

    const controller = new AbortController();
    set({ loading: true, error: null, _productsController: controller });

    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.set("category", params.category);
      if (params.search) queryParams.set("search", params.search);
      if (params.page) queryParams.set("page", String(params.page));
      if (params.limit) queryParams.set("limit", String(params.limit));
      if (params.minPrice) queryParams.set("minPrice", String(params.minPrice));
      if (params.maxPrice) queryParams.set("maxPrice", String(params.maxPrice));
      if (params.status) queryParams.set("status", params.status);

      const queryString = queryParams.toString();
      const path = `/api/products${queryString ? `?${queryString}` : ""}`;

      const result = await apiRequest(path, {
        signal: controller.signal,
      });

      const products = result?.products || [];

      set({
        products,
        totalProducts: result?.total ?? products.length,
        loading: false,
        error: null,
        _productsController: null,
      });

      return products;
    } catch (err) {
      if (err.name === "AbortError") return get().products;

      set({
        loading: false,
        error: err.message || "Failed to load products",
        _productsController: null,
      });
      throw err;
    }
  },

  /**
   * Fetch a single product by ID.
   * @param {string} id - The product MongoDB _id
   */
  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const result = await apiRequest(`/api/products/${id}`);
      set({ loading: false, error: null });
      return result?.product || null;
    } catch (err) {
      set({
        loading: false,
        error: err.message || "Failed to load product",
      });
      throw err;
    }
  },

  /** Clear any stored error */
  clearError: () => set({ error: null }),

  /** Cancel any in-flight requests (useful for cleanup) */
  cancelRequests: () => {
    const state = get();
    if (state._latestController) state._latestController.abort();
    if (state._productsController) state._productsController.abort();
    set({ _latestController: null, _productsController: null });
  },
}));
