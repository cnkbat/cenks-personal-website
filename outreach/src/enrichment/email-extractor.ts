/**
 * Email extraction from raw HTML.
 *
 * Pulls addresses from mailto: links and plain text, lowercases + de-duplicates,
 * and drops obvious junk (tracking pixels, image filenames, framework noise).
 * Also chooses a single "best" address for a given site domain.
 */

/** Global scanners (fresh RegExp per call to avoid shared lastIndex state). */
const EMAIL_GLOBAL_RE = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/gi;
const MAILTO_GLOBAL_RE = /mailto:([^"'?>\s]+)/gi;
/** Single-address validator (anchored). */
const EMAIL_ONE_RE = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;

/** Substrings that mark an address as junk (tracking / images / framework noise). */
const JUNK_SUBSTRINGS = [
  "sentry",
  "wixpress",
  "example.",
  "@2x",
  "u003",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
];

/** Trailing image extension => not a real address. */
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg)$/i;

/** Free consumer mailbox providers (used only to rank, never to drop). */
const FREE_PROVIDERS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
]);

/** Safe URL-decode (mailto: values may be percent-encoded). */
function decode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** Domain part of an address (already lowercased). */
function domainOf(email: string): string {
  return email.slice(email.lastIndexOf("@") + 1);
}

/** True if an address is obvious junk (tracking / image / framework noise). */
function isJunk(email: string): boolean {
  if (JUNK_SUBSTRINGS.some((j) => email.includes(j))) return true;
  if (IMAGE_EXT_RE.test(email)) return true;
  return false;
}

/**
 * Extract unique, lowercased email addresses from HTML. Reads mailto: links and
 * plain-text matches; drops junk. First-seen order is preserved.
 */
export function extractEmails(html: string): string[] {
  if (!html) return [];
  const seen = new Set<string>();
  const out: string[] = [];

  const consider = (candidate: string): void => {
    const email = candidate.trim().toLowerCase();
    if (!email || seen.has(email)) return;
    if (!EMAIL_ONE_RE.test(email)) return;
    if (isJunk(email)) return;
    seen.add(email);
    out.push(email);
  };

  let m: RegExpExecArray | null;

  // mailto: links first (usually the most reliable contact address).
  const mailto = new RegExp(MAILTO_GLOBAL_RE);
  while ((m = mailto.exec(html)) !== null) {
    consider(decode(m[1] ?? ""));
  }

  // Plain-text addresses anywhere in the markup.
  const plain = new RegExp(EMAIL_GLOBAL_RE);
  while ((m = plain.exec(html)) !== null) {
    consider(m[0]);
  }

  return out;
}

/**
 * Pick the single best address for a site. Preference order:
 *  1. an address whose domain equals the site domain,
 *  2. the first non-free-provider address,
 *  3. the first address.
 * Returns null when there are no candidates. `source` defaults to "extracted"
 * (the caller may override it with page context such as homepage/contact_page).
 */
export function pickBestEmail(
  emails: string[],
  siteDomain: string,
): { email: string; source: string } | null {
  if (emails.length === 0) return null;

  const domain = siteDomain.trim().toLowerCase().replace(/^www\./, "");
  if (domain) {
    const onDomain = emails.find((e) => domainOf(e) === domain);
    if (onDomain) return { email: onDomain, source: "extracted" };
  }

  const nonFree = emails.find((e) => !FREE_PROVIDERS.has(domainOf(e)));
  if (nonFree) return { email: nonFree, source: "extracted" };

  return { email: emails[0], source: "extracted" };
}
