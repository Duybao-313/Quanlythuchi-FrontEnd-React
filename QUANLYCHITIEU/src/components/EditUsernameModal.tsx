import { useState } from "react";
import type { UserDTO } from "../type/UserDTO";

interface EditUsernameModalProps {
  user: UserDTO;
  isOpen: boolean;
  onClose: () => void;
  onSave: (fullName: string) => Promise<void>;
}

export default function EditUsernameModal({
  user,
  isOpen,
  onClose,
  onSave,
}: EditUsernameModalProps) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("Tên không được để trống");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await onSave(fullName.trim());
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Lỗi khi cập nhật tên người dùng"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Chỉnh sửa tên người dùng
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setError("");
              }}
              placeholder="Nhập họ và tên"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
