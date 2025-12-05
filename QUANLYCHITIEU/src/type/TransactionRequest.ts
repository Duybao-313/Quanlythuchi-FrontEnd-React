// src/type/TransactionRequest.ts
import type { TransactionType } from "./TransactionType";

export interface TransactionRequest {
  amount: number;       
  type: TransactionType; 
  description?: string;
  walletId: number;
  categoryId: number;
}