// src/type/BudgetEnums.ts

/**
 * Trạng thái của Budget
 */
export const BudgetStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  OVER_BUDGET: "OVER_BUDGET",
  COMPLETED: "COMPLETED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  ARCHIVED: "ARCHIVED",
} as const;

export type BudgetStatus = (typeof BudgetStatus)[keyof typeof BudgetStatus];

/**
 * Loại phạm vi áp dụng của Budget
 */
export const ScopeType = {
  CATEGORY: "CATEGORY",
  ACCOUNT: "ACCOUNT",
  WALLET: "WALLET",
} as const;

export type ScopeType = (typeof ScopeType)[keyof typeof ScopeType];

/**
 * Hành động khi đạt ngưỡng
 */
export const ThresholdAction = {
  NOTIFY: "NOTIFY",
  BLOCK: "BLOCK",
} as const;

export type ThresholdAction =
  (typeof ThresholdAction)[keyof typeof ThresholdAction];

/**
 * Chu kỳ của Budget
 */
export const PeriodType = {
  ONE_TIME: "ONE_TIME",
  MONTHLY: "MONTHLY",
  WEEKLY: "WEEKLY",
} as const;

export type PeriodType = (typeof PeriodType)[keyof typeof PeriodType];

// Labels cho hiển thị UI
export const BudgetStatusLabels: Record<BudgetStatus, string> = {
  [BudgetStatus.DRAFT]: "Bản nháp",
  [BudgetStatus.ACTIVE]: "Đang hoạt động",
  [BudgetStatus.PAUSED]: "Tạm dừng",
  [BudgetStatus.OVER_BUDGET]: "Vượt ngân sách",
  [BudgetStatus.COMPLETED]: "Hoàn thành",
  [BudgetStatus.EXPIRED]: "Hết hạn",
  [BudgetStatus.CANCELLED]: "Đã hủy",
  [BudgetStatus.ARCHIVED]: "Đã lưu trữ",
};

export const ScopeTypeLabels: Record<ScopeType, string> = {
  [ScopeType.CATEGORY]: "Danh mục",
  [ScopeType.ACCOUNT]: "Tài khoản",
  [ScopeType.WALLET]: "Ví",
};

export const ThresholdActionLabels: Record<ThresholdAction, string> = {
  [ThresholdAction.NOTIFY]: "Thông báo",
  [ThresholdAction.BLOCK]: "Chặn",
};

export const PeriodTypeLabels: Record<PeriodType, string> = {
  [PeriodType.ONE_TIME]: "Một lần",
  [PeriodType.MONTHLY]: "Hàng tháng",
  [PeriodType.WEEKLY]: "Hàng tuần",
};

// Colors cho status badges
export const BudgetStatusColors: Record<BudgetStatus, string> = {
  [BudgetStatus.DRAFT]: "bg-gray-100 text-gray-800",
  [BudgetStatus.ACTIVE]: "bg-green-100 text-green-800",
  [BudgetStatus.PAUSED]: "bg-yellow-100 text-yellow-800",
  [BudgetStatus.OVER_BUDGET]: "bg-red-100 text-red-800",
  [BudgetStatus.COMPLETED]: "bg-blue-100 text-blue-800",
  [BudgetStatus.EXPIRED]: "bg-orange-100 text-orange-800",
  [BudgetStatus.CANCELLED]: "bg-red-100 text-red-600",
  [BudgetStatus.ARCHIVED]: "bg-gray-200 text-gray-600",
};
