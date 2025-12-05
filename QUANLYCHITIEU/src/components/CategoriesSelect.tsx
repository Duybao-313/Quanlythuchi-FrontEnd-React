// src/components/CategorySelector.tsx
import type { CategoryResponse } from "../type/CategoriesResponse";

export type CategorySelectorProps = {
  categories: CategoryResponse[];
  selectedId: number | null;
  loading?: boolean;
  error?: string | null;
  onSelect: (id: number) => void;
  onAddNew?: (type?: "INCOME" | "EXPENSE") => void;
};

export default function CategorySelector({
  categories,
  selectedId,
  loading = false,
  error = null,
  onSelect,
  onAddNew,
}: CategorySelectorProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-700">Chọn danh mục</div>
        <button
          onClick={() => onAddNew?.()}
          className="text-sm text-blue-600 hover:underline"
          type="button"
        >
          Thêm danh mục
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Đang tải danh mục...</div>
      ) : error ? (
        <div className="text-sm text-red-500">Lỗi: {error}</div>
      ) : (
        <div className="flex gap-3 overflow-x-auto py-1">
          {categories.map((c) => {
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`flex-shrink-0 flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
                  active
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                aria-pressed={active}
                title={c.name}
                type="button"
              >
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-100">
                  <img
                    src={c.iconUrl || "/icons/default.png"}
                    alt={c.name}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="text-sm text-gray-800 whitespace-nowrap">{c.name}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}