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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Thêm danh mục mới</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Tên danh mục</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Ví dụ: Ăn uống"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Loại</label>
          <select
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value as "EXPENSE" | "INCOME")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="EXPENSE">Chi (Expense)</option>
            <option value="INCOME">Thu (Income)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Icon (ảnh)</label>

          {/* Drag & drop area */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="flex items-center justify-between gap-4 p-3 border-2 border-dashed rounded-md hover:border-blue-400 transition-colors"
            aria-label="Kéo thả ảnh hoặc chọn file"
          >
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12" />
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2" />
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 11l2 2 3-3 4 4" />
              </svg>

              <div>
                <div className="text-sm font-medium">Kéo thả ảnh ở đây</div>
                <div className="text-xs text-gray-500">Hoặc nhấn nút bên để chọn file</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="category-file"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                </svg>
                <span className="text-sm">Chọn ảnh</span>
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
            <div className="mt-3 flex items-center gap-4">
              <div className="w-24 h-24 rounded-md overflow-hidden border">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{file?.name ?? "Ảnh đã chọn"}</div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={removeFile}
                    className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-50"
                  >
                    Xóa ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // mở ảnh trong tab mới
                      if (preview) window.open(preview, "_blank");
                    }}
                    className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-50"
                  >
                    Xem lớn
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-sm text-gray-500">Chưa có ảnh được chọn</div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Đang tạo..." : "Tạo danh mục"}
          </button>

          <button
            type="button"
            onClick={() => {
              setName("");
              removeFile();
              setCategoryType("EXPENSE");
            }}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-50"
          >
            Làm lại
          </button>
        </div>
      </form>
    </div>
  );
}