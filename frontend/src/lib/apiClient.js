import { useAuthStore } from "../store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://e-commerce-he4h.onrender.com";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const buildUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export async function apiRequest(path, options = {}) {
  const { method = "GET", headers = {}, body, token, signal } = options;

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  const stateToken = useAuthStore.getState().accessToken;
  const finalToken = token || stateToken;

  if (finalToken) {
    mergedHeaders.Authorization = `Bearer ${finalToken}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: mergedHeaders,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    // Surface the most specific error message available
    const message =
      data?.chapaError?.message ||
      data?.error ||
      data?.message ||
      "Request failed";
    throw new Error(message);
  }

  return data;
}

export const productsApi = {
  getProducts: async ({ search, category, status, minPrice, maxPrice, page, limit }) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const queryString = params.toString();
    const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
    return apiRequest(endpoint);
  },

  deleteProduct: async (id) => {
    return apiRequest(`/api/admin/products/${id}`, { method: 'DELETE' });
  }
};
