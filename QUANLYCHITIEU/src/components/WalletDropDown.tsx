import React, { useEffect, useRef, useState } from "react";
import type { Wallet } from "../type/Wallet";

type Props = {
  wallets: Wallet[];
  value?: number | null;
  onChange: (id: number) => void;
  placeholder?: string;
  onCreateClick?: () => void;
};

export default function WalletDropdown({
  wallets,
  value,
  onChange,
  placeholder = "Chọn ví",
  onCreateClick,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlight(-1);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = wallets.find((w) => w.id === value);

  const openDropdown = () => {
    setOpen(true);
    // khi mở, đặt highlight vào item đã chọn nếu có, hoặc -1
    const idx = wallets.findIndex((w) => w.id === value);
    setHighlight(idx >= 0 ? idx : -1);
  };

  const closeDropdown = () => {
    setOpen(false);
    setHighlight(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      openDropdown();
      e.preventDefault();
      return;
    }
    if (open) {
      if (e.key === "ArrowDown") {
        setHighlight((h) => Math.min(h + 1, wallets.length - 1));
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setHighlight((h) => Math.max(h - 1, 0));
        e.preventDefault();
      } else if (e.key === "Enter" && highlight >= 0) {
        onChange(wallets[highlight].id);
        closeDropdown();
        e.preventDefault();
      } else if (e.key === "Escape") {
        closeDropdown();
      }
    }
  };

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((s) => {
            const next = !s;
            if (next) {
              // mở
              const idx = wallets.findIndex((w) => w.id === value);
              setHighlight(idx >= 0 ? idx : -1);
            } else {
              // đóng
              setHighlight(-1);
            }
            return next;
          });
        }}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
          <svg
            className="w-5 h-5 text-indigo-600"
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
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-900">
            {selected ? selected.name : placeholder}
          </div>
          <div className="text-xs text-gray-500">
            {selected
              ? `${selected.balance.toLocaleString()} đ`
              : "Chọn ví để ghi giao dịch"}
          </div>
        </div>
        <svg
          className={`ml-2 h-5 w-5 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
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
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 w-72 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl max-h-72 overflow-auto"
          onKeyDown={onKeyDown}
        >
          {wallets.map((w, idx) => {
            const isSelected = w.id === value;
            const isHighlighted = idx === highlight;
            return (
              <li
                key={w.id}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => {
                  onChange(w.id);
                  closeDropdown();
                }}
                className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                  isHighlighted ? "bg-indigo-50" : "hover:bg-gray-50"
                } ${isSelected ? "bg-indigo-50" : ""}`}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-lg ${
                    isSelected ? "bg-indigo-100" : "bg-gray-100"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${
                      isSelected ? "text-indigo-600" : "text-gray-500"
                    }`}
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
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${
                      isSelected ? "text-indigo-700" : "text-gray-900"
                    }`}
                  >
                    {w.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {w.balance.toLocaleString()} đ
                  </div>
                </div>
                {isSelected && (
                  <svg
                    className="w-5 h-5 text-indigo-600"
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
                )}
              </li>
            );
          })}

          <li className="border-t border-gray-100 px-4 py-3">
            <button
              onClick={() => {
                closeDropdown();
                onCreateClick?.();
              }}
              className="w-full flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
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
              Tạo ví mới
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
