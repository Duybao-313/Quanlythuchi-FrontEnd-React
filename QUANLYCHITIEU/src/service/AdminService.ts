import type { ApiResponse } from "../type/ApiResponse";
import type {
  AdminOverview,
  AdminUser,
  UpdateUserRequest,
} from "../type/AdminResponse";
import type { CategoryResponse } from "../type/CategoriesResponse";
import { getApiUrl, getAuthToken, getHeaders } from "../config/apiConfig";

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

export interface GlobalCategoryRequest {
  id: string;
  name: string;
  type: "EXPENSE" | "INCOME";
}

export interface GlobalCategoryResponse {
  success: boolean;
  code: number;
  message: string;
}

export async function saveGlobalCategory(
  data: GlobalCategoryRequest,
  file?: File | null,
): Promise<GlobalCategoryResponse> {
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

    // const token = getToken();
    res = await fetch(getApiUrl("/admin/update-global-category"), {
      method: "POST",
      headers: {
        Authorization: getAuthToken ? `Bearer ${getAuthToken()}` : "",
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

  let json: GlobalCategoryResponse;
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

export async function deleteAdminCategory(
  id: number,
): Promise<GlobalCategoryResponse> {
  let res: Response;
  try {
    res = await fetch(getApiUrl(`/admin/delete/category?id=${id}`), {
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

  let json: GlobalCategoryResponse;
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

// Import categories from Excel file
export interface ImportCategoryError {
  row: number;
  message: string;
}

export interface ImportCategoriesData {
  total: number;
  successCount: number;
  errors: ImportCategoryError[];
}

export interface ImportCategoriesResponse {
  success: boolean;
  code: number;
  data: ImportCategoriesData;
  message?: string;
}

export async function importCategories(
  file: File,
): Promise<ImportCategoriesResponse> {
  let res: Response;
  try {
    const formData = new FormData();
    formData.append("file", file);

    res = await fetch(getApiUrl("/admin/import-categories"), {
      method: "POST",
      headers: {
        Authorization: getAuthToken ? `Bearer ${getAuthToken()}` : "",
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

  let json: ImportCategoriesResponse;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Dữ liệu không hợp lệ từ server");
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Lỗi khi import danh mục");
  }

  return json;
}
