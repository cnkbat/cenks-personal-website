"use client";

import {
  Banknote,
  Bell,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Filter,
  Home,
  KeyRound,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  Avatar,
  Bar,
  BrowserFrame,
  DemoHero,
  DemoShell,
  DemoStage,
  FeatureGrid,
  FinalCTA,
  MiniBars,
  Panel,
  PricingCards,
  ProblemSection,
  Scenario,
  Section,
  SolutionSection,
  Sparkline,
  StatTile,
  Tag,
  demoThemes,
} from "@/components/demos/kit";

/* --------------------------- demo data --------------------------- */
const LISTINGS = [
  {
    title: "Bağdat Caddesi Lüks Daire",
    type: "Satılık Daire",
    district: "Kadıköy",
    price: "₺8.450.000",
    rooms: "3+1",
    area: "145 m²",
    agent: "Cem Yılmaz",
    tone: "accent" as const,
    label: "Satılık",
    image: "/demos/estate/apartment-interior.webp",
  },
  {
    title: "Deniz Manzaralı Villa",
    type: "Villa",
    district: "Beşiktaş",
    price: "₺24.900.000",
    rooms: "5+2",
    area: "420 m²",
    agent: "Deniz Ak",
    tone: "accent" as const,
    label: "Satılık",
  },
  {
    title: "Çankaya Eşyalı Rezidans",
    type: "Kiralık Daire",
    district: "Çankaya",
    price: "₺28.500/ay",
    rooms: "2+1",
    area: "98 m²",
    agent: "Pınar Öz",
    tone: "success" as const,
    label: "Kiralık",
  },
  {
    title: "Merkezi Ticari Mağaza",
    type: "Ticari",
    district: "Kadıköy",
    price: "₺4.250.000",
    rooms: "Dükkan",
    area: "120 m²",
    agent: "Cem Yılmaz",
    tone: "soft" as const,
    label: "Satıldı",
  },
];

const PIPELINE = [
  { stage: "Yeni", count: 24, tone: "accent" as const, hint: "Bu hafta gelen" },
  { stage: "Görüşme", count: 13, tone: "warn" as const, hint: "Telefon / ziyaret" },
  { stage: "Teklif", count: 7, tone: "accent" as const, hint: "Pazarlık aşaması" },
  { stage: "Kapandı", count: 4, tone: "success" as const, hint: "Bu ay imzalanan" },
];

const TASKS = [
  { agent: "Cem Yılmaz", text: "Kadıköy dairesi için ekspertiz randevusu", due: "Bugün 14:00", tone: "warn" as const, label: "Bugün" },
  { agent: "Deniz Ak", text: "Villa müşterisine teklif evrakı gönder", due: "Yarın 11:00", tone: "accent" as const, label: "Yarın" },
  { agent: "Pınar Öz", text: "Çankaya kiralık için kira sözleşmesi", due: "Bugün 17:30", tone: "warn" as const, label: "Bugün" },
  { agent: "Cem Yılmaz", text: "Yeni lead — geri arama planla", due: "Cuma 10:00", tone: "soft" as const, label: "Planlı" },
];

const TOP_AGENTS = [
  { name: "Cem Yılmaz", deals: 6, volume: 92 },
  { name: "Deniz Ak", deals: 4, volume: 68 },
  { name: "Pınar Öz", deals: 3, volume: 47 },
];

const PROBLEMS = [
  "İlanlar Sahibinden, Instagram, vitrin ve defter arasında dağınık; hangi portföy güncel belli olmuyor.",
  "Gelen müşteri görüşmeleri kayıt altına alınmıyor; bir danışman ayrılınca tüm lead'ler kayboluyor.",
  "Hangi müşteri hangi aşamada (görüşme, teklif, kapanış) takip edilemiyor, sıcak lead'ler soğuyor.",
  "Komisyon ve satış rakamları Excel'de tutuluyor; danışman performansı net görülemiyor.",
  "Geri arama ve ekspertiz randevuları unutuluyor; müşteri rakip ofise gidiyor.",
  "Portföydeki ev sahipleriyle iletişim kopuk; fiyat güncellemeleri zamanında yansımıyor.",
];

