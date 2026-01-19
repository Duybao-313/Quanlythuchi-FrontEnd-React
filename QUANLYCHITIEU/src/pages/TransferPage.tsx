import { useState, useEffect } from "react";
import { useWallets } from "../hooks/useWallet";
import {
  transferMoney,
  type TransferRequest,
} from "../service/TransactionService";

// Toast component
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl ${
        type === "success"
          ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
          : "bg-gradient-to-r from-rose-500 to-red-500 text-white"
      }`}
    >
      {type === "success" ? (
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5"
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
        </div>
      ) : (
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      )}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80 transition-opacity"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default function TransferPage() {
  const { wallets, wloading, werror, reload } = useWallets();
  const [walletIdTransfer, setWalletIdTransfer] = useState<number | null>(null);
  const [walletIdReceive, setWalletIdReceive] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Reset ví nhận khi ví chuyển thay đổi (nếu trùng)
  useEffect(() => {
    if (
      walletIdTransfer &&
      walletIdReceive &&
      walletIdTransfer === walletIdReceive
    ) {
      setWalletIdReceive(null);
    }
  }, [walletIdTransfer, walletIdReceive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletIdTransfer || !walletIdReceive) {
      setToast({
        message: "Vui lòng chọn cả ví chuyển và ví nhận",
        type: "error",
      });
      return;
    }

    if (walletIdTransfer === walletIdReceive) {
      setToast({
        message: "Ví chuyển và ví nhận không được trùng nhau",
        type: "error",
      });
      return;
    }

    const amountNum = parseFloat(amount.replace(/\./g, ""));
    if (isNaN(amountNum) || amountNum <= 0) {
      setToast({ message: "Số tiền phải lớn hơn 0", type: "error" });
      return;
    }

    const transferWallet = wallets.find((w) => w.id === walletIdTransfer);
    if (transferWallet && amountNum > transferWallet.balance) {
      setToast({ message: "Số dư ví chuyển không đủ", type: "error" });
      return;
    }

    const payload: TransferRequest = {
      amount: amountNum,
      walletIdTransfer,
      walletIdReceive,
      description: description.trim() || undefined,
    };

    setSubmitting(true);
    try {
      const res = await transferMoney(payload);
      if (res.success) {
        setToast({
          message: res.message || "Chuyển tiền thành công",
          type: "success",
        });
        setAmount("");
        setDescription("");
        setWalletIdTransfer(null);
        setWalletIdReceive(null);
        reload();
      } else {
        setToast({
          message: res.message || "Chuyển tiền thất bại",
          type: "error",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setToast({ message: message || "Đã xảy ra lỗi", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTransferWallet = wallets.find((w) => w.id === walletIdTransfer);
  const selectedReceiveWallet = wallets.find((w) => w.id === walletIdReceive);

  // Ví có thể chọn cho ví nhận (loại trừ ví chuyển đã chọn)
  const availableReceiveWallets = wallets.filter(
    (w) => w.id !== walletIdTransfer,
  );

  if (wloading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-full h-full border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải ví...</p>
        </div>
      </div>
    );
  }

  if (werror) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-rose-700 font-semibold">Đã xảy ra lỗi</p>
              <p className="text-rose-600 text-sm mt-1">{werror}</p>
            </div>
          </div>
          <button
            onClick={reload}
            className="mt-6 px-6 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (wallets.length < 2) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Cần ít nhất 2 ví
            </h3>
            <p className="text-gray-600">
              Bạn cần có ít nhất 2 ví để thực hiện chuyển tiền nội bộ.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Chuyển tiền nội bộ
          </h1>
          <p className="text-gray-500 mt-1">Chuyển tiền giữa các ví của bạn</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-100 text-indigo-600">
            <svg
              className="w-4 h-4 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Chuyển khoản
          </span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ví chuyển */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <svg
                className="w-4 h-4 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Ví chuyển
            </label>
            <div className="relative">
              <select
                value={walletIdTransfer ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setWalletIdTransfer(v === "" ? null : Number(v));
                }}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">-- Chọn ví chuyển --</option>
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
            {selectedTransferWallet && (
              <p className="mt-2 text-sm text-gray-500">
                Số dư hiện tại:{" "}
                <span className="font-semibold text-rose-600">
                  {selectedTransferWallet.balance.toLocaleString()} đ
                </span>
              </p>
            )}
          </div>

          {/* Arrow icon */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-2xl shadow-inner">
              <svg
                className="w-6 h-6 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>

          {/* Ví nhận */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Ví nhận
            </label>
            <div className="relative">
              <select
                value={walletIdReceive ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setWalletIdReceive(v === "" ? null : Number(v));
                }}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                disabled={!walletIdTransfer}
              >
                <option value="">-- Chọn ví nhận --</option>
                {availableReceiveWallets.map((w) => (
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
            {!walletIdTransfer && (
              <p className="mt-2 text-sm text-amber-600">
                Vui lòng chọn ví chuyển trước
              </p>
            )}
            {selectedReceiveWallet && (
              <p className="mt-2 text-sm text-gray-500">
                Số dư hiện tại:{" "}
                <span className="font-semibold text-emerald-600">
                  {selectedReceiveWallet.balance.toLocaleString()} đ
                </span>
              </p>
            )}
          </div>

          {/* Số tiền */}
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Số tiền
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => {
                const raw = e.target.value.replace(/\./g, "");
                if (raw === "" || /^\d+$/.test(raw)) {
                  const formatted = raw
                    ? Number(raw).toLocaleString("de-DE")
                    : "";
                  setAmount(formatted);
                }
              }}
              placeholder="Nhập số tiền cần chuyển"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Mô tả */}
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
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chuyển tiền"
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting || !walletIdTransfer || !walletIdReceive}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/30 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <span>Chuyển tiền</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
