import { useState, useRef } from "react";
import type { UserDTO } from "../type/UserDTO";
import { uploadAvatar } from "../service/UserService";
import { API_CONFIG } from "../config/apiConfig";
import { toast } from "react-toastify";

interface AvatarUploadProps {
  user: UserDTO;
  onAvatarChange?: (avatar: string) => void;
}

export default function AvatarUpload({
  user,

}: AvatarUploadProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn một tệp hình ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước hình ảnh không được vượt quá 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);

    // Upload avatar
    setIsLoading(true);
    try {
      const response = await uploadAvatar(file);

      if (response.success=== true ) {
      
        toast.success("Cập nhật ảnh đại diện thành công!");
      } else {
        toast.error(
          "Lỗi khi tải lên hình ảnh: " + (response.message || "Unknown error")
        );
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(
        "Lỗi khi tải lên hình ảnh: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      setAvatarPreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvatarUrl = (): string | null => {
    if (avatarPreview) return avatarPreview;

    if (user.avatarUrl) {
      return user.avatarUrl.startsWith("http")
        ? user.avatarUrl
        : `${API_CONFIG.BASE_URL}${user.avatarUrl}`;
    }

    return null;
  };

  const avatarUrl = getAvatarUrl();
  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .join("")
    : user.username.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center py-8">
      <div
        onClick={handleAvatarClick}
        className="cursor-pointer relative group mb-6"
      >
        {/* Background container - only show if no image */}
        {!avatarUrl && (
          <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-2xl border-4 border-white" />
        )}

        {/* Image and text container */}
        <div className="w-40 h-40 rounded-full flex items-center justify-center text-indigo-600 text-6xl font-bold overflow-hidden shadow-2xl border-4 border-white relative z-10">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image failed to load:", avatarUrl);
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="bg-gradient-to-br from-white to-gray-100 w-full h-full flex items-center justify-center">
              {initials}
            </span>
          )}
        </div>

        {/* Overlay hover effect */}
        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
          <div className="text-white opacity-0 group-hover:opacity-100 text-center transition-all duration-300">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm font-semibold">Đổi ảnh</div>
          </div>
        </div>

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-indigo-600"></div>
          </div>
        )}
      </div>

      <p className="text-white text-sm font-medium">Nhấp vào ảnh để thay đổi</p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
