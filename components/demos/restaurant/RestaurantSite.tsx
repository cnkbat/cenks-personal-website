"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Bell,
  CalendarCheck,
  Check,
  ChefHat,
  Clock,
  Coffee,
  CreditCard,
  Download,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Megaphone,
  Minus,
  Pause,
  Play,
  Plus,
  QrCode,
  Salad,
  Send,
  Settings,
  Star,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import {
  AnimatedView,
  Bar,
  BrowserFrame,
  DemoActionButton,
  DemoClosingCTA,
  DemoCounter,
  DemoHero,
  DemoMobileNav,
  DemoShell,
  DemoSidebar,
  DemoStage,
  FeatureGrid,
  IconButton,
  Panel,
  PhoneFrame,
  PresentationMode,
  PricingCards,
  ProblemSection,
  Scenario,
  Section,
  SelectField,
  SolutionSection,
  Sparkline,
  StatTile,
  Tag,
  Toggle,
  demoThemes,
  useDemoToast,
  type PresentationStep,
  type SidebarItem,
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

const fmtTRY = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/* kitchen order lifecycle */
type OrderStatus = "Yeni" | "Hazırlanıyor" | "Hazır" | "Servis edildi";
const ORDER_FLOW: OrderStatus[] = ["Yeni", "Hazırlanıyor", "Hazır", "Servis edildi"];
const orderTone: Record<OrderStatus, "accent" | "warn" | "success"> = {
  Yeni: "accent",
  Hazırlanıyor: "warn",
  Hazır: "warn",
  "Servis edildi": "success",
};
const orderNext: Record<OrderStatus, string> = {
  Yeni: "Hazırlığa al",
  Hazırlanıyor: "Hazır işaretle",
  Hazır: "Servis et",
  "Servis edildi": "Tamamlandı",
};

type Order = {
  code: string;
  channel: string;
  items: string;
  total: number;
  status: OrderStatus;
};

const INITIAL_ORDERS: Order[] = [
  { code: "#4821", channel: "Getir", items: "2x Burger · 1x Patates", total: 740, status: "Hazırlanıyor" },
  { code: "#4820", channel: "Yemeksepeti", items: "1x Makarna · 1x Salata", total: 520, status: "Yeni" },
  { code: "#4819", channel: "QR Masa M5", items: "6x İçecek · 3x Tatlı", total: 1140, status: "Hazır" },
  { code: "#4818", channel: "Trendyol", items: "1x Köfte Menü", total: 480, status: "Servis edildi" },
];

const INITIAL_POPULAR: { name: string; count: number; price: number }[] = [
  { name: "Izgara Köfte", count: 64, price: 420 },
  { name: "Cheeseburger", count: 51, price: 320 },
  { name: "Serpme Kahvaltı", count: 38, price: 680 },
  { name: "Latte", count: 33, price: 110 },
  { name: "San Sebastian", count: 27, price: 180 },
];

/* today's reservations */
type ResStatus = "Onaylı" | "Bekliyor";
type Reservation = { id: number; time: string; name: string; people: string };
const INITIAL_RESERVATIONS: { res: Reservation; status: ResStatus }[] = [
  { res: { id: 1, time: "19:30", name: "Yıldız Ailesi", people: "4 kişi · Teras" }, status: "Onaylı" },
  { res: { id: 2, time: "20:00", name: "Demir Bey", people: "2 kişi · Salon" }, status: "Bekliyor" },
  { res: { id: 3, time: "20:30", name: "Kaya Grubu", people: "6 kişi · Salon" }, status: "Onaylı" },
  { res: { id: 4, time: "21:15", name: "Şahin Çift", people: "2 kişi · Teras" }, status: "Bekliyor" },
];
const resTone: Record<ResStatus, "success" | "warn"> = {
  Onaylı: "success",
  Bekliyor: "warn",
};

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

/* active campaigns */
type Campaign = {
  id: number;
  title: string;
  desc: string;
  uses: string;
  extra: string;
  running: boolean;
};
const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 1, title: "Hafta İçi Öğle Menüsü · %20 İndirim", desc: "12:00 – 15:00 arası QR menüden verilen ana yemeklerde geçerli.", uses: "148 kez", extra: "₺19.400", running: true },
  { id: 2, title: "2 Kahve 1 Tatlı Bedava", desc: "Aynı adisyonda 2 kahve alana San Sebastian ikram.", uses: "92 kez", extra: "₺6.200", running: true },
  { id: 3, title: "Akşam Erken Rezervasyon · %15", desc: "18:00 – 19:30 arası rezervasyonlarda geçerli kampanya.", uses: "37 kez", extra: "₺4.850", running: false },
];

