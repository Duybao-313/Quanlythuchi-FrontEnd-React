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
import CategorySelector from "../components/CategoriesSelect";
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

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      setCatLoading(true);
      setCatError(null);
      try {
        // Nếu listCategories hỗ trợ signal, truyền controller.signal; nếu không, gọi như hiện tại
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

  // handler tạo ví từ modal
  const handleCreateWallet = async (
    req: WalletRequest
  ): Promise<ApiResponse<Wallet> | void> => {
    try {
      const res = await createWallet(req);
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

      const res = await createTransaction(payload);

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tạo giao dịch mới</h2>

        {wloading ? (
          <div>Đang tải ví...</div>
        ) : werror ? (
          <div className="text-red-500">
            Lỗi: {werror}{" "}
            <button onClick={reload} className="ml-2 underline">
              Thử lại
            </button>
          </div>
        ) : wallets.length === 0 ? (
          <div>
            Chưa có ví.{" "}
            <button
              onClick={() => setShowCreateModal(true)}
              className="ml-2 text-blue-600"
            >
              Tạo ví
            </button>
          </div>
        ) : (
          <>
            {/* TransactionForm được đặt ngay sau phần dropdown */}
            <div className="mt-6">
              <TransactionForm
                wallets={wallets}
                categories={categories}
                onCreateWallet={() => setShowCreateModal(true)}
                onSubmit={handleSubmitTransaction}
                selectedCategory={selectedCategory}
                reload={reload}
              />

              {/* dùng component tách riêng */}
              <CategorySelector
                categories={categories}
                selectedId={selectedCategory}
                loading={catLoading}
                error={catError}
                onSelect={(id) => setSelectedCategory(id)}
                onAddNew={() => console.log("")}
              />
            </div>
          </>
        )}
      </div>

      {showCreateModal && (
        <CreateWalletModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWallet}
        />
      )}
    </div>
  );
}
