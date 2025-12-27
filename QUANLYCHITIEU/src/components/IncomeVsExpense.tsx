import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { TransactionResponse } from "../type/TransactionResponse";

interface IncomeVsExpenseProps {
  transactions: TransactionResponse[];
}

const COLORS = {
  INCOME: "#22c55e",
  EXPENSE: "#ef4444",
};

export default function IncomeVsExpense({
  transactions,
}: IncomeVsExpenseProps) {
  // Nhóm dữ liệu theo tháng
  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("vi-VN", {
      month: "short",
      year: "numeric",
    });

    let existing = acc.find((item) => item.key === monthKey);
    if (!existing) {
      existing = { key: monthKey, name: monthName, INCOME: 0, EXPENSE: 0 };
      acc.push(existing);
    }

    if (t.type === "INCOME") {
      existing.INCOME += t.amount;
    } else {
      existing.EXPENSE += t.amount;
    }

    return acc;
  }, [] as Array<{ key: string; name: string; INCOME: number; EXPENSE: number }>);

  // Sắp xếp theo tháng
  monthlyData.sort((a, b) => a.key.localeCompare(b.key));

  // Lấy 12 tháng gần nhất
  const chartData = monthlyData.slice(-12);

  // Tính tổng thu nhập và chi tiêu
  const totalIncome = chartData.reduce((sum, item) => sum + item.INCOME, 0);
  const totalExpense = chartData.reduce((sum, item) => sum + item.EXPENSE, 0);

  // Dữ liệu cho biểu đồ tròn
  const pieData = [
    { name: "Thu nhập", value: totalIncome, fill: COLORS.INCOME },
    { name: "Chi tiêu", value: totalExpense, fill: COLORS.EXPENSE },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Thu nhập vs Chi tiêu
      </h2>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-80 text-gray-500">
          <p>Không có dữ liệu</p>
        </div>
      ) : (
        <>
          {/* Biểu đồ tròn */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number" ? value.toLocaleString() : value
                    }
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      const item = pieData.find((d) => d.name === value);
                      return `${value}: ${item?.value?.toLocaleString() || 0}`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Thống kê tóm tắt */}
            <div className="flex-1 space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-gray-600">Thu nhập</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <p className="text-sm text-gray-600">Chi tiêu</p>
                <p className="text-2xl font-bold text-red-600">
                  {totalExpense.toLocaleString()}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg border-l-4 ${
                  totalIncome - totalExpense >= 0
                    ? "bg-blue-50 border-blue-500"
                    : "bg-orange-50 border-orange-500"
                }`}
              >
                <p className="text-sm text-gray-600">Cân bằng</p>
                <p
                  className={`text-2xl font-bold ${
                    totalIncome - totalExpense >= 0
                      ? "text-blue-600"
                      : "text-orange-600"
                  }`}
                >
                  {(totalIncome - totalExpense).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Bảng chi tiết */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-600 font-semibold">
                    Tháng
                  </th>
                  <th className="text-right py-2 px-3 text-gray-600 font-semibold">
                    Thu nhập
                  </th>
                  <th className="text-right py-2 px-3 text-gray-600 font-semibold">
                    Chi tiêu
                  </th>
                  <th className="text-right py-2 px-3 text-gray-600 font-semibold">
                    Cân bằng
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item) => (
                  <tr
                    key={item.key}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-3 font-medium text-gray-700">
                      {item.name}
                    </td>
                    <td className="text-right py-3 px-3 text-green-600 font-semibold">
                      {item.INCOME.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-3 text-red-600 font-semibold">
                      {item.EXPENSE.toLocaleString()}
                    </td>
                    <td
                      className={`text-right py-3 px-3 font-semibold ${
                        item.INCOME - item.EXPENSE >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {(item.INCOME - item.EXPENSE).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