/* --------------------------- sidebar & presentation --------------------------- */
const SIDEBAR: SidebarItem[] = [
  { id: "genel", icon: LayoutDashboard, label: "Genel Bakış" },
  { id: "menu", icon: QrCode, label: "Menü" },
  { id: "siparisler", icon: CreditCard, label: "Siparişler" },
  { id: "masalar", icon: UtensilsCrossed, label: "Masalar" },
  { id: "rezervasyonlar", icon: CalendarCheck, label: "Rezervasyonlar" },
  { id: "mutfak", icon: ChefHat, label: "Mutfak" },
  { id: "kampanyalar", icon: Megaphone, label: "Kampanyalar" },
  { id: "raporlar", icon: FileText, label: "Raporlar" },
  { id: "ayarlar", icon: Settings, label: "Ayarlar" },
];

const STEPS: PresentationStep[] = [
  { view: "menu", title: "Dijital Menü", text: "Menünüzü saniyede güncellersiniz; matbaa masrafı ve eski menü sorunu biter.", action: "Bir kategoriye geçip ürünleri gösterin." },
  { view: "siparisler", title: "QR Sipariş Akışı", text: "Müşteri masadaki QR'ı okutup kendi siparişini verir; sipariş anında sisteme düşer.", action: "Online siparişlerin tek ekranda toplandığını gösterin." },
  { view: "masalar", title: "Masa Durumları", text: "Boş, dolu ve rezerve masaları tek ekranda renkli görürsünüz.", action: "Bir masaya tıklayıp durumunu değiştirin." },
  { view: "rezervasyonlar", title: "Rezervasyonlar", text: "Günün rezervasyonlarını ve durumlarını tek yerden yönetirsiniz.", action: "Bir rezervasyonu onaylayın." },
  { view: "mutfak", title: "Mutfak Siparişleri", text: "Siparişler anında mutfağa düşer, hazırlık durumu takip edilir.", action: "Bir siparişi 'Hazır' olarak işaretleyin." },
  { view: "genel", title: "Günlük Ciro", text: "Günlük cironuzu, en çok satan ürünleri ve yoğunluğu net görürsünüz.", action: "Ciro ve popüler ürün kartlarını gösterin." },
  { view: "genel", title: "Size Özel Kurulum", text: "Bu sistem işletmenizin menüsüne, masa düzenine ve çalışma şekline göre özelleştirilebilir.", action: "Sunumu bitirip teklif aşamasına geçin." },
];

/* --------------------------- the dashboard mockup --------------------------- */
const BASE_CIRO = 48700;

