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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Tạo giao dịch mới
          </h1>
          <p className="text-gray-500 mt-1">
            Ghi nhận chi tiêu hoặc thu nhập của bạn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              transactionType === "EXPENSE"
                ? "bg-rose-100 text-rose-600"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {transactionType === "EXPENSE" ? "Chi tiêu" : "Thu nhập"}
          </span>
        </div>
      </div>

      {wloading ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-full h-full border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải ví...</p>
        </div>
      ) : werror ? (
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
              <p className="text-rose-600 text-sm mt-1">{werror}</p>
            </div>
          </div>
          <button
            onClick={reload}
            className="mt-6 px-6 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 font-medium"
          >
            Thử lại
          </button>
        </div>
      ) : wallets.length === 0 ? (
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
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Chưa có ví nào
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy tạo ví để bắt đầu ghi giao dịch của bạn
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
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
              Tạo ví mới
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form chính */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
                    transactionType === "EXPENSE"
                      ? "bg-gradient-to-br from-rose-400 to-pink-500 shadow-rose-500/30"
                      : "bg-gradient-to-br from-emerald-400 to-green-500 shadow-emerald-500/30"
                  }`}
                >
                  {transactionType === "EXPENSE" ? (
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
                  ) : (
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
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {transactionType === "EXPENSE"
                    ? "Danh mục chi tiêu"
                    : "Danh mục thu nhập"}
                </h3>
              </div>

              {catLoading ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 mx-auto relative">
                    <div className="w-full h-full border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : catError ? (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <p className="text-rose-500 text-sm">{catError}</p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Không có danh mục cho loại này
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                        selectedCategory === cat.id
                          ? transactionType === "EXPENSE"
                            ? "bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-400 text-rose-900 shadow-md"
                            : "bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-400 text-emerald-900 shadow-md"
                          : "bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100 hover:border-gray-200"
                      }`}
                    >
                      {cat.iconUrl ? (
                        <img
                          src={cat.iconUrl}
                          alt={cat.name}
                          className="w-6 h-6 object-contain rounded"
                        />
                      ) : (
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                            selectedCategory === cat.id
                              ? transactionType === "EXPENSE"
                                ? "bg-rose-200 text-rose-600"
                                : "bg-emerald-200 text-emerald-600"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                      )}
                      <span
                        className={
                          selectedCategory === cat.id
                            ? "font-semibold"
                            : "font-medium"
                        }
                      >
                        {cat.name}
                      </span>
                      {selectedCategory === cat.id && (
                        <svg
                          className={`w-5 h-5 ml-auto ${
                            transactionType === "EXPENSE"
                              ? "text-rose-500"
                              : "text-emerald-500"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
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
