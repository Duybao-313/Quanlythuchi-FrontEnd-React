import type { Wallet } from "../type/Wallet";

type Props = {
  wallets: Wallet[];
  value?: number | null;
  onChange: (id: number | null) => void;
  onCreateClick?: () => void;
};

export default function WalletSelect({ wallets, value, onChange, onCreateClick }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Chọn ví</label>
      <div className="flex gap-2">
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
          className="flex-1 border rounded px-3 py-2"
          aria-label="Chọn ví"
        >
          <option value="">-- Chọn ví --</option>
          {wallets.map((w) => (
            <option key={w.id} value={w.id}>
              Ví: {w.name} (số dư: <p className="text-danger">{w.balance.toLocaleString()} vnđ</p>)
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onCreateClick}
          className="px-3 py-2 border rounded bg-white hover:bg-gray-50"
          aria-label="Tạo ví mới"
        >
          + Ví
        </button>
      </div>
    </div>
  );
}