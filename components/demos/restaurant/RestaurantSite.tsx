"use client";

import { useState } from "react";

import {
  Bell,
  CalendarCheck,
  ChefHat,
  Clock,
  Coffee,
  CreditCard,
  LayoutDashboard,
  MessageCircle,
  Megaphone,
  QrCode,
  Salad,
  Star,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BrowserFrame,
  DemoHero,
  DemoShell,
  DemoStage,
  FeatureGrid,
  FinalCTA,
  Panel,
  PhoneFrame,
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
type TableState = "Boş" | "Dolu" | "Rezerve";
const TABLES: { no: string; state: TableState; info: string }[] = [
  { no: "M1", state: "Dolu", info: "4 kişi · 42 dk" },
  { no: "M2", state: "Dolu", info: "2 kişi · 18 dk" },
  { no: "M3", state: "Boş", info: "Hazır" },
  { no: "M4", state: "Rezerve", info: "20:30 · Yıldız" },
  { no: "M5", state: "Dolu", info: "6 kişi · 1s 05dk" },
  { no: "M6", state: "Boş", info: "Hazır" },
  { no: "M7", state: "Dolu", info: "3 kişi · 27 dk" },
  { no: "M8", state: "Rezerve", info: "21:00 · Demir" },
  { no: "M9", state: "Boş", info: "Hazır" },
  { no: "M10", state: "Dolu", info: "2 kişi · 9 dk" },
  { no: "T1", state: "Dolu", info: "Teras · 4 kişi" },
  { no: "T2", state: "Boş", info: "Teras · Hazır" },
];

const tableTone: Record<TableState, "success" | "danger" | "warn"> = {
  Boş: "success",
  Dolu: "danger",
  Rezerve: "warn",
};

const MENU: { cat: string; items: { name: string; desc: string; price: number }[] }[] = [
  {
    cat: "Kahvaltı",
    items: [
      { name: "Serpme Kahvaltı (2 kişi)", desc: "22 çeşit · sınırsız çay", price: 680 },
      { name: "Menemen", desc: "Köy yumurtası, tereyağı", price: 190 },
      { name: "Bal-Kaymak & Simit", desc: "Taze simit ile", price: 170 },
      { name: "Omlet (3 yumurta)", desc: "Kaşar / mantar / sucuk", price: 210 },
    ],
  },
  {
    cat: "Kahve",
    items: [
      { name: "Flat White", desc: "Çift shot espresso", price: 120 },
      { name: "Latte", desc: "Buharda süt", price: 110 },
      { name: "Türk Kahvesi", desc: "Yanında lokum", price: 90 },
      { name: "Cold Brew", desc: "16 saat demleme", price: 150 },
    ],
  },
  {
    cat: "Ana Yemek",
    items: [
      { name: "Izgara Köfte & Patates", desc: "180gr el yapımı", price: 420 },
      { name: "Tavuk Şinitzel", desc: "Patates & sos", price: 360 },
      { name: "Izgara Somon", desc: "Mevsim sebzeli", price: 540 },
      { name: "Karışık Izgara", desc: "2 kişilik tabak", price: 760 },
    ],
  },
  {
    cat: "Burger",
    items: [
      { name: "Cheeseburger", desc: "150gr dana · cheddar", price: 320 },
      { name: "Truffle Burger", desc: "Mantar & truffle mayo", price: 410 },
      { name: "Tavuk Burger", desc: "Çıtır tavuk göğsü", price: 290 },
      { name: "Double Smash", desc: "2x köfte · 2x cheddar", price: 460 },
    ],
  },
  {
    cat: "Makarna",
    items: [
      { name: "Truffle Mantarlı Makarna", desc: "Taze parmesan", price: 360 },
      { name: "Penne Arabiata", desc: "Acılı domates sos", price: 280 },
      { name: "Spaghetti Bolonez", desc: "Dana kıyma ragu", price: 320 },
      { name: "Fettuccine Alfredo", desc: "Kremalı tavuk", price: 340 },
    ],
  },
  {
    cat: "Tatlı",
    items: [
      { name: "San Sebastian", desc: "Akışkan cheesecake", price: 180 },
      { name: "Brownie & Dondurma", desc: "Sıcak servis", price: 160 },
      { name: "Sufle", desc: "Akışkan çikolata", price: 175 },
      { name: "Tiramisu", desc: "Ev yapımı", price: 165 },
    ],
  },
  {
    cat: "İçecek",
    items: [
      { name: "Limonata", desc: "Taze sıkım · naneli", price: 120 },
      { name: "Ev Yapımı Ice Tea", desc: "Şeftali / orman meyve", price: 115 },
      { name: "Taze Portakal Suyu", desc: "Günlük sıkım", price: 130 },
      { name: "Milkshake", desc: "Çikolata / muz / çilek", price: 175 },
    ],
  },
];

const fmtTRY = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const POPULAR = [
  { name: "Izgara Köfte", count: 64, price: "₺420" },
  { name: "Cheeseburger", count: 51, price: "₺320" },
  { name: "Serpme Kahvaltı", count: 38, price: "₺680" },
  { name: "Latte", count: 33, price: "₺110" },
  { name: "San Sebastian", count: 27, price: "₺180" },
];

const ONLINE_ORDERS = [
  { code: "#4821", channel: "Getir", items: "2x Burger · 1x Patates", total: "₺740", tone: "warn" as const, label: "Hazırlanıyor" },
  { code: "#4820", channel: "Yemeksepeti", items: "1x Makarna · 1x Salata", total: "₺520", tone: "accent" as const, label: "Yeni" },
  { code: "#4819", channel: "QR Masa M5", items: "6x İçecek · 3x Tatlı", total: "₺1.140", tone: "success" as const, label: "Servis edildi" },
  { code: "#4818", channel: "Trendyol", items: "1x Köfte Menü", total: "₺480", tone: "success" as const, label: "Yola çıktı" },
];

const PROBLEMS = [
  "Menü değişiklikleri matbaaya bağlı; fiyat güncellemek günler sürüyor, eski menüler dolaşımda kalıyor.",
  "Garson masalar arasında koşturuyor; sipariş kâğıda yazılıyor, mutfağa yanlış iletiliyor.",
  "Yoğun saatte hangi masa boş, hangisi rezerve belli olmuyor; müşteri kapıda bekletiliyor.",
  "Getir, Yemeksepeti ve telefon siparişleri farklı yerlerde; karışıyor, hata oranı artıyor.",
  "Gün sonu ciro defterden hesaplanıyor; hangi ürün ne kadar sattı, kâr nerede belirsiz.",
  "Google yorumları takip edilmiyor; memnun müşteriden puan istenmiyor, fırsat kaçıyor.",
];

const SOLUTIONS = [
  { icon: QrCode, title: "QR Dijital Menü", text: "Masadaki QR kodu okutan müşteri menüyü görür, sipariş verir. Fotoğraflı, her an güncel, matbaa masrafı sıfır." },
  { icon: UtensilsCrossed, title: "Akıllı Masa Yönetimi", text: "Boş, dolu ve rezerve masalar tek ekranda renkli görünür. Oturma süresi ve kişi sayısı anında belli." },
  { icon: CalendarCheck, title: "Online Rezervasyon", text: "Müşteriler boş saatleri görüp kendi rezervasyonunu yapar; çift kayıt ve karışıklık biter." },
  { icon: CreditCard, title: "Tek Ekranda Siparişler", text: "QR masa, Getir, Yemeksepeti ve telefon siparişleri tek panelde toplanır; mutfağa anında düşer." },
  { icon: Wallet, title: "Ciro & Ürün Raporu", text: "Günlük ciro, en çok satan ürünler ve saatlik yoğunluk net rakamlarla; karar vermek kolaylaşır." },
  { icon: Star, title: "Google Yorum Toplama", text: "Memnun müşteriye otomatik link gider; puanınız yükselir, yeni müşteri kazanırsınız." },
];

const FEATURES = [
  { icon: QrCode, title: "QR Dijital Menü", text: "Fotoğraflı, çok dilli ve saniyede güncellenen menü." },
  { icon: UtensilsCrossed, title: "Masa Yönetimi", text: "Boş / dolu / rezerve durumunu canlı takip edin." },
  { icon: CalendarCheck, title: "Online Rezervasyon", text: "Boş masaları gösteren akıllı rezervasyon takvimi." },
  { icon: CreditCard, title: "Adisyon & Hızlı Ödeme", text: "Masaya yazma, bölüştürme ve hızlı kapatma." },
  { icon: ChefHat, title: "Mutfak Ekranı (KDS)", text: "Siparişler anında mutfak ekranına düşer, hata azalır." },
  { icon: Coffee, title: "Çoklu Sipariş Kanalı", text: "Getir, Yemeksepeti, Trendyol ve telefon tek panelde." },
  { icon: Wallet, title: "Ciro & Stok Raporu", text: "Günlük ciro, ürün kârı ve azalan stok uyarıları." },
  { icon: Bell, title: "WhatsApp Hatırlatma", text: "Rezervasyon onayı ve hatırlatma otomatik gider." },
  { icon: Star, title: "Yorum & Sadakat", text: "Google yorum toplama ve sadık müşteri kampanyaları." },
];

const PLANS = [
  {
    name: "Başlangıç",
    tagline: "Kafe ve küçük işletmeler için",
    price: "₺",
    period: "/ özel teklif",
    features: [
      "QR dijital menü (fotoğraflı)",
      "Sınırsız menü güncelleme",
      "Masa durumu görünümü",
      "Mobil uyumlu işletme sayfası",
    ],
  },
  {
    name: "Profesyonel",
    tagline: "Büyüyen restoranlar için en popüler seçim",
    price: "₺₺",
    period: "/ özel teklif",
    highlighted: true,
    features: [
      "Başlangıç'taki her şey",
      "Online rezervasyon & WhatsApp onay",
      "QR masa sipariş + mutfak ekranı",
      "Getir / Yemeksepeti entegrasyonu",
      "Ciro & en çok satan ürün raporu",
    ],
  },
  {
    name: "Premium",
    tagline: "Zincir & çok şubeli işletmeler",
    price: "₺₺₺",
    period: "/ özel teklif",
    features: [
      "Profesyonel'deki her şey",
      "Çoklu şube yönetimi & raporu",
      "Stok takibi & maliyet analizi",
      "Google yorum & sadakat modülü",
      "Öncelikli destek & danışmanlık",
    ],
  },
];

const SCENARIO_STEPS = [
  { time: "10:30", text: "Sabah menüdeki kahvaltı fiyatı güncelleniyor; tek tıkla tüm masalardaki QR menü saniyede değişiyor, hiçbir şey basılmıyor." },
  { time: "Öğle", text: "Salon dolarken yeni gelen müşteri panelde boş masayı görüyor; garson QR ile sipariş alıyor, istek anında mutfak ekranına düşüyor." },
  { time: "Akşam", text: "Getir ve Yemeksepeti siparişleri telefon siparişiyle birlikte tek ekranda akıyor; karışıklık olmadan sırayla hazırlanıyor." },
  { time: "Kapanış", text: "Gün sonu ciro, en çok satan ürünler ve masa doluluğu rapordan görünüyor; memnun müşterilere otomatik Google yorum linki gidiyor." },
];

/* --------------------------- the dashboard mockup --------------------------- */
function RestaurantPanel() {
  const [activeCat, setActiveCat] = useState(MENU[0].cat);
  const activeItems = MENU.find((m) => m.cat === activeCat)!.items;
  const cartTotal = activeItems.reduce((sum, it) => sum + it.price, 0);
  return (
    <BrowserFrame url="restaurantos.app/pano">
      <div className="grid gap-3 lg:grid-cols-[180px_1fr]">
        {/* sidebar */}
        <aside className="hidden flex-col gap-1 rounded-xl bg-[var(--d-bg-soft)] p-3 lg:flex">
          <div className="mb-2 flex items-center gap-2 px-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--d-accent)] text-[var(--d-accent-fg)]">
              <UtensilsCrossed className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-bold text-[var(--d-fg)]">RestaurantOS</span>
          </div>
          {[
            { icon: LayoutDashboard, label: "Pano", active: true },
            { icon: UtensilsCrossed, label: "Masalar" },
            { icon: QrCode, label: "QR Menü" },
            { icon: CreditCard, label: "Siparişler" },
            { icon: CalendarCheck, label: "Rezervasyon" },
            { icon: Wallet, label: "Ciro" },
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
            <StatTile label="Bugünkü Ciro" value="₺48.700" delta="+22%" icon={Wallet} />
            <StatTile label="Aktif Masa" value="8/12" delta="+3" icon={UtensilsCrossed} />
            <StatTile label="Online Sipariş" value="37" delta="+11" icon={CreditCard} />
            <StatTile label="Rezervasyon" value="9" delta="+2" icon={CalendarCheck} />
          </div>

          {/* table grid + qr menu phone */}
          <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
            <Panel
              title="Masa Durumu"
              action="Salon + Teras"
            >
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {TABLES.map((t) => (
                  <div
                    key={t.no}
                    className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] p-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[var(--d-fg)]">
                        {t.no}
                      </span>
                      <Tag tone={tableTone[t.state]}>{t.state}</Tag>
                    </div>
                    <div className="mt-1.5 truncate text-[10px] text-[var(--d-faint)]">
                      {t.info}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-[var(--d-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--d-pos)]" /> Boş
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--d-neg)]" /> Dolu
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--d-warn)]" /> Rezerve
                </span>
              </div>
            </Panel>

            {/* QR digital menu in a phone */}
            <PhoneFrame className="mx-auto w-full max-w-[280px]">
              <div className="px-3 pb-4 pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-bold text-[var(--d-fg)]">
                      Lezzet Durağı
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] text-[var(--d-faint)]">
                      <QrCode className="h-3 w-3" /> QR Dijital Menü · Masa M5
                    </div>
                  </div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--d-accent)]/15 text-[var(--d-accent)]">
                    <Coffee className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* category chips — tap to switch (live demo) */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {MENU.map((m) => {
                    const active = m.cat === activeCat;
                    return (
                      <button
                        key={m.cat}
                        type="button"
                        onClick={() => setActiveCat(m.cat)}
                        className={
                          "cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors " +
                          (active
                            ? "bg-[var(--d-accent)] text-[var(--d-accent-fg)]"
                            : "border border-[var(--d-border)] text-[var(--d-muted)] hover:text-[var(--d-fg)]")
                        }
                      >
                        {m.cat}
                      </button>
                    );
                  })}
                </div>

                {/* menu items for the active category */}
                <ul className="mt-3 space-y-2">
                  {activeItems.map((m) => (
                    <li
                      key={m.name}
                      className="flex items-center gap-2.5 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface)] p-2"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--d-accent)]/12 text-[var(--d-accent)]">
                        <Salad className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[11.5px] font-semibold text-[var(--d-fg)]">
                          {m.name}
                        </div>
                        <div className="truncate text-[10px] text-[var(--d-faint)]">
                          {m.desc}
                        </div>
                      </div>
                      <span className="text-[11.5px] font-bold text-[var(--d-accent)]">
                        ₺{m.price}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[var(--d-accent)] py-2 text-[11px] font-bold text-[var(--d-accent-fg)]">
                  <CreditCard className="h-3.5 w-3.5" /> Sepete Ekle · ₺{fmtTRY(cartTotal)}
                </div>
              </div>
            </PhoneFrame>
          </div>

          {/* orders + popular + sales */}
          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
            <Panel title="Online Siparişler" action="Canlı">
              <ul className="space-y-2">
                {ONLINE_ORDERS.map((o) => (
                  <li
                    key={o.code}
                    className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
                  >
                    <span className="w-12 shrink-0 text-[12px] font-semibold tabular-nums text-[var(--d-accent)]">
                      {o.code}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">
                        {o.channel}
                      </div>
                      <div className="truncate text-[11px] text-[var(--d-faint)]">
                        {o.items}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[12px] font-bold text-[var(--d-fg)]">
                        {o.total}
                      </span>
                      <Tag tone={o.tone}>{o.label}</Tag>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <div className="space-y-3">
              <Panel title="Günlük Satış">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[var(--d-fg)]">₺48.700</div>
                    <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-pos)]">
                      <TrendingUp className="h-3 w-3" /> dün bu saate göre +22%
                    </div>
                  </div>
                  <Clock className="h-5 w-5 text-[var(--d-accent)]" />
                </div>
                <Sparkline data={[12, 18, 15, 26, 22, 34, 30, 44, 49]} className="mt-3 h-10" />
                <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--d-faint)]">
                  <span>10:00</span><span>14:00</span><span>18:00</span><span>22:00</span>
                </div>
              </Panel>

              <Panel title="Popüler Ürünler" action="Bugün">
                <ul className="space-y-2.5">
                  {POPULAR.slice(0, 4).map((p) => (
                    <li key={p.name}>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[var(--d-muted)]">{p.name}</span>
                        <span className="font-semibold text-[var(--d-fg)]">
                          {p.count} · {p.price}
                        </span>
                      </div>
                      <Bar value={(p.count / 64) * 100} className="mt-1" />
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>

          {/* google review + campaign */}
          <div className="grid gap-3 lg:grid-cols-2">
            <Panel title="Google Yorum" action="Otomatik">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center rounded-xl bg-[var(--d-accent)]/12 px-4 py-2.5">
                  <span className="text-2xl font-bold text-[var(--d-accent)]">4.8</span>
                  <span className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star
                        key={s}
                        className="h-3 w-3 fill-[var(--d-accent)] text-[var(--d-accent)]"
                      />
                    ))}
                  </span>
                </div>
                <div className="min-w-0 flex-1 text-[12px] leading-relaxed text-[var(--d-muted)]">
                  <span className="font-semibold text-[var(--d-fg)]">312</span> Google
                  değerlendirmesi · bu ay{" "}
                  <span className="font-semibold text-[var(--d-pos)]">+24 yeni yorum</span>.
                  Memnun müşterilere otomatik yorum linki gönderilir.
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#25D366]/10 px-3 py-2.5">
                <span className="inline-flex items-center gap-2 text-[11.5px] text-[var(--d-muted)]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-[#06210f]">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                  Ayşe Hanım'a teşekkür mesajı + yorum linki
                </span>
                <span className="rounded-full bg-[var(--d-accent)] px-2.5 py-1 text-[10px] font-bold text-[var(--d-accent-fg)]">
                  Yorum İste
                </span>
              </div>
            </Panel>

            <Panel title="Aktif Kampanya" action="Bu Hafta">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--d-accent)]/15 text-[var(--d-accent)]">
                  <Megaphone className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-[var(--d-fg)]">
                    Hafta İçi Öğle Menüsü · %20 İndirim
                  </div>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--d-muted)]">
                    12:00 – 15:00 arası QR menüden verilen ana yemeklerde geçerli.
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2">
                  <div className="text-[10px] text-[var(--d-faint)]">Kullanım</div>
                  <div className="text-[15px] font-bold text-[var(--d-fg)]">148 kez</div>
                </div>
                <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2">
                  <div className="text-[10px] text-[var(--d-faint)]">Ek Ciro</div>
                  <div className="text-[15px] font-bold text-[var(--d-accent)]">₺19.400</div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* --------------------------- page --------------------------- */
