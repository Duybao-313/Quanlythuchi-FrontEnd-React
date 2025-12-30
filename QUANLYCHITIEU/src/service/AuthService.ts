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
