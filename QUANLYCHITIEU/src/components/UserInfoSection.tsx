import type { UserDTO } from "../type/UserDTO";

interface UserInfoSectionProps {
  user: UserDTO;
  onEditClick: () => void;
  onChangePasswordClick: () => void;
  onLogoutClick: () => void;
}

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <div className="text-2xl mt-1">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-base font-medium text-gray-900 break-words">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default function UserInfoSection({
  user,
  onEditClick,
  onChangePasswordClick,
  onLogoutClick,
}: UserInfoSectionProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Info Cards Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>📋</span>
          Thông tin cá nhân
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon="👤" label="Tên người dùng" value={user.username} />

          {user.fullName && (
            <InfoCard icon="🏷️" label="Họ và tên" value={user.fullName} />
          )}

          {user.email && (
            <InfoCard icon="📧" label="Email" value={user.email} />
          )}

          {user.phone && (
            <InfoCard icon="📱" label="Số điện thoại" value={user.phone} />
          )}

          {user.address && (
            <div className="md:col-span-2">
              <InfoCard icon="📍" label="Địa chỉ" value={user.address} />
            </div>
          )}

          {user.created_at && (
            <InfoCard
              icon="📅"
              label="Ngày tạo tài khoản"
              value={formatDate(user.created_at)}
            />
          )}

          {user.role && (
            <InfoCard icon="🎭" label="Vai trò" value={user.role} />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t-2 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>⚙️</span>
          Tùy chọn tài khoản
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Edit Profile Button */}
          <button
            onClick={onEditClick}
            className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-xl">✏️</span>
              <span>Chỉnh sửa thông tin</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          {/* Change Password Button */}
          <button
            onClick={onChangePasswordClick}
            className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-xl">🔐</span>
              <span>Đổi mật khẩu</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogoutClick}
            className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-xl">🚪</span>
              <span>Đăng xuất</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
