// src/service/walletService.ts

import type { ApiResponse } from "../type/ApiResponse";
import type { Wallet } from "../type/Wallet";
import type { WalletRequest } from "../type/WalletRequest";
import type { WalletResponse } from "../type/WalletResponse";

const API_BASE = "http://localhost:8080";

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
export async function createWallet(
  req: WalletRequest
): Promise<ApiResponse<Wallet>> {
  console.log(req);
  const res = await fetch(`${API_BASE}/wallets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}`
        : "",
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  const parsed = (await res.json()) as ApiResponse<Wallet>;
  return parsed;
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
