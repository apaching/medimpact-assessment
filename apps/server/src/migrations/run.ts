import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RowDataPacket } from "mysql2";
import { pool } from "../config/mysql.js";

const dir = path.dirname(fileURLToPath(import.meta.url));

interface MigrationRow extends RowDataPacket {
  name: string;
}

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      name VARCHAR(255) PRIMARY KEY,
      run_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [applied] = await pool.query<MigrationRow[]>("SELECT name FROM migrations");
  const appliedNames = new Set(applied.map((row) => row.name));

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (appliedNames.has(file)) continue;
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    console.log(`Applying ${file}...`);
    await pool.query(sql);
    await pool.query("INSERT INTO migrations (name) VALUES (?)", [file]);
  }

  console.log("Migrations up to date.");
  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
