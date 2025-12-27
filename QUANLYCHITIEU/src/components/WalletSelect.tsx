import type { Wallet } from "../type/Wallet";

type Props = {
  wallets: Wallet[];
  value?: number | null;
  onChange: (id: number | null) => void;
};

export default function WalletSelect({ wallets, value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Chọn ví
      </label>
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
        className="w-full border rounded px-3 py-2"
        aria-label="Chọn ví"
      >
        <option value="">-- Chọn ví --</option>
        {wallets.map((w) => (
          <option key={w.id} value={w.id}>
            Ví: {w.name} (số dư: {w.balance.toLocaleString()} vnđ)
          </option>
        ))}
      </select>
    </div>
  );
}
