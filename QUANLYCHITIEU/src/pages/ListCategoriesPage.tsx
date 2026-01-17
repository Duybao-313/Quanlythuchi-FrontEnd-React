import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listCategories, deleteCategory } from "../service/Categories";
import type { CategoryResponse } from "../type/CategoriesResponse";
import { toast } from "react-toastify";

type ViewMode = "ALL" | "INCOME" | "EXPENSE";

export default function CategoryListPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("ALL");
  const [deleting, setDeleting] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const data = await listCategories();
        console.log(data);
        setCategories(data ?? []);
      } catch (err: unknown) {
        // Nếu request bị abort, không set error
        if ((err as DOMException)?.name === "AbortError") {
          return;
        }
        const messageE = err instanceof Error ? err.message : String(err);
        setError(messageE || "Lỗi khi tải danh mục");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();

    return () => {
      controller.abort();
    };
  }, []);

  const shownCategories = useMemo(() => {
    if (viewMode === "ALL") return categories;
    return categories.filter((c) => c.type === viewMode);
  }, [categories, viewMode]);

  const onAddForCategory = (c: CategoryResponse) => {
    navigate(`/categories/new?type=${c.type}&fromCategory=${c.id}`);
  };

  const onClickOther = () => {
    const type = viewMode === "ALL" ? "EXPENSE" : viewMode;
    navigate(`/categories/new?type=${type}`);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("Bạn chắc chắn muốn xóa danh mục này?")) return;

    setDeleting(categoryId);
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter((c) => c.id !== categoryId));
      toast.success("Xóa danh mục thành công");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Lỗi khi xóa danh mục";
      setError(message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <svg
            className="w-8 h-8 animate-spin text-indigo-500 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
          <span className="text-sm text-gray-500">Đang tải danh mục...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-3"
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
          <p className="text-red-600 font-medium">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Danh mục
        </h1>
        <p className="text-gray-500 mt-1">
          Quản lý các danh mục giao dịch của bạn
        </p>
      </div>

      {/* Tabs / Filter */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setViewMode("ALL")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === "ALL"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "text-gray-600 hover:bg-white hover:shadow-sm"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setViewMode("INCOME")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === "INCOME"
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md"
              : "text-gray-600 hover:bg-white hover:shadow-sm"
          }`}
        >
          Thu nhập
        </button>
        <button
          onClick={() => setViewMode("EXPENSE")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === "EXPENSE"
              ? "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-md"
              : "text-gray-600 hover:bg-white hover:shadow-sm"
          }`}
        >
          Chi tiêu
        </button>
      </div>

      {/* Category list */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {shownCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            </div>
            <p className="text-gray-600 font-medium">Không có danh mục</p>
            <p className="text-sm text-gray-400 mt-1">
              Tạo danh mục mới để bắt đầu
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {shownCategories.map((c) => (
              <div
                key={c.id}
                className="group flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      c.type === "INCOME"
                        ? "bg-gradient-to-br from-emerald-100 to-green-100"
                        : "bg-gradient-to-br from-rose-100 to-red-100"
                    }`}
                  >
                    <img
                      src={c.iconUrl || "/icons/default.png"}
                      alt={c.name}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{c.name}</div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        c.type === "INCOME"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {c.type === "INCOME" ? "Thu nhập" : "Chi tiêu"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onAddForCategory(c)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    aria-label={`Thêm cho ${c.name}`}
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
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    disabled={!c.ownerId || deleting === c.id}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                      !c.ownerId || deleting === c.id
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                    aria-label={`Xóa ${c.name}`}
                  >
                    {deleting === c.id ? (
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                    ) : (
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-gray-100">
          <Link
            to="/createCategory"
            onClick={onClickOther}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <span className="font-medium">Thêm danh mục mới</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
