// src/pages/admin/AdminUsers.tsx
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { getAdminUsers, updateAdminUser } from "../../service/AdminService";
import type {
  AdminUser,
  UpdateUserRequest,
  UserStatus,
  UserRole,
} from "../../type/AdminResponse";

const STATUS_OPTIONS: { value: UserStatus; label: string; color: string }[] = [
  {
    value: "ACTIVE",
    label: "Hoạt động",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    value: "INACTIVE",
    label: "Không hoạt động",
    color: "bg-gray-100 text-gray-700",
  },
  {
    value: "PENDING",
    label: "Chờ xác minh",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "SUSPENDED",
    label: "Tạm khóa",
    color: "bg-orange-100 text-orange-700",
  },
  { value: "DELETED", label: "Đã xóa", color: "bg-red-100 text-red-700" },
];

const ROLE_OPTIONS: { value: UserRole; label: string; color: string }[] = [
  {
    value: "ROLE_USER",
    label: "Người dùng",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "ROLE_ADMIN",
    label: "Admin",
    color: "bg-orange-100 text-orange-700",
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{
    id: number;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [statusDropdown, setStatusDropdown] = useState<number | null>(null);
  const [roleDropdown, setRoleDropdown] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAdminUsers();
        setUsers(res.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setStatusDropdown(null);
      setRoleDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdateUser = async (
    user: AdminUser,
    updates: Partial<AdminUser>,
  ) => {
    setUpdating(true);
    try {
      const updateData: UpdateUserRequest = {
        id: user.id,
        username: updates.username ?? user.username,
        fullName: updates.fullName ?? user.fullName,
        email: updates.email ?? user.email,
        status: updates.status ?? user.status,
        role: updates.role ?? user.role,
      };

      await updateAdminUser(updateData);

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, ...updates } : u)),
      );
      toast.success("Cập nhật thành công!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật",
      );
    } finally {
      setUpdating(false);
      setEditingField(null);
      setStatusDropdown(null);
      setRoleDropdown(null);
    }
  };

  const handleDoubleClick = (
    userId: number,
    field: string,
    currentValue: string,
  ) => {
    setEditingField({ id: userId, field });
    setEditValue(currentValue || "");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    user: AdminUser,
    field: string,
  ) => {
    if (e.key === "Enter") {
      handleUpdateUser(user, { [field]: editValue || null });
    } else if (e.key === "Escape") {
      setEditingField(null);
    }
  };

  const handleBlur = (user: AdminUser, field: string) => {
    const currentValue = user[field as keyof AdminUser];
    if (editValue !== (currentValue || "")) {
      handleUpdateUser(user, { [field]: editValue || null });
    } else {
      setEditingField(null);
    }
  };

  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  };

  const getRoleInfo = (role: string) => {
    return ROLE_OPTIONS.find((r) => r.value === role) || ROLE_OPTIONS[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-red-400"
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
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý người dùng
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng cộng {users.length} người dùng
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  ID
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Họ tên
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Tên đăng nhập
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Số ví
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Vai trò
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Trạng thái
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Ngày tạo
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-gray-500">
                    #{user.id}
                  </td>
                  {/* Họ tên - Editable */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {(user.fullName || user.username || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      {editingField?.id === user.id &&
                      editingField?.field === "fullName" ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, user, "fullName")}
                          onBlur={() => handleBlur(user, "fullName")}
                          className="font-medium text-gray-800 border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={updating}
                        />
                      ) : (
                        <p
                          className="font-medium text-gray-800 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                          onDoubleClick={() =>
                            handleDoubleClick(
                              user.id,
                              "fullName",
                              user.fullName || "",
                            )
                          }
                          title="Nhấp đúp để sửa"
                        >
                          {user.fullName || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>
                  </td>
                  {/* Tên đăng nhập - Editable */}
                  <td className="py-4 px-6">
                    {editingField?.id === user.id &&
                    editingField?.field === "username" ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, user, "username")}
                        onBlur={() => handleBlur(user, "username")}
                        className="text-sm text-gray-600 border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={updating}
                      />
                    ) : (
                      <span
                        className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-50"
                        onDoubleClick={() =>
                          handleDoubleClick(user.id, "username", user.username)
                        }
                        title="Nhấp đúp để sửa"
                      >
                        @{user.username}
                      </span>
                    )}
                  </td>
                  {/* Email - Editable */}
                  <td className="py-4 px-6">
                    {editingField?.id === user.id &&
                    editingField?.field === "email" ? (
                      <input
                        ref={inputRef}
                        type="email"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, user, "email")}
                        onBlur={() => handleBlur(user, "email")}
                        className="text-gray-600 border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={updating}
                      />
                    ) : (
                      <span
                        className="text-gray-600 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                        onDoubleClick={() =>
                          handleDoubleClick(user.id, "email", user.email)
                        }
                        title="Nhấp đúp để sửa"
                      >
                        {user.email}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      {user.walletCount} ví
                    </span>
                  </td>
                  {/* Role - Dropdown */}
                  <td className="py-4 px-6 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoleDropdown(
                          roleDropdown === user.id ? null : user.id,
                        );
                        setStatusDropdown(null);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-all ${getRoleInfo(user.role).color}`}
                      disabled={updating}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {user.role === "ROLE_ADMIN" ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        )}
                      </svg>
                      {getRoleInfo(user.role).label}
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {roleDropdown === user.id && (
                      <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                        {ROLE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (option.value !== user.role) {
                                handleUpdateUser(user, { role: option.value });
                              } else {
                                setRoleDropdown(null);
                              }
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                              option.value === user.role
                                ? "bg-gray-50 font-semibold"
                                : ""
                            }`}
                          >
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${option.color}`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  {/* Status - Dropdown */}
                  <td className="py-4 px-6 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatusDropdown(
                          statusDropdown === user.id ? null : user.id,
                        );
                        setRoleDropdown(null);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer hover:opacity-80 ${getStatusInfo(user.status).color}`}
                      disabled={updating}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          user.status === "ACTIVE"
                            ? "bg-emerald-500"
                            : user.status === "INACTIVE"
                              ? "bg-gray-500"
                              : user.status === "PENDING"
                                ? "bg-yellow-500"
                                : user.status === "SUSPENDED"
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                        }`}
                      ></span>
                      {getStatusInfo(user.status).label}
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {statusDropdown === user.id && (
                      <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                        {STATUS_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (option.value !== user.status) {
                                handleUpdateUser(user, {
                                  status: option.value,
                                });
                              } else {
                                setStatusDropdown(null);
                              }
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                              option.value === user.status
                                ? "bg-gray-50 font-semibold"
                                : ""
                            }`}
                          >
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${option.color}`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      {/* Edit Button */}
                      <button
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      {/* View Detail Button */}
                      <button
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        title="Xem chi tiết"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      {/* Delete Button */}
                      <button
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p>Chưa có người dùng nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
