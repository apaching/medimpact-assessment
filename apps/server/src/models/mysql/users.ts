import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/mysql.js";
import type { PublicUser, UserRole, UserRow, UserStatus } from "../../types.js";

const PUBLIC_FIELDS =
  "id, first_name, last_name, email, role, status, created_at, updated_at";

interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}

export async function createUser({
  firstName,
  lastName,
  email,
  passwordHash,
  role = "user",
}: CreateUserInput): Promise<PublicUser | null> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [firstName, lastName, email, passwordHash, role],
  );
  return findById(result.insertId);
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await pool.query<(UserRow & RowDataPacket)[]>(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );
  return rows[0] || null;
}

export async function findById(id: number): Promise<PublicUser | null> {
  const [rows] = await pool.query<(PublicUser & RowDataPacket)[]>(
    `SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`,
    [id],
  );
  return rows[0] || null;
}

export async function listUsers(): Promise<PublicUser[]> {
  const [rows] = await pool.query<(PublicUser & RowDataPacket)[]>(
    `SELECT ${PUBLIC_FIELDS} FROM users ORDER BY created_at DESC`,
  );
  return rows;
}

interface UpdateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export async function updateUser(
  id: number,
  { firstName, lastName, email, role }: UpdateUserInput,
): Promise<PublicUser | null> {
  await pool.query(
    `UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ?`,
    [firstName, lastName, email, role, id],
  );
  return findById(id);
}

export async function setStatus(id: number, status: UserStatus): Promise<PublicUser | null> {
  await pool.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
  return findById(id);
}

export async function setPasswordHash(id: number, passwordHash: string): Promise<void> {
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, id]);
}

export async function deleteUser(id: number): Promise<void> {
  await pool.query("DELETE FROM users WHERE id = ?", [id]);
}

export async function countUsers(): Promise<number> {
  const [rows] = await pool.query<(RowDataPacket & { count: number })[]>(
    "SELECT COUNT(*) AS count FROM users",
  );
  return rows[0].count;
}
