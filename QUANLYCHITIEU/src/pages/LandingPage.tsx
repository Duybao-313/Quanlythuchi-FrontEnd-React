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

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Testimonial({ name, text }: { name: string; text: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
      <p className="text-gray-700 mb-4">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold shadow-lg shadow-indigo-500/25">
          {name[0]}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{name}</div>
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
    <div className="font-sans text-gray-800 bg-gradient-to-br from-gray-50 to-indigo-50/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25">
              CT
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ChiTiêuApp</div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#home" className="text-gray-600 hover:text-indigo-600 transition-colors">Trang chủ</a>
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Tính năng</a>
            <a href="#faq" className="text-gray-600 hover:text-indigo-600 transition-colors">FAQ</a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Liên hệ</a>
            <Link to="/login" className="ml-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 font-medium">
              Đăng nhập
            </Link>
          </div>

          <div className="md:hidden">
            <Link to="/login" className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25">Đăng nhập</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header id="home" className="min-h-screen flex items-center pt-24 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              <span className="text-gray-900">Quản lý chi tiêu</span>{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">dễ dàng, thông minh hơn</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Theo dõi thu chi, đặt mục tiêu tiết kiệm và nhận gợi ý chi tiêu thông minh. Giao diện trực quan, báo cáo rõ ràng.
            </p>

            <div className="flex gap-4 items-center">
              <Link to="/register" className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 hover:scale-[1.02] transition-all font-medium">
                Bắt đầu miễn phí
              </Link>
              <Link to="/login" className="px-6 py-3.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-white hover:shadow-md transition-all font-medium">
                Đăng nhập
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                <IconCheck /> Bảo mật cao
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                <IconCheck /> Đồng bộ đa thiết bị
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                <IconCheck /> Báo cáo trực quan
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-md bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50 transform transition hover:scale-105">
              {/* Simple mock dashboard */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-5 mb-4 shadow-lg">
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
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-500">Chi tiêu</div>
                  <div className="text-lg font-bold text-rose-600">₫ 8,200,000</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-500">Tiết kiệm</div>
                  <div className="text-lg font-bold text-emerald-600">₫ 3,000,000</div>
                </div>
                <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-500">Danh mục hàng đầu</div>
                  <div className="text-sm font-medium text-gray-900">Ăn uống, Di chuyển</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block">Tính năng nổi bật</h2>
            <p className="text-gray-600 mt-2">Mọi thứ bạn cần để quản lý tài chính hiệu quả</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="Dashboard trực quan" 
              desc="Biểu đồ, số liệu tổng quan giúp bạn nắm rõ tình hình tài chính."
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
            <FeatureCard 
              title="Quản lý giao dịch" 
              desc="Thêm, sửa, xóa giao dịch, lọc theo ngày và danh mục."
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            />
            <FeatureCard 
              title="Mục tiêu tiết kiệm" 
              desc="Đặt mục tiêu và theo dõi tiến độ hàng tháng."
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block w-full">Người dùng nói gì</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial name="Lan" text="Ứng dụng giúp mình kiểm soát chi tiêu hàng tháng rõ ràng hơn rất nhiều." />
            <Testimonial name="Minh" text="Báo cáo trực quan, dễ hiểu. Mình thích tính năng mục tiêu tiết kiệm." />
            <Testimonial name="Huy" text="Giao diện đẹp, đồng bộ nhanh giữa điện thoại và web." />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Câu hỏi thường gặp</h3>
          <div className="space-y-4">
            <details className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm group">
              <summary className="font-medium cursor-pointer text-gray-900 flex items-center justify-between">
                Ứng dụng có miễn phí không?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="mt-3 text-sm text-gray-600">Có, bạn có thể sử dụng miễn phí với đầy đủ tính năng cơ bản.</p>
            </details>
            <details className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm group">
              <summary className="font-medium cursor-pointer text-gray-900 flex items-center justify-between">
                Có thể xuất báo cáo không?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="mt-3 text-sm text-gray-600">Có, bạn có thể xuất báo cáo PDF hoặc Excel để lưu trữ.</p>
            </details>
            <details className="p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm group">
              <summary className="font-medium cursor-pointer text-gray-900 flex items-center justify-between">
                Ứng dụng có hỗ trợ đa thiết bị?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="mt-3 text-sm text-gray-600">Có, bạn có thể sử dụng trên web, mobile và đồng bộ dữ liệu.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1.5' cy='1.5' r='1.5' fill='white'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />
        </div>
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-3xl font-bold mb-4">Sẵn sàng quản lý tài chính của bạn?</h3>
          <p className="mb-8 opacity-90 text-lg">Tạo tài khoản miễn phí và bắt đầu theo dõi chi tiêu ngay hôm nay.</p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="px-8 py-3.5 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all">Tạo tài khoản</Link>
            <Link to="/login" className="px-8 py-3.5 border-2 border-white/30 rounded-xl font-medium hover:bg-white/10 transition-all">Đăng nhập</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              CT
            </div>
            <div className="text-sm text-gray-400">© {new Date().getFullYear()} ChiTiêuApp. All rights reserved.</div>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="mailto:support@chitieapp.com" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}