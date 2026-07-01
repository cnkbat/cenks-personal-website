/**
 * Tiny logger: prints to the console and appends a complete, timestamped audit
 * trail to /outreach/generated/logs/outreach.log. "Keep complete logs" is a
 * hard requirement, so every run is recorded here regardless of dry-run.
 */
import fs from "node:fs";
import path from "node:path";
import { PATHS } from "./config";

type Level = "info" | "warn" | "error" | "success" | "debug";

const ICON: Record<Level, string> = {
  info: "•",
  warn: "!",
  error: "✗",
  success: "✓",
  debug: "·",
};

function logFile(): string {
  fs.mkdirSync(PATHS.generated.logs, { recursive: true });
  return path.join(PATHS.generated.logs, "outreach.log");
}

function write(level: Level, msg: string): void {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${level.toUpperCase().padEnd(7)} ${msg}`;
  try {
    fs.appendFileSync(logFile(), line + "\n", "utf8");
  } catch {
    // Never let logging crash the pipeline.
  }
  const consoleMsg = `${ICON[level]} ${msg}`;
  if (level === "error") console.error(consoleMsg);
  else if (level === "warn") console.warn(consoleMsg);
  else console.log(consoleMsg);
}

export const log = {
  info: (m: string) => write("info", m),
  warn: (m: string) => write("warn", m),
  error: (m: string) => write("error", m),
  success: (m: string) => write("success", m),
  debug: (m: string) => {
    if (process.env.OUTREACH_DEBUG) write("debug", m);
  },
  /** A visual section header in the console (also recorded to the log file). */
  section: (title: string) => {
    const bar = "─".repeat(Math.max(4, 52 - title.length));
    console.log(`\n\x1b[1m${title}\x1b[0m ${bar}`);
    try {
      fs.appendFileSync(logFile(), `\n=== ${title} ===\n`, "utf8");
    } catch {
      /* ignore */
    }
  },
  /** Blank line for readability. */
  blank: () => console.log(""),
};