function RestaurantPanel() {
  const toast = useDemoToast();

  /* ---- live state ---- */
  const [tables, setTables] = useState(TABLES);
  const [activeCat, setActiveCat] = useState(MENU[0].cat);
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [popular, setPopular] = useState(INITIAL_POPULAR);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [extraCiro, setExtraCiro] = useState(0);
  const [orderSeq, setOrderSeq] = useState(4822);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [itemActive, setItemActive] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MENU.flatMap((m) => m.items).map((it) => [it.name, true])),
  );

  /* ---- view / presentation ---- */
  const [view, setView] = useState("genel");
  const [presentOpen, setPresentOpen] = useState(false);

  /* ---- settings ---- */
  const [settings, setSettings] = useState({
    qrSiparis: true,
    onlineRezervasyon: true,
    whatsapp: true,
    googleYorum: true,
    stokUyari: false,
  });
  const [workHours, setWorkHours] = useState("10:00 – 24:00");
  const [serviceFee, setServiceFee] = useState("Yok");
  const [currency, setCurrency] = useState("₺ Türk Lirası");

  const activeItems = MENU.find((m) => m.cat === activeCat)!.items;

  /* ---- derived, live stats ---- */
  const aktifMasa = useMemo(() => tables.filter((t) => t.state !== "Boş").length, [tables]);
  const counts = useMemo(() => {
    const c: Record<TableState, number> = { Boş: 0, Dolu: 0, Rezerve: 0 };
    tables.forEach((t) => (c[t.state] += 1));
    return c;
  }, [tables]);

  const basketCount = useMemo(
    () => Object.values(basket).reduce((s, n) => s + n, 0),
    [basket],
  );
  const basketTotal = useMemo(
    () =>
      MENU.flatMap((m) => m.items).reduce(
        (s, it) => s + (basket[it.name] ?? 0) * it.price,
        0,
      ),
    [basket],
  );

  const ciro = BASE_CIRO + extraCiro;
  const onlineCount = orders.length;
  const rezCount = reservations.length;
  const maxPopular = Math.max(1, ...popular.map((p) => p.count));

  /* ---- table actions ---- */
  function cycleTable(no: string) {
    setTables((prev) =>
      prev.map((t) => {
        if (t.no !== no) return t;
        const order: TableState[] = ["Boş", "Dolu", "Rezerve"];
        const next = order[(order.indexOf(t.state) + 1) % order.length];
        const info =
          next === "Boş" ? "Hazır" : next === "Dolu" ? "Yeni · 0 dk" : "Rezerve · bekliyor";
        return { ...t, state: next, info };
      }),
    );
    const t = tables.find((x) => x.no === no);
    if (t) {
      const order: TableState[] = ["Boş", "Dolu", "Rezerve"];
      const next = order[(order.indexOf(t.state) + 1) % order.length];
      toast({
        title: `Masa ${no} · ${next}`,
        tone: next === "Boş" ? "success" : next === "Dolu" ? "danger" : "warn",
        icon: UtensilsCrossed,
      });
    }
  }

  /* ---- basket actions ---- */
  function addToBasket(name: string) {
    setBasket((b) => ({ ...b, [name]: (b[name] ?? 0) + 1 }));
  }
  function removeFromBasket(name: string) {
    setBasket((b) => {
      const next = (b[name] ?? 0) - 1;
      const copy = { ...b };
      if (next <= 0) delete copy[name];
      else copy[name] = next;
      return copy;
    });
  }
  function placeOrder() {
    if (basketCount === 0) {
      toast({ title: "Sepet boş", desc: "Önce ürün ekleyin", tone: "warn", icon: CreditCard });
      return;
    }
    const lines = Object.entries(basket)
      .map(([name, qty]) => `${qty}x ${name.split(" ")[0]}`)
      .join(" · ");
    const code = `#${orderSeq}`;
    const newOrder: Order = {
      code,
      channel: "QR Masa M5",
      items: lines,
      total: basketTotal,
      status: "Yeni",
    };
    setOrders((prev) => [newOrder, ...prev]);
    setOrderSeq((s) => s + 1);
    /* reflect ordered quantities in popular bars */
    setPopular((prev) =>
      prev.map((p) => {
        const matched = Object.entries(basket).find(([name]) =>
          name.toLocaleLowerCase("tr").includes(p.name.toLocaleLowerCase("tr").split(" ")[0]),
        );
        return matched ? { ...p, count: p.count + matched[1] } : p;
      }),
    );
    toast({
      title: "Sipariş mutfağa iletildi",
      desc: `${code} · ${basketCount} ürün · ₺${fmtTRY(basketTotal)}`,
      tone: "success",
      icon: Check,
    });
    setBasket({});
  }

  /* ---- kitchen order actions ---- */
  function advanceOrder(code: string) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.code !== code || o.status === "Servis edildi") return o;
        const next = ORDER_FLOW[ORDER_FLOW.indexOf(o.status) + 1];
        if (next === "Servis edildi") {
          setExtraCiro((c) => c + o.total);
          toast({
            title: `${code} servis edildi`,
            desc: `+₺${fmtTRY(o.total)} ciroya eklendi`,
            tone: "success",
            icon: Check,
          });
        } else {
          toast({ title: `${code} · ${next}`, tone: "default", icon: ChefHat });
        }
        return { ...o, status: next };
      }),
    );
  }

  /* ---- reservation actions ---- */
  function toggleReservation(id: number) {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.res.id !== id) return r;
        const status: ResStatus = r.status === "Onaylı" ? "Bekliyor" : "Onaylı";
        toast({
          title: `${r.res.name} · ${status}`,
          tone: status === "Onaylı" ? "success" : "warn",
          icon: CalendarCheck,
        });
        return { ...r, status };
      }),
    );
  }

  /* ---- campaign actions ---- */
  function toggleCampaign(id: number) {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const running = !c.running;
        toast({
          title: running ? "Kampanya başlatıldı" : "Kampanya durduruldu",
          desc: c.title,
          tone: running ? "success" : "warn",
          icon: Megaphone,
        });
        return { ...c, running };
      }),
    );
  }

  /* ---------- shared rows ---------- */
  function orderRow(o: Order) {
    const done = o.status === "Servis edildi";
    return (
      <motion.li
        key={o.code}
        layout
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
      >
        <span className="w-12 shrink-0 text-[12px] font-semibold tabular-nums text-[var(--d-accent)]">
          {o.code}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{o.channel}</div>
          <div className="truncate text-[11px] text-[var(--d-faint)]">{o.items}</div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[12px] font-bold text-[var(--d-fg)]">₺{fmtTRY(o.total)}</span>
          {done ? (
            <Tag tone={orderTone[o.status]}>
              <Check className="h-2.5 w-2.5" /> {o.status}
            </Tag>
          ) : (
            <button
              type="button"
              onClick={() => advanceOrder(o.code)}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--d-accent)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--d-accent)] transition-colors hover:bg-[var(--d-accent)]/25"
            >
              <ChefHat className="h-2.5 w-2.5" /> {o.status} → {orderNext[o.status]}
            </button>
          )}
        </div>
      </motion.li>
    );
  }

  function reservationRow(r: { res: Reservation; status: ResStatus }) {
    return (
      <li
        key={r.res.id}
        className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
      >
        <span className="w-11 shrink-0 text-[12px] font-semibold tabular-nums text-[var(--d-accent)]">
          {r.res.time}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{r.res.name}</div>
          <div className="truncate text-[11px] text-[var(--d-faint)]">{r.res.people}</div>
        </div>
        <button
          type="button"
          onClick={() => toggleReservation(r.res.id)}
          aria-label="Durumu değiştir"
          className="transition-transform active:scale-95"
        >
          <motion.span
            key={r.status}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tag tone={resTone[r.status]}>
              {r.status === "Onaylı" ? <Check className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
              {r.status}
            </Tag>
          </motion.span>
        </button>
      </li>
    );
  }

  /* ---------- the QR menu phone (reused in genel + menu) ---------- */
  function qrMenuPhone() {
    return (
      <PhoneFrame className="mx-auto w-full max-w-[280px]">
        <div className="px-3 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-[var(--d-fg)]">Lezzet Durağı</div>
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
            {activeItems
              .filter((m) => itemActive[m.name])
              .map((m) => {
                const qty = basket[m.name] ?? 0;
                return (
                  <li
                    key={m.name}
                    className={
                      "flex items-center gap-2.5 rounded-xl border bg-[var(--d-surface)] p-2 transition-colors " +
                      (qty > 0 ? "border-[var(--d-accent)]/60" : "border-[var(--d-border)]")
                    }
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--d-accent)]/12 text-[var(--d-accent)]">
                      <Salad className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[11.5px] font-semibold text-[var(--d-fg)]">{m.name}</div>
                      <div className="truncate text-[10px] text-[var(--d-faint)]">{m.desc}</div>
                    </div>
                    <span className="text-[11.5px] font-bold text-[var(--d-accent)]">₺{m.price}</span>
                    <div className="flex items-center gap-1">
                      {qty > 0 && (
                        <>
                          <IconButton icon={Minus} label="Azalt" onClick={() => removeFromBasket(m.name)} />
                          <motion.span
                            key={qty}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="w-4 text-center text-[12px] font-bold tabular-nums text-[var(--d-fg)]"
                          >
                            {qty}
                          </motion.span>
                        </>
                      )}
                      <IconButton icon={Plus} label="Ekle" tone="success" onClick={() => addToBasket(m.name)} />
                    </div>
                  </li>
                );
              })}
          </ul>

          {/* live basket */}
          <AnimatePresence initial={false}>
            {basketCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--d-surface-2)] px-3 py-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                    <CreditCard className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Sepet ·{" "}
                    <span className="font-semibold text-[var(--d-fg)]">
                      <DemoCounter value={basketCount} /> ürün
                    </span>
                  </span>
                  <span className="font-bold text-[var(--d-accent)]">
                    ₺<DemoCounter value={basketTotal} format={(n) => fmtTRY(n)} />
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={placeOrder}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--d-accent)] py-2 text-[11px] font-bold text-[var(--d-accent-fg)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
            disabled={basketCount === 0}
          >
            <Send className="h-3.5 w-3.5" /> Sipariş Ver
            {basketCount > 0 && (
              <>
                {" · ₺"}
                <DemoCounter value={basketTotal} format={(n) => fmtTRY(n)} />
              </>
            )}
          </button>
        </div>
      </PhoneFrame>
    );
  }

  /* ---------- the table grid (reused in genel + masalar) ---------- */
  function tableGrid() {
    return (
      <Panel title="Masa Durumu" action="Dokun · durumu değiştir">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {tables.map((t) => (
            <button
              key={t.no}
              type="button"
              onClick={() => cycleTable(t.no)}
              className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] p-2.5 text-left transition-all hover:border-[var(--d-accent)]/50 active:scale-[0.97]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[var(--d-fg)]">{t.no}</span>
                <motion.span
                  key={t.state}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Tag tone={tableTone[t.state]}>{t.state}</Tag>
                </motion.span>
              </div>
              <div className="mt-1.5 truncate text-[10px] text-[var(--d-faint)]">{t.info}</div>
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-[var(--d-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--d-pos)]" /> Boş ·{" "}
            <span className="font-semibold text-[var(--d-fg)]">
              <DemoCounter value={counts["Boş"]} />
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--d-neg)]" /> Dolu ·{" "}
            <span className="font-semibold text-[var(--d-fg)]">
              <DemoCounter value={counts["Dolu"]} />
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--d-warn)]" /> Rezerve ·{" "}
            <span className="font-semibold text-[var(--d-fg)]">
              <DemoCounter value={counts["Rezerve"]} />
            </span>
          </span>
        </div>
      </Panel>
    );
  }

  /* ---------- VIEWS ---------- */
  function genelView() {
    return (
      <div className="space-y-3">
        {/* stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="Bugünkü Ciro"
            value={<DemoCounter value={ciro} format={(n) => `₺${fmtTRY(n)}`} />}
            delta="+22%"
            icon={Wallet}
          />
          <StatTile
            label="Aktif Masa"
            value={
              <span>
                <DemoCounter value={aktifMasa} />
                <span className="text-[var(--d-faint)]">/{tables.length}</span>
              </span>
            }
            delta="+3"
            icon={UtensilsCrossed}
          />
          <StatTile
            label="Online Sipariş"
            value={<DemoCounter value={onlineCount} />}
            delta="+11"
            icon={CreditCard}
          />
          <StatTile
            label="Rezervasyon"
            value={<DemoCounter value={rezCount} />}
            delta="+2"
            icon={CalendarCheck}
          />
        </div>

        {/* table grid + qr menu phone */}
        <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          {tableGrid()}
          {qrMenuPhone()}
        </div>

        {/* orders + popular + sales */}
        <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
          <Panel title="Online Siparişler" action="Mutfak · Canlı">
            <ul className="space-y-2">
              <AnimatePresence initial={false}>{orders.map((o) => orderRow(o))}</AnimatePresence>
            </ul>
          </Panel>

          <div className="space-y-3">
            <Panel title="Günlük Satış">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-[var(--d-fg)]">
                    ₺<DemoCounter value={ciro} format={(n) => fmtTRY(n)} />
                  </div>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-pos)]">
                    <TrendingUp className="h-3 w-3" /> dün bu saate göre +22%
                  </div>
                </div>
                <Clock className="h-5 w-5 text-[var(--d-accent)]" />
              </div>
              <Sparkline data={[12, 18, 15, 26, 22, 34, 30, 44, 49]} className="mt-3 h-10" />
              <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--d-faint)]">
                <span>10:00</span>
                <span>14:00</span>
                <span>18:00</span>
                <span>22:00</span>
              </div>
            </Panel>

            <Panel title="Popüler Ürünler" action="Bugün · Canlı">
              <ul className="space-y-2.5">
                {popular.slice(0, 4).map((p) => (
                  <li key={p.name}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[var(--d-muted)]">{p.name}</span>
                      <span className="font-semibold text-[var(--d-fg)]">
                        <DemoCounter value={p.count} /> · ₺{p.price}
                      </span>
                    </div>
                    <Bar value={(p.count / maxPopular) * 100} className="mt-1" />
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>

        {/* today's reservations — toggle status */}
        <Panel title="Bugünkü Rezervasyonlar" action="Dokun · onay durumu">
          <ul className="grid gap-2 sm:grid-cols-2">{reservations.map((r) => reservationRow(r))}</ul>
        </Panel>

        {/* google review + campaign */}
        <div className="grid gap-3 lg:grid-cols-2">
          <Panel title="Google Yorum" action="Otomatik">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center rounded-xl bg-[var(--d-accent)]/12 px-4 py-2.5">
                <span className="text-2xl font-bold text-[var(--d-accent)]">4.8</span>
                <span className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="h-3 w-3 fill-[var(--d-accent)] text-[var(--d-accent)]" />
                  ))}
                </span>
              </div>
              <div className="min-w-0 flex-1 text-[12px] leading-relaxed text-[var(--d-muted)]">
                <span className="font-semibold text-[var(--d-fg)]">312</span> Google değerlendirmesi · bu ay{" "}
                <span className="font-semibold text-[var(--d-pos)]">+24 yeni yorum</span>. Memnun müşterilere otomatik
                yorum linki gönderilir.
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#25D366]/10 px-3 py-2.5">
              <span className="inline-flex items-center gap-2 text-[11.5px] text-[var(--d-muted)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-[#06210f]">
                  <MessageCircle className="h-3.5 w-3.5" />
                </span>
                Ayşe Hanım&apos;a teşekkür mesajı + yorum linki
              </span>
              <button
                type="button"
                onClick={() =>
                  toast({
                    title: "Yorum linki gönderildi",
                    desc: "Ayşe Hanım'a WhatsApp ile Google yorum linki iletildi",
                    tone: "success",
                    icon: MessageCircle,
                  })
                }
                className="rounded-full bg-[var(--d-accent)] px-2.5 py-1 text-[10px] font-bold text-[var(--d-accent-fg)] transition-transform hover:scale-[1.04] active:scale-95"
              >
                Yorum İste
              </button>
            </div>
          </Panel>

          <Panel title="Aktif Kampanya" action="Bu Hafta">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--d-accent)]/15 text-[var(--d-accent)]">
                <Megaphone className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-[var(--d-fg)]">Hafta İçi Öğle Menüsü · %20 İndirim</div>
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
    );
  }

  function menuView() {
    return (
      <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr]">
        <Panel
          title="Menü Yönetimi"
          action={`${MENU.flatMap((m) => m.items).filter((i) => itemActive[i.name]).length} aktif ürün`}
        >
          <div className="mb-3 flex flex-wrap gap-1.5">
            {MENU.map((m) => {
              const active = m.cat === activeCat;
              return (
                <button
                  key={m.cat}
                  type="button"
                  onClick={() => setActiveCat(m.cat)}
                  className={
                    "rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors " +
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
          <ul className="space-y-2">
            {activeItems.map((m) => (
              <li
                key={m.name}
                className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--d-accent)]/12 text-[var(--d-accent)]">
                  <Salad className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{m.name}</div>
                  <div className="truncate text-[11px] text-[var(--d-faint)]">{m.desc}</div>
                </div>
                <span className="shrink-0 text-[12.5px] font-bold text-[var(--d-accent)]">₺{m.price}</span>
                <span className="hidden w-12 shrink-0 text-right text-[11px] font-medium text-[var(--d-muted)] sm:block">
                  {itemActive[m.name] ? "Aktif" : "Pasif"}
                </span>
                <Toggle
                  checked={itemActive[m.name]}
                  onChange={(v) => {
                    setItemActive((s) => ({ ...s, [m.name]: v }));
                    toast({
                      title: v ? "Ürün menüye eklendi" : "Ürün menüden gizlendi",
                      desc: m.name,
                      tone: v ? "success" : "warn",
                      icon: Salad,
                    });
                  }}
                />
              </li>
            ))}
          </ul>
        </Panel>
        <div className="space-y-3">
          <Panel title="QR Menü Önizleme" action="Masa M5">
            {qrMenuPhone()}
          </Panel>
        </div>
      </div>
    );
  }

  function siparislerView() {
    const chips = [
      { k: "Toplam", v: orders.length },
      { k: "Yeni", v: orders.filter((o) => o.status === "Yeni").length },
      { k: "Hazırlanıyor", v: orders.filter((o) => o.status === "Hazırlanıyor").length },
      { k: "Servis", v: orders.filter((o) => o.status === "Servis edildi").length },
    ];
    return (
      <Panel title="Online Siparişler" action="Getir · Yemeksepeti · QR Masa">
        <div className="mb-3 grid grid-cols-4 gap-2">
          {chips.map((c) => (
            <div
              key={c.k}
              className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2 text-center"
            >
              <div className="text-lg font-bold text-[var(--d-fg)]">{c.v}</div>
              <div className="text-[10px] text-[var(--d-faint)]">{c.k}</div>
            </div>
          ))}
        </div>
        <ul className="space-y-2">
          <AnimatePresence initial={false}>{orders.map((o) => orderRow(o))}</AnimatePresence>
        </ul>
      </Panel>
    );
  }

  function masalarView() {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Boş" value={<DemoCounter value={counts["Boş"]} />} icon={UtensilsCrossed} />
          <StatTile label="Dolu" value={<DemoCounter value={counts["Dolu"]} />} icon={UtensilsCrossed} />
          <StatTile label="Rezerve" value={<DemoCounter value={counts["Rezerve"]} />} icon={CalendarCheck} />
        </div>
        {tableGrid()}
      </div>
    );
  }

  function rezervasyonlarView() {
    const onayli = reservations.filter((r) => r.status === "Onaylı").length;
    return (
      <Panel title="Bugünkü Rezervasyonlar" action={`${onayli}/${reservations.length} onaylı`}>
        <div className="mb-3 flex items-start gap-3 rounded-xl bg-[var(--d-accent)]/10 p-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--d-accent)]/20 text-[var(--d-accent)]">
            <CalendarCheck className="h-4 w-4" />
          </span>
          <div className="text-[12px] leading-relaxed text-[var(--d-muted)]">
            Bugün <span className="font-semibold text-[var(--d-fg)]">{reservations.length}</span> rezervasyon var. Onay
            durumunu değiştirmek için sağdaki etikete dokunun; müşteriye otomatik WhatsApp bilgilendirmesi gider.
          </div>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">{reservations.map((r) => reservationRow(r))}</ul>
      </Panel>
    );
  }

  function mutfakView() {
    const queue = orders.filter((o) => o.status !== "Servis edildi");
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <StatTile
            label="Yeni"
            value={<DemoCounter value={orders.filter((o) => o.status === "Yeni").length} />}
            icon={CreditCard}
          />
          <StatTile
            label="Hazırlanıyor"
            value={<DemoCounter value={orders.filter((o) => o.status === "Hazırlanıyor").length} />}
            icon={ChefHat}
          />
          <StatTile
            label="Hazır"
            value={<DemoCounter value={orders.filter((o) => o.status === "Hazır").length} />}
            icon={Check}
          />
        </div>
        <Panel title="Mutfak Ekranı (KDS)" action="Aktif siparişler">
          {queue.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-8 text-center text-[12px] text-[var(--d-faint)]">
              Bekleyen sipariş yok. Tüm siparişler servis edildi.
            </div>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {queue.map((o) => (
                <li
                  key={o.code}
                  className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[var(--d-accent)]">{o.code}</span>
                    <Tag tone={orderTone[o.status]}>{o.status}</Tag>
                  </div>
                  <div className="mt-1 text-[11px] text-[var(--d-faint)]">{o.channel}</div>
                  <div className="mt-1 text-[12px] font-medium text-[var(--d-fg)]">{o.items}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <DemoActionButton variant="soft" onClick={() => advanceOrder(o.code)} className="flex-1">
                      <ChefHat className="h-3.5 w-3.5" /> {orderNext[o.status]}
                    </DemoActionButton>
                    {o.status === "Hazır" ? (
                      <DemoActionButton variant="solid" onClick={() => advanceOrder(o.code)}>
                        <Check className="h-3.5 w-3.5" /> Servis
                      </DemoActionButton>
                    ) : (
                      <DemoActionButton
                        variant="solid"
                        onClick={() => {
                          setOrders((prev) =>
                            prev.map((x) => (x.code === o.code ? { ...x, status: "Hazır" } : x)),
                          );
                          toast({ title: `${o.code} · Hazır`, desc: "Servise hazır", tone: "success", icon: Check });
                        }}
                      >
                        <Check className="h-3.5 w-3.5" /> Hazır
                      </DemoActionButton>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    );
  }

  function kampanyalarView() {
    const aktif = campaigns.filter((c) => c.running).length;
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatTile label="Aktif Kampanya" value={<DemoCounter value={aktif} />} icon={Megaphone} />
          <StatTile label="Toplam Kullanım" value="277 kez" icon={TrendingUp} />
          <StatTile label="Ek Ciro" value="₺30.450" icon={Wallet} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {campaigns.map((c) => (
            <Panel
              key={c.id}
              title={c.title}
              action={
                <span
                  className={
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                    (c.running
                      ? "bg-[var(--d-pos)]/15 text-[var(--d-pos)]"
                      : "bg-[var(--d-surface-2)] text-[var(--d-faint)]")
                  }
                >
                  {c.running ? "Yayında" : "Durduruldu"}
                </span>
              }
            >
              <p className="text-[11.5px] leading-relaxed text-[var(--d-muted)]">{c.desc}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2">
                  <div className="text-[10px] text-[var(--d-faint)]">Kullanım</div>
                  <div className="text-[14px] font-bold text-[var(--d-fg)]">{c.uses}</div>
                </div>
                <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2">
                  <div className="text-[10px] text-[var(--d-faint)]">Ek Ciro</div>
                  <div className="text-[14px] font-bold text-[var(--d-accent)]">{c.extra}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2">
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--d-fg)]">
                  {c.running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {c.running ? "Durdur" : "Başlat"}
                </span>
                <Toggle checked={c.running} onChange={() => toggleCampaign(c.id)} />
              </div>
            </Panel>
          ))}
        </div>
      </div>
    );
  }

  function raporlarView() {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="Günlük Ciro"
            value={<DemoCounter value={ciro} format={(n) => `₺${fmtTRY(n)}`} />}
            delta="+22%"
            icon={Wallet}
          />
          <StatTile label="Haftalık Ciro" value={`₺${fmtTRY(ciro + 268000)}`} delta="+14%" icon={TrendingUp} />
          <StatTile label="Aylık Ciro" value={`₺${fmtTRY(ciro + 1142000)}`} delta="+9%" icon={Coffee} />
          <StatTile label="Ort. Adisyon" value="₺486" delta="+6%" icon={CreditCard} />
        </div>
        <Panel
          title="Son 7 Gün Ciro"
          action={
            <button
              type="button"
              onClick={() =>
                toast({
                  title: "Rapor hazırlandı",
                  desc: "Haftalık ciro raporu indirildi",
                  tone: "success",
                  icon: Download,
                })
              }
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-accent)]"
            >
              <Download className="h-3.5 w-3.5" /> Rapor İndir
            </button>
          }
        >
          <Sparkline data={[38, 44, 41, 52, 47, 61, Math.max(30, Math.round(ciro / 900))]} className="h-24" />
          <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--d-faint)]">
            <span>Pzt</span>
            <span>Sal</span>
            <span>Çar</span>
            <span>Per</span>
            <span>Cum</span>
            <span>Cmt</span>
            <span>Bugün</span>
          </div>
        </Panel>
        <Panel title="En Çok Satan Ürünler">
          <ul className="space-y-2.5">
            {popular.map((p) => (
              <li key={p.name}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--d-muted)]">{p.name}</span>
                  <span className="font-semibold text-[var(--d-fg)]">
                    {p.count} adet · ₺{fmtTRY(p.count * p.price)}
                  </span>
                </div>
                <Bar value={(p.count / maxPopular) * 100} className="mt-1" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }

  function ayarlarView() {
    const rows: { k: keyof typeof settings; label: string; desc: string }[] = [
      { k: "qrSiparis", label: "QR Masa Siparişi", desc: "Müşteriler masadaki QR'dan sipariş verebilir." },
      { k: "onlineRezervasyon", label: "Online Rezervasyon", desc: "Web sitesinden boş masa seçilip rezervasyon yapılır." },
      { k: "whatsapp", label: "WhatsApp Bilgilendirme", desc: "Rezervasyon onay ve hatırlatmaları otomatik gider." },
      { k: "googleYorum", label: "Otomatik Google Yorum", desc: "Memnun müşteriye yorum linki gönderilir." },
      { k: "stokUyari", label: "Azalan Stok Uyarısı", desc: "Stok azaldığında panelde uyarı gösterilir." },
    ];
    return (
      <div className="space-y-3">
        <Panel title="İşletme Ayarları">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SelectField
              label="Çalışma Saatleri"
              value={workHours}
              onChange={setWorkHours}
              options={["09:00 – 23:00", "10:00 – 24:00", "11:00 – 02:00"]}
            />
            <SelectField label="Servis Ücreti" value={serviceFee} onChange={setServiceFee} options={["Yok", "%5", "%10"]} />
            <SelectField
              label="Para Birimi"
              value={currency}
              onChange={setCurrency}
              options={["₺ Türk Lirası", "€ Euro", "$ Dolar"]}
            />
          </div>
        </Panel>
        <Panel title="Sistem & Bildirimler">
          <ul className="space-y-1">
            {rows.map((r) => (
              <li key={r.k} className="flex items-center gap-3 rounded-xl px-1 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-[var(--d-fg)]">{r.label}</div>
                  <div className="text-[11px] text-[var(--d-faint)]">{r.desc}</div>
                </div>
                <Toggle checked={settings[r.k]} onChange={(v) => setSettings((s) => ({ ...s, [r.k]: v }))} />
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-end">
            <DemoActionButton
              variant="solid"
              onClick={() => toast({ title: "Ayarlar kaydedildi", desc: "Tercihleriniz güncellendi", tone: "success", icon: Settings })}
            >
              Kaydet
            </DemoActionButton>
          </div>
        </Panel>
      </div>
    );
  }

  function renderView() {
    switch (view) {
      case "menu":
        return menuView();
      case "siparisler":
        return siparislerView();
      case "masalar":
        return masalarView();
      case "rezervasyonlar":
        return rezervasyonlarView();
      case "mutfak":
        return mutfakView();
      case "kampanyalar":
        return kampanyalarView();
      case "raporlar":
        return raporlarView();
      case "ayarlar":
        return ayarlarView();
      default:
        return genelView();
    }
  }

  return (
    <BrowserFrame url="restaurantos.app/pano">
      <div className="lg:grid lg:grid-cols-[180px_1fr] lg:gap-3">
        <DemoSidebar
          brand={{ icon: UtensilsCrossed, name: "RestaurantOS" }}
          items={SIDEBAR}
          active={view}
          onSelect={setView}
          onPresent={() => setPresentOpen(true)}
        />
        <div>
          <DemoMobileNav
            items={SIDEBAR}
            active={view}
            onSelect={setView}
            onPresent={() => setPresentOpen(true)}
          />
          <AnimatedView id={view}>{renderView()}</AnimatedView>
        </div>
      </div>

      <PresentationMode
        open={presentOpen}
        steps={STEPS}
        onClose={() => setPresentOpen(false)}
        onStepView={setView}
      />
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
        subtitle="Soldaki menüden her bölüme geçebilir, 'Sunum Modu' ile sistemi adım adım tanıtabilirsiniz. Panel gerçekten çalışır: QR menüden sipariş verin, masa durumu değiştirin, siparişi mutfakta ilerletin — ciro anında güncellenir."
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

      <DemoClosingCTA defaultSector="Restoran & Kafe" serif />
    </DemoShell>
  );
}
