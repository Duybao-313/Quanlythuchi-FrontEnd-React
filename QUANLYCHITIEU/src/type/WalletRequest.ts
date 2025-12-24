// src/type/WalletRequest.ts
import type { WalletType } from "./WalletType";

export interface WalletRequest {
  name: string; // bắt buộc
  balance: number; // bắt buộc, thay BigDecimal bằng number
  type: WalletType; // bắt buộc
  description?: string; // tùy chọn
}
