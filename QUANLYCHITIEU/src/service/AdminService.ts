import type { ApiResponse } from "../type/ApiResponse";
import type { AdminOverview } from "../type/AdminResponse";
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
