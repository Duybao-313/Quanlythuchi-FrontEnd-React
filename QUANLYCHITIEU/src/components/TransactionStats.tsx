import type { JSX } from "react";

interface TransactionStatsProps {
  income: number;
  expense: number;
  transactionCount: number;
  loading: boolean;
}

export default function TransactionStats({
  income,
  expense,
  transactionCount,
  loading,
}: TransactionStatsProps): JSX.Element {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Income Card */}
      <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg
                className="w-6 h-6 text-white"
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

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tổng Thu</p>
              <p className="text-2xl font-bold text-emerald-600">
                +{income.toLocaleString()} đ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
            <svg
              className="w-4 h-4 text-emerald-500"
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
            <span className="text-sm font-medium text-emerald-600">
              {transactionCount}
            </span>
          </div>
        </div>
      </div>

      {/* Expense Card */}
      <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25">
              <svg
                className="w-6 h-6 text-white"
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

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tổng Chi</p>
              <p className="text-2xl font-bold text-rose-600">
                -{expense.toLocaleString()} đ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 text-gray-400 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm text-gray-500">Đang tải...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-500">Hoàn tất</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