export function RestaurantSite() {
  const img = "/demos/restaurant/food-hero.webp";
  const interior = "/demos/restaurant/interior.webp";
  return (
    <DemoShell
      theme={demoThemes.restaurant}
      name="RestaurantOS"
      sector="Restoran & Kafe Yönetim Sistemi"
      serif
    >
      <DemoHero
        sector="Restoran & Kafe Yönetim Sistemi"
        name="RestaurantOS"
        promise="Dijital menü, QR sipariş, rezervasyon ve masa yönetimini tek sistemde toplayan restoran & kafe çözümü. Menünüzü saniyede güncelleyin, masaları akıllıca yönetin."
        image={img}
        serif
      />

      <ProblemSection
        title="Restoran ve kafelerin her gün yaşadığı gerçek sorunlar"
        items={PROBLEMS}
        soft
      />

      <SolutionSection
        title="RestaurantOS bu sorunları nasıl çözüyor?"
        subtitle="Menü, masa, rezervasyon ve sipariş; dağınık kâğıtlar ve farklı uygulamalar yerine tek, akıllı bir panelde."
        items={SOLUTIONS}
        serif
      />

      <Section
        id="panel"
        eyebrow="Canlı Panel"
        title="İşletmenizi yöneten dijital pano"
        subtitle="Aşağıdaki panel, dolu bir akşam servisini yansıtacak şekilde tasarlandı: masa durumu, QR menü, online siparişler, günlük ciro ve yorumlar tek ekranda."
        serif
      >
        <DemoStage>
          <RestaurantPanel />
        </DemoStage>

        {/* secondary image — atmosphere card */}
        <div className="mt-6 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden rounded-[1.4rem] border border-[var(--d-border)]">
            <img
              src={interior}
              alt="Restoran iç mekânı"
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="text-[13px] font-semibold text-white">
                Müşteri deneyimi ekranda biter, masada başlar
              </div>
              <p className="mt-1 max-w-md text-[12px] leading-relaxed text-white/80">
                Sistem arkada çalışır; salonunuz akıcı, garsonlarınız hızlı, misafirleriniz
                memnun kalır.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
            <div className="rounded-[1.4rem] border border-[var(--d-border)] bg-[var(--d-surface)] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--d-accent)]">
                Servis hızı
              </div>
              <div className="mt-2 text-2xl font-bold text-[var(--d-fg)]">%34 daha hızlı</div>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--d-muted)]">
                QR sipariş ve mutfak ekranı ile masa devir süresi kısalır.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--d-border)] bg-[var(--d-surface)] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--d-accent)]">
                Menü güncelleme
              </div>
              <div className="mt-2 text-2xl font-bold text-[var(--d-fg)]">Saniyeler içinde</div>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--d-muted)]">
                Fiyat değişikliği tek tıkla tüm masalardaki menüye yansır.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Özellikler" title="Restoranınız için ihtiyacınız olan her şey" serif>
        <FeatureGrid features={FEATURES} />
      </Section>

      <Section eyebrow="Örnek Senaryo" title="Yoğun bir akşam, RestaurantOS ile" soft serif>
        <Scenario
          persona="Lezzet Durağı — Beşiktaş'ta 12 masalı bir restoran & kafe işletiyor."
          steps={SCENARIO_STEPS}
        />
      </Section>

      <Section
        eyebrow="Paketler"
        title="İşletmenize göre esnek paketler"
        subtitle="Fiyatlar işletmenizin büyüklüğüne ve masa sayısına göre belirlenir. Net teklif için bir mesaj yeterli."
        serif
      >
        <PricingCards plans={PLANS} />
      </Section>

      <FinalCTA serif />
    </DemoShell>
  );
}
