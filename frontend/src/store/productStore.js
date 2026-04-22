import { create } from "zustand";
import { apiRequest } from "../lib/apiClient";

export const useProductStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  latestProducts: [],
  products: [],          // Base cached products (fetched once)
  filteredProducts: [],  // Subset of products based on current filters
  totalProducts: 0,
  loading: false,        
  error: null,

  error: null,

  categories: [],
  selectedCategory: null,
  hasFetchedCategories: false,

  fetchCategories: async () => {
    const state = get();
    if (state.hasFetchedCategories) return;

    try {
      const result = await apiRequest("/api/products?limit=100");
      const uniqueCategories = [
        ...new Set(
          (result?.products || [])
            .map(p => p.category)
            .filter(c => c && c !== "string")
        )
      ];

      set({
        categories: uniqueCategories,
        hasFetchedCategories: true
      });
    } catch (err) {
      console.error("Category fetch failed", err);
    }
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category === "All Collections" ? null : category });
  },

  // ── fetchProducts ──────────────────────────────────────────────────────────
  /**
   * Fetch ALL products exactly once and cache them in store locally.
   * If already exists, do not refetch.
   */
  fetchProducts: async () => {
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

    try {
      // Fetch up to 20 items to load them all into local state for filtering
      const result = await apiRequest("/api/products?limit=20");
      const products = result?.products || [];
      const total = result?.total ?? products.length;

      set({
        products,
        filteredProducts: products,
        totalProducts: total,
        loading: false,
        error: null,
      });

      return products;
    } catch (err) {
      set({
        loading: false,
        error: err.message || "Failed to load products",
      });
      return mockProducts;
    }
  },

  // ── fetchLatestProducts ────────────────────────────────────────────────────
  /**
   * Derive latest 8 products from the `products` array locally.
   * Ensures products are fetched if not yet available.
   */
  fetchLatestProducts: async () => {
    const state = get();
    let currentProducts = state.products;

    // Fetch if they don't exist yet
    if (currentProducts.length === 0) {
      try {
        currentProducts = await state.fetchProducts();
      } catch (err) {
        throw err;
      }
    }

    // Sort by createdAt (latest first) and slice 8
    const latest = [...currentProducts]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8);

    set({ latestProducts: latest });
    return latest;
  },

  // ── applyFilters ───────────────────────────────────────────────────────────
  applyFilters: ({ search, minPrice, maxPrice }) => {
    const { products, selectedCategory } = get();
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) => p.name?.toLowerCase().includes(q));
    }

    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      filtered = filtered.filter((p) => {
        const price = p.discountedPrice ?? p.price;
        return price >= Number(minPrice);
      });
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      filtered = filtered.filter((p) => {
        const price = p.discountedPrice ?? p.price;
        return price <= Number(maxPrice);
      });
    }

    set({ filteredProducts: filtered, totalProducts: filtered.length });
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
      
      set({ loading: false, error: null });
      
      get().invalidateCache();
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
  invalidateCache: () => set({ products: [], filteredProducts: [], latestProducts: [] }),

  cancelRequests: () => {
    // No-op since abort controllers are removed
  },
}));
