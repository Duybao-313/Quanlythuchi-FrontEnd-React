// src/service/NotificationService.ts
// Service xử lý các API liên quan đến thông báo

import type {
  Notification,
  NotificationPageResponse,
  NotificationParams,
} from "../type/Notification";
import { API_CONFIG, getApiUrl, getHeaders } from "../config/apiConfig";

/**
 * Lấy danh sách thông báo với pagination và filter
 * GET /notifications?unreadOnly=true&page=0&size=10
 * Response trả về trực tiếp NotificationPageResponse (không wrap trong data)
 */
export async function fetchNotifications(
  params?: NotificationParams
): Promise<NotificationPageResponse | null> {
  const searchParams = new URLSearchParams();

  // Thêm params vào query string
  if (params?.unreadOnly !== undefined) {
    searchParams.append("unreadOnly", String(params.unreadOnly));
  }
  searchParams.append("page", String(params?.page ?? 0));
  searchParams.append("size", String(params?.size ?? 10));

  const url = `${getApiUrl(API_CONFIG.NOTIFICATIONS.BASE)}?${searchParams.toString()}`;


  try {
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(true),
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    // Response trả về trực tiếp, không wrap trong { data: ... }
    const data = (await res.json()) as NotificationPageResponse;
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

/**
 * Lấy số thông báo chưa đọc
 * GET /notifications/unread-count
 */
export async function fetchUnreadCount(): Promise<number> {
  const url = getApiUrl(API_CONFIG.NOTIFICATIONS.UNREAD_COUNT);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(true),
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    // API trả về number trực tiếp
    const count = await res.json();
    console.log("[NotificationService] Unread count:", count);
    return typeof count === "number" ? count : 0;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0; // Trả về 0 nếu có lỗi
  }
}

/**
 * Đánh dấu một thông báo đã đọc
 * PATCH /notifications/{id}/read
 * API trả về void (không có JSON)
 */
export async function markNotificationAsRead(id: number): Promise<void> {
  const url = getApiUrl(`${API_CONFIG.NOTIFICATIONS.BASE}/${id}/read`);
  console.log("[NotificationService] Marking notification as read, id:", id);
  
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: getHeaders(true),
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    // API trả về void, không cần parse JSON
    console.log("[NotificationService] Notification marked as read successfully");
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

/**
 * Đánh dấu tất cả thông báo đã đọc
 * PATCH /notifications/read-all
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const url = getApiUrl(`${API_CONFIG.NOTIFICATIONS.BASE}/read-all`);

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: getHeaders(true),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      throw new Error(json?.message ?? `HTTP error ${res.status}`);
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

/**
 * Lấy thông báo mới nhất chưa đọc (dùng sau khi tạo transaction)
 * GET /notifications?unreadOnly=true&page=0&size=1
 */
export async function fetchLatestUnreadNotification(): Promise<Notification | null> {
  try {
    const response = await fetchNotifications({
      unreadOnly: true,
      page: 0,
      size: 1,
    });

    if (response && response.content && response.content.length > 0) {
      return response.content[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching latest notification:", error);
    return null;
  }
}

/**
 * Lấy tất cả thông báo chưa đọc (dùng để hiện toast)
 * GET /notifications?unreadOnly=true&page=0&size=10
 */
export async function fetchAllUnreadNotifications(): Promise<Notification[]> {
  try {
    const response = await fetchNotifications({
      unreadOnly: true,
      page: 0,
      size: 10,
    });

    if (response && response.content) {
      return response.content;
    }

    return [];
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return [];
  }
}
