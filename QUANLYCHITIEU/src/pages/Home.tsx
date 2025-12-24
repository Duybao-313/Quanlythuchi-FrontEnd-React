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

        // Lấy giao dịch 7 ngày gần nhất
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const year = sevenDaysAgo.getFullYear();
        const month = String(sevenDaysAgo.getMonth() + 1).padStart(2, "0");
        const day = String(sevenDaysAgo.getDate()).padStart(2, "0");
        const startDate = `${year}-${month}-${day}`;

        const transRes = await fetchTransactions({ startDate });
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

  // Giao dịch gần đây từ API (7 ngày), sắp xếp mới nhất trước
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
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Tổng quan tài chính
        </h1>
        <p className="text-gray-600 mt-2">
          Quản lý chi tiêu và doanh thu của bạn
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tổng số dư */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Tổng số dư</p>
              <p className="text-3xl font-bold mt-2">
                {totalBalance.toLocaleString()}
              </p>
              <p className="text-xs text-blue-100 mt-2">
                Từ {wallets.length} ví
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
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
        </div>

        {/* Tổng chi tiêu */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Tổng chi tiêu</p>
              <p className="text-3xl font-bold mt-2">
                {totalExpense.toLocaleString()}
              </p>
              <p className="text-xs text-red-100 mt-2">
                {expenseCount} giao dịch
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tổng doanh thu */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Tổng doanh thu
              </p>
              <p className="text-3xl font-bold mt-2">
                {totalIncome.toLocaleString()}
              </p>
              <p className="text-xs text-green-100 mt-2">
                {incomeCount} giao dịch
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Cân bằng */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Cân bằng ròng
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  netBalance >= 0 ? "text-green-300" : "text-red-300"
                }`}
              >
                {netBalance.toLocaleString()}
              </p>
              <p className="text-xs text-purple-100 mt-2">
                {netBalance >= 0 ? "🎉 Dương" : "⚠️ Âm"}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
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
        </div>
      </div>

      {/* Today Stats & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today Statistics */}
        <div className="lg:col-span-1 space-y-4">
          {/* Hôm nay */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Hôm nay
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📤</span>
                  <span className="text-sm text-gray-700">Chi tiêu</span>
                </div>
                <span className="font-semibold text-red-600">
                  {todayExpense.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📥</span>
                  <span className="text-sm text-gray-700">Doanh thu</span>
                </div>
                <span className="font-semibold text-green-600">
                  {todayIncome.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚖️</span>
                  <span className="text-sm text-gray-700">Cân bằng</span>
                </div>
                <span
                  className={`font-semibold ${
                    todayIncome - todayExpense >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(todayIncome - todayExpense).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Số ví */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Ví của bạn ({walletCount})
            </h3>
            <div className="space-y-2">
              {wallets.slice(0, 5).map((w) => (
                <div key={w.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{w.name}</span>
                  <span className="font-medium text-gray-800">
                    {w.balance.toLocaleString()}
                  </span>
                </div>
              ))}
              {wallets.length > 5 && (
                <div className="text-xs text-gray-500 pt-2">
                  +{wallets.length - 5} ví khác
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Giao dịch gần đây
            </h3>
            {recentTransactions.length > 0 && (
              <span className="text-xs text-gray-500">7 ngày gần nhất</span>
            )}
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-500">Chưa có giao dịch nào</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        t.type === "EXPENSE"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {t.type === "EXPENSE" ? "📤" : "📥"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {t.description || `Giao dịch #${t.id}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t.date
                          ? new Date(t.date).toLocaleDateString("vi-VN")
                          : "Không rõ"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold text-sm whitespace-nowrap ml-2 ${
                      t.type === "EXPENSE" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {t.type === "EXPENSE" ? "-" : "+"}
                    {t.amount.toLocaleString()}
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
