// src/type/BudgetRequest.ts

import type {
  BudgetStatus,
  PeriodType,
  ScopeType,
  ThresholdAction,
} from "./BudgetEnums";

/**
 * Phạm vi áp dụng của Budget
 */
export interface BudgetScope {
  scopeType: ScopeType;
  refId: number;
}

/**
 * Ngưỡng cảnh báo của Budget
 */
export interface BudgetThreshold {
  percent: number;
  action: ThresholdAction;
}

/**
 * Request tạo Budget mới
 */
export interface CreateBudgetRequest {
  name: string;
  amount: number;
  currency?: string; // Default: VND
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
  periodType: PeriodType;
  budgetStatus: BudgetStatus;
  scopes: BudgetScope[];
  thresholds: BudgetThreshold[];
}

/**
 * Request cập nhật Budget (same as create, id is in URL)
 */
export interface UpdateBudgetRequest {
  name: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  periodType: PeriodType;
  budgetStatus: BudgetStatus;
  scopes: BudgetScope[];
  thresholds: BudgetThreshold[];
}
