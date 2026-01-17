import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallets } from "../hooks/useWallet";
import { fetchTransactions } from "../service/TransactionService";
import { fetchWalletOverview } from "../service/WalletService";
import type { TransactionResponse } from "../type/TransactionResponse";
import type { WalletOverview } from "../service/WalletService";

export const Home = () => {
  const navigate = useNavigate();
  const { wallets } = useWallets();
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [overview, setOverview] = useState<WalletOverview | null>(null);
  const [todayOverview, setTodayOverview] = useState<WalletOverview | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Lấy dữ liệu overview tổng từ service
        const overviewRes = await fetchWalletOverview();
        if (overviewRes.success && overviewRes.data) {
          setOverview(overviewRes.data);
        }

        // Lấy tất cả giao dịch
        const transRes = await fetchTransactions({});
        if (transRes && Array.isArray(transRes)) {
          setTransactions(transRes);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Lấy dữ liệu hôm nay (refetch mỗi phút)
  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        // Format: YYYY-MM-DDTHH:mm:ss
        const startDateISO = `${year}-${month}-${day}T00:00:00`;
        const endDateISO = `${year}-${month}-${day}T23:00:00`;

        const todayRes = await fetchWalletOverview(startDateISO, endDateISO);
        if (todayRes.success && todayRes.data) {
          console.log("Today's overview:", startDateISO, endDateISO);
          setTodayOverview(todayRes.data);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu hôm nay:", err);
      }
    };

    // Chạy ngay khi mount
    fetchTodayData();

    // Refetch mỗi 30 giây
    const interval = setInterval(fetchTodayData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Sử dụng dữ liệu từ overview API, nếu không có thì = 0
  const totalBalance = overview?.totalBalance ?? 0;
  const totalExpense = overview?.totalExpense ?? 0;
  const totalIncome = overview?.totalIncome ?? 0;
  const walletCount = overview?.walletCount ?? 0;
  const netBalance = overview?.netBalance ?? 0;
  const expenseCount = overview?.expenseCount ?? 0;
  const incomeCount = overview?.incomeCount ?? 0;

  // Giao dịch gần đây từ API, sắp xếp mới nhất trước, lấy top 10
  const recentTransactions = transactions
    .sort(
      (a, b) =>
        new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
    )
    .slice(0, 5);

  // Dữ liệu hôm nay từ API
  const todayExpense = todayOverview?.totalExpense ?? 0;
  const todayIncome = todayOverview?.totalIncome ?? 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-36 bg-white/60 rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-white/60 rounded-2xl animate-pulse" />
          <div className="lg:col-span-2 h-64 bg-white/60 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Tổng quan tài chính
          </h1>
          <p className="text-gray-500 mt-1">
            Theo dõi chi tiêu và thu nhập của bạn
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium">Hôm nay</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tổng số dư */}
        <div className="group relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-indigo-100 text-sm font-medium">Tổng số dư</p>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">
              {totalBalance.toLocaleString()}
              <span className="text-lg ml-1">₫</span>
            </p>
            <p className="text-sm text-indigo-200 mt-2">
              Từ {wallets.length} ví
            </p>
          </div>
        </div>

        {/* Tổng chi tiêu */}
        <div className="group relative bg-gradient-to-br from-rose-500 via-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-rose-100 text-sm font-medium">Tổng chi tiêu</p>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">
              {totalExpense.toLocaleString()}
              <span className="text-lg ml-1">₫</span>
            </p>
            <p className="text-sm text-rose-200 mt-2">
              {expenseCount} giao dịch
            </p>
          </div>
        </div>

        {/* Tổng doanh thu */}
        <div className="group relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-emerald-100 text-sm font-medium">
                Tổng thu nhập
              </p>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">
              {totalIncome.toLocaleString()}
              <span className="text-lg ml-1">₫</span>
            </p>
            <p className="text-sm text-emerald-200 mt-2">
              {incomeCount} giao dịch
            </p>
          </div>
        </div>

        {/* Cân bằng */}
        <div className="group relative bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-violet-100 text-sm font-medium">
                Cân bằng ròng
              </p>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <p
              className={`text-3xl font-bold ${
                netBalance >= 0 ? "" : "text-rose-200"
              }`}
            >
              {netBalance >= 0 ? "+" : ""}
              {netBalance.toLocaleString()}
              <span className="text-lg ml-1">₫</span>
            </p>
            <p className="text-sm text-violet-200 mt-2 flex items-center gap-1">
              {netBalance >= 0 ? (
                <>
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>{" "}
                  Dương
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-rose-400 rounded-full"></span> Âm
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Today Stats & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today Statistics */}
        <div className="space-y-6">
          {/* Hôm nay */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Hôm nay</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-rose-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-rose-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 13l-5 5m0 0l-5-5m5 5V6"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Chi tiêu
                  </span>
                </div>
                <span className="font-bold text-rose-600">
                  {todayExpense.toLocaleString()}₫
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Thu nhập
                  </span>
                </div>
                <span className="font-bold text-emerald-600">
                  {todayIncome.toLocaleString()}₫
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Cân bằng
                  </span>
                </div>
                <span
                  className={`font-bold ${
                    todayIncome - todayExpense >= 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {(todayIncome - todayExpense).toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>

          {/* Số ví */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
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
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Ví của bạn
                </h3>
              </div>
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {walletCount}
              </span>
            </div>
            <div className="space-y-3">
              {wallets.slice(0, 5).map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                      {w.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {w.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {w.balance.toLocaleString()}₫
                  </span>
                </div>
              ))}
              {wallets.length > 5 && (
                <div className="text-center pt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    +{wallets.length - 5} ví khác
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Giao dịch gần đây
              </h3>
            </div>
            {recentTransactions.length > 0 && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                Mới nhất
              </span>
            )}
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Chưa có giao dịch nào</p>
              <p className="text-gray-400 text-sm mt-1">
                Bắt đầu ghi nhận chi tiêu của bạn
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        t.type === "EXPENSE"
                          ? "bg-gradient-to-br from-rose-100 to-pink-100 text-rose-500"
                          : "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-500"
                      }`}
                    >
                      {t.type === "EXPENSE" ? (
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
                            d="M17 13l-5 5m0 0l-5-5m5 5V6"
                          />
                        </svg>
                      ) : (
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
                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {t.description || `Giao dịch #${t.id}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t.date
                          ? new Date(t.date).toLocaleDateString("vi-VN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })
                          : "Không rõ"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-bold text-sm whitespace-nowrap ml-4 ${
                      t.type === "EXPENSE"
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {t.type === "EXPENSE" ? "-" : "+"}
                    {t.amount.toLocaleString()}₫
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
