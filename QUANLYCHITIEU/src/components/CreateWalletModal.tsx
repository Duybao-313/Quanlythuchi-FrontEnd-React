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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Tạo ví mới</h3>
              <p className="text-indigo-100 text-sm">
                Thêm ví để quản lý tài chính
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Tên ví */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên ví
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Tiền mặt hằng ngày"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Số dư ban đầu */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số dư ban đầu
            </label>
            <div className="relative">
              <input
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="Nhập số tiền"
                type="number"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                ₫
              </span>
            </div>
          </div>

          {/* Loại ví */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Loại ví
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as WalletType)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value={WalletType.CASH}>💵 Tiền mặt</option>
              <option value={WalletType.BANK}>🏦 Ngân hàng</option>
              <option value={WalletType.E_WALLET}>📱 Ví điện tử</option>
            </select>
          </div>

          {/* Mô tả */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả ví (tùy chọn)"
              rows={3}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Upload Icon */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Icon (ảnh)
            </label>
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              className="flex items-center justify-between gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Kéo thả ảnh ở đây
                  </div>
                  <div className="text-xs text-gray-400">
                    PNG, JPG tối đa 5MB
                  </div>
                </div>
              </div>

              <label
                htmlFor="wallet-file"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-sm font-medium">Chọn ảnh</span>
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
              <div className="mt-4 flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {file?.name ?? "Ảnh đã chọn"}
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="mt-1 text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Xóa ảnh
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-all"
            >
              Hủy
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang tạo...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Tạo ví
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
