import { useState } from "react";
import { toast } from "react-toastify";
import type { WalletRequest } from "../type/WalletRequest";
import { WalletType } from "../type/WalletType";
import type { ApiResponse } from "../type/ApiResponse";
import type { Wallet } from "../type/Wallet";

type Props = {
  onClose: () => void;
  onCreate: (
    req: WalletRequest,
    file?: File | null
  ) => Promise<ApiResponse<Wallet> | void>;
};

export default function CreateWalletModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState<WalletType>(WalletType.CASH);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFileChange(f);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    handleFileChange(f);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const submit = async () => {
    if (!name.trim() || !balance.trim()) {
      toast.error("Vui lòng điền tên ví và số dư ban đầu");
      return;
    }

    setLoading(true);
    try {
      const req: WalletRequest = {
        name: name.trim(),
        balance: Number(balance),
        type,
        description: description.trim() || undefined,
      };
      await onCreate(req, file);
      toast.success("Tạo ví thành công");
      setName("");
      setBalance("");
      setType(WalletType.CASH);
      removeFile();
      setDescription("");
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Tạo ví thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-semibold mb-6">Tạo ví mới</h3>

        {/* Tên ví */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tên ví</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Tiền mặt hằng ngày"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Số dư ban đầu */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Số dư ban đầu
          </label>
          <input
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="Nhập số tiền"
            type="number"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Loại ví */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Loại ví</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as WalletType)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value={WalletType.CASH}>Tiền mặt</option>
            <option value={WalletType.BANK}>Ngân hàng</option>
            <option value={WalletType.E_WALLET}>Ví điện tử</option>
          </select>
        </div>

        {/* Mô tả */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả ví (tùy chọn)"
            rows={3}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Upload Icon */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Icon (ảnh)</label>
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="flex items-center justify-between gap-4 p-3 border-2 border-dashed rounded-md hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12"
                />
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2"
                />
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 11l2 2 3-3 4 4"
                />
              </svg>

              <div>
                <div className="text-sm font-medium">Kéo thả ảnh ở đây</div>
                <div className="text-xs text-gray-500">
                  Hoặc nhấn nút bên để chọn file
                </div>
              </div>
            </div>

            <label
              htmlFor="wallet-file"
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
            >
              <svg
                className="w-4 h-4"
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
              <span className="text-sm">Chọn ảnh</span>
            </label>

            <input
              id="wallet-file"
              type="file"
              accept="image/*"
              onChange={onInputChange}
              className="hidden"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-3 flex items-center gap-4">
              <div className="w-24 h-24 rounded-md overflow-hidden border">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {file?.name ?? "Ảnh đã chọn"}
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Xóa ảnh
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang tạo..." : "Tạo ví"}
          </button>
        </div>
      </div>
    </div>
  );
}
