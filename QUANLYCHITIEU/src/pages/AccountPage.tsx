import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import AvatarUpload from "../components/AvatarUpload";
import UserInfoSection from "../components/UserInfoSection";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { updateUserInfo, changePassword } from "../service/UserService";

export default function AccountPage() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Đang tải thông tin người dùng...</div>
      </div>
    );
  }

  const handleAvatarChange = (avatar: string) => {
    setUser({
      ...user,
      avatar,
    });
  };

  const handleEditProfile = async (data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    const response = await updateUserInfo(data);

    if (response.success && response.data) {
      setUser(response.data);
    } else {
      throw new Error(response.message || "Lỗi khi cập nhật thông tin");
    }
  };

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    const response = await changePassword({
      oldPassword,
      newPassword,
    });

    if (!response.success) {
      throw new Error(response.message || "Lỗi khi đổi mật khẩu");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Tài khoản của tôi
          </h1>
          <p className="text-gray-600 text-lg">
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 py-12">
            <AvatarUpload user={user} onAvatarChange={handleAvatarChange} />
          </div>

          {/* User Info and Actions Section */}
          <div className="p-8 md:p-12">
            <UserInfoSection
              user={user}
              onEditClick={() => setIsEditModalOpen(true)}
              onChangePasswordClick={() => setIsChangePasswordModalOpen(true)}
              onLogoutClick={handleLogout}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditProfile}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={handleChangePassword}
      />
    </div>
  );
}
