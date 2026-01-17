import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import AvatarUpload from "../components/AvatarUpload";
import UserInfoSection from "../components/UserInfoSection";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { updateUserInfo } from "../service/UserService";
import { changePassword } from "../service/AuthService";
import { toast } from "react-toastify";

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

  const handleAvatarChange = (avatarUrl: string) => {
    setUser({
      ...user,
      avatarUrl,
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
    try {
      const response = await changePassword({
        oldPass: oldPassword,
        newPass1: newPassword,
        newPass2: newPassword,
      });

      if (response.success) {
        toast.success(response.message || "Đổi mật khẩu thành công!");
      } else {
        console.log(response);
        toast.error(response.message || "Lỗi khi đổi mật khẩu");
      }
    } catch (error) {
      toast.error(
        "Không thể kết nối tới server. Vui lòng thử lại sau." + error
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Đã đăng xuất");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Tài khoản của tôi
          </h1>
          <p className="text-gray-500 text-lg">
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <AvatarUpload user={user} onAvatarChange={handleAvatarChange} />
            </div>
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
