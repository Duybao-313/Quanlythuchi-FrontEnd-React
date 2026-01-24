import type { ApiResponse } from "../type/ApiResponse";
import type {
  AdminOverview,
  AdminUser,
  UpdateUserRequest,
} from "../type/AdminResponse";
import type { CategoryResponse } from "../type/CategoriesResponse";
import { getApiUrl, getHeaders } from "../config/apiConfig";

export async function getAdminOverview(): Promise<ApiResponse<AdminOverview>> {
  let res: Response;
  try {
    res = await fetch(getApiUrl("/admin/overview"), {
      method: "GET",
      headers: getHeaders(true),
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau.",
    );
  }

  const text = await res.text();
  if (!text) {
    throw new Error("Server trả về dữ liệu rỗng");
  }

  let json: ApiResponse<AdminOverview>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Dữ liệu không hợp lệ từ server");
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Lỗi khi lấy dữ liệu dashboard");
  }

  return json;
}

export async function getAdminUsers(): Promise<ApiResponse<AdminUser[]>> {
  let res: Response;
  try {
    res = await fetch(getApiUrl("/admin/users"), {
      method: "GET",
      headers: getHeaders(true),
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau.",
    );
  }

  const text = await res.text();
  if (!text) {
    throw new Error("Server trả về dữ liệu rỗng");
  }

  let json: ApiResponse<AdminUser[]>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Dữ liệu không hợp lệ từ server");
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Lỗi khi lấy danh sách người dùng");
  }

  return json;
}

export async function updateAdminUser(
  data: UpdateUserRequest,
): Promise<ApiResponse<AdminUser>> {
  let res: Response;
  try {
    res = await fetch(getApiUrl("/admin/update-user"), {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau.",
    );
  }

  const text = await res.text();
  if (!text) {
    throw new Error("Server trả về dữ liệu rỗng");
  }

  let json: ApiResponse<AdminUser>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Dữ liệu không hợp lệ từ server");
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Lỗi khi cập nhật người dùng");
  }

  return json;
}

// Admin Categories APIs
export async function getAdminCategories(): Promise<
  ApiResponse<CategoryResponse[]>
> {
  let res: Response;
  try {
    res = await fetch(getApiUrl("/admin/categories-admin"), {
      method: "GET",
      headers: getHeaders(true),
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau.",
    );
  }

  const text = await res.text();
  if (!text) {
    throw new Error("Server trả về dữ liệu rỗng");
  }

  let json: ApiResponse<CategoryResponse[]>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Dữ liệu không hợp lệ từ server");
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Lỗi khi lấy danh sách danh mục");
  }

  return json;
}

export interface CreateCategoryRequest {
  name: string;
  type: "EXPENSE" | "INCOME";
  iconUrl?: string | null;
}

export async function createAdminCategory(
  data: CreateCategoryRequest,
): Promise<ApiResponse<CategoryResponse>> {
  let res: Response;
  try {
    res = await fetch(getApiUrl("/admin/categories-admin"), {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau.",
    );
  }

  const text = await res.text();
  if (!text) {
    throw new Error("Server trả về dữ liệu rỗng");
  }

  let json: ApiResponse<CategoryResponse>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Dữ liệu không hợp lệ từ server");
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Lỗi khi tạo danh mục");
  }

  return json;
}

export interface UpdateCategoryRequest {
  id: number;
  name: string;
  type: "EXPENSE" | "INCOME";
  iconUrl?: string | null;
}

export async function updateAdminCategory(
  data: UpdateCategoryRequest,
): Promise<ApiResponse<CategoryResponse>> {
  let res: Response;
  try {
    res = await fetch(getApiUrl("/admin/categories-admin"), {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau.",
    );
  }

  const text = await res.text();
  if (!text) {
    throw new Error("Server trả về dữ liệu rỗng");
  }

  let json: ApiResponse<CategoryResponse>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Dữ liệu không hợp lệ từ server");
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Lỗi khi cập nhật danh mục");
  }

  return json;
}

// New API for update-global-category with multipart/form-data
export interface GlobalCategoryRequest {
  id?: number | null;
  name: string;
  type: "EXPENSE" | "INCOME";
  color?: string | null;
  UpdateFlag: boolean; // true = update, false = create
}

function getToken(): string | null {
  return localStorage.getItem("accessToken");
}

export async function saveGlobalCategory(
  data: GlobalCategoryRequest,
  file?: File | null,
): Promise<ApiResponse<CategoryResponse>> {
  let res: Response;
  try {
    const formData = new FormData();

    // Convert data to JSON blob and append as "data" part
    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    formData.append("data", jsonBlob);

    // Append file if provided
    if (file) {
      formData.append("file", file);
    }

    const token = getToken();
    res = await fetch(getApiUrl("/admin/update-global-category"), {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau.",
    );
  }

  const text = await res.text();
  if (!text) {
    throw new Error("Server trả về dữ liệu rỗng");
  }

  let json: ApiResponse<CategoryResponse>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Dữ liệu không hợp lệ từ server");
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Lỗi khi lưu danh mục");
  }

  return json;
}

export async function deleteAdminCategory(
  id: number,
): Promise<ApiResponse<null>> {
  let res: Response;
  try {
    res = await fetch(getApiUrl(`/admin/categories-admin/${id}`), {
      method: "DELETE",
      headers: getHeaders(true),
    });
  } catch (networkErr) {
    console.error(networkErr);
    throw new Error(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng hoặc thử lại sau.",
    );
  }

  const text = await res.text();
  if (!text) {
    throw new Error("Server trả về dữ liệu rỗng");
  }

  let json: ApiResponse<null>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Dữ liệu không hợp lệ từ server");
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Lỗi khi xóa danh mục");
  }

  return json;
}
