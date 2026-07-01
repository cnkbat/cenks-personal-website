/**
 * Website fetcher for the enrichment pass.
 *
 * One HTTP GET per URL, a hard timeout via AbortController, a capped response
 * body, redirect following, and a polite bot User-Agent. This function NEVER
 * throws: every failure (network, timeout, bad URL, non-2xx) collapses into a
 * FetchResult with ok=false. No retries, no concurrency — exactly one request
 * per URL so we never hammer a host.
 */

/** Outcome of a single page fetch. */
export interface FetchResult {
  ok: boolean;
  status: number;
  finalUrl: string;
  html: string;
  error: string;
}

/** Upper bound on the HTML we keep in memory (defensive against huge pages). */
const MAX_HTML_CHARS = 400_000;

/** Polite, identifiable bot UA so site owners can see who we are. */
const USER_AGENT = "VesperOutreachBot/1.0 (+lead research; contact via website)";

/** Add https:// if the URL has no scheme. Returns "" for blank input. */
function normalizeUrl(url: string): string {
  const v = url.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/**
 * Fetch a single page. One request, aborts after `timeoutMs`, follows redirects,
 * caps the returned HTML to ~400k chars. Catches ALL errors -> ok:false. Never
 * throws.
 */
export async function fetchPage(url: string, timeoutMs: number): Promise<FetchResult> {
  const target = normalizeUrl(url);
  if (!target) {
    return { ok: false, status: 0, finalUrl: url, html: "", error: "boş url" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1, timeoutMs));
  try {
    const res = await fetch(target, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT },
    });

    let html = "";
    try {
      const text = await res.text();
      html = text.length > MAX_HTML_CHARS ? text.slice(0, MAX_HTML_CHARS) : text;
    } catch {
      // Body read failed (e.g. aborted mid-stream) — keep the status, drop body.
      html = "";
    }

    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url || target,
      html,
      error: res.ok ? "" : `http ${res.status}`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, status: 0, finalUrl: target, html: "", error: msg };
  } finally {
    clearTimeout(timer);
  }
}
