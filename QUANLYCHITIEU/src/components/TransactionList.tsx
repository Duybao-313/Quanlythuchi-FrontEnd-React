import type { JSX } from "react";
import type { TransactionResponse } from "../type/TransactionResponse";

interface TransactionListProps {
  transactions: TransactionResponse[];
  loading: boolean;
  networkError: string | null;
  onRetry: () => void;
}

export default function TransactionList({
  transactions,
  loading,
  networkError,
  onRetry,
}: TransactionListProps): JSX.Element {
  return (
    <section className="w-full">
      {networkError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">{networkError}</span>
          </div>
          <button
            onClick={onRetry}
            className="text-sm font-medium text-red-600 hover:text-red-700 underline"
            type="button"
          >
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg
            className="w-8 h-8 animate-spin text-indigo-500 mb-3"
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
          <span className="text-sm">Đang tải giao dịch...</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <span className="text-sm font-medium">Không có giao dịch</span>
          <span className="text-xs text-gray-400 mt-1">
            Các giao dịch sẽ hiển thị ở đây
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === "EXPENSE"
                        ? "bg-gradient-to-br from-rose-100 to-red-100"
                        : "bg-gradient-to-br from-emerald-100 to-green-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        tx.type === "EXPENSE"
                          ? "text-rose-500"
                          : "text-emerald-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {tx.type === "EXPENSE" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 13l-5 5m0 0l-5-5m5 5V6"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        />
                      )}
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {tx.categoryName ?? "Giao dịch"}
                    </div>
                    {tx.description && (
                      <div className="text-sm text-gray-500 truncate mt-0.5">
                      Ghi chú: {tx.description}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                        <svg
                          className="w-3 h-3"
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
                        {tx.walletName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
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
                        {new Date(tx.date ?? "").toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`font-bold text-lg ${
                    tx.type === "EXPENSE" ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {tx.type === "EXPENSE" ? "-" : "+"}
                  {tx.amount.toLocaleString()} đ
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
