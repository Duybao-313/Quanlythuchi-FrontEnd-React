// src/layouts/ClientLayout.tsx
import React, { useCallback, useEffect, useState } from "react";
import UserMenu from "../components/UserMenu";
import NotificationButton from "../components/NotificationButton";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getProfile, refreshToken } from "../service/AuthService";
import { useUser } from "../hooks/useUser";
import { API_CONFIG } from "../config/apiConfig";

type ClientLayoutProps = {
  children: React.ReactNode;
};

const menuItems = [
  {
    path: "/",
    label: "Trang chủ",
    icon: (
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    path: "/transactions",
    label: "Giao dịch",
    icon: (
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    path: "/Wallets",
    label: "Ví",
    icon: (
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
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
  {
    path: "/transfer",
    label: "Chuyển tiền",
    icon: (
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
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
  },
  {
    path: "/history",
    label: "Lịch sử",
    icon: (
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    path: "/categories",
    label: "Danh mục",
    icon: (
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
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
  },
  {
    path: "/statistics",
    label: "Thống kê",
    icon: (
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    path: "/budgets",
    label: "Ngân sách",
    icon: (
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
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    path: "/account",
    label: "Tài khoản",
    icon: (
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }, [setUser, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const res = await getProfile();
        if (res.success && res.data) {
          setUser(res.data);
        } else if (res.code === 1007 || res.code === "1007") {
          const refreshRes = await refreshToken(token);
          if (refreshRes.success && refreshRes.data) {
            localStorage.setItem("token", refreshRes.data.token);
            const newProfileRes = await getProfile();
            if (newProfileRes.success && newProfileRes.data) {
              setUser(newProfileRes.data);
            } else {
              handleLogout();
            }
          } else {
            handleLogout();
          }
        } else {
          handleLogout();
        }
      } catch (e) {
        handleLogout();
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser, navigate, handleLogout]);

  const getAvatarUrl = (): string | null => {
    if (user?.avatarUrl) {
      return user.avatarUrl.startsWith("http")
        ? user.avatarUrl
        : `${API_CONFIG.BASE_URL}${user.avatarUrl}`;
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-72"
        } bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ChiTiêu
                </div>
                <div className="text-xs text-gray-500">Quản lý tài chính</div>
              </div>
            )}
          </Link>
        </div>

        {/* User Info */}
        <div className="px-4 py-5 border-b border-gray-100">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse"></div>
              {!sidebarCollapsed && (
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              )}
            </div>
          ) : user ? (
            <div
              className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
            >
              {getAvatarUrl() ? (
                <img
                  src={getAvatarUrl()!}
                  alt="Avatar"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold text-lg shadow-md">
                  {user.fullName
                    ? user.fullName.charAt(0).toUpperCase()
                    : user.username.charAt(0).toUpperCase()}
                </div>
              )}
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {user.fullName ?? user.username}
                  </div>
                  <div className="text-xs text-indigo-600 font-medium">
                    {user.role?.name ?? "Người dùng"}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center">
              Chưa đăng nhập
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <span
                  className={`${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-indigo-500"
                  } transition-colors`}
                >
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                sidebarCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Thu gọn</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)
                ?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Admin Button - chỉ hiện nếu user có role ROLE_ADMIN */}
            {user?.role?.name === "ROLE_ADMIN" && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium text-sm hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/30"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Admin
              </Link>
            )}
            {/* Notifications */}
            <NotificationButton />
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200/50 text-center text-sm text-gray-500 py-4">
          © {new Date().getFullYear()} ChiTiêu. Quản lý tài chính thông minh.
        </footer>
      </div>
    </div>
  );
}
