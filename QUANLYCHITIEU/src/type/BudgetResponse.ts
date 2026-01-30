// src/type/BudgetResponse.ts

import type {
  BudgetStatus,
  PeriodType,
  ScopeType,
  ThresholdAction,
} from "./BudgetEnums";

/**
 * Response cho Scope
 */
export interface BudgetScopeResponse {
  scopeType: ScopeType;
  refId: number;
}

/**
 * Response cho Threshold
 */
export interface BudgetThresholdResponse {
  percent: number;
  action: ThresholdAction;
}

/**
 * Response cho Budget list item (từ API list)
 */
export interface BudgetListItem {
  id: number;
  name: string;
  ownerId: number;
  amount: number;
  startDate: string;
  endDate: string;
  periodType: PeriodType;
  status: BudgetStatus;
}

/**
 * Response cho Budget detail (từ API detail)
 */
export interface BudgetDetailResponse {
  name: string;
  amount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  startDate: string;
  endDate: string;
  periodType: PeriodType;
  budgetStatus: BudgetStatus;
  scopes: BudgetScopeResponse[];
  thresholds: BudgetThresholdResponse[];
}

/**
 * Response pagination cho danh sách budget
 */
export interface BudgetPageResponse {
  content: BudgetListItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
