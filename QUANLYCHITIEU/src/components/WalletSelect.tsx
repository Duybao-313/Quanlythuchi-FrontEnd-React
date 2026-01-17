import type { Wallet } from "../type/Wallet";

type Props = {
  wallets: Wallet[];
  value?: number | null;
  onChange: (id: number | null) => void;
};

export default function WalletSelect({ wallets, value, onChange }: Props) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <svg
          className="w-4 h-4 text-indigo-500"
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
        Chọn ví
      </label>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") {
              onChange(null);
              return;
            }
            const n = Number(v);
            onChange(Number.isNaN(n) ? null : n);
          }}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
          aria-label="Chọn ví"
        >
          <option value="">-- Chọn ví --</option>
          {wallets.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} ({w.balance.toLocaleString()} đ)
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
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
      </div>
    </div>
  );
}
