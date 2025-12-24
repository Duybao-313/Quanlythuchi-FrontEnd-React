// src/service/walletService.ts

import type { ApiResponse } from "../type/ApiResponse";
import type { Wallet } from "../type/Wallet";
import type { WalletRequest } from "../type/WalletRequest";
import type { WalletResponse } from "../type/WalletResponse";

const API_BASE = "http://localhost:8080";

export interface WalletOverview {
  totalBalance: number;
  walletCount: number;
  totalExpense: number;
  totalIncome: number;
  netBalance: number;
  expenseCount: number;
  incomeCount: number;
}

export async function fetchWallets(): Promise<ApiResponse<Wallet[]>> {
  const res = await fetch(`${API_BASE}/wallets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}`
        : "",
    },
  });

  if (!res.ok) {
    // cố gắng parse body để lấy message
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  const parsed = (await res.json()) as ApiResponse<Wallet[]>;
  return parsed;
}

export async function fetchWalletOverview(
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<WalletOverview>> {
  const token = localStorage.getItem("token") ?? "";

  let url = `${API_BASE}/wallets/overview`;

  // Thêm query parameters nếu có date
  if (startDate && endDate) {
    const params = new URLSearchParams();
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    url += `?${params.toString()}`;
  }
console.log ("Fetching wallet overview from URL:", url);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  const parsed = (await res.json()) as ApiResponse<WalletOverview>;
  return parsed;
}

export async function createWallet(
  req: WalletRequest,
  file?: File | null
): Promise<ApiResponse<Wallet>> {
  const token = localStorage.getItem("token") ?? "";

  // Sử dụng FormData như tạo danh mục
  const form = new FormData();
  const jsonBlob = new Blob([JSON.stringify(req)], {
    type: "application/json",
  });
  form.append("data", jsonBlob, "data.json");

  if (file) form.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/wallets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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
      parsed && typeof parsed === "object"
        ? (parsed as { message?: string })
        : null;
    const msg = err?.message ?? `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return parsed as ApiResponse<Wallet>;
}

export async function deleteWallet(
  walletId: number | string
): Promise<ApiResponse<WalletResponse>> {
  console.log(walletId);
  const res = await fetch(`${API_BASE}/wallets/${walletId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}`
        : "",
    },
  });
  const json = await res.json().catch(() => {
    throw new Error(`Invalid JSON response (status ${res.status})`);
  });

  if (!res.ok) {
    const msg = json?.message ?? `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return json as ApiResponse<WalletResponse>;
}
