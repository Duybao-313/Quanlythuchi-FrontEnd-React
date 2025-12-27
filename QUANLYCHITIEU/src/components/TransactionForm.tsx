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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-1 md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số tiền
        </label>
        <AmountInput value={amount} onChange={setAmount} placeholder="0" />
      </div>

      <div>
        <WalletSelect
          wallets={wallets}
          value={walletId}
          onChange={setWalletId}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Loại giao dịch
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange("EXPENSE")}
            className={`flex-1 py-2 rounded font-medium transition ${
              type === "EXPENSE"
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            💰 Chi tiêu
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("INCOME")}
            className={`flex-1 py-2 rounded font-medium transition ${
              type === "INCOME"
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            📈 Thu nhập
          </button>
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ghi chú..."
          className="w-full border rounded px-3 py-2 min-h-[80px]"
        />
      </div>

      <div className="md:col-span-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-600 uppercase font-semibold mb-1">
            Danh mục đã chọn
          </p>
          <p className="text-lg font-bold text-blue-900">
            {categories.find((c) => c.id === selectedCategory)?.name ??
              "⚠️ Chưa chọn danh mục"}
          </p>
        </div>
      </div>

      <div className="md:col-span-2 flex items-center justify-between gap-4">
        <div className="text-xs text-gray-500">ℹ️ Số tiền phải là số dương</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCreateWallet}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition"
          >
            + Ví mới
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
          >
            {loading ? "⏳ Đang gửi..." : "✓ Ghi giao dịch"}
          </button>
        </div>
      </div>
    </div>
  );
}
