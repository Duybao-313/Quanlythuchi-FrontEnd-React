// src/components/NotificationButton.tsx
// Component hiển thị nút thông báo với badge và dropdown danh sách thông báo

import { useState, useEffect, useRef, useCallback, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../service/NotificationService";
import type { Notification } from "../type/Notification";

/**
 * Props cho NotificationButton
 */
interface NotificationButtonProps {
  // Callback khi có lỗi (optional)
  onError?: (error: Error) => void;
  // Class CSS bổ sung (optional)
  className?: string;
}

/**
 * Component NotificationButton
 * - Hiển thị nút thông báo với badge số chưa đọc
 * - Dropdown hiển thị danh sách thông báo
 * - Hỗ trợ đánh dấu đã đọc
 */
export default function NotificationButton({
  onError,
  className = "",
}: NotificationButtonProps): JSX.Element {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy số thông báo chưa đọc
   */
  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load unread count:", err);
      // Không hiển thị lỗi cho badge, giữ count cũ
    }
  }, []);

  /**
   * Lấy danh sách tất cả thông báo
   */
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchNotifications({
        unreadOnly: false, // Lấy tất cả thông báo (đã đọc + chưa đọc)
        page: 0,
        size: 20,
      });

      if (response) {
        setNotifications(response.content);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể tải thông báo";
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [onError]);

  /**
   * Đánh dấu một thông báo đã đọc
   */
  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.readFlag) return;

    // Cập nhật UI trước (optimistic update)
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, readFlag: true } : n,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsRead(notification.id);
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // Rollback nếu API fail
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, readFlag: false } : n,
        ),
      );
      setUnreadCount((prev) => prev + 1);
    }
  };

  /**
   * Đánh dấu tất cả đã đọc
   */
  const handleMarkAllAsRead = async () => {
    // Lưu state cũ để rollback nếu cần
    const oldNotifications = [...notifications];
    const oldUnreadCount = unreadCount;

    // Cập nhật UI trước (optimistic update)
    setNotifications((prev) => prev.map((n) => ({ ...n, readFlag: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      // Rollback nếu API fail
      setNotifications(oldNotifications);
      setUnreadCount(oldUnreadCount);
    }
  };

  /**
   * Xem chi tiết thông báo
   */
  const handleViewDetail = async (notification: Notification) => {
    // Đánh dấu đã đọc
    await handleMarkAsRead(notification);

    // Điều hướng dựa vào title
    if (
      notification.title.includes("Ngân sách") ||
      notification.title.includes("ngưỡng")
    ) {
      // Thông báo liên quan đến ngân sách - điều hướng đến trang budgets
      navigate("/budgets");
    } else if (notification.title.includes("Giao dịch")) {
      // Thông báo liên quan đến giao dịch
      navigate("/transactions");
    }
    // Nếu không xác định được, chỉ đóng dropdown

    setIsOpen(false);
  };

  /**
   * Toggle dropdown
   */
  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    // Load notifications khi mở dropdown
    if (newState) {
      loadNotifications();
    }
  };

  /**
   * Format thời gian hiển thị
   */
  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /**
   * Rút ngắn body để hiển thị
   */
  const truncateBody = (body: string, maxLength = 80): string => {
    if (body.length <= maxLength) return body;
    return body.substring(0, maxLength) + "...";
  };

  /**
   * Lấy icon theo loại thông báo (dựa vào title)
   */
  const getNotificationIcon = (title: string) => {
    // Xác định loại thông báo dựa vào title
    if (
      title.includes("vượt") ||
      title.includes("chặn") ||
      title.includes("100%")
    ) {
      // Budget exceeded / blocked
      return (
        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-rose-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      );
    }

    if (title.includes("ngưỡng") || title.includes("%")) {
      // Budget warning
      return (
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      );
    }

    // Default icon
    return (
      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg
          className="w-5 h-5 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </div>
    );
  };

  // Load unread count khi component mount và định kỳ mỗi 30s
  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Nút thông báo */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
        title="Thông báo"
      >
        {/* Icon chuông */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge số chưa đọc */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Thông báo</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-indigo-100 hover:text-white transition-colors"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-indigo-100 text-sm mt-1">
                Bạn có {unreadCount} thông báo chưa đọc
              </p>
            )}
          </div>

          {/* Content */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              // Loading state
              <div className="p-8 text-center">
                <div className="w-10 h-10 mx-auto mb-3 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm">Đang tải thông báo...</p>
              </div>
            ) : error ? (
              // Error state
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-rose-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-rose-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-rose-600 font-medium">Đã xảy ra lỗi</p>
                <p className="text-gray-500 text-sm mt-1">{error}</p>
                <button
                  onClick={loadNotifications}
                  className="mt-3 px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : notifications.length === 0 ? (
              // Empty state
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">
                  Chưa có thông báo nào
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Thông báo sẽ hiển thị ở đây
                </p>
              </div>
            ) : (
              // Notification list
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleViewDetail(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.readFlag ? "bg-indigo-50/50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {getNotificationIcon(notification.title)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-sm ${
                              !notification.readFlag
                                ? "font-bold text-gray-900"
                                : "font-medium text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.readFlag && (
                            <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {truncateBody(notification.body)}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/notifications");
                }}
                className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
