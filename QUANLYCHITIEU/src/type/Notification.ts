// src/type/Notification.ts

/**
 * Loại thông báo
 */
export const NotificationType = {
  BUDGET_WARNING: "BUDGET_WARNING",
  BUDGET_EXCEEDED: "BUDGET_EXCEEDED",
  TRANSACTION: "TRANSACTION",
  SYSTEM: "SYSTEM",
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

/**
 * Cấu trúc một thông báo từ API
 */
export interface Notification {
  id: number;
  title: string;
  body: string;
  readFlag: boolean;
  createdAt: string;
  readAt: string | null;
}

/**
 * Response cho API lấy danh sách thông báo (có pagination)
 */
export interface NotificationPageResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Response cho API đếm số thông báo chưa đọc
 */
export interface UnreadCountResponse {
  count: number;
}

/**
 * Params cho API lấy danh sách thông báo
 */
export interface NotificationParams {
  unreadOnly?: boolean;
  page?: number;
  size?: number;
}
