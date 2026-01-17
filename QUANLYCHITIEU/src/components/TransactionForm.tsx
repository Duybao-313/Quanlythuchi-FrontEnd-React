import { useMemo, useState } from "react";
import WalletSelect from "./WalletSelect";
import AmountInput from "./AmoutInput";
import { toast } from "react-toastify";
import type { Wallet } from "../type/Wallet";
import type { ApiResponse } from "../type/ApiResponse";
import type { Transaction } from "../type/Transaction";
import type { CategoryResponse } from "../type/CategoriesResponse";

type Props = {
  wallets: Wallet[];
  categories: CategoryResponse[];
  onCreateWallet: () => void;
  selectedCategory: number | null;
  onSubmit: (payload: {
    amount: number;
    description: string;
    walletId: number;
    categoryId: number;
    type: "INCOME" | "EXPENSE";
  }) => Promise<ApiResponse<Transaction>>;
  reload: () => Promise<void>;
  onTypeChange?: (type: "INCOME" | "EXPENSE") => void;
};

export default function TransactionForm({
  wallets,
  categories,
  selectedCategory,
  onCreateWallet,
  onSubmit,
  reload,
  onTypeChange,
}: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [walletId, setWalletId] = useState<number | null>(
    wallets[0]?.id ?? null
  );
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  const handleTypeChange = (newType: "INCOME" | "EXPENSE") => {
    setType(newType);
    onTypeChange?.(newType);
  };
  const [loading, setLoading] = useState(false);

  const parsedAmount = useMemo(() => {
    const n = Number(amount.replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const handleSubmit = async () => {
    setLoading(true);

    const res = await onSubmit({
      amount: parsedAmount,
      description: description.trim(),
      walletId: walletId as number,
      categoryId: selectedCategory as number,
      type,
    });

    if (!res.success) {
      console.log(res);
      toast.error(res.message ?? "Tạo giao dịch thất bại");
    } else {
      toast.success("Tạo giao dịch thành công");
      await reload();
      setAmount("");
      setDescription("");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Amount Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Số tiền
        </label>
        <AmountInput value={amount} onChange={setAmount} placeholder="0" />
      </div>

      {/* Wallet & Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <WalletSelect
            wallets={wallets}
            value={walletId}
            onChange={setWalletId}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Loại giao dịch
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange("EXPENSE")}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                type === "EXPENSE"
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30"
                  : "bg-gray-50 border-2 border-gray-200 text-gray-600 hover:border-rose-300 hover:bg-rose-50"
              }`}
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
                  d="M17 13l-5 5m0 0l-5-5m5 5V6"
                />
              </svg>
              Chi tiêu
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("INCOME")}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                type === "INCOME"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-gray-50 border-2 border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
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
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
              Thu nhập
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mô tả
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ghi chú cho giao dịch này..."
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Selected Category Display */}
      <div
        className={`rounded-xl p-4 border-2 ${
          selectedCategory
            ? type === "EXPENSE"
              ? "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200"
              : "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <p
          className={`text-xs uppercase font-bold mb-1 ${
            selectedCategory
              ? type === "EXPENSE"
                ? "text-rose-600"
                : "text-emerald-600"
              : "text-amber-600"
          }`}
        >
          Danh mục đã chọn
        </p>
        <p
          className={`text-lg font-bold ${
            selectedCategory
              ? type === "EXPENSE"
                ? "text-rose-900"
                : "text-emerald-900"
              : "text-amber-900"
          }`}
        >
          {categories.find((c) => c.id === selectedCategory)?.name ?? (
            <span className="flex items-center gap-2">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Chưa chọn danh mục
            </span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-400">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Số tiền phải là số dương
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCreateWallet}
            className="px-5 py-2.5 bg-gray-100 border-2 border-gray-200 rounded-xl hover:bg-gray-200 font-medium text-gray-700 transition-all flex items-center gap-2"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Ví mới
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2.5 rounded-xl text-white font-semibold transition-all flex items-center gap-2 ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang gửi...
              </>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Ghi giao dịch
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
