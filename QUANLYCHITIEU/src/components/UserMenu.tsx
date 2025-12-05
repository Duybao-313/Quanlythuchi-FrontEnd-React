import { useState } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const isLoggedIn = false; // giả sử chưa đăng nhập

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img src="/avatar.png" alt="User" className="w-8 h-8 rounded-full border" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded z-50">
          {!isLoggedIn ? (
            <>
              <a href="/login" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Đăng nhập
              </a>
              <a href="/register" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Đăng ký
              </a>
            </>
          ) : (
            <>
              <a href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Hồ sơ
              </a>
              <a href="/logout" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Đăng xuất
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}