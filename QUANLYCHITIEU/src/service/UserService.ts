import type { ApiResponse } from "../type/ApiResponse";
import type { CategoryResponse } from "../type/CategoriesResponse";

const API_BASE = "http://localhost:8080/users";

type CreatePayload = {
  name: string;
  type: string; // "EXPENSE" | "INCOME"
};

type ErrorResponse = {
  message?: string;
  [key: string]: unknown;
};

export async function createCategoryForMe(
  payload: CreatePayload,
  file?: File | null
): Promise<ApiResponse<CategoryResponse>> {
  const token = localStorage.getItem("token") ?? "";

  const form = new FormData();
  const jsonBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
form.append("data", jsonBlob, "data.json");

  if (file) form.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error("Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau.");
  }

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Server trả về dữ liệu không hợp lệ (status ${res.status}).`);
  }

  if (!res.ok) {
    // an toàn: kiểm tra parsed có phải object và có trường message
    const err = (parsed && typeof parsed === "object") ? (parsed as ErrorResponse) : null;
    const msg = err?.message ?? `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  // Nếu backend trả đúng ApiResponse<CategoryResponse>
  return parsed as ApiResponse<CategoryResponse>;
}