/**
 * Domain knowledge for Vesper Outreach OS: industry classification, the Turkish
 * copy for every detectable problem, and the offer catalogue (names, concrete
 * improvement lines, subject variants).
 *
 * Centralised here so the analyzer, scorer, offer-selector and email-generator
 * all speak the same vocabulary. Edit copy here — not inside the pipeline.
 */
import type { OfferKey, ProblemId } from "./types";

/** Canonical business categories we map free-text industry/business_type onto. */
export type Category =
  | "beauty"
  | "dental"
  | "barber"
  | "restaurant"
  | "realestate"
  | "education"
  | "fitness"
  | "clinic"
  | "automotive"
  | "localservice"
  | "unknown";

/** Keyword → category. First match wins; order matters (specific before generic). */
const CATEGORY_KEYWORDS: [Category, string[]][] = [
  ["dental", ["dental", "diş", "dis", "dentist", "ortodonti"]],
  ["beauty", ["beauty", "güzellik", "guzellik", "estetik", "aesthetic", "cilt", "spa", "epilasyon", "medikal estetik"]],
  ["barber", ["barber", "berber", "kuaför", "kuafor", "saç", "sac", "hair", "salon"]],
  ["restaurant", ["restaurant", "restoran", "cafe", "kafe", "coffee", "kahve", "bistro", "lokanta", "yemek", "pizza", "burger"]],
  ["realestate", ["real estate", "emlak", "gayrimenkul", "realtor", "konut"]],
  ["education", ["school", "okul", "kurs", "course", "dershane", "eğitim", "egitim", "academy", "akademi", "etüt"]],
  ["fitness", ["fitness", "gym", "spor salonu", "pilates", "yoga", "crossfit", "reformer"]],
  ["clinic", ["clinic", "klinik", "poliklinik", "medical", "sağlık", "saglik", "fizyoterapi", "diyetisyen", "psikolog", "muayenehane", "tıp merkezi"]],
  ["automotive", ["detailing", "oto ", "otomotiv", "araç", "arac", "car", "kaporta", "lastik", "yıkama", "yikama", "servis"]],
];

/** Categories whose business model is appointment/service driven. */
export const APPOINTMENT_CATEGORIES = new Set<Category>([
  "beauty",
  "dental",
  "barber",
  "clinic",
  "fitness",
  "automotive",
]);

/** Every category we consider high commercial value (per the brief). */
export const HIGH_VALUE_CATEGORIES = new Set<Category>([
  "beauty",
  "dental",
  "barber",
  "restaurant",
  "realestate",
  "education",
  "fitness",
  "clinic",
  "automotive",
  "localservice",
]);

/** Visual / younger-audience businesses that suit Meta & TikTok creative. */
export const VISUAL_CATEGORIES = new Set<Category>(["beauty", "barber", "restaurant", "fitness"]);

/** High search-intent categories that suit Google Ads. */
export const SEARCH_INTENT_CATEGORIES = new Set<Category>([
  "dental",
  "clinic",
  "realestate",
  "automotive",
  "education",
  "localservice",
]);

/** Classify a lead's industry/business_type free text into a category. */
export function classifyCategory(industry: string, businessType: string): Category {
  const hay = `${industry} ${businessType}`.toLowerCase();
  for (const [cat, words] of CATEGORY_KEYWORDS) {
    if (words.some((w) => hay.includes(w))) return cat;
  }
  // Anything with any text we treat as a generic local service business.
  return hay.trim() ? "localservice" : "unknown";
}

/** Human-readable Turkish name for a category (used in reasoning/reports). */
export const CATEGORY_LABEL: Record<Category, string> = {
  beauty: "güzellik/estetik",
  dental: "diş kliniği",
  barber: "kuaför/berber",
  restaurant: "restoran/kafe",
  realestate: "emlak",
  education: "eğitim/kurs",
  fitness: "fitness/pilates",
  clinic: "klinik/sağlık",
  automotive: "oto hizmet",
  localservice: "yerel hizmet",
  unknown: "belirsiz",
};

/** Display names — must exactly match config.allowedOffers. */
export const OFFER_NAMES: Record<OfferKey, string> = {
  website: "Premium Website",
  crm: "AI CRM / Appointment System",
  "google-ads": "Google Ads",
  "meta-ads": "Meta Ads",
  "tiktok-ads": "TikTok Ads",
  seo: "SEO",
  automation: "AI Business Automation",
};

