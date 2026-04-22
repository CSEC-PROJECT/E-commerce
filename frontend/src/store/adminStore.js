import { create } from "zustand";
import { apiRequest } from "../lib/apiClient";

export const useAdminStore = create((set, get) => ({
  stats: null,
  salesPerformance: [],
  recentOrders: [],
  bestSellingProducts: [],
  
  loadingStats: false,
  loadingSales: false,
  loadingOrders: false,
  loadingBestSelling: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ loadingStats: true, error: null });
    try {
      const stats = await apiRequest("/api/admin/dashboard/stats");
      set({ stats, loadingStats: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch dashboard stats", loadingStats: false });
    }
  },

  fetchSalesPerformance: async () => {
    set({ loadingSales: true, error: null });
    try {
      const salesPerformance = await apiRequest("/api/admin/dashboard/sales-performance");
      set({ salesPerformance, loadingSales: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch sales performance", loadingSales: false });
    }
  },

  fetchRecentOrders: async () => {
    set({ loadingOrders: true, error: null });
    try {
      const response = await apiRequest("/api/admin/orders");
      // Note: Backend returns { orders: [...] }
      set({ recentOrders: response?.orders || [], loadingOrders: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch recent orders", loadingOrders: false });
    }
  },

  fetchBestSellingProducts: async () => {
    set({ loadingBestSelling: true, error: null });
    try {
      const bestSellingProducts = await apiRequest("/api/admin/dashboard/best-selling");
      set({ bestSellingProducts, loadingBestSelling: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch best selling products", loadingBestSelling: false });
    }
  },

  fetchAll: async () => {
    // Fire all initial requests in parallel
    await Promise.all([
      get().fetchDashboardStats(),
      get().fetchSalesPerformance(),
      get().fetchRecentOrders(),
      get().fetchBestSellingProducts()
    ]);
  }
}));
