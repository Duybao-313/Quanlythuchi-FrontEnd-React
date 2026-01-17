import type { JSX } from "react";
import CategorySelector from "./CategoriesSelect";
import type { CategoryResponse } from "../type/CategoriesResponse";

type DateRangeType = "DAY" | "WEEK" | "MONTH" | "YEAR";

interface DateRangeWithCategoryProps {
  dateRangeType: DateRangeType;
  displayRange: string;
  categories: CategoryResponse[];
  selectedCategory: number | null;
  catLoading: boolean;
  catError: string | null;
  onDateRangeTypeChange: (type: DateRangeType) => void;
  onPrevious: () => void;
  onNext: () => void;
  onCategorySelect: (id: number | null) => void;
}

export default function DateRangeWithCategory({
  dateRangeType,
  displayRange,
  categories,
  selectedCategory,
  catLoading,
  catError,
  onDateRangeTypeChange,
  onPrevious,
  onNext,
  onCategorySelect,
}: DateRangeWithCategoryProps): JSX.Element {
  return (
    <section className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Khoảng thời gian
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {(["DAY", "WEEK", "MONTH", "YEAR"] as DateRangeType[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  onDateRangeTypeChange(d);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  dateRangeType === d 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md" 
                    : "text-gray-600 hover:bg-white hover:shadow-sm"
                }`}
                type="button"
              >
                {d === "DAY"
                  ? "Ngày"
                  : d === "WEEK"
                  ? "Tuần"
                  : d === "MONTH"
                  ? "Tháng"
                  : "Năm"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            type="button"
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg min-w-[180px] text-center">
            <span className="text-sm font-semibold text-indigo-700">{displayRange}</span>
          </div>

          <button
            onClick={onNext}
            className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            type="button"
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <CategorySelector
          categories={categories}
          selectedId={selectedCategory}
          loading={catLoading}
          error={catError}
          onSelect={onCategorySelect}
          onAddNew={() => {}}
        />
      </div>
    </section>
  );
}
