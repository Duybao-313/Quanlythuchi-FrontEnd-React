import type { ApiResponse } from "../type/ApiResponse";
import type { CategoryResponse } from "../type/CategoriesResponse";


const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("token");

async function handleResponse<T>(res: Response): Promise<T | null> {
  // res là Response từ fetch, có method json()
  const json = await res.json().catch(() => null) as ApiResponse<T> | null;

  if (!res.ok) {
    const message = json?.message ?? `HTTP error ${res.status}`;
    throw new Error(message);
  }

  return json?.data ?? null;
}

export async function listCategories(): Promise<CategoryResponse[]> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });

  const data = await handleResponse<CategoryResponse[]>(res);
  return data ?? [];
}
