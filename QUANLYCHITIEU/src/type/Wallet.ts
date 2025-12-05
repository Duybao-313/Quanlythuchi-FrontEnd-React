import type { WalletType } from "./WalletType";


export interface Wallet {
  id: number;
  name: string;
  balance: number;
  type: WalletType;
  iconUrl?: string;
  description?: string;
  createdAt?: string; 
  updatedAt?: string; 
  userId?: number;  
}