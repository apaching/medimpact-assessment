export type UserRole = "super_admin" | "admin" | "user";
export type UserStatus = "pending" | "active" | "deactivated";

export interface PublicUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface UserRow extends PublicUser {
  password_hash: string;
}

export interface AuthTokenPayload {
  userId: number;
  role: UserRole;
}
