export interface WalletResponse {
  id: number;
  name: string;
  balance: string;
  type: string;
  iconUrl?: string | null;
  description?: string | null;
  createdAt?: string | null; 
}