// src/service/BudgetService.ts

import type { ApiResponse } from "../type/ApiResponse";
import type { BudgetResponse } from "../type/BudgetResponse";
import type {
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from "../type/BudgetRequest";
import { API_CONFIG, getApiUrl, getHeaders } from "../config/apiConfig";

/**
 * Xử lý response từ API
 */
async function handleResponse<T>(res: Response): Promise<T | null> {
  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok) {
    const message = json?.message ?? `HTTP error ${res.status}`;
    throw new Error(message);
  }

  return json?.data ?? null;
}

/**
 * Lấy danh sách tất cả budgets
 */
export async function fetchBudgets(): Promise<BudgetResponse[]> {
  const res = await fetch(getApiUrl(API_CONFIG.BUDGETS.BASE), {
    method: "GET",
    headers: getHeaders(true),
  });

  const data = await handleResponse<BudgetResponse[]>(res);
  return data ?? [];
}

/**
 * Lấy chi tiết một budget theo ID
 */
export async function fetchBudgetById(
  id: number,
): Promise<BudgetResponse | null> {
  const res = await fetch(getApiUrl(`${API_CONFIG.BUDGETS.BASE}/${id}`), {
    method: "GET",
    headers: getHeaders(true),
  });

  return await handleResponse<BudgetResponse>(res);
}

/**
 * Tạo budget mới
 */
export async function createBudget(
  request: CreateBudgetRequest,
): Promise<BudgetResponse | null> {
  const res = await fetch(getApiUrl(API_CONFIG.BUDGETS.BASE), {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(request),
  });

  return await handleResponse<BudgetResponse>(res);
}

/**
 * Cập nhật budget
 */
export async function updateBudget(
  id: number,
  request: UpdateBudgetRequest,
): Promise<BudgetResponse | null> {
  const res = await fetch(getApiUrl(`${API_CONFIG.BUDGETS.BASE}/${id}`), {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(request),
  });

  return await handleResponse<BudgetResponse>(res);
}

/**
 * Xóa budget
 */
export async function deleteBudget(id: number): Promise<void> {
  const res = await fetch(getApiUrl(`${API_CONFIG.BUDGETS.BASE}/${id}`), {
    method: "DELETE",
    headers: getHeaders(true),
  });

  if (!res.ok) {
    const json = (await res
      .json()
      .catch(() => null)) as ApiResponse<unknown> | null;
    const message = json?.message ?? `HTTP error ${res.status}`;
    throw new Error(message);
  }
}
