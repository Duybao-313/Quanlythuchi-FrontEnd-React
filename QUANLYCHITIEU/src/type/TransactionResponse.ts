// TransactionResponse.ts
import type { TransactionType } from "./TransactionType";

export interface TransactionResponse {
  id: number;                
  amount: number;            
  type: TransactionType;     
  description: string;
  categoryName: string;
  walletName: string;
  date:Date;
}