// src/hooks/useNotificationToast.tsx
// Hook để hiển thị toast thông báo sau khi tạo transaction

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Notification } from "../type/Notification";
import {
  fetchAllUnreadNotifications,
  markNotificationAsRead,
} from "../service/NotificationService";

/**
 * Hook để hiển thị toast thông báo sau khi tạo transaction
 * Sử dụng trong TransactionForm hoặc component tạo transaction
 *
 * @example
 * ```tsx
 * const { checkAndShowNotificationToast } = useNotificationToast();
 *
 * const handleCreateTransaction = async () => {
 *   const result = await createTransaction(data);
 *   if (result.success) {
 *     // Kiểm tra và hiển thị toast nếu có thông báo mới
 *     await checkAndShowNotificationToast();
 *   }
 * };
 * ```
 */
export function useNotificationToast() {
  const navigate = useNavigate();

  /**
   * Lấy icon màu dựa vào title
   */
  const getToastType = (title: string): "warning" | "error" | "info" => {
    if (title.includes("vượt") || title.includes("chặn") || title.includes("100%")) {
      return "error";
    }
    if (title.includes("ngưỡng") || title.includes("%")) {
      return "warning";
    }
    return "info";
  };

  /**
   * Hiển thị toast cho một thông báo
   */
  const showNotificationToast = (notification: Notification) => {
    const toastType = getToastType(notification.title);

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-gray-900">{notification.title}</p>
          <p className="text-sm text-gray-600">{notification.body}</p>
          <button
            onClick={() => {
              // Đánh dấu đã đọc và điều hướng
              markNotificationAsRead(notification.id);
              // Điều hướng dựa vào title
              if (
                notification.title.includes("Ngân sách") ||
                notification.title.includes("ngưỡng")
              ) {
                navigate("/budgets");
              } else if (notification.title.includes("Giao dịch")) {
                navigate("/transactions");
              }
              closeToast?.();
            }}
            className="mt-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium text-left"
          >
            Xem chi tiết →
          </button>
        </div>
      ),
      {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        type: toastType,
        className: "!bg-white !shadow-xl !rounded-xl !border !border-gray-100",
      }
    );
  };

  /**
   * Kiểm tra và hiển thị toast cho TẤT CẢ thông báo chưa đọc
   * Gọi sau khi createTransaction thành công
   */
  const checkAndShowNotificationToast = async () => {
    try {
      const notifications = await fetchAllUnreadNotifications();

      if (notifications.length > 0) {
        // Hiển thị toast cho từng thông báo (với delay để không bị chồng)
        notifications.forEach((notification, index) => {
          setTimeout(() => {
            showNotificationToast(notification);
          }, index * 500); // Delay 500ms giữa các toast
        });
      }
    } catch (error) {
      console.error("Error checking notifications:", error);
      // Không hiển thị lỗi, silent fail
    }
  };

  return { checkAndShowNotificationToast };
}

export default useNotificationToast;
