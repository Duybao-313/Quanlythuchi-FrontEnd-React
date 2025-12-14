export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description?: string;
  walletId: number;
  categoryId?: number;
  date?: string; 
}