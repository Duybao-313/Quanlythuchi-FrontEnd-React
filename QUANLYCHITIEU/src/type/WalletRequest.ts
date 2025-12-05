// src/type/WalletRequest.ts
import type { WalletType } from "./WalletType";

export interface WalletRequest {
  name: string;          // bắt buộc
  balance: number;       // bắt buộc, thay BigDecimal bằng number
  type: WalletType;      // bắt buộc
  iconUrl?: string;      // tùy chọn
  description?: string;  // tùy chọn
}