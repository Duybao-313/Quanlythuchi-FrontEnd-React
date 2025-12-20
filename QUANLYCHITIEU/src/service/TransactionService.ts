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
export async function fetchTransactions(
  params?: Record<string, unknown>,
  init?: RequestInit
): Promise<TransactionResponse[]> {
  const token = localStorage.getItem("token") ?? "";


  const toDateOnly = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const normalized: Record<string, string> = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v instanceof Date) {
        normalized[k] = toDateOnly(v);
      } else if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
        // already date-only
        normalized[k] = v;
      } else if (v !== undefined && v !== null && v !== "") {
        normalized[k] = String(v);
      }
    }
  }

  const qs =
    Object.keys(normalized).length > 0
      ? "?" +
        Object.entries(normalized)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join("&")
      : "";

  const url = `${API_BASE}/transactions/user${qs}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...init,
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Không thể kết nối tới server");
  }

  const text = await response.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    const msg =
      parsed &&
      typeof parsed === "object" &&
      "message" in parsed &&
      typeof (parsed as Record<string, unknown>)["message"] === "string"
        ? String((parsed as Record<string, unknown>)["message"])
        : `Server trả lỗi ${response.status}`;
    throw new Error(msg);
  }

  if (Array.isArray(parsed)) return parsed as TransactionResponse[];

  if (
    parsed &&
    typeof parsed === "object" &&
    "success" in parsed &&
    typeof (parsed as Record<string, unknown>)["success"] === "boolean"
  ) {
    const api = parsed as ApiResponse<unknown>;
    if (!api.success) {
      const msg =
        typeof (api as unknown as Record<string, unknown>)["message"] === "string"
          ? String((api as unknown as Record<string, unknown>)["message"])
          : "Lỗi tải giao dịch";
      throw new Error(msg);
    }
    const data = api.data;
    if (Array.isArray(data)) return data as TransactionResponse[];
    if (data && typeof data === "object" && Array.isArray((data as Record<string, unknown>)["items"])) {
      return (data as Record<string, unknown>)["items"] as TransactionResponse[];
    }
    return [];
  }

  return [];
}