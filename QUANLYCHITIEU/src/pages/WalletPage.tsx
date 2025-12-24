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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý ví</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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

      <WalletList key={reloadTrigger} />

      {showCreateModal && (
        <CreateWalletModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWallet}
        />
      )}
    </div>
  );
};
