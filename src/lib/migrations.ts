import { readFileSync } from "node:fs";
import path from "node:path";

export function readMigration(fileName: string): string {
  return readFileSync(path.join(process.cwd(), "db/migrations", fileName), "utf8");
}
