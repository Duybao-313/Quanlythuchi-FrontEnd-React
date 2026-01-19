// Shared API Configuration
// const API_BASE_URL =
// import.meta.env.VITE_API_BASE_URL || "https://java-springboot-quanlythuchi-production.up.railway.app";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    USER_DETAIL: "/auth/userdetail",
    REFRESH: "/auth/refresh",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  USERS: {
    BASE: "/users",
    UPDATE_INFO: "/users/updateinfo",
    CHANGE_PASSWORD: "/users/changepassword",
    UPLOAD_AVATAR: "/users/upload-avatar",
  },
  WALLETS: {
    BASE: "/wallets",
    OVERVIEW: "/wallets/overview",
    CREATE: "/wallets",
    UPDATE: "/wallets",
    DELETE: "/wallets",
  },
  TRANSACTIONS: {
    BASE: "/transactions",
    CREATE: "/transactions",
    FETCH: "/transactions",
    TRANSFER: "/transactions/transfer",
  },
  CATEGORIES: {
    BASE: "/users/categories",
  },
};

/**
 * Get full API URL
 * @param endpoint - The endpoint path (e.g., '/auth/login' or 'auth/login')
 */
export function getApiUrl(endpoint: string): string {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
}

/**
 * Get token from localStorage
 */
export function getAuthToken(): string {
  return localStorage.getItem("token") ?? "";
}

/**
 * Get default headers with authorization
 */
export function getHeaders(includeAuth = true): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}
