// src/type/TransactionRequest.ts

export interface TransactionRequest {
  amount: number;       
  description?: string;
  walletId: number;
  categoryId: number;
}