import { useEffect, useState, useCallback } from "react";
import type { Wallet } from "../type/Wallet";
import { fetchWallets } from "../service/WalletService";


export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [wloading, setLoading] = useState(false);
  const [werror, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWallets();
      if (res.success && res.data) {
        setWallets(res.data);
      } else {
        setError(res.message || "Lỗi khi lấy ví");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { wallets, wloading, werror, reload: load, setWallets };
}