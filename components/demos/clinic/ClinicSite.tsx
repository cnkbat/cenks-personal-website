"use client";

import {
  Activity,
  Bell,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  HeartPulse,
  LayoutDashboard,
  MessageCircle,
  Receipt,
  Stethoscope,
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
const CLINIC_TYPES = ["Diş Kliniği", "Fizik Tedavi", "Diyetisyen", "Özel Muayenehane"];

const SCHEDULE = [
  { time: "09:00", name: "Ayşe Kılıç", treatment: "Kontrol Muayenesi", doctor: "Dr. Mehmet Aydın", tone: "success" as const, label: "Tamamlandı" },
  { time: "09:45", name: "Hasan Yıldız", treatment: "Dolgu", doctor: "Dr. Mehmet Aydın", tone: "success" as const, label: "Tamamlandı" },
  { time: "10:30", name: "Zeynep Arslan", treatment: "Fizik Tedavi Seansı", doctor: "Dr. Selin Korkmaz", tone: "accent" as const, label: "Onaylı" },
  { time: "11:15", name: "Emre Doğan", treatment: "Diyet Kontrolü", doctor: "Dr. Selin Korkmaz", tone: "accent" as const, label: "Onaylı" },
  { time: "13:30", name: "Fatma Şen", treatment: "Diş Çekimi", doctor: "Dr. Burak Şahin", tone: "warn" as const, label: "Bekliyor" },
  { time: "14:15", name: "Ali Çelik", treatment: "Kanal Tedavisi", doctor: "Dr. Burak Şahin", tone: "warn" as const, label: "Bekliyor" },
];

const WAITING = [
  { name: "Merve Aksoy", note: "Sıra No 4 · Dr. Mehmet Aydın", waited: "8 dk", tone: "accent" as const, label: "Sırada" },
  { name: "Kerem Polat", note: "İlk muayene · Evrak bekliyor", waited: "12 dk", tone: "warn" as const, label: "Kayıt" },
  { name: "Selin Yavuz", note: "Kontrol · Dr. Selin Korkmaz", waited: "3 dk", tone: "accent" as const, label: "Sırada" },
];

const PAYMENTS = [
  { name: "Ayşe Kılıç", treatment: "Kontrol Muayenesi", amount: "₺850", tone: "success" as const, label: "Ödendi" },
  { name: "Hasan Yıldız", treatment: "Dolgu", amount: "₺1.200", tone: "success" as const, label: "Ödendi" },
  { name: "Zeynep Arslan", treatment: "Fizik Tedavi (10 seans)", amount: "₺6.500", tone: "warn" as const, label: "Bekliyor" },
  { name: "Ali Çelik", treatment: "Kanal Tedavisi", amount: "₺3.400", tone: "warn" as const, label: "Bekliyor" },
];

const DOCTORS = [
  { name: "Dr. Mehmet Aydın", role: "Diş Hekimi", today: 12, fill: 92 },
  { name: "Dr. Selin Korkmaz", role: "Fizyoterapist", today: 9, fill: 78 },
  { name: "Dr. Burak Şahin", role: "Diş Hekimi", today: 8, fill: 64 },
];

const PROBLEMS = [
  "Randevular telefon ve deftere yazılıyor; aynı saate iki hasta yazılıyor, çakışmalar kapıda fark ediliyor.",
  "Hasta dosyaları kâğıt klasörlerde; geçmiş tedavi, reçete ve notlara ulaşmak dakikalar alıyor.",
  "Gelmeyen (no-show) hastalar yüzünden hekim koltuğu boş kalıyor, gün planı bozuluyor.",
  "Ödeme ve taksit takibi Excel'de; kimin borcu var, hangi tahsilat yapıldı net görünmüyor.",
  "Hatırlatma manuel yapılıyor; sekreter tek tek arıyor, çoğu hasta randevuyu unutuyor.",
  "Günlük hasta sayısı, doluluk ve ciro tek bir yerden görünmüyor; klinik körü körüne yönetiliyor.",
];

const SOLUTIONS = [
  { icon: CalendarDays, title: "Çakışmasız Hekim Takvimi", text: "Her hekimin müsait saatleri tek ekranda; sistem aynı slota ikinci randevuyu otomatik engeller." },
  { icon: FileText, title: "Dijital Hasta Dosyası", text: "Geçmiş tedaviler, reçeteler, radyografi notları ve alerjiler tek tıkla; arşivde kaybolan dosya kalmaz." },
  { icon: Bell, title: "Otomatik WhatsApp / SMS Hatırlatma", text: "Randevudan önce otomatik hatırlatma gider; no-show oranı ve boş koltuk belirgin düşer." },
  { icon: CreditCard, title: "Ödeme & Taksit Takibi", text: "Tahsil edilen, bekleyen ve taksitli ödemeler tek panelde; hiçbir alacak gözden kaçmaz." },
  { icon: Users, title: "Sıra & Bekleyen Hasta Yönetimi", text: "Bekleme salonundaki hastalar canlı listede; hangi hekime kim sırada anında belli." },
  { icon: TrendingUp, title: "Doluluk & Ciro Raporu", text: "Günlük hasta sayısı, hekim doluluğu ve tahsilat net rakamlarla; klinik veriyle yönetilir." },
];

const FEATURES = [
  { icon: CalendarDays, title: "Hekim Randevu Takvimi", text: "Hekim bazlı, çakışmayı engelleyen çok takvimli randevu sistemi." },
  { icon: FileText, title: "Hasta Kayıt & Dosya", text: "Demografik bilgi, tedavi geçmişi ve notlar tek kartta." },
  { icon: Bell, title: "WhatsApp & SMS Hatırlatma", text: "Otomatik randevu hatırlatma, onay ve kontrol çağrısı." },
  { icon: CreditCard, title: "Ödeme & Taksit", text: "Tahsilat, bekleyen alacak ve taksit planı yönetimi." },
  { icon: ClipboardList, title: "Tedavi Planı", text: "Çok seanslı tedavileri planlayın, ilerlemeyi izleyin." },
  { icon: Receipt, title: "Fatura & Makbuz", text: "Hizmet kalemiyle otomatik makbuz ve gün sonu kasa." },
  { icon: Activity, title: "Doluluk Paneli", text: "Hekim doluluğu, yoğun saatler ve boş slotlar." },
  { icon: HeartPulse, title: "Kontrol Hatırlatma", text: "6 ay sonrası kontrolü unutmayın; hasta otomatik geri gelir." },
  { icon: Stethoscope, title: "Çok Branş Desteği", text: "Diş, fizik tedavi, diyetisyen ve muayenehaneye uygun." },
];

const PLANS = [
  {
    name: "Başlangıç",
    tagline: "Tek hekimli muayenehaneler için",
    price: "₺",
    period: "/ özel teklif",
    features: [
      "Hekim randevu takvimi",
      "Dijital hasta kaydı",
      "WhatsApp ile randevu",
      "Mobil uyumlu klinik sayfası",
    ],
  },
  {
    name: "Profesyonel",
    tagline: "Büyüyen klinikler için en popüler seçim",
    price: "₺₺",
    period: "/ özel teklif",
    highlighted: true,
    features: [
      "Başlangıç'taki her şey",
      "Çok hekimli çakışmasız takvim",
      "Otomatik WhatsApp / SMS hatırlatma",
      "Ödeme & taksit takibi",
      "Doluluk & ciro raporu",
    ],
  },
  {
    name: "Premium",
    tagline: "Çok şubeli & kurumsal sağlık merkezleri",
    price: "₺₺₺",
    period: "/ özel teklif",
    features: [
      "Profesyonel'deki her şey",
      "Çoklu şube & branş yönetimi",
      "Tedavi planı & seans takibi",
      "Fatura, makbuz & kasa modülü",
      "Öncelikli destek & danışmanlık",
    ],
  },
];

const SCENARIO_STEPS = [
  { time: "08:45", text: "Klinik açılmadan sekreter paneli açıyor; günün 24 randevusunu, hangi hekime kimin geleceğini ve boş slotları tek bakışta görüyor." },
  { time: "Gün içi", text: "Yeni hasta kliniğin linkinden Dr. Selin Korkmaz'ın boş saatlerini görüp 11:15'i seçiyor, kaydını kendisi oluşturuyor. Çakışma olmuyor, telefon çalmıyor." },
  { time: "1 gün önce", text: "Sistem ertesi günün tüm hastalarına otomatik WhatsApp hatırlatması gönderiyor; bir hasta saatini değiştiriyor, koltuk boşa düşmüyor." },
  { time: "Akşam", text: "Kapanışta sekreter günlük hasta sayısını, hekim doluluğunu ve günün tahsilatını rapordan görüyor; bekleyen ödemeleri tek tıkla hatırlatıyor." },
];

/* --------------------------- the dashboard mockup --------------------------- */
function ClinicPanel() {
  return (
    <BrowserFrame url="clinicos.app/pano">
      <div className="grid gap-3 lg:grid-cols-[180px_1fr]">
        {/* sidebar */}
        <aside className="hidden flex-col gap-1 rounded-xl bg-[var(--d-bg-soft)] p-3 lg:flex">
          <div className="mb-2 flex items-center gap-2 px-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--d-accent)] text-[var(--d-accent-fg)]">
              <Stethoscope className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-bold text-[var(--d-fg)]">ClinicOS</span>
          </div>
          {[
            { icon: LayoutDashboard, label: "Pano", active: true },
            { icon: CalendarDays, label: "Randevular" },
            { icon: Users, label: "Hastalar" },
            { icon: ClipboardList, label: "Tedaviler" },
            { icon: Wallet, label: "Ödemeler" },
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
          <div className="mt-3 border-t border-[var(--d-border)] pt-3">
            <div className="px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--d-faint)]">
              Branşlar
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5 px-1">
              {CLINIC_TYPES.map((t, i) => (
                <span
                  key={t}
                  className={
                    "rounded-full px-2 py-0.5 text-[10px] font-medium " +
                    (i === 0
                      ? "bg-[var(--d-accent)]/15 text-[var(--d-accent)]"
                      : "border border-[var(--d-border)] text-[var(--d-muted)]")
                  }
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* main */}
        <div className="space-y-3">
          {/* stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Bugünkü Hasta" value="24" delta="+4" icon={Users} />
            <StatTile label="Doluluk" value="%82" delta="+9%" icon={Activity} />
            <StatTile label="Günlük Tahsilat" value="₺18.400" delta="+14%" icon={Wallet} />
            <StatTile label="Yeni Kayıt" value="6" delta="+3" icon={UserPlus} />
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
            {/* schedule */}
            <Panel title="Hekim Takvimi · Günün Programı" action="Bugün">
              <ul className="space-y-2">
                {SCHEDULE.map((a) => (
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
                        {a.treatment} · {a.doctor}
                      </div>
                    </div>
                    <Tag tone={a.tone}>{a.label}</Tag>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* right column */}
            <div className="space-y-3">
              <Panel title="Haftalık Tahsilat">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[var(--d-fg)]">₺96.300</div>
                    <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-pos)]">
                      <TrendingUp className="h-3 w-3" /> geçen haftaya göre +14%
                    </div>
                  </div>
                  <Receipt className="h-5 w-5 text-[var(--d-accent)]" />
                </div>
                <Sparkline data={[28, 35, 30, 44, 40, 55, 63]} className="mt-3 h-10" />
              </Panel>

              <Panel title="Genel Doluluk">
                <div className="flex items-center gap-4">
                  <Donut value={82} size={72} label="%82" />
                  <div className="flex-1 space-y-1.5 text-[11px] text-[var(--d-muted)]">
                    <div className="flex items-center justify-between">
                      <span>Dolu slot</span>
                      <span className="font-semibold text-[var(--d-fg)]">29 / 35</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Boş slot</span>
                      <span className="font-semibold text-[var(--d-fg)]">6</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>İptal / No-show</span>
                      <span className="font-semibold text-[var(--d-fg)]">1</span>
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          </div>

          {/* doctors + waiting + payments */}
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
            <Panel title="Hekim Doluluğu" action="Bugün">
              <div className="space-y-3">
                {DOCTORS.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <Avatar name={d.name} className="h-8 w-8" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="truncate font-medium text-[var(--d-fg)]">{d.name}</span>
                        <span className="font-semibold text-[var(--d-fg)]">%{d.fill}</span>
                      </div>
                      <div className="text-[10px] text-[var(--d-faint)]">
                        {d.role} · {d.today} hasta
                      </div>
                      <Bar value={d.fill} className="mt-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Bekleyen Hastalar" action="Canlı">
              <ul className="space-y-2">
                {WAITING.map((w) => (
                  <li
                    key={w.name}
                    className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
                  >
                    <Avatar name={w.name} className="h-8 w-8" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">
                        {w.name}
                      </div>
                      <div className="truncate text-[11px] text-[var(--d-faint)]">{w.note}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Tag tone={w.tone}>{w.label}</Tag>
                      <span className="text-[10px] text-[var(--d-faint)]">{w.waited}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* payments + whatsapp */}
          <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
            <Panel title="Ödeme Takibi" action="Tümü">
              <ul className="space-y-2">
                {PAYMENTS.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--d-accent)]/12 text-[var(--d-accent)]">
                      <Wallet className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">
                        {p.name}
                      </div>
                      <div className="truncate text-[11px] text-[var(--d-faint)]">{p.treatment}</div>
                    </div>
                    <span className="text-[12.5px] font-semibold tabular-nums text-[var(--d-fg)]">
                      {p.amount}
                    </span>
                    <Tag tone={p.tone}>{p.label}</Tag>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="WhatsApp / SMS Hatırlatma" action="Otomatik">
              <div className="flex items-start gap-3 rounded-xl bg-[#25D366]/10 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#06210f]">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div className="text-[12px] leading-relaxed text-[var(--d-muted)]">
                  <span className="font-semibold text-[var(--d-fg)]">Fatma Hanım</span>, yarın
                  <span className="font-semibold text-[var(--d-fg)]"> 13:30</span> Dr. Burak Şahin ile
                  diş çekimi randevunuzu hatırlatırız. Onaylıyor musunuz?
                  <div className="mt-2 flex gap-2">
                    <span className="rounded-full bg-[#25D366] px-2.5 py-1 text-[10px] font-semibold text-[#06210f]">Onayla</span>
                    <span className="rounded-full border border-[var(--d-border)] px-2.5 py-1 text-[10px] font-semibold text-[var(--d-muted)]">Ertele</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                  <CalendarCheck className="h-3.5 w-3.5 text-[var(--d-accent)]" /> 6 ay kontrol
                </span>
                <span className="font-semibold text-[var(--d-fg)]">8 hastaya otomatik gönderildi</span>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* --------------------------- page --------------------------- */
export function ClinicSite() {
  const hero = "/demos/clinic/reception.webp";
  const treatment = "/demos/clinic/treatment-room.webp";
  return (
    <DemoShell
      theme={demoThemes.clinic}
      name="ClinicOS"
      sector="Klinik & Hasta Yönetim Sistemi"
    >
      <DemoHero
        sector="Klinik & Hasta Yönetim Sistemi"
        name="ClinicOS"
        promise="Hekim takvimi, hasta kayıtları, randevu akışı ve ödeme takibini tek ekranda birleştiren klinik yönetim sistemi. Çakışan randevular ve manuel takip yükü bitsin."
        image={hero}
      />

      <ProblemSection
        title="Kliniklerin her gün yaşadığı gerçek sorunlar"
        items={PROBLEMS}
        soft
      />

      <SolutionSection
        title="ClinicOS bu sorunları nasıl çözüyor?"
        subtitle="Randevu, hasta dosyası, hekim takvimi ve ödeme; dağınık defterler ve Excel yerine tek, akıllı bir panelde."
        items={SOLUTIONS}
      />

      <Section
        id="panel"
        eyebrow="Canlı Panel"
        title="Kliniğinizi yöneten dijital pano"
        subtitle="Aşağıdaki panel, gerçek bir kliniğin bir gününü yansıtacak şekilde tasarlandı: hekim takvimi, bekleyen hastalar, ödeme takibi ve doluluk tek ekranda."
      >
        <DemoStage>
          <ClinicPanel />
        </DemoStage>

        {/* secondary image — branch / room preview */}
        <div className="mt-6 grid items-center gap-5 rounded-3xl border border-[var(--d-border)] bg-[var(--d-surface)] p-5 sm:grid-cols-[0.9fr_1.1fr] sm:p-6">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rounded-[1.6rem] blur-2xl"
              style={{ background: "var(--d-ring)" }}
            />
            <img
              src={treatment}
              alt="Klinik tedavi odası"
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-2xl border border-[var(--d-border)] object-cover"
            />
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--d-accent)]">
              Her Branşa Uygun
            </div>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--d-fg)] sm:text-2xl">
              Diş kliniğinden fizik tedaviye, tek sistem
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--d-muted)]">
              ClinicOS; diş klinikleri, fizik tedavi merkezleri, diyetisyenler ve özel
              muayenehaneler için aynı temiz akışı sunar. Her hekimin takvimi, her hastanın
              dosyası ve her tahsilatın takibi tek ekranda toplanır.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {CLINIC_TYPES.map((t) => (
                <Tag key={t} tone="soft">
                  {t}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Özellikler" title="Kliniğiniz için ihtiyacınız olan her şey">
        <FeatureGrid features={FEATURES} />
      </Section>

      <Section eyebrow="Örnek Senaryo" title="Bir gün, ClinicOS ile" soft>
        <Scenario
          persona="Dr. Mehmet Aydın — 3 hekimli bir ağız ve diş sağlığı kliniği işletiyor."
          steps={SCENARIO_STEPS}
        />
      </Section>

      <Section
        eyebrow="Paketler"
        title="Kliniğinize göre esnek paketler"
        subtitle="Fiyatlar kliniğinizin hekim sayısına ve branşına göre belirlenir. Net teklif için bir mesaj yeterli."
      >
        <PricingCards plans={PLANS} />
      </Section>

      <FinalCTA />
    </DemoShell>
  );
}
