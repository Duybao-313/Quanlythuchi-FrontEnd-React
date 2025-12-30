// src/types/user.ts
export interface UserDTO {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  created_at?: string;
  avatar?: string;
}
