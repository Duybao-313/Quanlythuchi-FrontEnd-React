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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <svg
            className="w-4 h-4 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          Chọn danh mục
        </div>
        <button
          onClick={() => onAddNew?.()}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          type="button"
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
          Thêm danh mục
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Đang tải danh mục...
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Lỗi: {error}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto py-1 pb-2 scrollbar-thin scrollbar-thumb-gray-200">
          {categories.map((c) => {
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`group flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                  active
                    ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/10"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                }`}
                aria-pressed={active}
                title={c.name}
                type="button"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    active
                      ? "bg-indigo-100"
                      : "bg-gray-100 group-hover:bg-gray-200"
                  }`}
                >
                  <img
                    src={c.iconUrl || "/icons/default.png"}
                    alt={c.name}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div
                  className={`text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? "text-indigo-700" : "text-gray-700"
                  }`}
                >
                  {c.name}
                </div>
                {active && (
                  <svg
                    className="w-4 h-4 text-indigo-500"
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
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
