// src/pages/RegisterPage.tsx
import { useState, useCallback } from "react";
import { register } from "../service/AuthService";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import type { ApiResponse } from "../type/ApiResponse";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const validate = useCallback(() => {
    const errs: string[] = [];
    if (!email.trim()) errs.push("Email không được để trống");
    else if (!validateEmail(email)) errs.push("Email không hợp lệ");
    if (!username.trim()) errs.push("Tài khoản không được để trống");
    if (!fullName.trim()) errs.push("Họ và tên không được để trống");
    if (!password) errs.push("Mật khẩu không được để trống");
    else if (password.length < 6) errs.push("Mật khẩu phải có ít nhất 6 ký tự");
    return errs;
  }, [email, username, fullName, password]);

  const normalizeErrors = (payload: unknown): string[] => {
    if (payload && typeof payload === "object") {
      const p = payload as Record<string, unknown>;
      if (Array.isArray(p.errors)) {
        return p.errors.filter(Boolean).map(String);
      }
      if (typeof p.message === "string") {
        return p.message
          .split(/[,;]+/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    if (typeof payload === "string") {
      return payload
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return ["Lỗi không xác định"];
  };

  const handleRegister = async () => {
    const clientErrors = validate();
    if (clientErrors.length) {
      clientErrors.forEach((e) => toast.error(e));
      return;
    }

    setLoading(true);
    try {
      // register trả ApiResponse<{ jwt?: string; ... }>
      const res: ApiResponse<Record<string, unknown>> = await register(
        email.trim(),
        username.trim(),
        fullName.trim(),
        password
      );

      if (!res.success) {
        const errs = normalizeErrors(res as unknown);
        errs.forEach((e) => toast.error(e));
        setLoading(false);
        return;
      }

      // Nếu backend trả token trong data, lưu hoặc chuyển hướng
      const token = res.data?.jwt as string | undefined;
      if (token) localStorage.setItem("token", token);

      toast.success(res.message ?? "Đăng ký thành công");
      // chuyển hướng tới trang login hoặc home tuỳ luồng
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        toast.error("Lỗi kết nối: " + err.message);
      } else {
        console.error("Unexpected error", err);
        toast.error("Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2 text-center">
          Tạo tài khoản mới
        </h2>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Bắt đầu quản lý chi tiêu của bạn ngay hôm nay
        </p>

        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <div className="flex items-center border rounded-lg px-3 py-2 mb-4">
          <span className="text-gray-400 mr-2" aria-hidden>
            📧
          </span>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full outline-none text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="email"
            aria-label="Email"
          />
        </div>

        <label className="block text-sm font-medium text-gray-600 mb-1">
          Tài khoản
        </label>
        <div className="flex items-center border rounded-lg px-3 py-2 mb-4">
          <span className="text-gray-400 mr-2" aria-hidden>
            👤
          </span>
          <input
            type="text"
            placeholder="Tên tài khoản"
            className="w-full outline-none text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="username"
            aria-label="Tài khoản"
          />
        </div>

        <label className="block text-sm font-medium text-gray-600 mb-1">
          Họ và tên
        </label>
        <div className="flex items-center border rounded-lg px-3 py-2 mb-4">
          <span className="text-gray-400 mr-2" aria-hidden>
            📝
          </span>
          <input
            type="text"
            placeholder="Nhập họ và tên"
            className="w-full outline-none text-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="name"
            aria-label="Họ và tên"
          />
        </div>

        <label className="block text-sm font-medium text-gray-600 mb-1">
          Mật khẩu
        </label>
        <div className="flex items-center border rounded-lg px-3 py-2 mb-3">
          <span className="text-gray-400 mr-2" aria-hidden>
            🔑
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Ít nhất 6 ký tự"
            className="w-full outline-none text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="new-password"
            aria-label="Mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="ml-2 text-sm text-gray-500"
            aria-pressed={showPassword}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? "Ẩn" : "Hiện"}
          </button>
        </div>

        <div className="flex justify-between items-center text-sm text-blue-600 mb-4">
          <Link to="/login" className="hover:underline">
            Đã có tài khoản? Đăng nhập
          </Link>
          <Link to="/forgot" className="hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gradient-to-r from-teal-300 to-teal-300 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01]"
          }`}
          aria-busy={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <div className="mt-6 text-center text-xs text-gray-400">
          Bằng việc đăng ký bạn đồng ý với{" "}
          <Link to="/terms" className="underline">
            Điều khoản
          </Link>{" "}
          và{" "}
          <Link to="/privacy" className="underline">
            Chính sách
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
