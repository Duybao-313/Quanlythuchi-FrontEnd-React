// src/pages/BudgetListPage.tsx
import { useEffect, useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchBudgets } from "../service/BudgetService";
import type { BudgetListItem } from "../type/BudgetResponse";
import {
  BudgetStatusLabels,
  BudgetStatusColors,
  PeriodTypeLabels,
} from "../type/BudgetEnums";

export default function BudgetListPage(): JSX.Element {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<BudgetListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBudgets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBudgets({
          page: 0,
          size: 20,
          sort: "startDate,desc",
        });
        setBudgets(data);
      } catch (err) {
        console.error("Error loading budgets:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách ngân sách";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    loadBudgets();
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-full h-full border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">
            Đang tải danh sách ngân sách...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-rose-700 font-semibold">Đã xảy ra lỗi</p>
              <p className="text-rose-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Danh sách ngân sách
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý các ngân sách chi tiêu của bạn
          </p>
        </div>
        <Link
          to="/budgets/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 font-semibold"
        >
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Tạo ngân sách
        </Link>
      </div>

      {/* Budget List */}
      {budgets.length === 0 ? (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Chưa có ngân sách nào
            </h3>
            <p className="text-gray-600 mb-6">
              Tạo ngân sách đầu tiên để quản lý chi tiêu hiệu quả
            </p>
            <Link
              to="/budgets/create"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 font-semibold flex items-center gap-2"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Tạo ngân sách mới
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              onClick={() => navigate(`/budgets/${budget.id}`)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left: Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {budget.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${BudgetStatusColors[budget.status]}`}
                      >
                        {BudgetStatusLabels[budget.status]}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                        {PeriodTypeLabels[budget.periodType]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Date */}
                <div className="flex flex-col md:items-end gap-2">
                  <p className="text-xl font-bold text-indigo-600">
                    {formatCurrency(budget.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(budget.startDate)} -{" "}
                    {formatDate(budget.endDate)}
                  </p>
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                <svg
                  className="w-6 h-6 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {budgets.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số ngân sách</p>
                <p className="text-xl font-bold text-gray-800">
                  {budgets.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Tổng ngân sách</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatCurrency(budgets.reduce((sum, b) => sum + b.amount, 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
