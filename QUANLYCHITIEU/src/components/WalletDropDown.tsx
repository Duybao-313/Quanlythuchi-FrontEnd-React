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
        className="inline-flex items-center gap-2 px-3 py-2 border rounded shadow-sm bg-white hover:bg-gray-50"
      >
        <span className="w-6 h-6 flex items-center justify-center rounded bg-blue-100 text-blue-700 font-semibold">💼</span>
        <div className="text-left">
          <div className="text-sm font-medium">{selected ? selected.name : placeholder}</div>
          <div className="text-xs text-gray-500">
            {selected ? `${selected.balance.toLocaleString()} ${selected.type}` : "Chọn ví để ghi giao dịch"}
          </div>
        </div>
        <svg className="ml-2 h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 w-64 bg-white border rounded shadow-lg max-h-60 overflow-auto"
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
                className={`px-3 py-2 cursor-pointer flex items-center justify-between ${isHighlighted ? "bg-blue-50" : ""} ${
                  isSelected ? "font-semibold" : "text-gray-700"
                }`}
              >
                <div>
                  <div className="text-sm">{w.name}</div>
                  <div className="text-xs text-gray-500">
                    {w.balance.toLocaleString()} {w.type}
                  </div>
                </div>
                {isSelected && <span className="text-blue-600 text-sm">Đã chọn</span>}
              </li>
            );
          })}

          <li className="border-t px-3 py-2">
            <button
              onClick={() => {
                closeDropdown();
                onCreateClick?.();
              }}
              className="w-full text-left text-sm text-blue-600 hover:underline"
            >
              + Tạo ví mới
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}