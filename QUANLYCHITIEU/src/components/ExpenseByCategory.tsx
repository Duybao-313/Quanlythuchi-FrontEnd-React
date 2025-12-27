import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TransactionResponse } from "../type/TransactionResponse";

interface ExpenseByCategoryProps {
  transactions: TransactionResponse[];
}

export default function ExpenseByCategory({
  transactions,
}: ExpenseByCategoryProps) {
  // Nhóm chi tiêu theo danh mục
  const categoryData = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.categoryName);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ name: t.categoryName, amount: t.amount });
      }
      return acc;
    }, [] as Array<{ name: string; amount: number }>)
    .sort((a, b) => b.amount - a.amount);

  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Chi tiêu theo danh mục
      </h2>

      {categoryData.length === 0 ? (
        <div className="flex items-center justify-center h-80 text-gray-500">
          <p>Không có dữ liệu chi tiêu</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                formatter={(value) =>
                  typeof value === "number" ? value.toLocaleString() : value
                }
              />
              <Bar dataKey="amount" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Bảng chi tiết */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoryData.map((item) => (
              <div key={item.name} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 truncate">{item.name}</p>
                <p className="text-lg font-bold text-red-600">
                  {item.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {((item.amount / total) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
