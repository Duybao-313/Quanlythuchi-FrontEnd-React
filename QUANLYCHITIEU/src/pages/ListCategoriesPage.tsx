import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listCategories, deleteCategory } from "../service/Categories";
import type { CategoryResponse } from "../type/CategoriesResponse";

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
        // Nếu listCategories hỗ trợ signal, truyền controller.signal; nếu không, gọi như hiện tại
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
  }, []); // thêm listCategories vào dependencies nếu hàm này thay đổi

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
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Lỗi khi xóa danh mục";
      setError(message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi: {error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Danh mục</h1>

      {/* Tabs / Filter */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("ALL")}
          className={`px-3 py-1 rounded-md text-sm ${
            viewMode === "ALL"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setViewMode("INCOME")}
          className={`px-3 py-1 rounded-md text-sm ${
            viewMode === "INCOME"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
        >
          Thu nhập
        </button>
        <button
          onClick={() => setViewMode("EXPENSE")}
          className={`px-3 py-1 rounded-md text-sm ${
            viewMode === "EXPENSE"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
        >
          Chi tiêu
        </button>
      </div>

      {/* Single list */}
      <div className="bg-white rounded-lg shadow-sm divide-y">
        {shownCategories.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">Không có danh mục</div>
        ) : (
          shownCategories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-100">
                  <img
                    src={c.iconUrl || "/icons/default.png"}
                    alt={c.name}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="text-sm text-gray-800">{c.name}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 mr-2">{c.type}</span>
                <button
                  onClick={() => onAddForCategory(c)}
                  className="w-9 h-9 flex items-center justify-center rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                  aria-label={`Thêm cho ${c.name}`}
                >
                  +
                </button>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  disabled={!c.ownerId || deleting === c.id}
                  className={`w-9 h-9 flex items-center justify-center rounded-md ${
                    !c.ownerId || deleting === c.id
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                  aria-label={`Xóa ${c.name}`}
                >
                  {deleting === c.id ? "..." : "×"}
                </button>
              </div>
            </div>
          ))
        )}

        <div className="p-3">
          <Link
            to="/createCategory"
            onClick={onClickOther}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-lg border border-dashed border-gray-200 text-sm text-blue-600 hover:bg-blue-50"
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-50 text-blue-600">
              +
            </div>
            <Link to="/createCategory">Khác</Link>
          </Link>
        </div>
      </div>
    </div>
  );
}
