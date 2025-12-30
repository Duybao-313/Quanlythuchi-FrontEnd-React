import type { ApiResponse } from "../type/ApiResponse";
import type { CategoryResponse } from "../type/CategoriesResponse";
import { API_CONFIG, getApiUrl, getHeaders } from "../config/apiConfig";

async function handleResponse<T>(res: Response): Promise<T | null> {
  // res là Response từ fetch, có method json()
  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok) {
    const message = json?.message ?? `HTTP error ${res.status}`;
    throw new Error(message);
  }

  return json?.data ?? null;
}

export async function listCategories(): Promise<CategoryResponse[]> {
  const res = await fetch(getApiUrl(API_CONFIG.CATEGORIES.BASE), {
    method: "GET",
    headers: getHeaders(true),
  });

  const data = await handleResponse<CategoryResponse[]>(res);
  return data ?? [];
}

export async function deleteCategory(categoryId: number): Promise<void> {
  const res = await fetch(
    getApiUrl(`${API_CONFIG.CATEGORIES.BASE}/${categoryId}`),
    {
      method: "DELETE",
      headers: getHeaders(true),
    }
  );

  if (!res.ok) {
    const json = (await res
      .json()
      .catch(() => null)) as ApiResponse<unknown> | null;
    const message = json?.message ?? `HTTP error ${res.status}`;
    throw new Error(message);
  }
}
