/**
 * Lead validation. Decides whether a lead is *eligible* to be contacted at all.
 * This is separate from scoring (how good) and analysis (what to offer).
 *
 * Core rule from the brief: B2B only. Personal-looking mailboxes (gmail/hotmail/
 * outlook/…) are skipped unless the address is clearly a business contact.
 */
import type { Lead, ValidationResult } from "./types";
import { isWithinMs } from "./time";

/** Free consumer mailbox providers — treated as non-business by default. */
const PERSONAL_PROVIDERS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.com.tr",
  "outlook.com",
  "outlook.com.tr",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.com.tr",
  "ymail.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "gmx.com",
  "yandex.com",
  "yandex.com.tr",
  "mail.ru",
  "proton.me",
  "protonmail.com",
]);

/** Business-y local parts that hint a shared mailbox even on a custom domain. */
const BUSINESS_LOCAL_PARTS = [
  "info",
  "iletisim",
  "contact",
  "hello",
  "merhaba",
  "destek",
  "support",
  "rezervasyon",
  "reservation",
  "booking",
  "randevu",
  "satis",
  "sales",
  "office",
  "admin",
  "yonetim",
];

/** Statuses that make a lead ineligible for a fresh cold email. */
const NON_SENDABLE_STATUSES = new Set([
  "blocked",
  "replied",
  "bounced",
  "closed",
  "sent",
  "followup_1_sent",
  "followup_2_sent",
]);

const RECENT_CONTACT_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** True if the string is a syntactically plausible email address. */
export function isValidEmailFormat(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

function domainOf(email: string): string {
  const at = email.lastIndexOf("@");
  return at === -1 ? "" : email.slice(at + 1).toLowerCase().trim();
}

function localOf(email: string): string {
  const at = email.lastIndexOf("@");
  return at === -1 ? "" : email.slice(0, at).toLowerCase().trim();
}

/** Root domain of a website URL, for comparing against the email domain. */
function siteDomain(website: string): string {
  if (!website) return "";
  try {
    const u = new URL(website.includes("://") ? website : `https://${website}`);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/**
 * Business-email heuristic. A custom-domain address is business. A free-provider
 * address is business ONLY if its domain matches the lead's website domain
 * (clear evidence it's the real business contact).
 */
export function isBusinessEmail(email: string, lead?: Lead): boolean {
  if (!isValidEmailFormat(email)) return false;
  const domain = domainOf(email);
  if (!PERSONAL_PROVIDERS.has(domain)) return true;
  // Free provider: only accept if it demonstrably belongs to the business.
  if (lead && siteDomain(lead.website) && siteDomain(lead.website) === domain) return true;
  return false;
}

/**
 * Full eligibility check. Returns every failing reason (not just the first) so
 * the operator can see exactly why a lead was skipped.
 */
export function validateLead(lead: Lead): ValidationResult {
  const reasons: string[] = [];
  const email = lead.email.trim();
  const business = isBusinessEmail(email, lead);

  if (!lead.business_name.trim()) reasons.push("Eksik: işletme adı (business_name)");
  if (!email) reasons.push("Eksik: e-posta adresi");
  else if (!isValidEmailFormat(email)) reasons.push("Geçersiz e-posta formatı");
  else if (!business) {
    const local = localOf(email);
    const hint = BUSINESS_LOCAL_PARTS.some((p) => local.startsWith(p))
      ? " (kurumsal görünen kullanıcı adı — kurumsal alan adına taşımanız önerilir)"
      : "";
    reasons.push(`Kişisel e-posta sağlayıcısı — kurumsal e-posta değil${hint}`);
  }

  const hasChannel = Boolean(
    lead.website.trim() || lead.instagram.trim() || lead.google_maps_url.trim(),
  );
  if (!hasChannel) reasons.push("Eksik: website / instagram / google_maps_url (en az biri gerekli)");

  if (!lead.industry.trim() && !lead.business_type.trim())
    reasons.push("Eksik: sektör (industry) veya işletme türü (business_type)");

  const status = lead.status.trim().toLowerCase();
  if (NON_SENDABLE_STATUSES.has(status)) reasons.push(`Durum uygun değil: ${status}`);

  if (lead.reply_status.trim().toLowerCase() === "opt_out")
    reasons.push("Lead çıkış (opt-out) talep etmiş");

  if (isWithinMs(lead.last_contacted_at, RECENT_CONTACT_MS))
    reasons.push("Son 14 gün içinde zaten iletişime geçilmiş");

  return { sendable: reasons.length === 0, reasons, isBusinessEmail: business };
}
