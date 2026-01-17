import { API_CONFIG, getApiUrl, getHeaders } from "../config/apiConfig";

export async function login(username: string, password: string) {
  const response = await fetch(getApiUrl(API_CONFIG.AUTH.LOGIN), {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ username, password }),
  });

  return await response.json();
}

export async function register(
  email: string,
  username: string,
  fullName: string,
  password: string
) {
  const response = await fetch(getApiUrl(API_CONFIG.AUTH.REGISTER), {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ email, username, fullName, password }),
  });
  return await response.json();
}

export async function getProfile() {
  const response = await fetch(getApiUrl(API_CONFIG.AUTH.USER_DETAIL), {
    method: "GET",
    headers: getHeaders(true),
  });
  return await response.json();
}

export interface RefreshTokenResponse {
  token: string;
  expiryDate: string;
}

export async function refreshToken(token: string) {
  const response = await fetch(getApiUrl(API_CONFIG.AUTH.REFRESH), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  return await response.json();
}

/**
 * Kiểm tra token hết hạn và tự động refresh
 * @param expiryDate - Thời gian hết hạn của token
 * @returns true nếu token còn hạn hoặc refresh thành công, false nếu thất bại
 */
export async function checkAndRefreshToken(
  expiryDate: string
): Promise<boolean> {
  const expiry = new Date(expiryDate).getTime();
  const now = Date.now();

  // Nếu token còn hạn (còn hơn 1 phút)
  if (expiry - now > 60000) {
    return true;
  }

  // Token sắp hết hạn hoặc đã hết hạn, thử refresh
  const currentToken = localStorage.getItem("token");
  if (!currentToken) {
    return false;
  }

  try {
    const result = await refreshToken(currentToken);
    if (result.success && result.data) {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("tokenExpiry", result.data.expiryDate);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
}
