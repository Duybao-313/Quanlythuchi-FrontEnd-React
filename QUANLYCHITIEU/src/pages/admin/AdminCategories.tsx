// src/pages/admin/AdminCategories.tsx
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  getAdminCategories,
  deleteAdminCategory,
  saveGlobalCategory,
  type GlobalCategoryRequest,
} from "../../service/AdminService";
import { createCategoryForMe } from "../../service/UserService";
import type { CategoryResponse } from "../../type/CategoriesResponse";

const ICON_BASE_URL = "http://localhost:8080/uploads/icons/";

const TYPE_OPTIONS: {
  value: "EXPENSE" | "INCOME";
  label: string;
  color: string;
}[] = [
  { value: "EXPENSE", label: "Chi tiêu", color: "bg-red-100 text-red-700" },
  { value: "INCOME", label: "Thu nhập", color: "bg-green-100 text-green-700" },
];

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inline edit states
  const [editingField, setEditingField] = useState<{
    id: number;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [typeDropdown, setTypeDropdown] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponse | null>(null);

  // Add form states
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [formColor, setFormColor] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setTypeDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAdminCategories();
      setCategories(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const getIconUrl = (iconUrl: string | null | undefined) => {
    if (!iconUrl) return null;
    if (iconUrl.startsWith("http")) return iconUrl;
    return `${ICON_BASE_URL}${iconUrl}`;
  };

  const getTypeInfo = (type: string) => {
    return TYPE_OPTIONS.find((t) => t.value === type) || TYPE_OPTIONS[0];
  };

  // Inline update handler
  const handleUpdateCategory = async (
    category: CategoryResponse,
    updates: Partial<{
      name: string;
      type: "EXPENSE" | "INCOME";
      color: string;
    }>,
    file?: File | null,
  ) => {
    setUpdating(true);
    try {
      const data: GlobalCategoryRequest = {
        id: category.id,
        name: updates.name ?? category.name,
        type: updates.type ?? category.type,
        color: updates.color ?? category.color ?? null,
        UpdateFlag: true, // true = update existing
      };

      await saveGlobalCategory(data, file);

      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, ...updates } : c)),
      );
      toast.success("Cập nhật thành công!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật",
      );
    } finally {
      setUpdating(false);
      setEditingField(null);
      setTypeDropdown(null);
    }
  };

  const handleDoubleClick = (
    categoryId: number,
    field: string,
    currentValue: string,
  ) => {
    setEditingField({ id: categoryId, field });
    setEditValue(currentValue || "");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    category: CategoryResponse,
    field: string,
  ) => {
    if (e.key === "Enter") {
      handleUpdateCategory(category, { [field]: editValue });
    } else if (e.key === "Escape") {
      setEditingField(null);
    }
  };

  const handleBlur = (category: CategoryResponse, field: string) => {
    const currentValue = category[field as keyof CategoryResponse];
    if (editValue !== (currentValue || "")) {
      handleUpdateCategory(category, { [field]: editValue });
    } else {
      setEditingField(null);
    }
  };

  // Add modal handlers
  const handleOpenAddModal = () => {
    setFormName("");
    setFormType("EXPENSE");
    setFormColor("");
    setFormFile(null);
    setShowAddModal(true);
  };

  const handleCreate = async () => {
    if (!formName.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        type: formType,
      };

      const res = await createCategoryForMe(payload, formFile);
      if (res && res.success) {
        toast.success(res.message ?? "Thêm danh mục thành công!");
        setShowAddModal(false);
        fetchCategories();
      } else {
        toast.error(res?.message ?? "Thêm danh mục thất bại");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi khi thêm danh mục");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete handlers
  const handleOpenDeleteModal = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setSubmitting(true);
    try {
      await deleteAdminCategory(selectedCategory.id);
      toast.success("Xóa danh mục thành công!");
      setShowDeleteModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi khi xóa danh mục");
    } finally {
      setSubmitting(false);
    }
  };

  // File upload for inline edit
  const handleFileChange = async (
    category: CategoryResponse,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUpdateCategory(category, {}, file);
      fetchCategories(); // Refresh to get new icon URL
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-red-400"
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
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");
  const incomeCategories = categories.filter((c) => c.type === "INCOME");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Danh mục hệ thống
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng cộng {categories.length} danh mục ({expenseCategories.length}{" "}
            chi tiêu, {incomeCategories.length} thu nhập)
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm danh mục
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  ID
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Icon
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Tên danh mục
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Loại
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-gray-500">
                    #{category.id}
                  </td>

                  {/* Icon - Click to change */}
                  <td className="py-4 px-6">
                    <label className="cursor-pointer group relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(category, e)}
                        disabled={updating}
                      />
                      {category.iconUrl ? (
                        <div className="relative">
                          <img
                            src={getIconUrl(category.iconUrl) || ""}
                            alt={category.name}
                            className="w-10 h-10 rounded-lg object-cover group-hover:opacity-70 transition-opacity"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </label>
                  </td>

                  {/* Name - Editable */}
                  <td className="py-4 px-6">
                    {editingField?.id === category.id &&
                    editingField?.field === "name" ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, category, "name")}
                        onBlur={() => handleBlur(category, "name")}
                        className="font-medium text-gray-800 border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={updating}
                      />
                    ) : (
                      <p
                        className="font-medium text-gray-800 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded inline-block"
                        onDoubleClick={() =>
                          handleDoubleClick(category.id, "name", category.name)
                        }
                        title="Nhấp đúp để sửa"
                      >
                        {category.name}
                      </p>
                    )}
                  </td>

                  {/* Type - Dropdown */}
                  <td className="py-4 px-6 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTypeDropdown(
                          typeDropdown === category.id ? null : category.id,
                        );
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-all ${getTypeInfo(category.type).color}`}
                      disabled={updating}
                    >
                      {category.type === "EXPENSE" ? (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 13l-5 5m0 0l-5-5m5 5V6"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                          />
                        </svg>
                      )}
                      {getTypeInfo(category.type).label}
                      <svg
                        className="w-3 h-3 ml-1"
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
                    {typeDropdown === category.id && (
                      <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                        {TYPE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (option.value !== category.type) {
                                handleUpdateCategory(category, {
                                  type: option.value,
                                });
                              } else {
                                setTypeDropdown(null);
                              }
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                              option.value === category.type
                                ? "bg-gray-50 font-semibold"
                                : ""
                            }`}
                          >
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${option.color}`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      {/* Delete Button */}
                      <button
                        onClick={() => handleOpenDeleteModal(category)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa"
                      >
                        <svg
                          className="w-5 h-5"
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
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p>Chưa có danh mục nào</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Thêm danh mục mới
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại
                </label>
                <select
                  value={formType}
                  onChange={(e) =>
                    setFormType(e.target.value as "EXPENSE" | "INCOME")
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="EXPENSE">Chi tiêu</option>
                  <option value="INCOME">Thu nhập</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Màu sắc (tùy chọn)
                </label>
                <input
                  type="text"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="#FF5733"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (tùy chọn)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Đang thêm..." : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
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
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Xác nhận xóa
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn có chắc muốn xóa danh mục "
                <span className="font-semibold">{selectedCategory.name}</span>"?
                <br />
                <span className="text-sm text-red-500">
                  Hành động này không thể hoàn tác.
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
