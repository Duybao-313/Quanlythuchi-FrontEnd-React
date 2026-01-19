export interface RecentUser {
  fullName: string | null;
  email: string;
  status: string;
  createdAt: string | null;
}

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
