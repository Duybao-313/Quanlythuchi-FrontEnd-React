// src/pages/BudgetDetailPage.tsx
import { useEffect, useState, type JSX } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchBudgetById, deleteBudget } from "../service/BudgetService";
import { fetchWallets } from "../service/WalletService";
import { listCategories } from "../service/Categories";
import type { BudgetDetailResponse } from "../type/BudgetResponse";
import type { Wallet } from "../type/Wallet";
import type { CategoryResponse } from "../type/CategoriesResponse";
import {
  BudgetStatusLabels,
  BudgetStatusColors,
  PeriodTypeLabels,
  ScopeTypeLabels,
  ThresholdActionLabels,
  ThresholdAction,
  ScopeType,
} from "../type/BudgetEnums";

export default function BudgetDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<BudgetDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Data for scope names
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("ID ngân sách không hợp lệ");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [budgetData, walletsRes, categoriesRes] = await Promise.all([
          fetchBudgetById(Number(id)),
          fetchWallets(),
          listCategories(),
        ]);

        if (!budgetData) {
          setError("Không tìm thấy ngân sách");
          return;
        }

        setBudget(budgetData);
        setWallets(walletsRes.data ?? []);
        setCategories(categoriesRes ?? []);
      } catch (err) {
        console.error("Error loading budget:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Không thể tải chi tiết ngân sách";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa ngân sách này?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteBudget(Number(id));
      toast.success("Xóa ngân sách thành công");
      navigate("/budgets");
    } catch (err) {
      console.error("Error deleting budget:", err);
      const message =
        err instanceof Error ? err.message : "Không thể xóa ngân sách";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getScopeName = (scopeType: string, refId: number): string => {
    if (scopeType === ScopeType.WALLET) {
      const wallet = wallets.find((w) => w.id === refId);
      return wallet?.name ?? `Ví #${refId}`;
    } else if (scopeType === ScopeType.CATEGORY) {
      const category = categories.find((c) => c.id === refId);
      return category?.name ?? `Danh mục #${refId}`;
    }
    return `#${refId}`;
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
            Đang tải chi tiết ngân sách...
          </p>
        </div>
      </div>
    );
  }

  if (error || !budget) {
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
              <p className="text-rose-600 text-sm mt-1">
                {error || "Không tìm thấy ngân sách"}
              </p>
            </div>
          </div>
          <Link
            to="/budgets"
            className="mt-6 inline-block px-6 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 font-medium"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/budgets")}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {budget.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${BudgetStatusColors[budget.budgetStatus]}`}
              >
                {BudgetStatusLabels[budget.budgetStatus]}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                {PeriodTypeLabels[budget.periodType]}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2.5 border-2 border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 transition-all font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {deleting ? (
              <div className="w-4 h-4 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin"></div>
            ) : (
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
            Xóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Ngân sách</p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(budget.amount)}
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Date Range Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Thời gian áp dụng
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl">
                <p className="text-sm text-emerald-600 font-medium">
                  Ngày bắt đầu
                </p>
                <p className="text-gray-800 font-semibold mt-1">
                  {formatDate(budget.startDate)}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-xl">
                <p className="text-sm text-rose-600 font-medium">
                  Ngày kết thúc
                </p>
                <p className="text-gray-800 font-semibold mt-1">
                  {formatDate(budget.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Scopes Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Phạm vi áp dụng
              </h2>
            </div>

            {budget.scopes && budget.scopes.length > 0 ? (
              <div className="space-y-2">
                {budget.scopes.map((scope, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                        {ScopeTypeLabels[scope.scopeType]}
                      </span>
                      <span className="text-gray-700 font-medium">
                        {getScopeName(scope.scopeType, scope.refId)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-sm">Không có phạm vi cụ thể</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Thresholds */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Ngưỡng cảnh báo
              </h2>
            </div>

            {budget.thresholds && budget.thresholds.length > 0 ? (
              <div className="space-y-3">
                {budget.thresholds.map((threshold, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                      threshold.percent >= 100
                        ? "bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200"
                        : threshold.percent >= 80
                          ? "bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200"
                          : "bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-sm font-bold ${
                          threshold.percent >= 100
                            ? "bg-rose-100 text-rose-700"
                            : threshold.percent >= 80
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {threshold.percent}%
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-sm font-semibold ${
                        threshold.action === ThresholdAction.BLOCK
                          ? "bg-rose-100 text-rose-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {ThresholdActionLabels[threshold.action]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <svg
                  className="w-10 h-10 mx-auto mb-2 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="text-sm">Không có ngưỡng cảnh báo</p>
              </div>
            )}

            {/* Info Card */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
              <h4 className="text-sm font-semibold text-indigo-700 mb-2">
                💡 Ghi chú
              </h4>
              <ul className="text-xs text-indigo-600 space-y-1">
                <li>
                  • <strong>Thông báo:</strong> Nhận cảnh báo khi đạt ngưỡng
                </li>
                <li>
                  • <strong>Chặn:</strong> Ngăn giao dịch vượt ngân sách
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
