import type { JSX } from "react";
import type { Wallet } from "../type/Wallet";

interface HistoryHeaderProps {
  selectedWallet: number | null;
  filter: "ALL" | "INCOME" | "EXPENSE";
  wallets: Wallet[];
  onWalletChange: (walletId: number | null) => void;
  onFilterChange: (filter: "ALL" | "INCOME" | "EXPENSE") => void;
  onReloadWallets: () => void;
}

export default function HistoryHeader({
  selectedWallet,
  filter,
  wallets,
  onWalletChange,
  onFilterChange,
  onReloadWallets,
}: HistoryHeaderProps): JSX.Element {
  return (
    <header className="w-full bg-white border-b">
      <div className="w-full px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Lịch sử giao dịch</h1>

          <div className="flex items-center gap-2">
            <label className="text-sm">Ví</label>
            <select
              value={selectedWallet ?? ""}
              onChange={(e) =>
                onWalletChange(e.target.value ? Number(e.target.value) : null)
              }
              className="border rounded px-3 py-2"
            >
              <option value="">Tất cả ví</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Loại</label>
            <select
              value={filter}
              onChange={(e) =>
                onFilterChange(e.target.value as "ALL" | "INCOME" | "EXPENSE")
              }
              className="border rounded px-3 py-2"
            >
              <option value="ALL">Tất cả</option>
              <option value="INCOME">Thu</option>
              <option value="EXPENSE">Chi</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReloadWallets}
            className="px-3 py-2 bg-gray-100 rounded"
            type="button"
          >
            Làm mới ví
          </button>
        </div>
      </div>
    </header>
  );
}
