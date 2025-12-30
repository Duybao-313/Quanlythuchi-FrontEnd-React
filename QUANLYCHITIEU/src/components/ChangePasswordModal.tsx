import { useState } from "react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (oldPassword: string, newPassword: string) => Promise<void>;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSave,
}: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleSave = async () => {
    // Validation
    if (!oldPassword.trim()) {
      setError("Vui lòng nhập mật khẩu cũ");
      return;
    }

    if (!newPassword.trim()) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (oldPassword === newPassword) {
      setError("Mật khẩu mới phải khác mật khẩu cũ");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await onSave(oldPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi đổi mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const PasswordInput = ({
    label,
    value,
    onChange,
    show,
    onToggle,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    show: boolean;
    onToggle: () => void;
    placeholder: string;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all pr-12"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span>🔐</span>
            Đổi mật khẩu
          </h2>
          <p className="text-gray-600">Cập nhật mật khẩu tài khoản của bạn</p>
        </div>

        <div className="space-y-5">
          {/* Old Password */}
          <PasswordInput
            label="Mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setError("");
            }}
            show={showPasswords.old}
            onToggle={() =>
              setShowPasswords({ ...showPasswords, old: !showPasswords.old })
            }
            placeholder="Nhập mật khẩu cũ"
          />

          {/* New Password */}
          <PasswordInput
            label="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
            show={showPasswords.new}
            onToggle={() =>
              setShowPasswords({ ...showPasswords, new: !showPasswords.new })
            }
            placeholder="Nhập mật khẩu mới"
          />

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs font-semibold text-blue-800 mb-2">
                Độ mạnh mật khẩu:
              </p>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    newPassword.length >= 12
                      ? "bg-green-500 w-full"
                      : newPassword.length >= 8
                      ? "bg-yellow-500 w-2/3"
                      : "bg-orange-500 w-1/3"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <PasswordInput
            label="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            show={showPasswords.confirm}
            onToggle={() =>
              setShowPasswords({
                ...showPasswords,
                confirm: !showPasswords.confirm,
              })
            }
            placeholder="Xác nhận mật khẩu mới"
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                <span>✅</span>
                Đổi mật khẩu thành công!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <span>🔒</span>
                  <span>Đổi mật khẩu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
