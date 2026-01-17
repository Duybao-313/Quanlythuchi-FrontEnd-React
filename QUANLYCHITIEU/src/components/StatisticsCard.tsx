import type { WalletOverview } from "../service/WalletService";

interface StatisticsCardProps {
  overview: WalletOverview | null;
}

export default function StatisticsCard({ overview }: StatisticsCardProps) {
  if (!overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 bg-white/60 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const totalExpense = overview.totalExpense || 0;
  const totalIncome = overview.totalIncome || 0;
  const netBalance = overview.netBalance || 0;
  const expenseCount = overview.expenseCount || 0;
  const incomeCount = overview.incomeCount || 0;

  const avgExpense = expenseCount > 0 ? totalExpense / expenseCount : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <p className="text-sm text-rose-200 mt-2">{expenseCount} giao dịch</p>
        </div>
      </div>

      {/* Tổng thu nhập */}
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

      {/* Chi tiêu trung bình */}
      <div className="group relative bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-100 text-sm font-medium">Chi tiêu TB</p>
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
          <p className="text-3xl font-bold">
            {avgExpense.toLocaleString()}
            <span className="text-lg ml-1">₫</span>
          </p>
          <p className="text-sm text-blue-200 mt-2">Mỗi giao dịch</p>
        </div>
      </div>

      {/* Cân bằng ròng */}
      <div
        className={`group relative rounded-2xl p-6 text-white shadow-xl transition-all duration-300 overflow-hidden ${
          netBalance >= 0
            ? "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 shadow-violet-500/20 hover:shadow-violet-500/40"
            : "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 shadow-orange-500/20 hover:shadow-orange-500/40"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <p
              className={`text-sm font-medium ${
                netBalance >= 0 ? "text-violet-100" : "text-orange-100"
              }`}
            >
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
          <p
            className={`text-sm mt-2 flex items-center gap-1 ${
              netBalance >= 0 ? "text-violet-200" : "text-orange-200"
            }`}
          >
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
  );
}
