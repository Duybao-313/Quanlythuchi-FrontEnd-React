// src/pages/CreateBudgetPage.tsx
import React, { useState, useEffect, type JSX } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createBudget } from "../service/BudgetService";
import { fetchWallets } from "../service/WalletService";
import { listCategories } from "../service/Categories";
import type { Wallet } from "../type/Wallet";
import type { CategoryResponse } from "../type/CategoriesResponse";
import type {
  BudgetScope,
  BudgetThreshold,
  CreateBudgetRequest,
} from "../type/BudgetRequest";
import {
  BudgetStatus,
  BudgetStatusLabels,
  PeriodType,
  PeriodTypeLabels,
  ScopeType,
  ScopeTypeLabels,
  ThresholdAction,
  ThresholdActionLabels,
} from "../type/BudgetEnums";

// Chỉ cho phép chọn DRAFT và ACTIVE khi tạo mới
const ALLOWED_CREATE_STATUSES = [BudgetStatus.DRAFT, BudgetStatus.ACTIVE];

export default function CreateBudgetPage(): JSX.Element {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.MONTHLY);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus>(
    BudgetStatus.ACTIVE,
  );

  // Scopes state
  const [scopes, setScopes] = useState<BudgetScope[]>([]);
  const [newScopeType, setNewScopeType] = useState<ScopeType>(
    ScopeType.CATEGORY,
  );
  const [newScopeRefId, setNewScopeRefId] = useState<number>(0);

  // Thresholds state
  const [thresholds, setThresholds] = useState<BudgetThreshold[]>([
    { percent: 70, action: ThresholdAction.NOTIFY },
    { percent: 90, action: ThresholdAction.NOTIFY },
    { percent: 100, action: ThresholdAction.BLOCK },
  ]);
  const [newThresholdPercent, setNewThresholdPercent] = useState<number>(50);
  const [newThresholdAction, setNewThresholdAction] = useState<ThresholdAction>(
    ThresholdAction.NOTIFY,
  );

  // Data for dropdowns
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load wallets and categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [walletsRes, categoriesRes] = await Promise.all([
          fetchWallets(),
          listCategories(),
        ]);
        setWallets(walletsRes.data ?? []);
        setCategories(categoriesRes ?? []);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Tự động điều chỉnh ngày kết thúc khi thay đổi period type hoặc ngày bắt đầu
  useEffect(() => {
    if (!startDate) return;

    const start = new Date(startDate);
    let end: Date;

    switch (periodType) {
      case PeriodType.WEEKLY:
        // Tính ngày kết thúc tuần (7 ngày)
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      case PeriodType.MONTHLY:
        // Tính ngày cuối tháng
        end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
        break;
      case PeriodType.ONE_TIME:
        // Giữ nguyên ngày kết thúc đã chọn hoặc mặc định 30 ngày
        if (!endDate) {
          end = new Date(start);
          end.setDate(start.getDate() + 30);
        } else {
          return; // Không tự động điều chỉnh cho ONE_TIME
        }
        break;
      default:
        return;
    }

    setEndDate(end.toISOString().split("T")[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodType, startDate]);

  // Validate ngày theo period type
  const validateDateRange = (
    start: string,
    end: string,
    period: PeriodType,
  ): boolean => {
    if (!start || !end) return true;

    const startD = new Date(start);
    const endD = new Date(end);
    const diffDays = Math.ceil(
      (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24),
    );

    switch (period) {
      case PeriodType.WEEKLY:
        return diffDays >= 0 && diffDays <= 6;
      case PeriodType.MONTHLY:
        // Cho phép từ 28-31 ngày
        return diffDays >= 27 && diffDays <= 31;
      case PeriodType.ONE_TIME:
        return diffDays >= 0;
      default:
        return true;
    }
  };

  // Lấy min/max date cho endDate dựa vào period type
  const getEndDateConstraints = () => {
    if (!startDate) return { min: "", max: "" };

    const start = new Date(startDate);

    switch (periodType) {
      case PeriodType.WEEKLY: {
        const maxEnd = new Date(start);
        maxEnd.setDate(start.getDate() + 6);
        return {
          min: startDate,
          max: maxEnd.toISOString().split("T")[0],
        };
      }
      case PeriodType.MONTHLY: {
        const minEnd = new Date(start);
        minEnd.setDate(start.getDate() + 27);
        const maxEnd = new Date(start);
        maxEnd.setDate(start.getDate() + 31);
        return {
          min: minEnd.toISOString().split("T")[0],
          max: maxEnd.toISOString().split("T")[0],
        };
      }
      case PeriodType.ONE_TIME:
      default:
        return { min: startDate, max: "" };
    }
  };

  // Add scope
  const handleAddScope = () => {
    if (newScopeRefId === 0) {
      toast.warning("Vui lòng chọn đối tượng áp dụng");
      return;
    }
    const exists = scopes.some(
      (s) => s.scopeType === newScopeType && s.refId === newScopeRefId,
    );
    if (exists) {
      toast.warning("Phạm vi này đã được thêm");
      return;
    }
    setScopes([...scopes, { scopeType: newScopeType, refId: newScopeRefId }]);
    setNewScopeRefId(0);
  };

  // Remove scope
  const handleRemoveScope = (index: number) => {
    setScopes(scopes.filter((_, i) => i !== index));
  };

  // Add threshold
  const handleAddThreshold = () => {
    if (newThresholdPercent <= 0 || newThresholdPercent > 100) {
      toast.warning("Phần trăm phải từ 1 đến 100");
      return;
    }
    const exists = thresholds.some((t) => t.percent === newThresholdPercent);
    if (exists) {
      toast.warning("Ngưỡng với phần trăm này đã tồn tại");
      return;
    }
    setThresholds(
      [
        ...thresholds,
        { percent: newThresholdPercent, action: newThresholdAction },
      ].sort((a, b) => a.percent - b.percent),
    );
    setNewThresholdPercent(50);
  };

  // Remove threshold
  const handleRemoveThreshold = (index: number) => {
    setThresholds(thresholds.filter((_, i) => i !== index));
  };

  // Get scope name for display
  const getScopeName = (scope: BudgetScope): string => {
    if (scope.scopeType === ScopeType.WALLET) {
      const wallet = wallets.find((w) => w.id === scope.refId);
      return wallet?.name ?? `Ví #${scope.refId}`;
    } else if (scope.scopeType === ScopeType.CATEGORY) {
      const category = categories.find((c) => c.id === scope.refId);
      return category?.name ?? `Danh mục #${scope.refId}`;
    }
    return `#${scope.refId}`;
  };

  // Get options for scope refId dropdown
  const getScopeOptions = () => {
    if (newScopeType === ScopeType.WALLET) {
      return wallets.map((w) => ({ id: w.id, name: w.name }));
    } else if (newScopeType === ScopeType.CATEGORY) {
      return categories.map((c) => ({ id: c.id, name: c.name }));
    }
    return [];
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Vui lòng nhập tên ngân sách");
      return;
    }
    if (amount <= 0) {
      toast.error("Số tiền phải lớn hơn 0");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày bắt đầu phải trước ngày kết thúc");
      return;
    }
    if (!validateDateRange(startDate, endDate, periodType)) {
      const periodLabel = PeriodTypeLabels[periodType].toLowerCase();
      toast.error(`Khoảng thời gian không hợp lệ cho chu kỳ ${periodLabel}`);
      return;
    }

    const request: CreateBudgetRequest = {
      name: name.trim(),
      amount,
      startDate,
      endDate,
      periodType,
      budgetStatus,
      scopes,
      thresholds,
    };

    setSubmitting(true);
    try {
      await createBudget(request);
      toast.success("Tạo ngân sách thành công!");
      navigate("/budgets");
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể tạo ngân sách",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const endDateConstraints = getEndDateConstraints();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-full h-full border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
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
            Tạo ngân sách mới
          </h1>
          <p className="text-gray-500 mt-1">
            Thiết lập ngân sách để quản lý chi tiêu hiệu quả
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              budgetStatus === BudgetStatus.ACTIVE
                ? "bg-emerald-100 text-emerald-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {BudgetStatusLabels[budgetStatus]}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
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
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Thông tin cơ bản
                </h2>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên ngân sách <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Chi tiêu tháng 5"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số tiền ngân sách <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="5000000"
                      min={0}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none pr-16"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      VND
                    </span>
                  </div>
                  {amount > 0 && (
                    <p className="text-sm text-indigo-600 mt-2 font-medium">
                      ≈ {formatCurrency(amount)}
                    </p>
                  )}
                </div>

                {/* Period Type & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Chu kỳ
                    </label>
                    <select
                      value={periodType}
                      onChange={(e) =>
                        setPeriodType(e.target.value as PeriodType)
                      }
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                    >
                      {Object.values(PeriodType).map((type) => (
                        <option key={type} value={type}>
                          {PeriodTypeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={budgetStatus}
                      onChange={(e) =>
                        setBudgetStatus(e.target.value as BudgetStatus)
                      }
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                    >
                      {ALLOWED_CREATE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {BudgetStatusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ngày bắt đầu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ngày kết thúc <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={endDateConstraints.min}
                      max={endDateConstraints.max || undefined}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none cursor-pointer"
                      required
                    />
                    {periodType === PeriodType.WEEKLY && (
                      <p className="text-xs text-amber-600 mt-1">
                        * Chu kỳ tuần: tối đa 7 ngày
                      </p>
                    )}
                    {periodType === PeriodType.MONTHLY && (
                      <p className="text-xs text-amber-600 mt-1">
                        * Chu kỳ tháng: 28-31 ngày
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scopes Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Phạm vi áp dụng
                </h2>
              </div>

              {/* Add Scope */}
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <select
                  value={newScopeType}
                  onChange={(e) => {
                    setNewScopeType(e.target.value as ScopeType);
                    setNewScopeRefId(0);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                >
                  {Object.values(ScopeType).map((type) => (
                    <option key={type} value={type}>
                      {ScopeTypeLabels[type]}
                    </option>
                  ))}
                </select>
                <select
                  value={newScopeRefId}
                  onChange={(e) => setNewScopeRefId(Number(e.target.value))}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value={0}>-- Chọn đối tượng --</option>
                  {getScopeOptions().map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddScope}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/30 font-semibold flex items-center gap-2"
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
                  Thêm
                </button>
              </div>

              {/* Scopes List */}
              {scopes.length > 0 ? (
                <div className="space-y-2">
                  {scopes.map((scope, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl group hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">
                          {ScopeTypeLabels[scope.scopeType]}
                        </span>
                        <span className="text-gray-700 font-medium">
                          {getScopeName(scope)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveScope(index)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
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
                  <p className="text-sm">Chưa có phạm vi nào</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Thêm ví hoặc danh mục để áp dụng ngân sách
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Thresholds */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
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

              {/* Add Threshold */}
              <div className="space-y-3 mb-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={newThresholdPercent}
                      onChange={(e) =>
                        setNewThresholdPercent(Number(e.target.value))
                      }
                      min={1}
                      max={100}
                      placeholder="70"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all outline-none pr-10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      %
                    </span>
                  </div>
                  <select
                    value={newThresholdAction}
                    onChange={(e) =>
                      setNewThresholdAction(e.target.value as ThresholdAction)
                    }
                    className="flex-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer text-sm"
                  >
                    {Object.values(ThresholdAction).map((action) => (
                      <option key={action} value={action}>
                        {ThresholdActionLabels[action]}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddThreshold}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30 font-semibold text-sm"
                >
                  Thêm ngưỡng
                </button>
              </div>

              {/* Thresholds List */}
              {thresholds.length > 0 ? (
                <div className="space-y-2">
                  {thresholds.map((threshold, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl group transition-all ${
                        threshold.percent >= 100
                          ? "bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200"
                          : threshold.percent >= 80
                            ? "bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200"
                            : "bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            threshold.percent >= 100
                              ? "bg-rose-100 text-rose-700"
                              : threshold.percent >= 80
                                ? "bg-orange-100 text-orange-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {threshold.percent}%
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            threshold.action === ThresholdAction.BLOCK
                              ? "bg-rose-100 text-rose-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {ThresholdActionLabels[threshold.action]}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveThreshold(index)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
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
                  <p className="text-sm">Chưa có ngưỡng nào</p>
                </div>
              )}

              {/* Tips */}
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
                <h4 className="text-sm font-semibold text-indigo-700 mb-2">
                  💡 Gợi ý
                </h4>
                <ul className="text-xs text-indigo-600 space-y-1">
                  <li>• 70%: Cảnh báo sớm</li>
                  <li>• 90%: Cảnh báo gấp</li>
                  <li>• 100%: Chặn giao dịch</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col md:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Tạo ngân sách</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
