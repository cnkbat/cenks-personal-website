/**
 * Spam / anti-abuse checker. Independent from the quality reviewer: quality
 * asks "is this a good email?", spam asks "would this look/behave like spam?".
 * A blocked email is never sent, even if its quality score is high.
 *
 * Key protection: near-duplicate detection. Two emails that are >90% similar are
 * blocked, which structurally prevents "mass-send identical emails".
 */
import type { GeneratedEmail, OutreachConfig, SpamCheck } from "./types";

const SALES_WORDS = [
  "indirim",
  "kampanya",
  "acele",
  "son şans",
  "kaçırma",
  "bedava",
  "ücretsiz fırsat",
  "kazanın",
  "muhteşem",
  "inanılmaz",
  "şok",
  "tıklayın",
  "satın alın",
];

const FORBIDDEN_SERVICE_PATTERNS: RegExp[] = [
  /sosyal medya yönet/i,
  /içerik üret/i,
  /içerik paket/i,
  /instagram yönet/i,
  /\bcontent\b/i,
];

const FALSE_GUARANTEE_PATTERNS: RegExp[] = [
  /garanti/i,
  /kesin satış/i,
  /kesinlikle artır/i,
  /%\s*100/,
];

const MISLEADING_SUBJECT_PATTERNS: RegExp[] = [/re:/i, /fwd:/i, /bedava/i, /son şans/i, /kazandınız/i];

const ALLCAPS_ALLOWLIST = new Set(["AI", "CRM", "SEO", "CTA", "QR", "TR", "EN", "OS", "B2B", "PDF"]);

const MAX_EXCLAMATIONS = 1;
const MAX_WORDS = 200;
const MAX_CHARS = 1800;
const SIMILARITY_BLOCK = 0.9;

/** 3-word shingles for similarity. */
function shingles(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const set = new Set<string>();
  for (let i = 0; i + 2 < words.length; i++) set.add(words.slice(i, i + 3).join(" "));
  return set;
}

/** Jaccard similarity between two texts (0–1). */
export function similarity(a: string, b: string): number {
  const sa = shingles(a);
  const sb = shingles(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  for (const s of sa) if (sb.has(s)) inter++;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function allCapsWords(text: string): string[] {
  const tokens = text.match(/\b[\p{Lu}]{4,}\b/gu) ?? [];
  return tokens.filter((t) => !ALLCAPS_ALLOWLIST.has(t));
}

/**
 * Check an email for spam signals. `previousBodies` are recently generated/sent
 * bodies to compare against for near-duplication.
 */
export function checkSpam(
  email: GeneratedEmail,
  previousBodies: string[],
  config: OutreachConfig,
): SpamCheck {
  const reasons: string[] = [];
  const body = email.body;
  const combined = `${email.subject}\n${body}`;

  const exclamations = (body.match(/!/g) ?? []).length;
  if (exclamations > MAX_EXCLAMATIONS) reasons.push(`Çok fazla ünlem (${exclamations})`);

  const salesHits = SALES_WORDS.filter((w) => combined.toLowerCase().includes(w));
  if (salesHits.length >= 2) reasons.push(`Satış baskısı kelimeleri: ${salesHits.join(", ")}`);

  if (MISLEADING_SUBJECT_PATTERNS.some((re) => re.test(email.subject)))
    reasons.push("Yanıltıcı konu satırı");

  if (!body.includes(config.optOutLine)) reasons.push("Çıkış (opt-out) cümlesi yok");

  if (!email.subject.trim() || email.wordCount < 40) reasons.push("Yetersiz kişiselleştirme / çok kısa");

  const forbidden = FORBIDDEN_SERVICE_PATTERNS.find((re) => re.test(body));
  if (forbidden) reasons.push(`Yasak hizmet ifadesi: ${forbidden}`);

  const guarantee = FALSE_GUARANTEE_PATTERNS.find((re) => re.test(body));
  if (guarantee) reasons.push(`Sahte garanti ifadesi: ${guarantee}`);

  const caps = allCapsWords(body);
  if (caps.length > 0) reasons.push(`Büyük harf bağırma: ${caps.slice(0, 3).join(", ")}`);

  if (email.wordCount > MAX_WORDS || body.length > MAX_CHARS)
    reasons.push(`E-posta çok uzun (${email.wordCount} kelime)`);

  let maxSim = 0;
  for (const prev of previousBodies) maxSim = Math.max(maxSim, similarity(body, prev));
  if (maxSim >= SIMILARITY_BLOCK)
    reasons.push(`Önceki bir e-postaya çok benziyor (%${Math.round(maxSim * 100)})`);

  return { blocked: reasons.length > 0, reasons, score: reasons.length };
}
