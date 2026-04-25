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
  const normalizedMethod = String(method).toUpperCase();

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  if (normalizedMethod === "GET") {
    mergedHeaders["Cache-Control"] = "no-cache";
    mergedHeaders.Pragma = "no-cache";
  }

  const stateToken = useAuthStore.getState().accessToken;
  const finalToken = token || stateToken;

  if (finalToken) {
    mergedHeaders.Authorization = `Bearer ${finalToken}`;
  }

  const response = await fetch(buildUrl(path), {
    method: normalizedMethod,
    headers: mergedHeaders,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
    signal,
    cache: normalizedMethod === "GET" ? "no-store" : "default",
  });

  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  let data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    if (response.status === 401 && !path.includes("/api/auth/refresh")) {
      try {

        const refreshResult = await useAuthStore.getState().refresh();
        if (refreshResult?.accessToken) {
          const retryResponse = await fetch(buildUrl(path), {
            method: normalizedMethod,
            headers: {
              ...mergedHeaders,
              Authorization: `Bearer ${refreshResult.accessToken}`,
            },
            credentials: "include",
            body: body ? JSON.stringify(body) : undefined,
            signal,
            cache: normalizedMethod === "GET" ? "no-store" : "default",
          });

          const retryContentType = retryResponse.headers.get("Content-Type") || "";
          const retryIsJson = retryContentType.includes("application/json");
          const retryData = retryIsJson ? await retryResponse.json().catch(() => null) : null;

          if (retryResponse.ok) {
            return retryData;
          } else {
            const message =
              retryData?.chapaError?.message ||
              retryData?.error ||
              retryData?.message ||
              "Request failed after refresh";
            throw new Error(message);
          }
        }
      } catch {
        useAuthStore.getState().logout();
        throw new Error("Session expired. Please log in again.");
      }
    }

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

export const ragApi = {
  chat: async ({ message, productId, page, limit = 4 }) => {
    return apiRequest("/api/rag/chat", {
      method: "POST",
      body: {
        message,
        productId,
        page,
        limit,
      },
    });
  },
};
