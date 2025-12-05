import type { Transaction } from "../type/Transaction";
import type { ApiResponse } from "../type/ApiResponse";
import type { TransactionRequest } from "../type/TransactionRequest";
import type { TransactionResponse } from "../type/TransactionResponse";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function createTransaction(req: TransactionRequest): Promise<ApiResponse<Transaction>> {
  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}` : "",
      },
      body: JSON.stringify(req),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      // Trả đúng object từ backend nếu nó có dạng ApiResponse
      if (json && typeof json === "object" && "success" in json) {
        return json as ApiResponse<Transaction>;
      }
      // Nếu backend không trả ApiResponse (HTML/text), mới fallback
      return {
        success: false,
        code: `HTTP_${res.status}`,
        message: typeof json === "string" ? json : `HTTP ${res.status}`,
        data: null,
        timestamp: new Date().toISOString(),
      };
    }

    return json as ApiResponse<Transaction>;
  } catch (err: unknown) {
    // Chỉ khi lỗi mạng/exception thì mới tự tạo CLIENT_ERROR
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      code: "CLIENT_ERROR",
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }
}
export async function fetchTransactions(): Promise<TransactionResponse[]> {
  const token = localStorage.getItem("token"); // hoặc từ cookie/context

  const res = await fetch(`${API_BASE}/transactions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },

    
  });
  const json: ApiResponse<TransactionResponse[]> = await res.json();

  if (!json.success) {
    throw new Error(json.message ?? "Lỗi tải giao dịch");
  }

  return json.data ?? [];
}