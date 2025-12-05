// src/pages/LoginPage.tsx
import { useState, useCallback } from "react";
import { login } from "../service/AuthService";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = useCallback(() => {
    const errs: string[] = [];
    if (!username.trim()) errs.push("Tài khoản không được để trống");
    if (!password) errs.push("Mật khẩu không được để trống");
    return errs;
  }, [username, password]);

  const handleLogin = async () => {
    const clientErrors = validate();
    if (clientErrors.length) {
      clientErrors.forEach((e) => toast.error(e));
      return;
    }

    setLoading(true);
    try {
      const res = await login(username.trim(), password);
      if (!res.success) {
        const raw = res.message ?? "";
        let errors: string[] = [];
     if (typeof raw === "string") {
          errors = raw.split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
        } else {
          errors = [String(raw)];
        }
        errors.forEach((err) => toast.error(err));
        setLoading(false);
        return;
      }

      const token = res.data?.jwt;
      if (token) localStorage.setItem("token", token);
      toast.success(res.message ?? "Đăng nhập thành công");
      navigate("/"); // hoặc "/home"
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
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold">
            CT
          </div>
          <span className="hidden md:inline text-white font-semibold">ChiTiêuApp</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative z-10">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2 text-center">Chào mừng trở lại</h2>
        <p className="text-sm text-slate-500 mb-6 text-center">Đăng nhập để tiếp tục quản lý chi tiêu của bạn</p>

        <label className="block text-sm font-medium text-gray-600 mb-1">Tài khoản</label>
        <div className="flex items-center border rounded-lg px-3 py-2 mb-4">
          <span className="text-gray-400 mr-2" aria-hidden>📧</span>
          <input
            type="text"
            placeholder="Tài khoản"
            className="w-full outline-none text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Tài khoản"
            autoComplete="username"
          />
        </div>

        <label className="block text-sm font-medium text-gray-600 mb-1">Mật khẩu</label>
        <div className="flex items-center border rounded-lg px-3 py-2 mb-2">
          <span className="text-gray-400 mr-2" aria-hidden>🔑</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            className="w-full outline-none text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Mật khẩu"
            autoComplete="current-password"
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
          <Link to="/forgot" className="hover:underline">Quên mật khẩu?</Link>
          <Link to="/register" className="hover:underline">Đăng ký</Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading ? "bg-gradient-to-r from-teal-300 to-teal-300 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01]"
          }`}
          aria-busy={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-3">Hoặc đăng nhập bằng</p>
          <div className="flex gap-3">
            <button
              onClick={() => toast.info("Chức năng Google chưa cấu hình")}
              className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50"
            >
              <img src="/search.png" alt="Google" className="w-5 h-5" />
              <span className="text-sm">Google</span>
            </button>
            <button
              onClick={() => toast.info("Chức năng Facebook chưa cấu hình")}
              className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.15h-1.1c-1.08 0-1.42.67-1.42 1.36V12h2.42l-.39 2.9h-2.03v7A10 10 0 0022 12z" />
              </svg>
              <span className="text-sm">Facebook</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Bằng việc đăng nhập bạn đồng ý với <Link to="/terms" className="underline">Điều khoản</Link> và <Link to="/privacy" className="underline">Chính sách</Link>.
        </div>
      </div>

      {/* subtle decorative panel on right for large screens */}
      <div className="hidden lg:block absolute right-12 top-24 w-96 h-72 rounded-3xl bg-white/10 backdrop-blur-md shadow-lg transform rotate-3" />
    </div>
  );
}