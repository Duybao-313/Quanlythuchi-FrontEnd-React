export interface RecentUser {
  fullName: string | null;
  email: string;
  status: string;
  createdAt: string | null;
}

export interface AdminUser {
  id: number;
  username: string;
  fullName: string | null;
  email: string;
  status: string;
  createdAt: string | null;
  walletCount: number;
  role: string;
}

export interface UpdateUserRequest {
  id: number;
  username: string;
  fullName: string | null;
  email: string;
  status: string;
  role: string;
}

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "SUSPENDED"
  | "DELETED";
export type UserRole = "ROLE_USER" | "ROLE_ADMIN";

export interface AdminOverview {
  totalUsers: number;
  activeUsersToday: number;
  totalWallets: number;
  totalSystemBalance: number;
  totalCategoriesByAdmin: number;
  generatedAt: string;
  transactionsToday: number;
  recentUsers: RecentUser[];
}
