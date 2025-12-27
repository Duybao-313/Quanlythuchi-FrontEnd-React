import { useState, useEffect } from "react";
import { fetchTransactions } from "../service/TransactionService";
import { fetchWalletOverview } from "../service/WalletService";
import type { TransactionResponse } from "../type/TransactionResponse";
import type { WalletOverview } from "../service/WalletService";
import StatisticsCard from "../components/StatisticsCard";
import ExpenseByCategory from "../components/ExpenseByCategory";
import ExpenseByWallet from "../components/ExpenseByWallet";
import IncomeVsExpense from "../components/IncomeVsExpense";

export default function StatisticsPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [overview, setOverview] = useState<WalletOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [txRes, overRes] = await Promise.all([
          fetchTransactions(),
          fetchWalletOverview(),
        ]);
        if (Array.isArray(txRes)) {
          setTransactions(txRes);
        }
        if (overRes.success && overRes.data) {
          setOverview(overRes.data);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Thống kê chi tiêu</h1>
        <p className="text-gray-600 mt-2">
          Phân tích chi tiêu và doanh thu của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <StatisticsCard overview={overview} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseByCategory transactions={transactions} />
        <ExpenseByWallet transactions={transactions} />
      </div>

      {/* Monthly Income vs Expense */}
      <IncomeVsExpense transactions={transactions} />
    </div>
  );
}
