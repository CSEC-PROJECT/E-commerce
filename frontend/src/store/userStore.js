import { create } from "zustand";
import { apiRequest } from "../lib/apiClient";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  users: [],
  totalUsers: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,

  fetchUsers: async ({ page = 1, limit = 20, search = "" } = {}) => {
    set({ loading: true, error: null });
    try {
      // Build query string
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);

      const response = await apiRequest(`/api/admin/users?${params.toString()}`, {
        method: "GET",
      });

      set({
        users: response.users || [],
        totalUsers: response.meta?.total || 0,
        totalPages: response.meta?.totalPages || 1,
        currentPage: response.meta?.page || 1,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message || "Failed to fetch users", loading: false });
      toast.error(error.message || "Failed to fetch users");
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiRequest(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
        totalUsers: Math.max(0, state.totalUsers - 1),
        loading: false,
      }));
      toast.success("User deleted successfully");
      return true;
    } catch (error) {
      set({ error: error.message || "Failed to delete user", loading: false });
      toast.error(error.message || "Failed to delete user");
      return false;
    }
  },
}));
