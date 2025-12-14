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
          <div key={i} className="flex items-center gap-3 p-3 border rounded animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (werror) {
    return (
      <div className="p-4 border rounded bg-red-50 text-red-700">
        <div className="font-medium mb-2">Không tải được danh sách ví</div>
        <div className="text-sm mb-3">{werror}</div>
        <button onClick={reload} className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50">Thử lại</button>
      </div>
    );
  }

  if (!wallets.length) {
    return (
      <div className="p-4 border rounded bg-gray-50 text-gray-600">
        Chưa có ví nào. Hãy tạo ví để bắt đầu quản lý chi tiêu.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow-lg max-w-md w-full p-4">
            <h3 className="font-medium text-lg mb-2">Xác nhận xóa ví</h3>
            <p className="text-sm text-gray-700 mb-3">
              Bạn sắp xóa ví <strong>{deletingWallet.name}</strong>. Hành động này sẽ xóa tất cả giao dịch liên quan đến ví này. Bạn có chắc chắn muốn tiếp tục?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingWallet(null)}
                className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50"
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
                className="px-3 py-1.5 rounded border bg-red-600 text-white hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? "Đang xóa..." : "Xóa và xóa giao dịch liên quan"}
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

  return (
    <div className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 transition">
      <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-100 overflow-hidden">
        {typeof icon === "string" && icon.startsWith("http") ? (
          <img src={icon} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">{icon}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-medium truncate">{wallet.name}</div>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{typeLabel}</span>
        </div>

        {wallet.description && (
          <div className="text-xs text-gray-500 truncate mt-0.5">{wallet.balance.toLocaleString()} vnđ</div>
        )}
      </div>

      <button
        onClick={onRequestDelete}
        className="text-sm px-3 py-1.5 rounded border bg-white hover:bg-gray-50 text-red-600"
      >
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

export default WalletList;