"use client";

import {
  Bell,
  CalendarDays,
  CreditCard,
  Crown,
  Gem,
  Heart,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Package,
  Repeat,
  Sparkles,
  Star,
  TrendingUp,
  UserPlus,
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
  Donut,
  FeatureGrid,
  FinalCTA,
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
const APPOINTMENTS = [
  { time: "10:00", name: "Ayşe Demir", service: "Hydrafacial", staff: "Uzm. Derya", tone: "success" as const, label: "Onaylı" },
  { time: "11:30", name: "Elif Yıldız", service: "Lazer Epilasyon", staff: "Esra", tone: "success" as const, label: "Onaylı" },
  { time: "13:00", name: "Zeynep Kaya", service: "Cilt Bakımı", staff: "Uzm. Derya", tone: "warn" as const, label: "Bekliyor" },
  { time: "14:30", name: "Selin Arslan", service: "Bölgesel İncelme", staff: "Buse", tone: "success" as const, label: "Onaylı" },
  { time: "16:00", name: "Merve Şahin", service: "Kaş Laminasyonu", staff: "Esra", tone: "accent" as const, label: "Yeni" },
];

const PACKAGES = [
  { name: "Ayşe Demir", treatment: "Lazer Epilasyon", done: 6, total: 8, next: "12 Tem" },
  { name: "Elif Yıldız", treatment: "Hydrafacial", done: 2, total: 4, next: "08 Tem" },
  { name: "Selin Arslan", treatment: "Bölgesel İncelme", done: 5, total: 10, next: "10 Tem" },
  { name: "Zeynep Kaya", treatment: "Cilt Bakımı", done: 3, total: 6, next: "15 Tem" },
];

const TREATMENTS = [
  { name: "Lazer Epilasyon", count: 42, price: "₺1.200" },
  { name: "Hydrafacial", count: 31, price: "₺900" },
  { name: "Cilt Bakımı", count: 24, price: "₺650" },
  { name: "Bölgesel İncelme", count: 18, price: "₺1.500" },
  { name: "Kalıcı Makyaj", count: 11, price: "₺2.400" },
];

const PROBLEMS = [
  "Paket alan müşterinin kaç seansı kaldığı defterde takip ediliyor; seanslar karışıyor, müşteri 'benim 2 seansım daha vardı' diye itiraz ediyor.",
  "Randevular telefon ve Instagram DM'den geliyor; yoğun günlerde mesajlar kaçıyor, çift kayıt oluyor.",
  "Gelmeyen (no-show) müşteriler yüzünden uzman boşa bekliyor, dolu geçmesi gereken saatler kayboluyor.",
  "Müşterinin cilt geçmişi, alerjileri ve önceki işlemleri hiçbir yerde tutulmuyor; her seferinde sıfırdan soruluyor.",
  "Hangi işlemin daha çok kazandırdığı, günlük gerçek ciro ve paket gelirleri net bilinmiyor.",
  "Paket bitince yeniden satış için kimseyi aramıyorsunuz; sadık müşteri sessizce başka merkeze gidiyor.",
];

const SOLUTIONS = [
  { icon: Package, title: "Paket & Seans Takibi", text: "Her müşterinin kalan seansı tek ekranda. Seans düşürme otomatik; 'kaç hakkım kaldı?' tartışması tamamen biter." },
  { icon: CalendarDays, title: "7/24 Online Randevu", text: "Müşteriler boş saatleri görür, kendi randevusunu alır. Telefon ve DM trafiği biter, takvim kendiliğinden dolar." },
  { icon: Bell, title: "Otomatik WhatsApp Hatırlatma", text: "Randevudan önce hatırlatma gider; no-show oranı düşer, koltuklar boş kalmaz." },
  { icon: Heart, title: "Müşteri & Cilt Kartı", text: "Cilt tipi, alerjiler, kullanılan ürünler ve işlem geçmişi kayıt altında; her seans kişiye özel ilerler." },
  { icon: Wallet, title: "Gelir & Paket Raporu", text: "Günlük/aylık ciro, paket satışları ve en çok kazandıran işlemler net rakamlarla önünüzde." },
  { icon: Repeat, title: "Paket Yenileme & Sadakat", text: "Paketi biten müşteri otomatik hatırlatılır; yeniden satış ve sadakat kampanyaları gözden kaçmaz." },
];

const FEATURES = [
  { icon: Package, title: "Paket & Seans Yönetimi", text: "Kalan seans, geçerlilik ve otomatik seans düşürme tek panelde." },
  { icon: CalendarDays, title: "Online Randevu Takvimi", text: "Boş saatleri gösteren, çakışmayı engelleyen akıllı takvim." },
  { icon: Bell, title: "WhatsApp Hatırlatma", text: "Otomatik randevu hatırlatma, onay ve paket yenileme mesajları." },
  { icon: Heart, title: "Müşteri & Cilt Kartı", text: "Cilt tipi, alerji, ürün ve işlem geçmişiyle kişisel takip." },
  { icon: Users, title: "Uzman Yönetimi", text: "Uzman bazlı program, randevu dağılımı ve performans." },
  { icon: Wallet, title: "Gelir & Paket Raporu", text: "Günlük ve aylık ciro, paket satışı ve işlem kırılımı." },
  { icon: TrendingUp, title: "Performans Paneli", text: "En çok kazandıran işlemler ve yoğun saatler tek bakışta." },
  { icon: Star, title: "Önce / Sonra Galeri", text: "İşlem sonuçlarını sergileyen profesyonel vitrin." },
  { icon: Gem, title: "Sadakat & Kampanya", text: "Düzenli müşterileri geri getiren puan ve indirim modülü." },
];

const PLANS = [
  {
    name: "Başlangıç",
    tagline: "Tek uzman / yeni açılan merkezler için",
    price: "₺",
    period: "/ özel teklif",
    features: [
      "Online randevu takvimi",
      "İşlem & fiyat listesi",
      "WhatsApp ile randevu",
      "Mobil uyumlu merkez sayfası",
    ],
  },
  {
    name: "Profesyonel",
    tagline: "Büyüyen güzellik merkezleri için en popüler seçim",
    price: "₺₺",
    period: "/ özel teklif",
    highlighted: true,
    features: [
      "Başlangıç'taki her şey",
      "Paket & seans takibi",
      "Otomatik WhatsApp hatırlatma",
      "Müşteri & cilt kartları",
      "Gelir & paket raporu",
    ],
  },
  {
    name: "Premium",
    tagline: "Çok şubeli & kurumsal estetik merkezleri",
    price: "₺₺₺",
    period: "/ özel teklif",
    features: [
      "Profesyonel'deki her şey",
      "Çoklu şube yönetimi",
      "Önce/sonra galeri & yorumlar",
      "Sadakat & kampanya modülü",
      "Öncelikli destek & danışmanlık",
    ],
  },
];

const SCENARIO_STEPS = [
  { time: "09:45", text: "Merkez açılmadan Selin Hanım paneli açıyor; günün randevularını, hangi uzmana kimin geleceğini ve bugün hangi paketlerin seansının düşeceğini tek bakışta görüyor." },
  { time: "Gün içi", text: "Yeni müşteri Instagram'dan linke tıklıyor, Hydrafacial için boş saatlerden 16:00'ı seçip kendi randevusunu oluşturuyor. Hiçbir DM kaçmıyor." },
  { time: "Seans sırasında", text: "Ayşe Hanım lazer epilasyon paketinin 6. seansına geliyor; uzman tek tıkla seansı düşürüyor, panelde otomatik '6/8' oluyor, tartışma yok." },
  { time: "Akşam", text: "Kapanışta Selin Hanım günlük ciroyu, satılan paketleri ve en çok kazandıran işlemi rapordan görüyor; biten paketler için ertesi gün otomatik yenileme mesajı planlanıyor." },
];

/* --------------------------- the dashboard mockup --------------------------- */
function BeautyPanel() {
  return (
    <BrowserFrame url="beautycrm.app/pano">
      <div className="grid gap-3 lg:grid-cols-[180px_1fr]">
        {/* sidebar */}
        <aside className="hidden flex-col gap-1 rounded-xl bg-[var(--d-bg-soft)] p-3 lg:flex">
          <div className="mb-2 flex items-center gap-2 px-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--d-accent)] text-[var(--d-accent-fg)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-bold text-[var(--d-fg)]">Beauty CRM</span>
          </div>
          {[
            { icon: LayoutDashboard, label: "Pano", active: true },
            { icon: CalendarDays, label: "Randevular" },
            { icon: Package, label: "Paketler" },
            { icon: Users, label: "Müşteriler" },
            { icon: Layers, label: "İşlemler" },
            { icon: Wallet, label: "Gelir" },
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
            <StatTile label="Bugünkü Randevu" value="12" delta="+4" icon={CalendarDays} />
            <StatTile label="Aktif Paket" value="38" delta="+6" icon={Package} />
            <StatTile label="Günlük Gelir" value="₺18.600" delta="+22%" icon={Wallet} />
            <StatTile label="Yeni Müşteri" value="7" delta="+3" icon={UserPlus} />
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr]">
            {/* appointments */}
            <Panel title="Bugünün Randevuları" action="Tümü">
              <ul className="space-y-2">
                {APPOINTMENTS.map((a) => (
                  <li
                    key={a.time}
                    className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
                  >
                    <span className="w-11 text-[12px] font-semibold tabular-nums text-[var(--d-accent)]">
                      {a.time}
                    </span>
                    <Avatar name={a.name} className="h-8 w-8" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">
                        {a.name}
                      </div>
                      <div className="truncate text-[11px] text-[var(--d-faint)]">
                        {a.service} · {a.staff}
                      </div>
                    </div>
                    <Tag tone={a.tone}>{a.label}</Tag>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* package & session tracking — the signature panel */}
            <Panel title="Paket & Seans Takibi" action="Aktif 38">
              <ul className="space-y-3">
                {PACKAGES.map((p) => {
                  const pct = Math.round((p.done / p.total) * 100);
                  return (
                    <li
                      key={p.name}
                      className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
                    >
                      <Donut value={pct} size={48} label={`${p.done}/${p.total}`} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">
                          {p.name}
                        </div>
                        <div className="truncate text-[11px] text-[var(--d-faint)]">
                          {p.treatment}
                        </div>
                        <div className="mt-1.5 flex items-center justify-between gap-2">
                          <Bar value={pct} className="max-w-[100px]" />
                          <span className="shrink-0 text-[10px] font-medium text-[var(--d-muted)]">
                            Sonraki · {p.next}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
            {/* weekly revenue */}
            <Panel title="Haftalık Gelir">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-[var(--d-fg)]">₺112.400</div>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-pos)]">
                    <TrendingUp className="h-3 w-3" /> geçen haftaya göre +22%
                  </div>
                </div>
                <CreditCard className="h-5 w-5 text-[var(--d-accent)]" />
              </div>
              <Sparkline data={[28, 34, 30, 46, 42, 58, 70]} className="mt-3 h-10" />
            </Panel>

            {/* popular treatments */}
            <Panel title="Popüler İşlemler">
              <ul className="space-y-2.5">
                {TREATMENTS.slice(0, 4).map((t) => (
                  <li key={t.name}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[var(--d-muted)]">{t.name}</span>
                      <span className="font-semibold text-[var(--d-fg)]">{t.count}</span>
                    </div>
                    <Bar value={(t.count / 42) * 100} className="mt-1" />
                  </li>
                ))}
              </ul>
            </Panel>

            {/* before / after gallery */}
            <Panel title="Önce / Sonra" action="Galeri">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative overflow-hidden rounded-xl border border-[var(--d-border)]">
                  <img
                    src="/demos/beauty/skincare-detail.webp"
                    alt="Cilt bakımı öncesi"
                    width={300}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover grayscale"
                  />
                  <span className="absolute bottom-1 left-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                    Önce
                  </span>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-[var(--d-border)]">
                  <img
                    src="/demos/beauty/skincare-detail.webp"
                    alt="Cilt bakımı sonrası"
                    width={300}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 rounded-md bg-[var(--d-accent)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--d-accent-fg)]">
                    Sonra
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--d-muted)]">
                <Heart className="h-3.5 w-3.5 text-[var(--d-accent)]" />
                Cilt Bakımı · 3 seans sonrası
              </div>
            </Panel>
          </div>

          {/* whatsapp reminder */}
          <Panel title="WhatsApp Hatırlatma" action="Otomatik">
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
              <div className="flex items-start gap-3 rounded-xl bg-[#25D366]/10 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#06210f]">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div className="text-[12px] leading-relaxed text-[var(--d-muted)]">
                  <span className="font-semibold text-[var(--d-fg)]">Elif Hanım</span>, yarın
                  <span className="font-semibold text-[var(--d-fg)]"> 11:30</span> Lazer Epilasyon
                  randevunuzu hatırlatırız. Onaylıyor musunuz?
                  <div className="mt-2 flex gap-2">
                    <span className="rounded-full bg-[#25D366] px-2.5 py-1 text-[10px] font-semibold text-[#06210f]">Evet</span>
                    <span className="rounded-full border border-[var(--d-border)] px-2.5 py-1 text-[10px] font-semibold text-[var(--d-muted)]">Ertele</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                    <Package className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Paket bitiyor
                  </span>
                  <span className="font-semibold text-[var(--d-fg)]">Ayşe Demir · 8/8 · yenileme</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                    <Crown className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Sadık müşteri
                  </span>
                  <span className="font-semibold text-[var(--d-fg)]">14. ziyaret · %15 indirim</span>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* --------------------------- page --------------------------- */
export function BeautySite() {
  const img = "/demos/beauty/treatment-room.webp";
  return (
    <DemoShell
      theme={demoThemes.beauty}
      name="Beauty Center CRM"
      sector="Güzellik & Estetik Merkezi CRM"
      serif
    >
      <DemoHero
        sector="Güzellik & Estetik Merkezi CRM"
        name="Beauty Center CRM"
        promise="Müşteri, randevu, paket ve seans takibini tek panelde toplayan güzellik & estetik merkezi CRM'i. Hiçbir seans, hiçbir takip, hiçbir satış kaçmasın."
        image={img}
        serif
      />

      <ProblemSection
        title="Güzellik merkezlerinin her gün yaşadığı gerçek sorunlar"
        items={PROBLEMS}
        soft
      />

      <SolutionSection
        title="Beauty Center CRM bu sorunları nasıl çözüyor?"
        subtitle="Randevu, paket, müşteri ve gelir; dağınık defterler ve DM'ler yerine tek, zarif bir panelde."
        items={SOLUTIONS}
        serif
      />

      <Section
        id="panel"
        eyebrow="Canlı Panel"
        title="Merkezinizi yöneten dijital pano"
        subtitle="Aşağıdaki panel, gerçek bir güzellik merkezinin bir gününü yansıtacak şekilde tasarlandı: randevular, paket & seans takibi, popüler işlemler ve gelir tek ekranda."
        serif
      >
        <DemoStage>
          <BeautyPanel />
        </DemoStage>
      </Section>

      <Section eyebrow="Özellikler" title="Merkeziniz için ihtiyacınız olan her şey" serif>
        <FeatureGrid features={FEATURES} />
      </Section>

      <Section
        eyebrow="Örnek Senaryo"
        title="Bir gün, Beauty Center CRM ile"
        soft
        serif
      >
        <Scenario
          persona="Selin Hanım — Nişantaşı'nda 3 uzmanlı bir güzellik & estetik merkezi işletiyor."
          steps={SCENARIO_STEPS}
        />
      </Section>

      <Section
        eyebrow="Paketler"
        title="İşletmenize göre esnek paketler"
        subtitle="Fiyatlar merkezinizin büyüklüğüne göre belirlenir. Net teklif için bir mesaj yeterli."
        serif
      >
        <PricingCards plans={PLANS} />
      </Section>

      <FinalCTA serif />
    </DemoShell>
  );
}
