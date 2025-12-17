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
};

export default function TransactionForm({
  wallets,
  categories,
  selectedCategory,
  onCreateWallet,
  onSubmit,
  reload,
}: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [walletId, setWalletId] = useState<number | null>(
    wallets[0]?.id ?? null
  );
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
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
          onCreateClick={onCreateWallet}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Loại giao dịch
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={`flex-1 py-2 rounded ${
              type === "EXPENSE" ? "bg-red-500 text-white" : "border"
            }`}
          >
            Chi
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={`flex-1 py-2 rounded ${
              type === "INCOME" ? "bg-green-500 text-white" : "border"
            }`}
          >
            Thu
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
        <div className="text-sm text-gray-600">
          Ghi chú:{" "}
          <span className="font-medium">
            {categories.find((c) => c.id === selectedCategory)?.name ??
              "Chưa chọn danh mục"}
          </span>
        </div>
      </div>

      <div className="md:col-span-2 flex items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          Ghi chú: Số tiền phải là số dương.
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCreateWallet}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Tạo ví mới
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Đang gửi..." : "Ghi giao dịch"}
          </button>
        </div>
      </div>
    </div>
  );
}
