const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://e-commerce-he4h.onrender.com";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const buildUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

import { useAuthStore } from "../store/authStore";

export async function apiRequest(path, options = {}) {
  const { method = "GET", headers = {}, body, signal } = options;

  let token = options.token;
  if (!token) {
    try {
      token = useAuthStore.getState().accessToken || localStorage.getItem("token") || localStorage.getItem("accessToken");
    } catch (e) {
      // Fallback if useAuthStore fails
      token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    }
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
    ...(token && { Authorization: `Bearer ${token}` }), 
  };

  const isAuthRequest = path.includes("/api/auth/login");

  if (isAuthRequest) {
    console.log("[DEBUG] Login Request Info:", { 
      url: buildUrl(path),
      method, 
      headers: mergedHeaders, 
      body 
    });
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

  if (isAuthRequest) {
    console.log("[DEBUG] Login Response Info:", { status: response.status, data });
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`;
    if (isAuthRequest) {
      console.error("[DEBUG] Login Request Error:", message);
    }
    throw new Error(message);
  }

  return data;
}
