// src/service/BudgetService.ts

import type { ApiResponse } from "../type/ApiResponse";
import type {
  BudgetDetailResponse,
  BudgetListItem,
  BudgetPageResponse,
} from "../type/BudgetResponse";
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
 * Pagination params
 */
export interface BudgetPaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Lấy danh sách budgets với pagination
 */
export async function fetchBudgets(
  params?: BudgetPaginationParams,
): Promise<BudgetListItem[]> {
  const searchParams = new URLSearchParams();
  searchParams.append("page", String(params?.page ?? 0));
  searchParams.append("size", String(params?.size ?? 20));
  if (params?.sort) {
    searchParams.append("sort", params.sort);
  } else {
    searchParams.append("sort", "startDate,desc");
  }

  const url = `${getApiUrl(API_CONFIG.BUDGETS.BASE)}?${searchParams.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: getHeaders(true),
  });

  const data = await handleResponse<BudgetPageResponse>(res);
  return data?.content ?? [];
}

/**
 * Lấy danh sách budgets với thông tin pagination đầy đủ
 */
export async function fetchBudgetsWithPagination(
  params?: BudgetPaginationParams,
): Promise<BudgetPageResponse | null> {
  const searchParams = new URLSearchParams();
  searchParams.append("page", String(params?.page ?? 0));
  searchParams.append("size", String(params?.size ?? 20));
  if (params?.sort) {
    searchParams.append("sort", params.sort);
  } else {
    searchParams.append("sort", "startDate,desc");
  }

  const url = `${getApiUrl(API_CONFIG.BUDGETS.BASE)}?${searchParams.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: getHeaders(true),
  });

  return await handleResponse<BudgetPageResponse>(res);
}

/**
 * Lấy chi tiết một budget theo ID
 */
export async function fetchBudgetById(
  id: number,
): Promise<BudgetDetailResponse | null> {
  const res = await fetch(getApiUrl(`${API_CONFIG.BUDGETS.BASE}/${id}`), {
    method: "GET",
    headers: getHeaders(true),
  });

  return await handleResponse<BudgetDetailResponse>(res);
}

/**
 * Tạo budget mới
 */
export async function createBudget(
  request: CreateBudgetRequest,
): Promise<BudgetDetailResponse | null> {
  const res = await fetch(getApiUrl(API_CONFIG.BUDGETS.BASE), {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(request),
  });

  return await handleResponse<BudgetDetailResponse>(res);
}

/**
 * Cập nhật budget
 */
export async function updateBudget(
  id: number,
  request: UpdateBudgetRequest,
): Promise<BudgetDetailResponse | null> {
  const res = await fetch(getApiUrl(`${API_CONFIG.BUDGETS.BASE}/${id}`), {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(request),
  });

  return await handleResponse<BudgetDetailResponse>(res);
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
