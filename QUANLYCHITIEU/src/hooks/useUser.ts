// src/hooks/useUser.ts
import { useContext } from "react";
import { UserContext } from "../contexts/UserContextCore";
import type { UserContextType } from "../contexts/UserContextCore";

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}