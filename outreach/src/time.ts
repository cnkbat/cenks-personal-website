/**
 * Date helpers. Follow-ups are scheduled in *business days* (skip Sat/Sun),
 * and limits are enforced per calendar day / rolling hour.
 */

/** ISO timestamp, e.g. 2026-07-01T09:30:00.000Z */
export function nowIso(): string {
  return new Date().toISOString();
}

/** YYYY-MM-DD for a given date (defaults to now). */
export function dateStamp(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Add N business days (skipping Saturday/Sunday) to a date. */
export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from.getTime());
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d;
}

/** True if the ISO timestamp is today or in the past. Empty string => false. */
export function isDueOrPast(iso: string): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  return t <= Date.now();
}

/** True if an ISO timestamp falls on today's calendar day (UTC). */
export function isToday(iso: string): boolean {
  if (!iso) return false;
  return iso.slice(0, 10) === dateStamp();
}

/** True if an ISO timestamp is within the last `ms` milliseconds. */
export function isWithinMs(iso: string, ms: number): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  return Date.now() - t <= ms;
}
