import { useState } from "react";
import type { WalletRequest } from "../type/WalletRequest";
import  { WalletType } from "../type/WalletType";
import type { ApiResponse } from "../type/ApiResponse";
import type { Wallet } from "../type/Wallet";

type Props = {
  onClose: () => void;
  onCreate: (req: WalletRequest) => Promise<ApiResponse<Wallet>|void>;
};

export default function CreateWalletModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState<WalletType>(WalletType.CASH);
  const [iconUrl, setIconUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !balance.trim()) return;
    setLoading(true);
    try {
      const req: WalletRequest = {
        name: name.trim(),
        balance: Number(balance),
        type,
        iconUrl: iconUrl.trim() || undefined,
        description: description.trim() || undefined,
      };
      await onCreate(req);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Tạo ví mới</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên ví"
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <input
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="Số dư ban đầu"
          type="number"
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as WalletType)}
          className="w-full border rounded px-3 py-2 mb-3"
        >
          <option value={WalletType.CASH}>Tiền mặt</option>
          <option value={WalletType.BANK}>Ngân hàng</option>
          <option value={WalletType.E_WALLET}>Ví điện tử</option>
        </select>

        <input
          value={iconUrl}
          onChange={(e) => setIconUrl(e.target.value)}
          placeholder="Icon URL"
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả"
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Hủy</button>
          <button onClick={submit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? "Đang tạo..." : "Tạo ví"}
          </button>
        </div>
      </div>
    </div>
  );
}