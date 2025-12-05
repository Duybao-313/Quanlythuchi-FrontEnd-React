// src/pages/TransactionHistoryPage.tsx
import { useEffect, useMemo, useState } from "react";
import { fetchTransactions } from "../service/TransactionService";
import type { TransactionResponse } from "../type/TransactionResponse";

type Filter = "ALL" | "INCOME" | "EXPENSE";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTransactions();
        if (mounted) setTransactions(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        if (mounted) setError(message || "Lỗi tải giao dịch");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "ALL") return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  }, [transactions]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Lịch sử giao dịch</h2>

        {/* Tổng quan */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-lg bg-green-50">
            <div className="text-sm text-gray-600">Tổng Thu</div>
            <div className="text-lg font-semibold text-green-700">
              +{totals.income.toLocaleString()} đ
            </div>
          </div>
          <div className="p-4 rounded-lg bg-red-50">
            <div className="text-sm text-gray-600">Tổng Chi</div>
            <div className="text-lg font-semibold text-red-700">
              -{totals.expense.toLocaleString()} đ
            </div>
          </div>
        </div>

        {/* Bộ lọc */}
        <div className="flex gap-2 mb-4">
          {(["ALL", "INCOME", "EXPENSE"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg border ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {f === "ALL" ? "Tất cả" : f === "INCOME" ? "Thu" : "Chi"}
            </button>
          ))}
        </div>

        {/* Danh sách */}
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div className="text-red-600">Lỗi: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-600">Không có giao dịch</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map((tx) => (
              <li key={tx.id} className="py-3 flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{tx.categoryName}</div>
                  <div className="text-sm text-gray-700 break-words">{tx.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Tên ví: <span className="text-gray-700">{tx.walletName}</span>
                  </div>
                </div>
                <div
                  className={`ml-4 shrink-0 font-semibold ${
                    tx.type === "EXPENSE" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {tx.type === "EXPENSE" ? "-" : "+"}
                  {tx.amount.toLocaleString()} đ
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}