import type { ApiResponse } from "../type/ApiResponse";
import type { CategoryResponse } from "../type/CategoriesResponse";
import type { UserDTO } from "../type/UserDTO";
import {
  API_CONFIG,
  getApiUrl,
  getAuthToken,
  getHeaders,
} from "../config/apiConfig";

type CreatePayload = {
  name: string;
  type: string; // "EXPENSE" | "INCOME"
};

type ErrorResponse = {
  message?: string;
  [key: string]: unknown;
};

type UpdateUserInfoPayload = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export async function updateUserInfo(
  payload: UpdateUserInfoPayload
): Promise<ApiResponse<UserDTO>> {
  let res: Response;
  try {
    res = await fetch(getApiUrl(API_CONFIG.USERS.UPDATE_INFO), {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau."
    );
  }

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Server trả về dữ liệu không hợp lệ (status ${res.status}).`
    );
  }

  if (!res.ok) {
    const err =
      parsed && typeof parsed === "object" ? (parsed as ErrorResponse) : null;
    const msg = err?.message ?? `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return parsed as ApiResponse<UserDTO>;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ApiResponse<unknown>> {
  let res: Response;
  try {
    res = await fetch(getApiUrl(API_CONFIG.USERS.CHANGE_PASSWORD), {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau."
    );
  }

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Server trả về dữ liệu không hợp lệ (status ${res.status}).`
    );
  }

  if (!res.ok) {
    const err =
      parsed && typeof parsed === "object" ? (parsed as ErrorResponse) : null;
    const msg = err?.message ?? `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return parsed as ApiResponse<unknown>;
}

export async function createCategoryForMe(
  payload: CreatePayload,
  file?: File | null
): Promise<ApiResponse<CategoryResponse>> {
  const token = getAuthToken();

  const form = new FormData();
  const jsonBlob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  form.append("data", jsonBlob, "data.json");

  if (file) form.append("file", file);

  let res: Response;
  try {
    res = await fetch(getApiUrl(API_CONFIG.CATEGORIES.BASE), {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: form,
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau."
    );
  }

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Server trả về dữ liệu không hợp lệ (status ${res.status}).`
    );
  }

  if (!res.ok) {
    // an toàn: kiểm tra parsed có phải object và có trường message
    const err =
      parsed && typeof parsed === "object" ? (parsed as ErrorResponse) : null;
    const msg = err?.message ?? `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  // Nếu backend trả đúng ApiResponse<CategoryResponse>
  return parsed as ApiResponse<CategoryResponse>;
}

export async function uploadAvatar(file: File): Promise<ApiResponse<UserDTO>> {
  const token = getAuthToken();

  const form = new FormData();
  form.append("file", file);

  let res: Response;
  try {
    res = await fetch(getApiUrl(API_CONFIG.USERS.UPLOAD_AVATAR), {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: form,
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau."
    );
  }

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Server trả về dữ liệu không hợp lệ (status ${res.status}).`
    );
  }

  if (!res.ok) {
    const err =
      parsed && typeof parsed === "object" ? (parsed as ErrorResponse) : null;
    const msg = err?.message ?? `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return parsed as ApiResponse<UserDTO>;
}
