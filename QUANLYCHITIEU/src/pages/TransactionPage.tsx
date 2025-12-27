import { useEffect, useState } from "react";
import CreateWalletModal from "../components/CreateWalletModal";
import { useWallets } from "../hooks/useWallet";
import TransactionForm from "../components/TransactionForm";
import { createWallet } from "../service/WalletService";
import { createTransaction } from "../service/TransactionService";
import type { WalletRequest } from "../type/WalletRequest";
import type { ApiResponse } from "../type/ApiResponse";
import type { Wallet } from "../type/Wallet";
import type { TransactionRequest } from "../type/TransactionRequest";
import type { CategoryResponse } from "../type/CategoriesResponse";
import { listCategories } from "../service/Categories";
import type { Transaction } from "../type/Transaction";

export default function TransactionPage() {
  const { wallets, wloading, werror, reload } = useWallets();
  const [selectedWallet, setSelectedWallet] = useState<number | null>(
    wallets[0]?.id ?? null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    "EXPENSE"
  );

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      setCatLoading(true);
      setCatError(null);
      try {
        const data = await listCategories();
        setCategories(data ?? []);
      } catch (err: unknown) {
        // Nếu request bị abort, không set error
        if ((err as DOMException)?.name === "AbortError") {
          return;
        }
        const messageE = err instanceof Error ? err.message : String(err);
        setCatError(messageE || "Lỗi khi tải danh mục");
      } finally {
        setCatLoading(false);
      }
    }

    fetchCategories();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (wallets.length && selectedWallet == null)
      setSelectedWallet(wallets[0].id);
  }, [wallets, selectedWallet]);

  // Reset selectedCategory khi thay đổi loại giao dịch
  useEffect(() => {
    setSelectedCategory(null);
  }, [transactionType]);

  // Lọc danh mục theo loại giao dịch
  const filteredCategories = categories.filter(
    (cat) => cat.type === transactionType
  );

  // handler tạo ví từ modal
  const handleCreateWallet = async (
    req: WalletRequest,
    file?: File | null
  ): Promise<ApiResponse<Wallet> | void> => {
    try {
      const res = await createWallet(req, file);
      if (!res || !res.success) {
        alert(res?.message ?? "Tạo ví thất bại");
        return res;
      }
      setShowCreateModal(false);
      await reload();
      return res;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message);
    }
  };

  // handler submit giao dịch từ TransactionForm
  const handleSubmitTransaction = async (
    payload: TransactionRequest
  ): Promise<ApiResponse<Transaction>> => {
    try {
      if (!payload.walletId && selectedWallet != null) {
        payload.walletId = selectedWallet;
      }
      if (!payload.categoryId && selectedCategory != null) {
        payload.categoryId = selectedCategory;
      }

     
      const { ...payloadWithoutType } = payload;

      const res = await createTransaction(
        payloadWithoutType as TransactionRequest
      );

      return res;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      // luôn trả về ApiResponse thất bại để form xử lý
      return {
        success: false,
        code: "CLIENT_ERROR",
        message,
        data: null,
        timestamp: new Date().toISOString(),
      };
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Tạo giao dịch mới
        </h1>
        <p className="text-gray-600">
          Ghi nhận chi tiêu hoặc doanh thu của bạn
        </p>
      </div>

      {wloading ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600">Đang tải ví...</p>
        </div>
      ) : werror ? (
        <div className="bg-red-50 border border-red-200 rounded-xl shadow p-6">
          <p className="text-red-700">Lỗi: {werror}</p>
          <button
            onClick={reload}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      ) : wallets.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl shadow p-6">
          <p className="text-blue-700 mb-3">
            Chưa có ví nào. Hãy tạo ví để bắt đầu ghi giao dịch.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Tạo ví mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form chính */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <TransactionForm
                wallets={wallets}
                categories={filteredCategories}
                onCreateWallet={() => setShowCreateModal(true)}
                onSubmit={handleSubmitTransaction}
                selectedCategory={selectedCategory}
                reload={reload}
                onTypeChange={setTransactionType}
              />
            </div>
          </div>

          {/* Sidebar - Chọn danh mục */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {transactionType === "EXPENSE"
                  ? "💰 Danh mục chi tiêu"
                  : "📈 Danh mục doanh thu"}
              </h3>

              {catLoading ? (
                <div className="text-center py-6">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                </div>
              ) : catError ? (
                <p className="text-red-500 text-sm">{catError}</p>
              ) : filteredCategories.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Không có danh mục cho loại giao dịch này
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                        selectedCategory === cat.id
                          ? "bg-blue-100 border-2 border-blue-500 text-blue-900"
                          : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.iconUrl ? (
                        <img
                          src={cat.iconUrl}
                          alt={cat.name}
                          className="w-5 h-5 object-contain"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-gray-300 rounded flex items-center justify-center text-xs">
                          📁
                        </div>
                      )}
                      <span
                        className={
                          selectedCategory === cat.id
                            ? "font-bold"
                            : "font-medium"
                        }
                      >
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateWalletModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWallet}
        />
      )}
    </div>
  );
}
