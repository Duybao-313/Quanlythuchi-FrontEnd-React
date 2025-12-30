import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
          {user?.fullName
            ? user.fullName
                .split(" ")
                .map((n) => n.charAt(0).toUpperCase())
                .join("")
            : user?.username.charAt(0).toUpperCase()}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded z-50">
          {user ? (
            <>
              <Link
                to="/account"
                onClick={handleClose}
                className="block px-4 py-2 text-sm hover:bg-gray-100 border-b"
              >
                Tài khoản của tôi
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleClose}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={handleClose}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
