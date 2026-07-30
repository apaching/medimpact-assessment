import type { RowDataPacket } from "mysql2";
import { pool } from "../../config/mysql.js";

interface ShareRow extends RowDataPacket {
  contact_id: string;
  owner_id: number;
  shared_with_user_id: number;
}

export async function shareContact(contactId: string, ownerId: number, sharedWithUserId: number) {
  await pool.query(
    `INSERT IGNORE INTO shared_contacts (contact_id, owner_id, shared_with_user_id)
     VALUES (?, ?, ?)`,
    [contactId, ownerId, sharedWithUserId],
  );
}

export async function unshareContact(contactId: string, sharedWithUserId: number) {
  await pool.query(
    "DELETE FROM shared_contacts WHERE contact_id = ? AND shared_with_user_id = ?",
    [contactId, sharedWithUserId],
  );
}

export async function listSharedUserIds(contactId: string): Promise<number[]> {
  const [rows] = await pool.query<ShareRow[]>(
    "SELECT shared_with_user_id FROM shared_contacts WHERE contact_id = ?",
    [contactId],
  );
  return rows.map((r) => r.shared_with_user_id);
}

export async function listContactIdsSharedWithUser(userId: number): Promise<string[]> {
  const [rows] = await pool.query<ShareRow[]>(
    "SELECT contact_id FROM shared_contacts WHERE shared_with_user_id = ?",
    [userId],
  );
  return rows.map((r) => r.contact_id);
}

export async function isSharedWithUser(contactId: string, userId: number): Promise<boolean> {
  const [rows] = await pool.query<ShareRow[]>(
    "SELECT 1 FROM shared_contacts WHERE contact_id = ? AND shared_with_user_id = ? LIMIT 1",
    [contactId, userId],
  );
  return rows.length > 0;
}

export async function deleteSharesForContact(contactId: string): Promise<void> {
  await pool.query("DELETE FROM shared_contacts WHERE contact_id = ?", [contactId]);
}
