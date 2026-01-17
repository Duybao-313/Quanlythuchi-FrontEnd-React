// src/layouts/ClientLayout.tsx
import React, { useCallback, useEffect, useState } from "react";
import UserMenu from "../components/UserMenu";
import { useNavigate, Link } from "react-router-dom";
import { getProfile, refreshToken } from "../service/AuthService";
import { useUser } from "../hooks/useUser";

type ClientLayoutProps = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }, [setUser, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // nếu không có token, chuyển về login
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const res = await getProfile();
        if (res.success && res.data) {
          setUser(res.data);
        } else if (res.code === 1007 || res.code === "1007") {
          // Token hết hạn hoặc không có quyền -> thử refresh token
          const refreshRes = await refreshToken(token);
          if (refreshRes.success && refreshRes.data) {
            // Refresh thành công -> lưu token mới và gọi lại getProfile
            localStorage.setItem("token", refreshRes.data.token);
            const newProfileRes = await getProfile();
            if (newProfileRes.success && newProfileRes.data) {
              setUser(newProfileRes.data);
            } else {
              // Vẫn thất bại sau khi refresh -> logout
              handleLogout();
            }
          } else {
            // Refresh thất bại -> logout
            handleLogout();
          }
        } else {
          // Lỗi khác -> logout
          handleLogout();
        }
      } catch (e) {
        // lỗi mạng -> giữ user null, chuyển login
        handleLogout();
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser, navigate, handleLogout]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              CT
            </div>
            <div>
              <div className="font-bold text-xl text-blue-600">ChiTiêuWeb</div>
              <div className="text-xs text-gray-500">Quản lý chi tiêu</div>
            </div>
          </Link>
        </div>

        {/* Hiển thị fullName ở đầu sidebar */}
        <div className="px-6 pb-4">
          {loading ? (
            <div className="text-sm text-gray-500">Đang tải...</div>
          ) : user ? (
            <div className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {user.fullName
                  ? user.fullName.charAt(0).toUpperCase()
                  : user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium">
                  {user.fullName ?? user.username}
                </div>
                <div className="text-xs text-gray-500">
                  {user.role ?? "Người dùng"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Chưa đăng nhập</div>
          )}
        </div>

        <nav className="mt-2 space-y-2 px-4">
          <Link to="/" className="block py-2 px-3 rounded hover:bg-gray-200">
            Trang chủ
          </Link>
          <Link
            to="/transactions"
            className="block py-2 px-3 rounded hover:bg-gray-200"
          >
            Giao dịch
          </Link>
          <Link
            to="/Wallets"
            className="block py-2 px-3 rounded hover:bg-gray-200"
          >
            Ví
          </Link>
          <Link
            to="/history"
            className="block py-2 px-3 rounded hover:bg-gray-200"
          >
            Lịch sử
          </Link>
          <Link
            to="/categories"
            className="block py-2 px-3 rounded hover:bg-gray-200"
          >
            Danh Mục
          </Link>

          <Link
            to="/statistics"
            className="block py-2 px-3 rounded hover:bg-gray-200"
          >
            Thống kê
          </Link>
          <Link
            to="/account"
            className="block py-2 px-3 rounded hover:bg-gray-200"
          >
            Tài khoản
          </Link>
          <Link
            to="/settings"
            className="block py-2 px-3 rounded hover:bg-gray-200"
          >
            Cài đặt
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-end items-center">
          <div className="flex items-center space-x-3">
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 min-h-0 p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-white text-center text-sm text-gray-500 py-4">
          © {new Date().getFullYear()} ChiTiêuApp. Mọi quyền được bảo lưu.
        </footer>
      </div>
    </div>
  );
}