const SOLUTIONS = [
  { icon: Building2, title: "Merkezi Portföy Yönetimi", text: "Satılık, kiralık, villa, arsa ve ticari tüm ilanlar fotoğraf, fiyat ve durumuyla tek panelde toplanır." },
  { icon: Users, title: "Lead & Müşteri Takibi", text: "Her gelen müşteri kaydedilir; Yeni → Görüşme → Teklif → Kapandı aşamalarıyla hiçbir fırsat kaçmaz." },
  { icon: Bell, title: "Otomatik WhatsApp Lead Takibi", text: "Yeni lead geldiğinde danışmana bildirim, müşteriye otomatik karşılama; geri arama hatırlatması." },
  { icon: ClipboardList, title: "Danışman Görev Panosu", text: "Ekspertiz, evrak, sözleşme ve geri arama görevleri danışman bazında planlanır, hiçbiri unutulmaz." },
  { icon: Wallet, title: "Komisyon & Satış Raporu", text: "Aylık satış hacmi, kapanan işlem ve danışman komisyonları gerçek rakamlarla takip edilir." },
  { icon: KeyRound, title: "Ev Sahibi Portalı", text: "Mülk sahibi ilanının kaç kez görüntülendiğini, gelen teklifleri ve süreci şeffaf şekilde izler." },
];

const FEATURES = [
  { icon: Building2, title: "Portföy & İlan Yönetimi", text: "Tüm gayrimenkulleri fotoğraf, konum ve durumla tek yerde yönetin." },
  { icon: Filter, title: "Akıllı Eşleştirme", text: "Müşteri kriterlerine uygun portföyü otomatik öneren filtre." },
  { icon: Users, title: "Lead Pipeline (CRM)", text: "Aşama bazlı müşteri takibi; sıcak fırsatları öne çıkarın." },
  { icon: Bell, title: "WhatsApp Lead Bildirimi", text: "Yeni lead ve geri arama hatırlatmaları anında danışmana gider." },
  { icon: ClipboardList, title: "Görev & Randevu", text: "Ekspertiz, evrak ve sözleşme görevlerini takvimle planlayın." },
  { icon: Wallet, title: "Komisyon Takibi", text: "Danışman bazlı komisyon ve aylık satış hacmi raporu." },
  { icon: TrendingUp, title: "Performans Paneli", text: "En çok satan danışman, bölge ve ilan tipi analizi." },
  { icon: MapPin, title: "Bölge & Harita", text: "İlanları Kadıköy, Beşiktaş, Çankaya gibi bölgelere göre gruplayın." },
  { icon: KeyRound, title: "Ev Sahibi Portalı", text: "Mülk sahiplerine şeffaf süreç ve görüntülenme raporu." },
];

const PLANS = [
  {
    name: "Başlangıç",
    tagline: "Tek danışman / yeni açılan emlak ofisleri için",
    price: "₺",
    period: "/ özel teklif",
    features: [
      "Portföy & ilan yönetimi",
      "Temel lead kaydı",
      "WhatsApp ile müşteri iletişimi",
      "Mobil uyumlu ofis vitrini",
    ],
  },
  {
    name: "Profesyonel",
    tagline: "Büyüyen emlak ofisleri için en popüler seçim",
    price: "₺₺",
    period: "/ özel teklif",
    highlighted: true,
    features: [
      "Başlangıç'taki her şey",
      "Lead Pipeline (CRM) & aşama takibi",
      "Otomatik WhatsApp lead bildirimi",
      "Danışman görev panosu & randevular",
      "Komisyon & satış raporu",
    ],
  },
  {
    name: "Premium",
    tagline: "Çok şubeli & kurumsal emlak markaları",
    price: "₺₺₺",
    period: "/ özel teklif",
    features: [
      "Profesyonel'deki her şey",
      "Çoklu şube & danışman ekipleri",
      "Ev sahibi portalı & şeffaf raporlama",
      "Akıllı portföy-müşteri eşleştirme",
      "Öncelikli destek & danışmanlık",
    ],
  },
];

const SCENARIO_STEPS = [
  { time: "09:00", text: "Cem Bey ofise gelir gelmez paneli açıyor; gece gelen 3 yeni lead'i, bekleyen teklifleri ve günün ekspertiz randevusunu tek bakışta görüyor." },
  { time: "Gün içi", text: "Sahibinden ilanına gelen bir müşteri WhatsApp'tan yazıyor; lead otomatik pipeline'a 'Yeni' olarak düşüyor, danışmana anında bildirim gidiyor." },
  { time: "Öğleden sonra", text: "Müşteri Bağdat Caddesi dairesini beğeniyor; Cem Bey lead'i 'Teklif' aşamasına taşıyor, sistem teklif evrakını ve geri arama görevini oluşturuyor." },
  { time: "Akşam", text: "Kapanışta yönetici panelden ayın satış hacmini, kapanan 4 işlemi ve danışman komisyonlarını rapordan görüyor; hiçbir şey Excel'e yazılmıyor." },
];

