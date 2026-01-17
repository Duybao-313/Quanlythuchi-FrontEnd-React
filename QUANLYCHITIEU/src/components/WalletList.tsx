// src/components/WalletList.tsx
import React, { useState } from "react";
import { useWallets } from "../hooks/useWallet";
import type { Wallet } from "../type/Wallet";
import { WalletType } from "../type/WalletType";
import { toast } from "react-toastify";
import { deleteWallet } from "../service/WalletService";

export const WalletList: React.FC = () => {
  const { wallets, wloading, werror, reload } = useWallets();
  const [deletingWallet, setDeletingWallet] = useState<Wallet | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (wloading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-lg w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded-lg w-1/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (werror) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Không tải được danh sách ví</span>
        </div>
        <div className="text-sm text-red-500 mb-4">{werror}</div>
        <button 
          onClick={reload} 
          className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!wallets.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Chưa có ví nào</p>
        <p className="text-sm text-gray-400 mt-1">Hãy tạo ví để bắt đầu quản lý chi tiêu</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {wallets.map((w) => (
        <WalletItem
          key={w.id}
          wallet={w}
          onRequestDelete={() => setDeletingWallet(w)}
        />
      ))}

      {deletingWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Xác nhận xóa ví</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600">
                Bạn sắp xóa ví <span className="font-semibold text-gray-900">{deletingWallet.name}</span>. 
                Hành động này sẽ xóa tất cả giao dịch liên quan đến ví này.
              </p>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setDeletingWallet(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                disabled={deleting}
              >
                Hủy
              </button>

              <button
                onClick={async () => {
                  setDeleting(true);
                  try {
                    const json = await deleteWallet(deletingWallet.id);
                    if (json && json.success) {
                      toast.success(json.message || "Xóa ví thành công");
                      setDeletingWallet(null);
                      await reload();
                    } else {
                      toast.error(json?.message || "Xóa thất bại");
                    }
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : String(err);
                    console.log(message);
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 font-medium transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Xóa ví</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function WalletItem({ wallet, onRequestDelete }: { wallet: Wallet; onRequestDelete?: () => void }) {
  const icon = getWalletIcon(wallet);
  const typeLabel = getWalletTypeLabel(wallet.type);
  const typeColor = getWalletTypeColor(wallet.type);

  return (
    <div className="group flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200">
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden ${typeColor}`}>
        {typeof icon === "string" && icon.startsWith("http") ? (
          <img src={icon} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">{icon}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-gray-900 truncate">{wallet.name}</div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            wallet.type === WalletType.CASH ? "bg-emerald-100 text-emerald-700" :
            wallet.type === WalletType.BANK ? "bg-blue-100 text-blue-700" :
            wallet.type === WalletType.E_WALLET ? "bg-purple-100 text-purple-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {typeLabel}
          </span>
        </div>

        <div className="text-sm text-gray-500 mt-0.5 font-medium">
          {wallet.balance.toLocaleString()} đ
        </div>
      </div>

      <button
        onClick={onRequestDelete}
        className="opacity-0 group-hover:opacity-100 text-sm px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-all flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Xóa
      </button>
    </div>
  );
}

/* getWalletIcon, getWalletTypeLabel giữ nguyên như trước */
function getWalletIcon(wallet: Wallet): string {
  if (wallet.iconUrl && wallet.iconUrl.trim().length > 0) return wallet.iconUrl;
  switch (wallet.type) {
    case WalletType.CASH:
      return "💵";
    case WalletType.BANK:
      return "🏦";
    case WalletType.E_WALLET:
      return "📱";
    default:
      return "👛";
  }
}

function getWalletTypeLabel(type: Wallet["type"]): string {
  switch (type) {
    case WalletType.CASH:
      return "Tiền mặt";
    case WalletType.BANK:
      return "Ngân hàng";
    case WalletType.E_WALLET:
      return "Ví điện tử";
    default:
      return "Khác";
  }
}

function getWalletTypeColor(type: Wallet["type"]): string {
  switch (type) {
    case WalletType.CASH:
      return "bg-gradient-to-br from-emerald-100 to-green-100";
    case WalletType.BANK:
      return "bg-gradient-to-br from-blue-100 to-indigo-100";
    case WalletType.E_WALLET:
      return "bg-gradient-to-br from-purple-100 to-pink-100";
    default:
      return "bg-gradient-to-br from-gray-100 to-gray-200";
  }
}

export default WalletList;