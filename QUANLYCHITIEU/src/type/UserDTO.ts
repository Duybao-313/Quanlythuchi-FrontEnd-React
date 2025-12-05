// src/types/user.ts
export interface UserDTO {
  id: number;
  username: string;
  fullname?: string;
  email?: string;
  role?: string;
}