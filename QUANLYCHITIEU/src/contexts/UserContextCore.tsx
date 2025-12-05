// src/contexts/UserContextCore.ts
import { createContext } from "react";
import type { UserDTO } from "../type/UserDTO";

export type UserContextType = {
  user: UserDTO | null;
  setUser: (u: UserDTO | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);