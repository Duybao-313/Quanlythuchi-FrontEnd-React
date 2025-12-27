import type { WalletOverview } from "../service/WalletService";

interface StatisticsCardProps {
  overview: WalletOverview | null;
}

export default function StatisticsCard({ overview }: StatisticsCardProps) {
  if (!overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Tổng chi tiêu */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
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
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Tổng doanh thu</p>
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

      {/* Chi tiêu trung bình */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Chi tiêu TB</p>
            <p className="text-3xl font-bold mt-2">
              {avgExpense.toLocaleString()}
            </p>
            <p className="text-xs text-blue-100 mt-2">Mỗi giao dịch</p>
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

      {/* Cân bằng ròng */}
      <div
        className={`bg-gradient-to-br rounded-lg p-6 text-white shadow-lg ${
          netBalance >= 0
            ? "from-purple-500 to-purple-600"
            : "from-orange-500 to-orange-600"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Cân bằng ròng</p>
            <p
              className={`text-3xl font-bold mt-2 ${
                netBalance >= 0 ? "text-green-300" : "text-red-300"
              }`}
            >
              {netBalance.toLocaleString()}
            </p>
            <p className="text-xs text-purple-100 mt-2">
              {netBalance >= 0 ? "✓ Dương" : "✗ Âm"}
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
    </div>
  );
}
