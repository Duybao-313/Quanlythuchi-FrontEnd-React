import { useEffect, useMemo, useState, type JSX } from "react";
import { useWallets } from "../hooks/useWallet";
import { fetchTransactions } from "../service/TransactionService";
import { listCategories } from "../service/Categories";
import HistoryHeader from "../components/HistoryHeader";
import DateRangeWithCategory from "../components/DateRangeWithCategory";
import TransactionStats from "../components/TransactionStats";
import TransactionList from "../components/TransactionList";
import type { TransactionResponse } from "../type/TransactionResponse";
import type { CategoryResponse } from "../type/CategoriesResponse";
import type { ApiResponse } from "../type/ApiResponse";

type Filter = "ALL" | "INCOME" | "EXPENSE";
type DateRangeType = "DAY" | "WEEK" | "MONTH" | "YEAR";

export default function TransactionHistoryPage(): JSX.Element {
  const { wallets, reload: reloadWallets } = useWallets();
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const [selectedWallet, setSelectedWallet] = useState<number | null>(null);
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>("DAY");
  const [anchorDate, setAnchorDate] = useState<Date>(() => new Date());

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [catLoading, setCatLoading] = useState<boolean>(false);
  const [catError, setCatError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { startISO, endISO, displayRange } = useMemo(() => {
    const now = new Date(anchorDate);
    let start = new Date(now);
    let end = new Date(now);

    if (dateRangeType === "DAY") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (dateRangeType === "WEEK") {
      const day = now.getDay();
      const diffToMonday = (day + 6) % 7;
      start.setDate(now.getDate() - diffToMonday);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (dateRangeType === "MONTH") {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`;

    return {
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      displayRange: `${fmt(start)} - ${fmt(end)}`,
    };
  }, [dateRangeType, anchorDate]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((s, t) => s + t.amount, 0);
    return { income, expense };
  }, [transactions]);

  useEffect(() => {
    if (wallets.length && selectedWallet == null) {
      setSelectedWallet(wallets[0].id);
    }
  }, [wallets, selectedWallet]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      setCatLoading(true);
      setCatError(null);
      try {
        const data = await listCategories();
        setCategories(data ?? []);
      } catch (err: unknown) {
        if ((err as DOMException)?.name === "AbortError") {
          return;
        }
        const messageE = err instanceof Error ? err.message : String(err);
        setCatError(messageE || "Lỗi khi tải danh mục");
      } finally {
        setCatLoading(false);
      }
    }

    fetchCategories();

    return () => {
      controller.abort();
    };
  }, []);

  const shiftAnchor = (direction: -1 | 1) => {
    setAnchorDate((prev) => {
      const d = new Date(prev);
      if (dateRangeType === "DAY") d.setDate(d.getDate() + direction * 1);
      else if (dateRangeType === "WEEK") d.setDate(d.getDate() + direction * 7);
      else if (dateRangeType === "MONTH")
        d.setMonth(d.getMonth() + direction * 1);
      else d.setFullYear(d.getFullYear() + direction * 1);
      return d;
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function load() {
      setLoading(true);
      setNetworkError(null);

      const toDateOnly = (v?: string | Date): string | undefined => {
        if (!v) return undefined;
        const d = typeof v === "string" ? new Date(v) : v;
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate()
        )}`;
      };

      const payload = {
        walletId: selectedWallet ?? undefined,
        categoryId: selectedCategory ?? undefined,
        type: filter === "ALL" ? undefined : filter,
        startDate: toDateOnly(startISO),
        endDate: toDateOnly(endISO),
      };

      try {
        const res = await fetchTransactions(payload);

        if (!mounted) return;

        if (Array.isArray(res)) setTransactions(res);
        else if (
          res &&
          typeof res === "object" &&
          (res as ApiResponse<unknown>).success !== undefined
        ) {
          const api = res as ApiResponse<TransactionResponse[]>;
          if (api.success) {
            const data = api.data;
            if (Array.isArray(data)) setTransactions(data);
            else setTransactions([]);
          } else {
            setTransactions([]);
          }
        } else setTransactions([]);
      } catch (err: unknown) {
        const isAbort = (err as DOMException)?.name === "AbortError";
        const isNetwork = (err as TypeError)?.message
          ?.toLowerCase()
          .includes("failed to fetch");
        if (!isAbort && isNetwork)
          setNetworkError(
            "Không thể kết nối tới server. Vui lòng kiểm tra mạng."
          );
        else if (!isAbort && !isNetwork)
          setNetworkError("Lỗi khi gọi API. Vui lòng thử lại sau.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [
    selectedWallet,
    selectedCategory,
    filter,
    dateRangeType,
    startISO,
    endISO,
  ]);

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 text-gray-900">
      <HistoryHeader
        selectedWallet={selectedWallet}
        filter={filter}
        wallets={wallets}
        onWalletChange={setSelectedWallet}
        onFilterChange={setFilter}
        onReloadWallets={reloadWallets}
      />

      <main className="w-full px-6 py-6">
        <DateRangeWithCategory
          dateRangeType={dateRangeType}
          displayRange={displayRange}
          categories={categories}
          selectedCategory={selectedCategory}
          catLoading={catLoading}
          catError={catError}
          onDateRangeTypeChange={(d) => {
            setDateRangeType(d);
            setAnchorDate(new Date());
          }}
          onPrevious={() => shiftAnchor(-1)}
          onNext={() => shiftAnchor(1)}
          onCategorySelect={setSelectedCategory}
        />

        <TransactionStats
          income={totals.income}
          expense={totals.expense}
          transactionCount={transactions.length}
          loading={loading}
        />

        <TransactionList
          transactions={transactions}
          loading={loading}
          networkError={networkError}
          onRetry={() => {
            setNetworkError(null);
            setAnchorDate((d) => new Date(d));
          }}
        />
      </main>
    </div>
  );
}