/* --------------------------- the dashboard mockup --------------------------- */
function EstatePanel() {
  return (
    <BrowserFrame url="estateos.app/pano">
      <div className="grid gap-3 lg:grid-cols-[190px_1fr]">
        {/* sidebar */}
        <aside className="hidden flex-col gap-1 rounded-xl bg-[var(--d-bg-soft)] p-3 lg:flex">
          <div className="mb-2 flex items-center gap-2 px-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--d-accent)] text-[var(--d-accent-fg)]">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-bold text-[var(--d-fg)]">EstateOS</span>
          </div>
          {[
            { icon: LayoutDashboard, label: "Pano", active: true },
            { icon: Home, label: "Portföy" },
            { icon: Users, label: "Lead'ler" },
            { icon: ClipboardList, label: "Görevler" },
            { icon: Wallet, label: "Komisyon" },
            { icon: MapPin, label: "Bölgeler" },
          ].map((n) => (
            <span
              key={n.label}
              className={
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium " +
                (n.active
                  ? "bg-[var(--d-accent)]/15 text-[var(--d-accent)]"
                  : "text-[var(--d-muted)]")
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </span>
          ))}
        </aside>

        {/* main */}
        <div className="space-y-3">
          {/* stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Aktif Portföy" value="148" delta="+9" icon={Building2} />
            <StatTile label="Bu Ay Satış" value="4" delta="+1" icon={KeyRound} />
            <StatTile label="Toplam Komisyon" value="₺1.24M" delta="+22%" icon={Wallet} />
            <StatTile label="Yeni Lead" value="24" delta="+6" icon={Users} />
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
            {/* portfolio / listings */}
            <Panel title="Portföy / İlanlar" action="Tümü">
              <ul className="space-y-2">
                {LISTINGS.map((l) => (
                  <li
                    key={l.title}
                    className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] p-2.5"
                  >
                    {l.image ? (
                      <img
                        src={l.image}
                        alt={l.title}
                        width={56}
                        height={56}
                        loading="lazy"
                        decoding="async"
                        className="h-12 w-14 shrink-0 rounded-lg border border-[var(--d-border)] object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg border border-[var(--d-border)] bg-[var(--d-bg-soft)] text-[var(--d-accent)]">
                        <Building2 className="h-5 w-5" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[12.5px] font-semibold text-[var(--d-fg)]">
                          {l.title}
                        </span>
                        <Tag tone={l.tone}>{l.label}</Tag>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[var(--d-faint)]">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">
                          {l.type} · {l.district} · {l.rooms} · {l.area}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[12.5px] font-bold tabular-nums text-[var(--d-accent)]">
                        {l.price}
                      </div>
                      <div className="text-[10px] text-[var(--d-faint)]">{l.agent}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* right column: commission + top agents */}
            <div className="space-y-3">
              <Panel title="Komisyon (Aylık)">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[var(--d-fg)]">₺1.24M</div>
                    <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-pos)]">
                      <TrendingUp className="h-3 w-3" /> geçen aya göre +22%
                    </div>
                  </div>
                  <Banknote className="h-5 w-5 text-[var(--d-accent)]" />
                </div>
                <Sparkline data={[42, 55, 48, 63, 71, 66, 88]} className="mt-3 h-10" />
                <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--d-faint)]">
                  <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span>May</span><span>Haz</span><span>Tem</span>
                </div>
              </Panel>

              <Panel title="Danışman Performansı" action="Bu Ay">
                <ul className="space-y-2.5">
                  {TOP_AGENTS.map((a) => (
                    <li key={a.name}>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                          <Avatar name={a.name} className="h-6 w-6 text-[10px]" />
                          {a.name}
                        </span>
                        <span className="font-semibold text-[var(--d-fg)]">{a.deals} işlem</span>
                      </div>
                      <Bar value={a.volume} className="mt-1.5" />
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>

          {/* lead pipeline */}
          <Panel title="Lead Pipeline" action="Bu Hafta">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {PIPELINE.map((p, i) => (
                <div
                  key={p.stage}
                  className="relative rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--d-muted)]">
                      {p.stage}
                    </span>
                    {i < PIPELINE.length - 1 && (
                      <span className="hidden text-[var(--d-faint)] sm:inline">→</span>
                    )}
                  </div>
                  <div className="mt-2 text-2xl font-bold tabular-nums text-[var(--d-fg)]">
                    {p.count}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] text-[var(--d-faint)]">{p.hint}</span>
                    <Tag tone={p.tone}>müşteri</Tag>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[11px] text-[var(--d-faint)]">Dönüşüm akışı</span>
              <MiniBars data={[24, 13, 7, 4]} className="h-8 flex-1" />
            </div>
          </Panel>

          {/* tasks + whatsapp */}
          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
            <Panel title="Danışman Görevleri" action="Bugün">
              <ul className="space-y-2">
                {TASKS.map((t) => (
                  <li
                    key={t.text}
                    className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--d-accent)]/15 text-[var(--d-accent)]">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">
                        {t.text}
                      </div>
                      <div className="inline-flex items-center gap-1 truncate text-[11px] text-[var(--d-faint)]">
                        <CalendarClock className="h-3 w-3" />
                        {t.agent} · {t.due}
                      </div>
                    </div>
                    <Tag tone={t.tone}>{t.label}</Tag>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="WhatsApp Lead Takibi" action="Otomatik">
              <div className="flex items-start gap-3 rounded-xl bg-[#25D366]/10 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#06210f]">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div className="text-[12px] leading-relaxed text-[var(--d-muted)]">
                  Merhaba <span className="font-semibold text-[var(--d-fg)]">Selin Hanım</span>,
                  Kadıköy'deki <span className="font-semibold text-[var(--d-fg)]">3+1 Satılık Daire</span> için
                  ilginiz için teşekkürler. Yarın bir görüşme ayarlayalım mı?
                  <div className="mt-2 flex gap-2">
                    <span className="rounded-full bg-[#25D366] px-2.5 py-1 text-[10px] font-semibold text-[#06210f]">
                      Evet, uygun
                    </span>
                    <span className="rounded-full border border-[var(--d-border)] px-2.5 py-1 text-[10px] font-semibold text-[var(--d-muted)]">
                      Sonra ara
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                  <Phone className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Geri arama
                </span>
                <span className="font-semibold text-[var(--d-fg)]">Cem Yılmaz · 14:00</span>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                  <Star className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Sıcak lead
                </span>
                <span className="font-semibold text-[var(--d-fg)]">Bütçe ₺8M · Teklif aşaması</span>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* --------------------------- page --------------------------- */
export function EstateSite() {
  const img = "/demos/estate/villa-exterior.webp";
  return (
    <DemoShell
      theme={demoThemes.estate}
      name="EstateOS"
      sector="Emlak Yönetim Platformu"
      serif
    >
      <DemoHero
        sector="Emlak Yönetim Platformu"
        name="EstateOS"
        promise="Portföy, ilanlar, müşteri takibi ve lead'leri tek platformda yöneten emlak işletme sistemi. Dağınık ilanlar ve kaçan müşteri görüşmeleri sona ersin."
        image={img}
        serif
      />

      <ProblemSection
        title="Emlak ofislerinin her gün yaşadığı gerçek sorunlar"
        items={PROBLEMS}
        soft
      />

      <SolutionSection
        title="EstateOS bu sorunları nasıl çözüyor?"
        subtitle="Portföy, lead, görev ve komisyon; dağınık ilanlar ve Excel tabloları yerine tek, akıllı bir platformda."
        items={SOLUTIONS}
        serif
      />

      <Section
        id="panel"
        eyebrow="Canlı Panel"
        title="Ofisinizi yöneten emlak panosu"
        subtitle="Aşağıdaki panel, gerçek bir emlak ofisinin bir gününü yansıtacak şekilde tasarlandı: aktif portföy, lead pipeline, danışman görevleri ve komisyon tek ekranda."
        serif
      >
        <DemoStage>
          <EstatePanel />
        </DemoStage>
      </Section>

      <Section eyebrow="Özellikler" title="Emlak ofisiniz için ihtiyacınız olan her şey" serif>
        <FeatureGrid features={FEATURES} />
      </Section>

      <Section eyebrow="Örnek Senaryo" title="Bir iş günü, EstateOS ile" soft serif>
        <Scenario
          persona="Cem Yılmaz — Kadıköy'de 3 danışmanlı bir emlak ofisi yönetiyor."
          steps={SCENARIO_STEPS}
        />
      </Section>

      <Section
        eyebrow="Paketler"
        title="Ofisinize göre esnek paketler"
        subtitle="Fiyatlar ekip büyüklüğünüze ve portföy hacminize göre belirlenir. Net teklif için bir mesaj yeterli."
        serif
      >
        <PricingCards plans={PLANS} />
      </Section>

      <FinalCTA serif />
    </DemoShell>
  );
}
