// src/pages/AddCategoryPage.tsx
import React, { useState, type JSX } from "react";
import { toast } from "react-toastify";
import { createCategoryForMe } from "../service/UserService";

export default function AddCategoryPage(): JSX.Element {
  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFileChange(f);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    handleFileChange(f);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        type: categoryType,
      };

      const res = await createCategoryForMe(payload, file ?? null);
      if (res && res.success) {
        toast.success(res.message ?? "Tạo danh mục thành công");
        setName("");
        removeFile();
        setCategoryType("EXPENSE");
      } else {
        toast.error(res?.message ?? "Tạo danh mục thất bại");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err ?? "Lỗi không xác định");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Thêm danh mục mới
        </h2>
        <p className="text-gray-500 mt-1">Tạo danh mục để phân loại giao dịch của bạn</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tên danh mục
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Ví dụ: Ăn uống"
              maxLength={100}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Loại danh mục
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCategoryType("EXPENSE")}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                  categoryType === "EXPENSE"
                    ? "border-rose-500 bg-rose-50 text-rose-600"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
                Chi tiêu
              </button>
              <button
                type="button"
                onClick={() => setCategoryType("INCOME")}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                  categoryType === "INCOME"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Thu nhập
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Icon (ảnh)
            </label>

            {/* Drag & drop area */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              className="flex items-center justify-between gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
              aria-label="Kéo thả ảnh hoặc chọn file"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Kéo thả ảnh ở đây</div>
                  <div className="text-xs text-gray-500">Hoặc nhấn nút bên để chọn file</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="category-file"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/25"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm font-medium">Chọn ảnh</span>
                </label>

                <input
                  id="category-file"
                  type="file"
                  accept="image/*"
                  onChange={onInputChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Preview */}
            {preview ? (
              <div className="mt-4 flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">{file?.name ?? "Ảnh đã chọn"}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={removeFile}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      Xóa ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (preview) window.open(preview, "_blank");
                      }}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      Xem lớn
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Chưa có ảnh được chọn
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60 font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tạo danh mục</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setName("");
                removeFile();
                setCategoryType("EXPENSE");
              }}
              className="px-5 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-600 font-medium transition-colors"
            >
              Làm lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}