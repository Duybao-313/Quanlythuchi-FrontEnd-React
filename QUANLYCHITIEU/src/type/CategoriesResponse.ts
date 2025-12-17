// src/types/CategoryResponse.ts
import type { TransactionType } from "./TransactionType";

export interface CategoryResponse {
  id: number;
  name: string;
  type: TransactionType; // "EXPENSE" | "INCOME"
  iconUrl?: string | null;
  color?: string | null;
  ownerId?: number | null;
}
