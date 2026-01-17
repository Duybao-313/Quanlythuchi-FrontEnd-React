import { useState } from "react";
import { WalletList } from "../components/WalletList";
import CreateWalletModal from "../components/CreateWalletModal";
import { createWallet } from "../service/WalletService";
import type { WalletRequest } from "../type/WalletRequest";
import type { Wallet } from "../type/Wallet";
import type { ApiResponse } from "../type/ApiResponse";

export const WalletPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleCreateWallet = async (
    req: WalletRequest,
    file?: File | null
  ): Promise<ApiResponse<Wallet> | void> => {
    try {
      const res = await createWallet(req, file);
      if (!res || !res.success) {
        throw new Error(res?.message ?? "Tạo ví thất bại");
      }
      setShowCreateModal(false);
      setReloadTrigger((prev) => prev + 1);
      return res;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quản lý ví
          </h1>
          <p className="text-gray-500 mt-1">
            Theo dõi và quản lý các ví của bạn
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 font-medium"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14m7-7H5"
            />
          </svg>
          <span>Thêm ví mới</span>
        </button>
      </div>

      {/* Wallet List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <WalletList key={reloadTrigger} />
      </div>

      {showCreateModal && (
        <CreateWalletModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWallet}
        />
      )}
    </div>
  );
};