/** Turkish description of each detectable problem (business name added later). */
export const PROBLEM_META: Record<ProblemId, { label: string; sentence: string }> = {
  no_website: {
    label: "Web sitesi yok",
    sentence:
      "İşletmenizin kendine ait profesyonel bir web sitesi göremedim; müşteriler sizi araştırırken güven verecek bir adres bulamıyor.",
  },
  outdated_website: {
    label: "Web sitesi eski",
    sentence:
      "Mevcut web siteniz güncelliğini yitirmiş ve bugünün standartlarının biraz gerisinde görünüyor.",
  },
  weak_mobile: {
    label: "Mobil deneyim zayıf",
    sentence:
      "Siteniz telefonda yavaş açılıyor ve kullanımı zor görünüyor; oysa ziyaretçilerin çoğu mobilden geliyor.",
  },
  no_appointment_flow: {
    label: "Online randevu yok",
    sentence:
      "Randevular yalnızca telefonla alınıyor gibi görünüyor; yoğun saatlerde kaçan aramalar müşteri kaybına dönüşebiliyor.",
  },
  no_online_booking: {
    label: "Online rezervasyon yok",
    sentence:
      "Müşterinin kendi başına rezervasyon/randevu bırakabileceği bir akış göremedim; her talep manuel takip gerektiriyor.",
  },
  no_crm: {
    label: "Müşteri takip sistemi yok",
    sentence:
      "Müşteri bilgileri ve geçmiş işlemlerin tek bir yerde toplandığı bir sistem göremedim.",
  },
  weak_google_presence: {
    label: "Google görünürlüğü zayıf",
    sentence:
      "Google'da aradığımda işletmeniz üst sıralarda kolayca öne çıkmıyor.",
  },
  weak_conversion: {
    label: "Dönüşüm akışı zayıf",
    sentence:
      "Siteye gelen ziyaretçiyi harekete geçirecek net bir yönlendirme (ara / randevu al / teklif iste) eksik görünüyor.",
  },
  no_ads_landing: {
    label: "Reklam açılış sayfası yok",
    sentence:
      "Reklam verildiğinde tıklayan kişi genel bir sayfaya düşüyor; bu da reklam bütçesini verimsiz kullandırıyor.",
  },
  google_ads_potential: {
    label: "Google Ads fırsatı",
    sentence:
      "Sektörünüzde insanlar hizmeti doğrudan Google'da arıyor; şu anda bu talebi karşılayan bir reklamınız görünmüyor.",
  },
  meta_ads_potential: {
    label: "Meta Ads fırsatı",
    sentence:
      "Instagram ve Facebook'ta bölgenizdeki potansiyel müşterilere ulaşan hedefli bir reklam göremedim.",
  },
  tiktok_ads_potential: {
    label: "TikTok Ads fırsatı",
    sentence:
      "Hedef kitleniz TikTok'ta oldukça aktif, ancak burada işletmenizi tanıtan bir çalışma görünmüyor.",
  },
  poor_seo: {
    label: "SEO zayıf",
    sentence:
      "Web siteniz var ama arama sonuçlarında rakiplerinizin gerisinde kalıyor gibi görünüyor.",
  },
  no_clear_offer: {
    label: "Net teklif yok",
    sentence:
      "Sayfanızda ziyaretçiye 'neden sizi seçmeli' sorusunu net yanıtlayan bir mesaj eksik görünüyor.",
  },
  no_whatsapp_cta: {
    label: "WhatsApp butonu yok",
    sentence:
      "Müşterinin tek dokunuşla yazabileceği bir WhatsApp bağlantısı göremedim.",
  },
  no_lead_form: {
    label: "Lead formu yok",
    sentence:
      "Siteye gelen ilgili ziyaretçinin bilgi bırakabileceği bir başvuru/teklif formu göremedim.",
  },
};

/** For each offer: the concrete improvement line + non-misleading subjects. */
export const OFFER_META: Record<
  OfferKey,
  { improvement: string; subjects: string[] }
> = {
  website: {
    improvement:
      "Mobil öncelikli, hızlı açılan ve WhatsApp'a bağlı premium bir web sitesi ile işletmenizi internette çok daha güçlü temsil edebiliriz.",
    subjects: ["{business_name} için kısa bir web sitesi önerisi", "{business_name} için küçük bir demo hazırlayabilirim"],
  },
  crm: {
    improvement:
      "Randevu, müşteri kartı ve otomatik WhatsApp hatırlatmayı tek panelde toplayan bir AI randevu/CRM sistemi ile günlük operasyonu sadeleştirebiliriz.",
    subjects: ["{business_name} için kısa bir randevu/CRM önerisi", "{business_name} için küçük bir online randevu fikri"],
  },
  "google-ads": {
    improvement:
      "Hizmetinizi Google'da arayan kişilere ulaşan, küçük bütçeli ve ölçülebilir bir Google Ads kurgusu ile net taleplere odaklanabiliriz.",
    subjects: ["{business_name} için reklam dönüşüm önerisi", "{business_name} için kısa bir Google Ads fikri"],
  },
  "meta-ads": {
    improvement:
      "Instagram ve Facebook'ta bölgenizdeki doğru kitleye görsel ağırlıklı Meta reklamlarıyla ulaşıp yeni müşteri akışını test edebiliriz.",
    subjects: ["{business_name} için reklam dönüşüm önerisi", "{business_name} için kısa bir Meta reklam fikri"],
  },
  "tiktok-ads": {
    improvement:
      "Kısa videolarla TikTok reklamlarını küçük bütçeyle test edip hangi içeriğin müşteri getirdiğini birlikte ölçebiliriz.",
    subjects: ["{business_name} için kısa bir TikTok reklam fikri", "{business_name} için reklam dönüşüm önerisi"],
  },
  seo: {
    improvement:
      "Teknik düzenlemeler ve yerel SEO ile arama sonuçlarındaki görünürlüğünüzü artırıp organik ziyaretçi kazanabiliriz.",
    subjects: ["{business_name} için kısa bir Google görünürlük önerisi", "Kısa bir dijital iyileştirme fikri"],
  },
  automation: {
    improvement:
      "Tekrar eden işleri (randevu hatırlatma, form takibi, mesaj yanıtları) otomatikleştiren bir yapı ile ekibinizin üzerindeki manuel yükü azaltabiliriz.",
    subjects: ["{business_name} için kısa bir otomasyon fikri", "Kısa bir dijital iyileştirme fikri"],
  },
};

/** Deterministic string hash (so subject choice is stable per lead, no RNG). */
export function stableHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
