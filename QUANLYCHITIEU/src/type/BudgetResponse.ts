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
  id: number;
  scopeType: ScopeType;
  refId: number;
}

/**
 * Response cho Threshold
 */
export interface BudgetThresholdResponse {
  id: number;
  percent: number;
  action: ThresholdAction;
}

/**
 * Response cho Budget
 */
export interface BudgetResponse {
  id: number;
  name: string;
  amount: number;
  spentAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate: string;
  periodType: PeriodType;
  budgetStatus: BudgetStatus;
  scopes: BudgetScopeResponse[];
  thresholds: BudgetThresholdResponse[];
  createdAt: string;
  updatedAt: string;
}
