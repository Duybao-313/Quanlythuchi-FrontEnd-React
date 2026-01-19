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
    <header className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Lịch sử giao dịch
          </h1>
          <p className="text-gray-500 mt-1">
            Xem và quản lý các giao dịch của bạn
          </p>
        </div>

        <button
          onClick={onReloadWallets}
          className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm self-start md:self-auto"
          type="button"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-sm font-medium">Làm mới</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm">
            <svg
              className="w-4 h-4 text-gray-400"
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
            <select
              value={selectedWallet ?? ""}
              onChange={(e) =>
                onWalletChange(e.target.value ? Number(e.target.value) : null)
              }
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer pr-6 min-w-[120px] appearance-none"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <svg
              className="w-4 h-4 text-gray-400 pointer-events-none -ml-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <select
              value={filter}
              onChange={(e) =>
                onFilterChange(e.target.value as "ALL" | "INCOME" | "EXPENSE")
              }
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer pr-6"
            >
              <option value="ALL">Tất cả loại</option>
              <option value="INCOME">Thu nhập</option>
              <option value="EXPENSE">Chi tiêu</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
