/**
 * Minimal, dependency-free RFC-4180-ish CSV reader/writer.
 *
 * Handles quoted fields, embedded commas, embedded quotes ("") and embedded
 * newlines. Good enough for lead lists; easy to swap for a real parser or a DB
 * later. All values are strings — the caller coerces types.
 */
import fs from "node:fs";
import path from "node:path";

/** Parse raw CSV text into an array of rows (each row an array of strings). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  // Strip a UTF-8 BOM if present so the first header isn't corrupted.
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // ignore; \n handles the row break
    } else {
      field += ch;
    }
  }
  // Flush the final field/row if the file didn't end with a newline.
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** Escape a single value for CSV output. */
function escapeField(value: string): string {
  const needsQuotes = /[",\r\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

/** Serialize header + object rows into CSV text (trailing newline included). */
export function toCsv<T extends Record<string, string>>(
  headers: (keyof T & string)[],
  rows: T[],
): string {
  const lines = [headers.map(escapeField).join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => escapeField(r[h] ?? "")).join(","));
  }
  return lines.join("\n") + "\n";
}

/**
 * Read a CSV file into typed objects keyed by the header row. Missing columns
 * become empty strings. Returns [] if the file does not exist.
 */
export function readCsvObjects<T extends Record<string, string>>(file: string): T[] {
  if (!fs.existsSync(file)) return [];
  const rows = parseCsv(fs.readFileSync(file, "utf8"));
  if (rows.length === 0) return [];
  const headers = rows[0];
  const out: T[] = [];
  for (let i = 1; i < rows.length; i++) {
    const raw = rows[i];
    // Skip fully blank lines.
    if (raw.length === 1 && raw[0].trim() === "") continue;
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = (raw[idx] ?? "").trim();
    });
    out.push(obj as T);
  }
  return out;
}

/** Write typed objects to a CSV file, creating parent dirs as needed. */
export function writeCsvObjects<T extends Record<string, string>>(
  file: string,
  headers: (keyof T & string)[],
  rows: T[],
): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, toCsv(headers, rows), "utf8");
}

/** Append one object row to an existing CSV, using its current header order. */
export function appendCsvRow<T extends Record<string, string>>(
  file: string,
  headers: (keyof T & string)[],
  row: T,
): void {
  if (!fs.existsSync(file)) {
    writeCsvObjects(file, headers, [row]);
    return;
  }
  const line = headers.map((h) => (row[h] ?? "")).map(escapeField).join(",") + "\n";
  fs.appendFileSync(file, line, "utf8");
}
