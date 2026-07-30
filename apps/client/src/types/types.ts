export type UserRole = "super_admin" | "admin" | "user";
export type UserStatus = "pending" | "active" | "deactivated";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  _id: string;
  ownerId: number;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email?: string;
  photo?: string | null;
  createdAt: string;
  updatedAt: string;
}
