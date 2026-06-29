"use client";

import {
  Bell,
  CalendarDays,
  Clock,
  Coins,
  Crown,
  Images,
  LayoutDashboard,
  MessageCircle,
  Repeat,
  Scissors,
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
const APPOINTMENTS = [
  { time: "09:30", name: "Ahmet Yılmaz", service: "Saç Kesimi", staff: "Ahmet Usta", tone: "success" as const, label: "Onaylı" },
  { time: "10:15", name: "Mert Kaya", service: "Sakal Tasarımı", staff: "Emre", tone: "success" as const, label: "Onaylı" },
  { time: "11:00", name: "Burak Demir", service: "Damat Tıraşı", staff: "Ahmet Usta", tone: "warn" as const, label: "Bekliyor" },
  { time: "13:30", name: "Caner Şahin", service: "Saç + Sakal", staff: "Selim", tone: "success" as const, label: "Onaylı" },
  { time: "15:00", name: "Onur Aydın", service: "Keratin Bakımı", staff: "Emre", tone: "accent" as const, label: "Yeni" },
];

const SERVICES = [
  { name: "Saç Kesimi", count: 38, price: "₺250" },
  { name: "Sakal Tasarımı", count: 27, price: "₺150" },
  { name: "Saç + Sakal", count: 21, price: "₺350" },
  { name: "Damat Tıraşı", count: 9, price: "₺400" },
  { name: "Keratin Bakımı", count: 6, price: "₺900" },
];

const STAFF = [
  { name: "Ahmet Usta", role: "Kuaför", today: 11, blocks: [1, 1, 0, 1, 1, 1, 0, 1] },
  { name: "Emre", role: "Berber", today: 9, blocks: [0, 1, 1, 1, 0, 1, 1, 1] },
  { name: "Selim", role: "Berber", today: 7, blocks: [1, 0, 1, 1, 1, 0, 1, 0] },
];

const PROBLEMS = [
  "Randevular telefonla alınıyor; yoğun saatlerde telefon susmuyor, müşteri bekletiliyor.",
  "Gelmeyen (no-show) müşteriler yüzünden koltuklar boş kalıyor, kazanç düşüyor.",
  "Personel programı kâğıtta; kim ne zaman müsait belli olmuyor, çakışmalar yaşanıyor.",
  "Müşteri geçmişi (tercih edilen kesim, son geliş) hiçbir yerde tutulmuyor.",
  "Günlük ciro ve popüler hizmetler deftere yazılıyor; gerçek rakamlar net değil.",
  "Hatırlatma yapılmıyor; müşteri randevusunu unutuyor, tekrar gelişler takip edilemiyor.",
];

const SOLUTIONS = [
  { icon: CalendarDays, title: "7/24 Online Randevu", text: "Müşteriler boş saatleri görüp kendi randevusunu alır. Telefon trafiği biter, takvim otomatik dolar." },
  { icon: Bell, title: "Otomatik WhatsApp Hatırlatma", text: "Randevudan önce otomatik hatırlatma gider; no-show oranı belirgin şekilde düşer." },
  { icon: Users, title: "Personel & Vardiya Yönetimi", text: "Her personelin programı tek ekranda; çakışma olmadan koltuklar verimli planlanır." },
  { icon: Scissors, title: "Müşteri Kartları & Geçmiş", text: "Her müşterinin tercih ettiği kesim, geliş sıklığı ve notları kayıt altında." },
  { icon: Wallet, title: "Gelir & Performans Takibi", text: "Günlük/haftalık ciro, en çok tercih edilen hizmetler ve personel performansı net rakamlarla." },
  { icon: Images, title: "Önce / Sonra Galeri", text: "Yapılan işleri sergileyen galeri ile yeni müşteri güveni ve sosyal medya içeriği." },
];

const FEATURES = [
  { icon: CalendarDays, title: "Online Randevu Takvimi", text: "Boş saatleri gösteren, çakışmayı engelleyen akıllı takvim." },
  { icon: Bell, title: "WhatsApp Hatırlatma", text: "Otomatik randevu hatırlatma ve onay mesajları." },
  { icon: Users, title: "Personel Yönetimi", text: "Vardiya, izin ve personel bazlı randevu dağılımı." },
  { icon: Scissors, title: "Hizmet & Fiyat Listesi", text: "Hizmetleri, süreleri ve fiyatları tek yerden yönetin." },
  { icon: Star, title: "Müşteri Kartları", text: "Geçmiş, tercihler ve notlarla kişisel hizmet." },
  { icon: Wallet, title: "Gelir Raporu", text: "Günlük ve aylık ciro, hizmet kırılımı ile." },
  { icon: TrendingUp, title: "Performans Paneli", text: "En çok tercih edilen hizmetler ve yoğun saatler." },
  { icon: Repeat, title: "Tekrar Randevu & Sadakat", text: "Düzenli müşterileri geri getiren hatırlatmalar." },
  { icon: Images, title: "Önce / Sonra Galeri", text: "İşlerinizi sergileyen profesyonel vitrin." },
];

const PLANS = [
  {
    name: "Başlangıç",
    tagline: "Tek koltuk / yeni açılan salonlar için",
    price: "₺",
    period: "/ özel teklif",
    features: ["Online randevu takvimi", "Hizmet & fiyat listesi", "WhatsApp ile randevu", "Mobil uyumlu salon sayfası"],
  },
  {
    name: "Profesyonel",
    tagline: "Büyüyen salonlar için en popüler seçim",
    price: "₺₺",
    period: "/ özel teklif",
    highlighted: true,
    features: ["Başlangıç'taki her şey", "Otomatik WhatsApp hatırlatma", "Personel & vardiya yönetimi", "Müşteri kartları & geçmiş", "Gelir & performans raporu"],
  },
  {
    name: "Premium",
    tagline: "Çok şubeli & kurumsal salonlar",
    price: "₺₺₺",
    period: "/ özel teklif",
    features: ["Profesyonel'deki her şey", "Çoklu şube yönetimi", "Önce/sonra galeri & yorumlar", "Sadakat & kampanya modülü", "Öncelikli destek & danışmanlık"],
  },
];

const SCENARIO_STEPS = [
  { time: "08:50", text: "Salon açılmadan Ahmet Usta paneli açıyor; günün 14 randevusunu, hangi personele kimin geleceğini tek bakışta görüyor." },
  { time: "Gün içi", text: "Yeni müşteri Instagram'dan gelip linke tıklıyor, boş saatlerden 15:00'i seçip kendi randevusunu oluşturuyor. Telefon hiç çalmıyor." },
  { time: "30 dk önce", text: "Sistem, gün içindeki tüm randevulara otomatik WhatsApp hatırlatması gönderiyor; bir müşteri saatini erteliyor, koltuk boşa düşmüyor." },
  { time: "Akşam", text: "Kapanışta Ahmet Usta günlük ciroyu, en çok yapılan hizmeti ve personel performansını rapordan görüyor; deftere hiçbir şey yazmıyor." },
];

/* --------------------------- the dashboard mockup --------------------------- */
function KuaforPanel() {
  return (
    <BrowserFrame url="kuaforos.app/pano">
      <div className="grid gap-3 lg:grid-cols-[180px_1fr]">
        {/* sidebar */}
        <aside className="hidden flex-col gap-1 rounded-xl bg-[var(--d-bg-soft)] p-3 lg:flex">
          <div className="mb-2 flex items-center gap-2 px-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--d-accent)] text-[var(--d-accent-fg)]">
              <Scissors className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-bold text-[var(--d-fg)]">Kuaför OS</span>
          </div>
          {[
            { icon: LayoutDashboard, label: "Pano", active: true },
            { icon: CalendarDays, label: "Randevular" },
            { icon: Users, label: "Müşteriler" },
            { icon: Scissors, label: "Hizmetler" },
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
            <StatTile label="Bugünkü Randevu" value="14" delta="+3" icon={CalendarDays} />
            <StatTile label="Doluluk" value="%86" delta="+12%" icon={TrendingUp} />
            <StatTile label="Günlük Gelir" value="₺12.400" delta="+18%" icon={Wallet} />
            <StatTile label="Yeni Müşteri" value="5" delta="+2" icon={UserPlus} />
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
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

            {/* right column */}
            <div className="space-y-3">
              <Panel title="Haftalık Gelir">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[var(--d-fg)]">₺68.900</div>
                    <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-pos)]">
                      <TrendingUp className="h-3 w-3" /> geçen haftaya göre +18%
                    </div>
                  </div>
                  <Coins className="h-5 w-5 text-[var(--d-accent)]" />
                </div>
                <Sparkline data={[20, 32, 28, 41, 38, 52, 60]} className="mt-3 h-10" />
              </Panel>

              <Panel title="Popüler Hizmetler">
                <ul className="space-y-2.5">
                  {SERVICES.slice(0, 4).map((s) => (
                    <li key={s.name}>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[var(--d-muted)]">{s.name}</span>
                        <span className="font-semibold text-[var(--d-fg)]">{s.count}</span>
                      </div>
                      <Bar value={(s.count / 38) * 100} className="mt-1" />
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>

          {/* staff schedule + whatsapp */}
          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
            <Panel title="Personel Programı" action="Bugün">
              <div className="space-y-3">
                {STAFF.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="w-24 shrink-0">
                      <div className="truncate text-[12px] font-medium text-[var(--d-fg)]">{p.name}</div>
                      <div className="text-[10px] text-[var(--d-faint)]">{p.role} · {p.today} randevu</div>
                    </div>
                    <div className="flex flex-1 gap-1">
                      {p.blocks.map((b, i) => (
                        <span
                          key={i}
                          className="h-6 flex-1 rounded-[4px]"
                          style={{
                            background: b
                              ? "color-mix(in srgb, var(--d-accent) 70%, transparent)"
                              : "var(--d-surface-2)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-1 text-[10px] text-[var(--d-faint)]">
                  <span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span>
                </div>
              </div>
            </Panel>

            <Panel title="WhatsApp Hatırlatma" action="Otomatik">
              <div className="flex items-start gap-3 rounded-xl bg-[#25D366]/10 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#06210f]">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div className="text-[12px] leading-relaxed text-[var(--d-muted)]">
                  <span className="font-semibold text-[var(--d-fg)]">Burak Bey</span>, yarın
                  <span className="font-semibold text-[var(--d-fg)]"> 11:00</span> Damat Tıraşı
                  randevunuzu hatırlatırız. Onaylıyor musunuz?
                  <div className="mt-2 flex gap-2">
                    <span className="rounded-full bg-[#25D366] px-2.5 py-1 text-[10px] font-semibold text-[#06210f]">Evet</span>
                    <span className="rounded-full border border-[var(--d-border)] px-2.5 py-1 text-[10px] font-semibold text-[var(--d-muted)]">Ertele</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                  <Crown className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Sadık müşteri
                </span>
                <span className="font-semibold text-[var(--d-fg)]">12. ziyaret · %10 indirim</span>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* --------------------------- page --------------------------- */
export function KuaforSite() {
  const img = "/demos/kuafor/salon-interior.webp";
  return (
    <DemoShell theme={demoThemes.kuafor} name="Kuaför OS" sector="Berber & Kuaför Yönetim Sistemi">
      <DemoHero
        sector="Berber & Kuaför Yönetim Sistemi"
        name="Kuaför OS"
        promise="Sadece bir web sitesi değil; randevudan gelire kadar tüm salonunuzu tek ekrandan yöneten dijital sistem. Telefon trafiğini bitirin, koltukları boş bırakmayın."
        image={img}
      />

      <ProblemSection
        title="Salonların her gün yaşadığı gerçek sorunlar"
        items={PROBLEMS}
        soft
      />

      <SolutionSection
        title="Kuaför OS bu sorunları nasıl çözüyor?"
        subtitle="Randevu, personel, müşteri ve gelir; dağınık defterler yerine tek, akıllı bir panelde."
        items={SOLUTIONS}
      />

      <Section
        id="panel"
        eyebrow="Canlı Panel"
        title="Salonunuzu yöneten dijital pano"
        subtitle="Aşağıdaki panel, gerçek bir salonun bir gününü yansıtacak şekilde tasarlandı: randevular, personel programı, popüler hizmetler ve gelir tek ekranda."
      >
        <DemoStage>
          <KuaforPanel />
        </DemoStage>
      </Section>

      <Section eyebrow="Özellikler" title="Salonunuz için ihtiyacınız olan her şey">
        <FeatureGrid features={FEATURES} />
      </Section>

      <Section
        eyebrow="Örnek Senaryo"
        title="Bir cumartesi, Kuaför OS ile"
        soft
      >
        <Scenario
          persona="Ahmet Usta — Kadıköy'de 2 koltuklu bir erkek kuaförü işletiyor."
          steps={SCENARIO_STEPS}
        />
      </Section>

      <Section eyebrow="Paketler" title="İşletmenize göre esnek paketler" subtitle="Fiyatlar salonunuzun büyüklüğüne göre belirlenir. Net teklif için bir mesaj yeterli.">
        <PricingCards plans={PLANS} />
      </Section>

      <FinalCTA />
    </DemoShell>
  );
}
