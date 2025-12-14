import type { JSX } from "react";

type DateRangeType = "DAY" | "WEEK" | "MONTH" | "YEAR";

interface DateRangeFilterProps {
  dateRangeType: DateRangeType;
  displayRange: string;
  onDateRangeTypeChange: (type: DateRangeType) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function DateRangeFilter({
  dateRangeType,
  displayRange,
  onDateRangeTypeChange,
  onPrevious,
  onNext,
}: DateRangeFilterProps): JSX.Element {
  return (
    <section className="w-full bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-sm font-medium">Khoảng thời gian</div>
          <div className="flex gap-2">
            {(["DAY", "WEEK", "MONTH", "YEAR"] as DateRangeType[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  onDateRangeTypeChange(d);
                }}
                className={`px-3 py-1 rounded ${
                  dateRangeType === d ? "bg-blue-600 text-white" : "bg-gray-100"
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

        <div className="flex items-center gap-3">
          <button
            onClick={onPrevious}
            className="px-2 py-1 border rounded"
            type="button"
            aria-label="Previous"
          >
            ‹
          </button>

          <div className="text-sm text-gray-600">
            Khoảng: <span className="font-medium">{displayRange}</span>
          </div>

          <button
            onClick={onNext}
            className="px-2 py-1 border rounded"
            type="button"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
