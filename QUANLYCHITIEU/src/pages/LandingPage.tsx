// src/pages/LandingPage.tsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function IconCheck() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 transform transition hover:-translate-y-2">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Testimonial({ name, text }: { name: string; text: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm">
      <p className="text-gray-700 mb-3">“{text}”</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          {name[0]}
        </div>
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-gray-500">Người dùng</div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token1 = localStorage.getItem("token");
    if (token1) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              CT
            </div>
            <div className="text-xl font-bold text-slate-800">ChiTiêuApp</div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#home" className="hover:text-blue-600">Trang chủ</a>
            <a href="#features" className="hover:text-blue-600">Tính năng</a>
            <a href="#faq" className="hover:text-blue-600">FAQ</a>
            <a href="#contact" className="hover:text-blue-600">Liên hệ</a>
            <Link to="/login" className="ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Đăng nhập
            </Link>
          </div>

          <div className="md:hidden">
            <Link to="/login" className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm">Đăng nhập</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header id="home" className="min-h-screen flex items-center pt-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 mb-4">
              Quản lý chi tiêu dễ dàng, thông minh hơn
            </h1>
            <p className="text-lg text-slate-600 mb-6 max-w-xl">
              Theo dõi thu chi, đặt mục tiêu tiết kiệm và nhận gợi ý chi tiêu thông minh. Giao diện trực quan, báo cáo rõ ràng.
            </p>

            <div className="flex gap-4 items-center">
              <Link to="/register" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:scale-[1.02] transition">
                Bắt đầu miễn phí
              </Link>
              <Link to="/login" className="px-6 py-3 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition">
                Đăng nhập
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-full text-sm">
                <IconCheck /> Bảo mật cao
              </div>
              <div className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-full text-sm">
                <IconCheck /> Đồng bộ đa thiết bị
              </div>
              <div className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-full text-sm">
                <IconCheck /> Báo cáo trực quan
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-md bg-gradient-to-br from-white/60 to-white/30 rounded-3xl p-6 shadow-xl transform transition hover:scale-105">
              {/* Simple mock dashboard */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm opacity-90">Tổng thu</div>
                    <div className="text-2xl font-bold">₫ 25,400,000</div>
                  </div>
                  <div className="text-right text-sm">
                    <div>Tháng này</div>
                    <div className="text-xs opacity-80">Cập nhật 2 giờ trước</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Chi tiêu</div>
                  <div className="text-lg font-semibold">₫ 8,200,000</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Tiết kiệm</div>
                  <div className="text-lg font-semibold">₫ 3,000,000</div>
                </div>
                <div className="col-span-2 bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Danh mục hàng đầu</div>
                  <div className="text-sm font-medium">Ăn uống, Di chuyển</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="Dashboard trực quan" desc="Biểu đồ, số liệu tổng quan giúp bạn nắm rõ tình hình tài chính." />
            <FeatureCard title="Quản lý giao dịch" desc="Thêm, sửa, xóa giao dịch, lọc theo ngày và danh mục." />
            <FeatureCard title="Mục tiêu tiết kiệm" desc="Đặt mục tiêu và theo dõi tiến độ hàng tháng." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-6">Người dùng nói gì</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial name="Lan" text="Ứng dụng giúp mình kiểm soát chi tiêu hàng tháng rõ ràng hơn rất nhiều." />
            <Testimonial name="Minh" text="Báo cáo trực quan, dễ hiểu. Mình thích tính năng mục tiêu tiết kiệm." />
            <Testimonial name="Huy" text="Giao diện đẹp, đồng bộ nhanh giữa điện thoại và web." />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-6">Câu hỏi thường gặp</h3>
          <div className="space-y-4">
            <details className="p-4 bg-gray-50 rounded-lg">
              <summary className="font-medium cursor-pointer">Ứng dụng có miễn phí không?</summary>
              <p className="mt-2 text-sm text-gray-600">Có, bạn có thể sử dụng miễn phí với đầy đủ tính năng cơ bản.</p>
            </details>
            <details className="p-4 bg-gray-50 rounded-lg">
              <summary className="font-medium cursor-pointer">Có thể xuất báo cáo không?</summary>
              <p className="mt-2 text-sm text-gray-600">Có, bạn có thể xuất báo cáo PDF hoặc Excel để lưu trữ.</p>
            </details>
            <details className="p-4 bg-gray-50 rounded-lg">
              <summary className="font-medium cursor-pointer">Ứng dụng có hỗ trợ đa thiết bị?</summary>
              <p className="mt-2 text-sm text-gray-600">Có, bạn có thể sử dụng trên web, mobile và đồng bộ dữ liệu.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-3">Sẵn sàng quản lý tài chính của bạn?</h3>
          <p className="mb-6 opacity-90">Tạo tài khoản miễn phí và bắt đầu theo dõi chi tiêu ngay hôm nay.</p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium">Tạo tài khoản</Link>
            <Link to="/login" className="px-6 py-3 border border-white/30 rounded-lg">Đăng nhập</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">© {new Date().getFullYear()} ChiTiêuApp. All rights reserved.</div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="mailto:support@chitieapp.com" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}