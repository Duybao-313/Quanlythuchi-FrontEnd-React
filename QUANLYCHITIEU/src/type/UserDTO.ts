// src/types/user.ts
export interface UserRole {
  id: number;
  name: string;
}

export interface UserDTO {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: UserRole;
  created_at?: string;
  avatarUrl?: string;
}
