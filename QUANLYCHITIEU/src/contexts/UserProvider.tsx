// src/providers/UserProvider.tsx
import  { useState, type ReactNode } from "react";
import type { UserDTO } from "../type/UserDTO";
import { UserContext } from "../contexts/UserContextCore";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export default UserProvider;