import type { JSX } from "react";

interface TransactionStatsProps {
  income: number;
  expense: number;
  transactionCount: number;
  loading: boolean;
}

export default function TransactionStats({
  income,
  expense,
  transactionCount,
  loading,
}: TransactionStatsProps): JSX.Element {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Tổng Thu</div>
          <div className="text-2xl font-semibold text-green-700">
            +{income.toLocaleString()} đ
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Số bản ghi: {transactionCount}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Tổng Chi</div>
          <div className="text-2xl font-semibold text-red-700">
            -{expense.toLocaleString()} đ
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {loading ? "Đang tải..." : "Đã tải xong"}
        </div>
      </div>
    </section>
  );
}
