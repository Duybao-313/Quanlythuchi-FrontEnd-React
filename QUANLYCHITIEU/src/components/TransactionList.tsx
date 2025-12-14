import type { JSX } from "react";
import type { TransactionResponse } from "../type/TransactionResponse";

interface TransactionListProps {
  transactions: TransactionResponse[];
  loading: boolean;
  networkError: string | null;
  onRetry: () => void;
}

export default function TransactionList({
  transactions,
  loading,
  networkError,
  onRetry,
}: TransactionListProps): JSX.Element {
  return (
    <section className="w-full bg-white rounded-lg p-6 shadow-sm">
      {networkError && (
        <div className="mb-4 text-red-600 flex items-center justify-between">
          <div>{networkError}</div>
          <button onClick={onRetry} className="underline" type="button">
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <div>Đang tải...</div>
      ) : transactions.length === 0 ? (
        <div className="text-gray-600">Không có giao dịch</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">
                  {tx.categoryName ?? "Giao dịch"}
                </div>
                <div className="text-sm text-gray-700 break-words">
                  {tx.description}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Tên ví: <span className="text-gray-700">{tx.walletName}</span>{" "}
                  •{" "}
                  <span>
                    {new Date(tx.date ?? tx.date ?? "").toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
              <div
                className={`ml-0 sm:ml-4 shrink-0 font-semibold ${
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
    </section>
  );
}
