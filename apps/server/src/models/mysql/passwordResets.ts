import type { RowDataPacket } from "mysql2";
import { pool } from "../../config/mysql.js";

interface PasswordResetRow extends RowDataPacket {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
}

export async function createResetToken(userId: number, tokenHash: string, expiresAt: Date) {
  await pool.query("DELETE FROM password_resets WHERE user_id = ?", [userId]);
  await pool.query(
    "INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
    [userId, tokenHash, expiresAt],
  );
}

export async function findValidToken(tokenHash: string): Promise<PasswordResetRow | null> {
  const [rows] = await pool.query<PasswordResetRow[]>(
    "SELECT * FROM password_resets WHERE token_hash = ? AND expires_at > NOW()",
    [tokenHash],
  );
  return rows[0] || null;
}

export async function deleteTokensForUser(userId: number): Promise<void> {
  await pool.query("DELETE FROM password_resets WHERE user_id = ?", [userId]);
}
