"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CreditCard,
  Crown,
  Download,
  FileText,
  Gem,
  Heart,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Package,
  Phone,
  Plus,
  Repeat,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  UserCog,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  AnimatedView,
  Avatar,
  Bar,
  BrowserFrame,
  ConfirmDialog,
  DemoActionButton,
  DemoClosingCTA,
  DemoCounter,
  DemoHero,
  DemoMobileNav,
  DemoModal,
  DemoShell,
  DemoSidebar,
  DemoStage,
  Donut,
  FeatureGrid,
  FilterChips,
  IconButton,
  MiniBars,
  Panel,
  PresentationMode,
  PricingCards,
  ProblemSection,
  Scenario,
  Section,
  SearchInput,
  SelectField,
  SolutionSection,
  Sparkline,
  StatTile,
  Tag,
  TextField,
  Toggle,
  demoThemes,
  useDemoToast,
  type PresentationStep,
  type SidebarItem,
} from "@/components/demos/kit";

const fmtTRY = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/* --------------------------- demo data --------------------------- */
type Status = "onayli" | "bekliyor" | "tamamlandi" | "iptal" | "yeni";

type Appt = {
  id: number;
  time: string;
  name: string;
  phone: string;
  service: string;
  staff: string;
  price: number;
  skin: string;
  history: string[];
  status: Status;
};

type Pkg = {
  id: number;
  name: string;
  treatment: string;
  done: number;
  total: number;
  next: string;
  sessionPrice: number;
};

const STAFF = ["Uzm. Derya", "Esra", "Buse"];
const STAFF_ROLE: Record<string, string> = {
  "Uzm. Derya": "Cilt Uzmanı",
  Esra: "Lazer Uzmanı",
  Buse: "Estetisyen",
};
const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
const SERVICE_PRICES: Record<string, number> = {
  "Lazer Epilasyon": 1200,
  "Cilt Bakımı": 650,
  Hydrafacial: 900,
  "Bölgesel İncelme": 1500,
  "Kaş Laminasyonu": 450,
  "Protez Tırnak": 550,
  "Kalıcı Makyaj": 2400,
};
const SERVICES = Object.keys(SERVICE_PRICES);

const STATUS_META: Record<Status, { label: string; tone: "accent" | "warn" | "success" | "danger" }> = {
  onayli: { label: "Onaylı", tone: "success" },
  bekliyor: { label: "Bekliyor", tone: "warn" },
  tamamlandi: { label: "Tamamlandı", tone: "success" },
  iptal: { label: "İptal", tone: "danger" },
  yeni: { label: "Yeni", tone: "accent" },
};

const SERVICE_FILTERS_BASE = [{ id: "all", label: "Tümü" }];

const INITIAL_APPTS: Appt[] = [
  {
    id: 1,
    time: "10:00",
    name: "Ayşe Demir",
    phone: "0532 111 22 33",
    service: "Hydrafacial",
    staff: "Uzm. Derya",
    price: 900,
    skin: "Karma cilt",
    history: ["Hydrafacial · 12 Haz", "Cilt Bakımı · 28 May"],
    status: "onayli",
  },
  {
    id: 2,
    time: "11:30",
    name: "Elif Yıldız",
    phone: "0533 222 33 44",
    service: "Lazer Epilasyon",
    staff: "Esra",
    price: 1200,
    skin: "Hassas cilt",
    history: ["Lazer Epilasyon · 14 Haz", "Lazer Epilasyon · 30 May"],
    status: "onayli",
  },
  {
    id: 3,
    time: "13:00",
    name: "Zeynep Kaya",
    phone: "0535 333 44 55",
    service: "Cilt Bakımı",
    staff: "Uzm. Derya",
    price: 650,
    skin: "Kuru cilt",
    history: ["Cilt Bakımı · 02 Haz", "Kaş Laminasyonu · 18 May"],
    status: "bekliyor",
  },
  {
    id: 4,
    time: "14:30",
    name: "Selin Arslan",
    phone: "0536 444 55 66",
    service: "Bölgesel İncelme",
    staff: "Buse",
    price: 1500,
    skin: "Normal cilt",
    history: ["Bölgesel İncelme · 10 Haz", "Bölgesel İncelme · 27 May"],
    status: "onayli",
  },
  {
    id: 5,
    time: "16:00",
    name: "Merve Şahin",
    phone: "0537 555 66 77",
    service: "Kaş Laminasyonu",
    staff: "Esra",
    price: 450,
    skin: "Yağlı cilt",
    history: ["İlk ziyaret"],
    status: "yeni",
  },
];

const INITIAL_PACKAGES: Pkg[] = [
  { id: 1, name: "Ayşe Demir", treatment: "Lazer Epilasyon", done: 6, total: 8, next: "12 Tem", sessionPrice: 1200 },
  { id: 2, name: "Elif Yıldız", treatment: "Hydrafacial", done: 2, total: 4, next: "08 Tem", sessionPrice: 900 },
  { id: 3, name: "Selin Arslan", treatment: "Bölgesel İncelme", done: 5, total: 10, next: "10 Tem", sessionPrice: 1500 },
  { id: 4, name: "Zeynep Kaya", treatment: "Cilt Bakımı", done: 3, total: 6, next: "15 Tem", sessionPrice: 650 },
];

/* baseline treatment counts so the bars stay populated as live data shifts */
const BASE_TREATMENT_COUNTS: Record<string, number> = {
  "Lazer Epilasyon": 41,
  Hydrafacial: 30,
  "Cilt Bakımı": 23,
  "Bölgesel İncelme": 17,
  "Kalıcı Makyaj": 11,
};

const SIDEBAR: SidebarItem[] = [
  { id: "genel", icon: LayoutDashboard, label: "Genel Bakış" },
  { id: "randevular", icon: CalendarDays, label: "Randevular" },
  { id: "musteriler", icon: Users, label: "Müşteriler" },
  { id: "seanslar", icon: Layers, label: "Seanslar" },
  { id: "paketler", icon: Package, label: "Paketler" },
  { id: "personeller", icon: UserCog, label: "Personeller" },
  { id: "gelir", icon: Wallet, label: "Gelir" },
  { id: "raporlar", icon: FileText, label: "Raporlar" },
  { id: "ayarlar", icon: Settings, label: "Ayarlar" },
];

const STEPS: PresentationStep[] = [
  { view: "genel", title: "Genel Bakış", text: "İşletmenizin günlük randevu, gelir ve aktif paket durumunu tek ekrandan görürsünüz.", action: "Üstteki canlı kartları gösterin." },
  { view: "randevular", title: "Randevular", text: "Randevuları düzenli takip eder, telefon ve DM trafiğini azaltırsınız.", action: "Bir randevuyu 'Tamamla' ile kapatın." },
  { view: "musteriler", title: "Müşteri Kartları", text: "Her müşterinin cilt tipi, geçmiş işlemleri ve notları kayıt altında tutulur.", action: "Bir müşteri kartını açın." },
  { view: "seanslar", title: "Seans ve Paket Takibi", text: "Paket alan müşterinin kalan seansı otomatik düşülür; 'kaç hakkım kaldı' tartışması biter.", action: "Bir pakette 'Seans Kullan'a basın; Donut güncellensin." },
  { view: "personeller", title: "Personel Performansı", text: "Hangi uzmanın ne kadar yoğun olduğunu ve performansını görürsünüz.", action: "Uzman performans kartlarını gösterin." },
  { view: "gelir", title: "Gelir Takibi", text: "Günlük ve aylık gelirinizi, paket satışlarını net görürsünüz.", action: "Gelir kartlarını gösterin." },
  { view: "genel", title: "Size Özel Kurulum", text: "Bu sistem merkezinizin işlemlerine, paketlerine ve çalışma düzenine göre özelleştirilebilir.", action: "Sunumu bitirip teklif aşamasına geçin." },
];

/* --------------------------- the interactive panel --------------------------- */
function BeautyPanel() {
  const toast = useDemoToast();

  const [appts, setAppts] = useState<Appt[]>(INITIAL_APPTS);
  const [packages, setPackages] = useState<Pkg[]>(INITIAL_PACKAGES);
  const [extraRevenue, setExtraRevenue] = useState(0);
  const [newCustomers, setNewCustomers] = useState(7);

  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [custQuery, setCustQuery] = useState("");

  const [view, setView] = useState("genel");
  const [presentOpen, setPresentOpen] = useState(false);

  const [selected, setSelected] = useState<Appt | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: SERVICES[0],
    staff: STAFF[0],
    time: SLOTS[0],
  });

  const [staffAvail, setStaffAvail] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(STAFF.map((s) => [s, true])),
  );
  const [settings, setSettings] = useState({ online: true, whatsapp: true, sms: false, kvkk: true });
  const [workHours, setWorkHours] = useState("10:00 – 19:00");
  const [interval, setIntervalVal] = useState("90 dk");

  /* derived, live stats */
  const active = appts.filter((a) => a.status !== "iptal");
  const completedRevenue = appts
    .filter((a) => a.status === "tamamlandi")
    .reduce((s, a) => s + a.price, 0);
  const gunlukGelir = completedRevenue + extraRevenue;
  const haftalik = 112400 + gunlukGelir;
  const aylik = 438000 + gunlukGelir;
  const aktifPaket = packages.reduce((s, p) => s + Math.max(0, p.total - p.done), 0);
  const paketGelir = 64000 + extraRevenue;

  /* live popular-treatment counts derived from appointments + base history */
  const treatmentBars = useMemo(() => {
    const counts: Record<string, number> = { ...BASE_TREATMENT_COUNTS };
    active.forEach((a) => {
      counts[a.service] = (counts[a.service] ?? 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [active]);
  const maxTreatment = Math.max(1, ...treatmentBars.map(([, c]) => c));

  /* treatment filter chips built from the appointment services present */
  const serviceFilters = useMemo(() => {
    const set = new Set(appts.map((a) => a.service));
    return [...SERVICE_FILTERS_BASE, ...[...set].map((s) => ({ id: s, label: s }))];
  }, [appts]);

  const visible = appts.filter((a) => {
    if (serviceFilter !== "all" && a.service !== serviceFilter) return false;
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return true;
    return (
      a.name.toLocaleLowerCase("tr").includes(q) ||
      a.service.toLocaleLowerCase("tr").includes(q)
    );
  });

  /* unique customers derived from appointments (latest record wins) */
  const customers = useMemo(() => {
    const m = new Map<string, { name: string; phone: string; skin: string; visits: number; last: string; history: string[] }>();
    appts.forEach((a) => {
      const e = m.get(a.name);
      if (e) {
        e.visits += 1;
        e.last = a.service;
      } else {
        m.set(a.name, { name: a.name, phone: a.phone, skin: a.skin, visits: 1 + a.history.length, last: a.service, history: a.history });
      }
    });
    return [...m.values()];
  }, [appts]);

  /* staff load + performance score */
  const staffLoad = STAFF.map((s) => {
    const count = active.filter((a) => a.staff === s).length;
    const rev = appts.filter((a) => a.staff === s && a.status === "tamamlandi").reduce((x, a) => x + a.price, 0);
    return { name: s, count, rev };
  });
  const STAFF_PERF: Record<string, number> = { "Uzm. Derya": 92, Esra: 84, Buse: 76 };

  const counts = {
    toplam: active.length,
    onayli: appts.filter((a) => a.status === "onayli").length,
    bekliyor: appts.filter((a) => a.status === "bekliyor").length,
    tamamlandi: appts.filter((a) => a.status === "tamamlandi").length,
  };

  /* actions */
  function complete(a: Appt) {
    if (a.status === "tamamlandi") return;
    setAppts((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: "tamamlandi" } : x)));
    toast({
      title: "Randevu tamamlandı",
      desc: `${a.name} · +₺${fmtTRY(a.price)} gelire eklendi`,
      tone: "success",
      icon: Check,
    });
  }

  function cancel(id: number) {
    const a = appts.find((x) => x.id === id);
    setAppts((prev) => prev.map((x) => (x.id === id ? { ...x, status: "iptal" } : x)));
    if (a) toast({ title: "Randevu iptal edildi", desc: a.name, tone: "danger", icon: X });
  }

  function consumeSession(pkg: Pkg) {
    if (pkg.done >= pkg.total) {
      toast({ title: "Paket zaten dolu", desc: `${pkg.name} · yenileme zamanı`, tone: "warn", icon: Repeat });
      return;
    }
    const nextDone = pkg.done + 1;
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? { ...p, done: nextDone } : p)));
    setExtraRevenue((r) => r + pkg.sessionPrice);
    if (nextDone === pkg.total) {
      toast({
        title: "Paket tamamlandı · yenileme zamanı",
        desc: `${pkg.name} · ${pkg.treatment} · +₺${fmtTRY(pkg.sessionPrice)}`,
        tone: "warn",
        icon: Repeat,
      });
    } else {
      toast({
        title: "Seans kullanıldı",
        desc: `${pkg.name} · ${nextDone}/${pkg.total} · +₺${fmtTRY(pkg.sessionPrice)}`,
        tone: "success",
        icon: Check,
      });
    }
  }

  function renewPackage(pkg: Pkg) {
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? { ...p, done: 0 } : p)));
    toast({ title: "Paket yenilendi", desc: `${pkg.name} · ${pkg.treatment}`, tone: "success", icon: Repeat });
  }

  function addCustomer() {
    if (!form.name.trim()) {
      toast({ title: "Ad Soyad gerekli", tone: "warn", icon: UserPlus });
      return;
    }
    const id = Math.max(0, ...appts.map((a) => a.id)) + 1;
    const appt: Appt = {
      id,
      time: form.time,
      name: form.name.trim(),
      phone: form.phone.trim() || "—",
      service: form.service,
      staff: form.staff,
      price: SERVICE_PRICES[form.service],
      skin: "Belirtilmedi",
      history: ["İlk ziyaret"],
      status: "yeni",
    };
    setAppts((prev) => [...prev, appt].sort((a, b) => a.time.localeCompare(b.time)));
    setNewCustomers((n) => n + 1);
    toast({ title: "Yeni müşteri eklendi", desc: `${appt.name} · ${appt.time}`, tone: "success", icon: UserPlus });
    setForm({ name: "", phone: "", service: SERVICES[0], staff: STAFF[0], time: SLOTS[0] });
    setAddOpen(false);
  }

  function openCustomer(name: string) {
    const ap = [...appts].reverse().find((a) => a.name === name);
    if (ap) setSelected(ap);
  }

  function sendReminder() {
    toast({
      title: "Hatırlatmalar gönderildi",
      desc: `${active.length} müşteriye WhatsApp mesajı`,
      tone: "success",
      icon: MessageCircle,
    });
  }

  /* ---------- appointment row (shared by Genel & Randevular) ---------- */
  function apptRow(a: Appt) {
    const meta = STATUS_META[a.status];
    const isActive = a.status === "onayli" || a.status === "bekliyor" || a.status === "yeni";
    return (
      <li
        key={a.id}
        onClick={() => setSelected(a)}
        className={
          "group flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 transition-colors hover:border-[var(--d-accent)]/40 " +
          (a.status === "iptal" ? "opacity-60" : "")
        }
      >
        <span className="w-11 text-[12px] font-semibold tabular-nums text-[var(--d-accent)]">{a.time}</span>
        <Avatar name={a.name} className="h-8 w-8" />
        <div className="min-w-0 flex-1">
          <div className={"truncate text-[12.5px] font-medium text-[var(--d-fg)] " + (a.status === "iptal" ? "line-through" : "")}>{a.name}</div>
          <div className="truncate text-[11px] text-[var(--d-faint)]">{a.service} · {a.staff}</div>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {isActive && (
            <>
              <IconButton icon={Check} label="Tamamla" tone="success" onClick={() => complete(a)} />
              <IconButton icon={X} label="İptal et" tone="danger" onClick={() => setConfirmId(a.id)} />
            </>
          )}
          {a.status === "tamamlandi" && <Tag tone={meta.tone}>{meta.label}</Tag>}
          {isActive && <span className="hidden sm:block"><Tag tone={meta.tone}>{meta.label}</Tag></span>}
          {a.status === "iptal" && <Tag tone={meta.tone}>{meta.label}</Tag>}
        </div>
      </li>
    );
  }

  /* ---------- package row (shared by Genel, Seanslar, Paketler) ---------- */
  function packageRow(p: Pkg) {
    const pct = Math.round((p.done / p.total) * 100);
    const full = p.done >= p.total;
    return (
      <li
        key={p.id}
        className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
      >
        <Donut value={pct} size={48} label={`${p.done}/${p.total}`} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{p.name}</div>
          <div className="truncate text-[11px] text-[var(--d-faint)]">{p.treatment}</div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <Bar value={pct} className="max-w-[100px]" />
            <span className="shrink-0 text-[10px] font-medium text-[var(--d-muted)]">Sonraki · {p.next}</span>
          </div>
        </div>
        {full ? (
          <button
            type="button"
            onClick={() => renewPackage(p)}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--d-accent)] px-2.5 py-1.5 text-[10.5px] font-semibold text-[var(--d-accent-fg)] transition-transform hover:scale-[1.03]"
          >
            <Repeat className="h-3 w-3" /> Yenile
          </button>
        ) : (
          <button
            type="button"
            onClick={() => consumeSession(p)}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--d-border)] bg-[var(--d-surface)] px-2.5 py-1.5 text-[10.5px] font-semibold text-[var(--d-accent)] transition-colors hover:border-[var(--d-accent)]/50"
          >
            <Check className="h-3 w-3" /> Seans Kullan
          </button>
        )}
      </li>
    );
  }

  /* ---------- VIEWS ---------- */
  function genelView() {
    return (
      <div className="space-y-3">
        {/* stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Bugünkü Randevu" value={<DemoCounter value={active.length} />} delta="+4" icon={CalendarDays} />
          <StatTile label="Aktif Paket" value={<DemoCounter value={aktifPaket} />} delta="+6" icon={Package} />
          <StatTile label="Günlük Gelir" value={<DemoCounter value={gunlukGelir} format={(n) => `₺${fmtTRY(n)}`} />} delta="+22%" icon={Wallet} />
          <StatTile label="Yeni Müşteri" value={<DemoCounter value={newCustomers} />} delta="+3" icon={UserPlus} />
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr]">
          {/* appointments — interactive */}
          <Panel
            title="Bugünün Randevuları"
            action={
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--d-accent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--d-accent-fg)] transition-transform hover:scale-[1.03]"
              >
                <Plus className="h-3 w-3" /> Randevu Ekle
              </button>
            }
          >
            <div className="mb-2.5 space-y-2">
              <SearchInput value={query} onChange={setQuery} placeholder="Müşteri veya işlem ara…" />
              <FilterChips options={serviceFilters} value={serviceFilter} onChange={setServiceFilter} />
            </div>
            <ul className="space-y-2">
              {visible.slice(0, 6).map((a) => apptRow(a))}
              {visible.length === 0 && (
                <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-6 text-center text-[12px] text-[var(--d-faint)]">
                  Sonuç bulunamadı.
                </li>
              )}
            </ul>
          </Panel>

          {/* package & session tracking — the signature panel */}
          <Panel title="Paket & Seans Takibi" action={`Aktif ${aktifPaket}`}>
            <ul className="space-y-3">{packages.map((p) => packageRow(p))}</ul>
          </Panel>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
          {/* weekly revenue */}
          <Panel title="Haftalık Gelir">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-[var(--d-fg)]">
                  ₺<DemoCounter value={haftalik} format={(n) => fmtTRY(n)} />
                </div>
                <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-pos)]">
                  <TrendingUp className="h-3 w-3" /> bugünkü gelir dahil
                </div>
              </div>
              <CreditCard className="h-5 w-5 text-[var(--d-accent)]" />
            </div>
            <Sparkline data={[28, 34, 30, 46, 42, 58, 70]} className="mt-3 h-10" />
          </Panel>

          {/* popular treatments — live */}
          <Panel title="Popüler İşlemler">
            <ul className="space-y-2.5">
              {treatmentBars.slice(0, 4).map(([name, count]) => (
                <li key={name}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[var(--d-muted)]">{name}</span>
                    <span className="font-semibold text-[var(--d-fg)]">{count}</span>
                  </div>
                  <Bar value={(count / maxTreatment) * 100} className="mt-1" />
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
                  <button
                    type="button"
                    onClick={sendReminder}
                    className="rounded-full bg-[#25D366] px-3 py-1 text-[10px] font-semibold text-[#06210f] transition-transform hover:scale-[1.03]"
                  >
                    Şimdi Gönder
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toast({ title: "Hatırlatma ertelendi", desc: "Elif Hanım · 1 saat sonra", tone: "default", icon: Bell })
                    }
                    className="rounded-full border border-[var(--d-border)] px-3 py-1 text-[10px] font-semibold text-[var(--d-muted)] transition-colors hover:text-[var(--d-fg)]"
                  >
                    Ertele
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const pkg = packages.find((p) => p.done >= p.total);
                  if (pkg) {
                    renewPackage(pkg);
                  } else {
                    toast({ title: "Paket yenileme önerildi", desc: "Ayşe Demir · yenileme mesajı planlandı", tone: "warn", icon: Package });
                  }
                }}
                className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2 text-[11px] transition-colors hover:border-[var(--d-accent)]/50"
              >
                <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                  <Package className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Paket bitiyor
                </span>
                <span className="font-semibold text-[var(--d-fg)]">Ayşe Demir · 8/8 · yenileme</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  toast({ title: "Sadakat indirimi gönderildi", desc: "14. ziyaret · %15 indirim kuponu", tone: "success", icon: Crown })
                }
                className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2 text-[11px] transition-colors hover:border-[var(--d-accent)]/50"
              >
                <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                  <Crown className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Sadık müşteri
                </span>
                <span className="font-semibold text-[var(--d-fg)]">14. ziyaret · %15 indirim</span>
              </button>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  function randevularView() {
    const chips = [
      { k: "Toplam", v: counts.toplam },
      { k: "Onaylı", v: counts.onayli },
      { k: "Bekliyor", v: counts.bekliyor },
      { k: "Tamamlandı", v: counts.tamamlandi },
    ];
    return (
      <Panel
        title="Tüm Randevular"
        action={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--d-accent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--d-accent-fg)] transition-transform hover:scale-[1.03]"
          >
            <Plus className="h-3 w-3" /> Randevu Ekle
          </button>
        }
      >
        <div className="mb-3 grid grid-cols-4 gap-2">
          {chips.map((c) => (
            <div key={c.k} className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2 text-center">
              <div className="text-lg font-bold text-[var(--d-fg)]">{c.v}</div>
              <div className="text-[10px] text-[var(--d-faint)]">{c.k}</div>
            </div>
          ))}
        </div>
        <div className="mb-2.5 space-y-2">
          <SearchInput value={query} onChange={setQuery} placeholder="Müşteri veya işlem ara…" />
          <FilterChips options={serviceFilters} value={serviceFilter} onChange={setServiceFilter} />
        </div>
        <ul className="space-y-2">
          {visible.map((a) => apptRow(a))}
          {visible.length === 0 && (
            <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-8 text-center text-[12px] text-[var(--d-faint)]">
              Bu filtreyle randevu yok.
            </li>
          )}
        </ul>
      </Panel>
    );
  }

  function musterilerView() {
    const list = customers.filter((c) =>
      c.name.toLocaleLowerCase("tr").includes(custQuery.trim().toLocaleLowerCase("tr")),
    );
    return (
      <Panel
        title="Müşteriler"
        action={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--d-accent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--d-accent-fg)] transition-transform hover:scale-[1.03]"
          >
            <Plus className="h-3 w-3" /> Yeni Müşteri
          </button>
        }
      >
        <div className="mb-2.5">
          <SearchInput value={custQuery} onChange={setCustQuery} placeholder="Müşteri ara…" />
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {list.map((c) => (
            <li
              key={c.name}
              onClick={() => openCustomer(c.name)}
              className="group cursor-pointer rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 transition-colors hover:border-[var(--d-accent)]/40"
            >
              <div className="flex items-center gap-3">
                <Avatar name={c.name} className="h-9 w-9" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{c.name}</div>
                  <div className="truncate text-[11px] text-[var(--d-faint)]">{c.phone}</div>
                </div>
                <Tag tone="accent">{c.skin}</Tag>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-[var(--d-border)] pt-2 text-[11px]">
                <span className="text-[var(--d-muted)]">{c.visits} işlem · son: {c.last}</span>
                <span className="font-semibold text-[var(--d-accent)]">Kartı Aç</span>
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-8 text-center text-[12px] text-[var(--d-faint)] sm:col-span-2">
              Müşteri bulunamadı.
            </li>
          )}
        </ul>
      </Panel>
    );
  }

  function seanslarView() {
    const totalDone = packages.reduce((s, p) => s + p.done, 0);
    const totalSlots = packages.reduce((s, p) => s + p.total, 0);
    const completionPct = Math.round((totalDone / Math.max(1, totalSlots)) * 100);
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatTile label="Kullanılan Seans" value={<DemoCounter value={totalDone} />} delta="+1" icon={Layers} />
          <StatTile label="Kalan Seans" value={<DemoCounter value={aktifPaket} />} icon={Package} />
          <StatTile label="Seans Geliri" value={<DemoCounter value={paketGelir} format={(n) => `₺${fmtTRY(n)}`} />} delta="+22%" icon={Wallet} />
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
          <Panel title="Seans Takibi" action={`Aktif ${aktifPaket}`}>
            <ul className="space-y-3">{packages.map((p) => packageRow(p))}</ul>
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--d-faint)]">
              &ldquo;Seans Kullan&rdquo; ile kalan hak otomatik düşer, Donut ve gelir anında güncellenir.
            </p>
          </Panel>
          <Panel title="Paket Doluluğu">
            <div className="flex flex-col items-center justify-center py-2">
              <Donut value={completionPct} size={120} label={`%${completionPct}`} />
              <div className="mt-3 text-center">
                <div className="text-[12px] text-[var(--d-muted)]">Toplam seans ilerlemesi</div>
                <div className="text-[13px] font-semibold text-[var(--d-fg)]">{totalDone} / {totalSlots} seans</div>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2">
                <div className="text-lg font-bold text-[var(--d-fg)]">{packages.length}</div>
                <div className="text-[10px] text-[var(--d-faint)]">Aktif Paket</div>
              </div>
              <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2">
                <div className="text-lg font-bold text-[var(--d-fg)]">{packages.filter((p) => p.done >= p.total).length}</div>
                <div className="text-[10px] text-[var(--d-faint)]">Yenilenecek</div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  function paketlerView() {
    return (
      <Panel
        title="Müşteri Paketleri"
        action={`${packages.length} paket · ${aktifPaket} kalan seans`}
      >
        <ul className="space-y-2">
          {packages.map((p) => {
            const pct = Math.round((p.done / p.total) * 100);
            const full = p.done >= p.total;
            return (
              <li key={p.id} className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--d-accent)]/15 text-[var(--d-accent)]">
                    <Package className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{p.name}</div>
                    <div className="truncate text-[11px] text-[var(--d-faint)]">{p.treatment} · ₺{fmtTRY(p.sessionPrice)}/seans</div>
                  </div>
                  <Tag tone={full ? "warn" : "accent"}>{full ? "Yenilenecek" : `${p.done}/${p.total}`}</Tag>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <Bar value={pct} />
                  <button
                    type="button"
                    onClick={() => renewPackage(p)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--d-border)] bg-[var(--d-surface)] px-2.5 py-1.5 text-[10.5px] font-semibold text-[var(--d-accent)] transition-colors hover:border-[var(--d-accent)]/50"
                  >
                    <Repeat className="h-3 w-3" /> Paketi Yenile
                  </button>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-[var(--d-faint)]">
                  <span>Sonraki seans · {p.next}</span>
                  <span>Kalan {Math.max(0, p.total - p.done)} seans</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    );
  }

  function personellerView() {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {staffLoad.map((p) => (
          <Panel key={p.name} title={p.name} action={STAFF_ROLE[p.name]}>
            <div className="flex items-center gap-3">
              <Avatar name={p.name} className="h-11 w-11 text-[13px]" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--d-muted)]">Performans</span>
                  <span className="font-semibold text-[var(--d-fg)]">%{STAFF_PERF[p.name]}</span>
                </div>
                <Bar value={STAFF_PERF[p.name]} className="mt-1.5" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2 text-center">
                <div className="text-lg font-bold text-[var(--d-fg)]">{p.count}</div>
                <div className="text-[10px] text-[var(--d-faint)]">Bugünkü randevu</div>
              </div>
              <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2 text-center">
                <div className="text-lg font-bold text-[var(--d-fg)]">₺{fmtTRY(p.rev)}</div>
                <div className="text-[10px] text-[var(--d-faint)]">Bugünkü gelir</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2">
              <span className="text-[12px] font-medium text-[var(--d-fg)]">{staffAvail[p.name] ? "Müsait" : "İzinli"}</span>
              <Toggle
                checked={staffAvail[p.name]}
                onChange={(v) => {
                  setStaffAvail((s) => ({ ...s, [p.name]: v }));
                  toast({ title: v ? "Uzman müsait" : "Uzman izinli", desc: p.name, tone: v ? "success" : "warn", icon: UserCog });
                }}
              />
            </div>
          </Panel>
        ))}
      </div>
    );
  }

  function gelirView() {
    const revByService = SERVICES.map((s) => ({
      s,
      rev: appts.filter((a) => a.service === s && a.status === "tamamlandi").reduce((x, a) => x + a.price, 0),
    }))
      .filter((r) => r.rev > 0)
      .sort((a, b) => b.rev - a.rev);
    const maxRev = Math.max(1, ...revByService.map((r) => r.rev));
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile label="Günlük Gelir" value={<DemoCounter value={gunlukGelir} format={(n) => `₺${fmtTRY(n)}`} />} delta="+22%" icon={Wallet} />
          <StatTile label="Haftalık Gelir" value={<DemoCounter value={haftalik} format={(n) => `₺${fmtTRY(n)}`} />} delta="+14%" icon={TrendingUp} />
          <StatTile label="Aylık Gelir" value={<DemoCounter value={aylik} format={(n) => `₺${fmtTRY(n)}`} />} delta="+9%" icon={CreditCard} />
        </div>
        <Panel
          title="Son 7 Gün"
          action={
            <button
              type="button"
              onClick={() => toast({ title: "Rapor hazırlandı", desc: "Haftalık gelir raporu indirildi", tone: "success", icon: Download })}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-accent)]"
            >
              <Download className="h-3.5 w-3.5" /> Rapor İndir
            </button>
          }
        >
          <MiniBars data={[42, 55, 48, 63, 58, 71, Math.max(20, Math.round(gunlukGelir / 200))]} className="h-24" />
          <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--d-faint)]">
            <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Bugün</span>
          </div>
        </Panel>
        <div className="grid gap-3 lg:grid-cols-2">
          <Panel title="İşlem Bazlı Gelir (Bugün)">
            {revByService.length === 0 ? (
              <div className="px-1 py-6 text-center text-[12px] text-[var(--d-faint)]">
                Henüz tamamlanan işlem yok. Bir randevuyu tamamlayın.
              </div>
            ) : (
              <ul className="space-y-2.5">
                {revByService.map((r) => (
                  <li key={r.s}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[var(--d-muted)]">{r.s}</span>
                      <span className="font-semibold text-[var(--d-fg)]">₺{fmtTRY(r.rev)}</span>
                    </div>
                    <Bar value={(r.rev / maxRev) * 100} className="mt-1" />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Gelir Kırılımı">
            <ul className="space-y-2">
              <li className="flex items-center justify-between rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 text-[12px]">
                <span className="inline-flex items-center gap-2 text-[var(--d-muted)]">
                  <CalendarDays className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Randevu Geliri
                </span>
                <span className="font-semibold text-[var(--d-fg)]">₺{fmtTRY(completedRevenue)}</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 text-[12px]">
                <span className="inline-flex items-center gap-2 text-[var(--d-muted)]">
                  <Package className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Paket / Seans Geliri
                </span>
                <span className="font-semibold text-[var(--d-fg)]">₺{fmtTRY(paketGelir)}</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 text-[12px]">
                <span className="inline-flex items-center gap-2 text-[var(--d-muted)]">
                  <Gem className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Ortalama İşlem Tutarı
                </span>
                <span className="font-semibold text-[var(--d-fg)]">₺{fmtTRY(SERVICES.reduce((s, x) => s + SERVICE_PRICES[x], 0) / SERVICES.length)}</span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    );
  }

  function raporlarView() {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Aylık Gelir" value={<DemoCounter value={aylik} format={(n) => `₺${fmtTRY(n)}`} />} delta="+9%" icon={Wallet} />
          <StatTile label="Toplam Randevu" value={<DemoCounter value={active.length + 124} />} delta="+18" icon={CalendarDays} />
          <StatTile label="Satılan Paket" value={<DemoCounter value={packages.length + 28} />} delta="+5" icon={Package} />
          <StatTile label="Yeni Müşteri" value={<DemoCounter value={newCustomers + 23} />} delta="+12%" icon={UserPlus} />
        </div>
        <Panel
          title="Aylık Performans"
          action={
            <button
              type="button"
              onClick={() => toast({ title: "Rapor indirildi", desc: "Aylık performans raporu hazırlandı", tone: "success", icon: Download })}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--d-accent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--d-accent-fg)] transition-transform hover:scale-[1.03]"
            >
              <Download className="h-3 w-3" /> Rapor İndir
            </button>
          }
        >
          <MiniBars data={[310, 365, 342, 410, 388, 452, 478]} className="h-28" />
          <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--d-faint)]">
            <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span>May</span><span>Haz</span><span>Tem</span>
          </div>
        </Panel>
        <div className="grid gap-3 lg:grid-cols-2">
          <Panel title="En Çok Kazandıran İşlemler">
            <ul className="space-y-2.5">
              {treatmentBars.slice(0, 5).map(([name, count]) => (
                <li key={name}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[var(--d-muted)]">{name}</span>
                    <span className="font-semibold text-[var(--d-fg)]">₺{fmtTRY(count * SERVICE_PRICES[name] * 0.3)}</span>
                  </div>
                  <Bar value={(count / maxTreatment) * 100} className="mt-1" />
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Özet Rapor">
            <ul className="space-y-2 text-[12px]">
              <li className="flex items-center justify-between rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5">
                <span className="text-[var(--d-muted)]">Doluluk oranı</span>
                <span className="font-semibold text-[var(--d-fg)]">%87</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5">
                <span className="text-[var(--d-muted)]">No-show oranı</span>
                <span className="font-semibold text-[var(--d-pos)]">%4</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5">
                <span className="text-[var(--d-muted)]">Tekrar gelen müşteri</span>
                <span className="font-semibold text-[var(--d-fg)]">%68</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5">
                <span className="text-[var(--d-muted)]">Paket yenileme oranı</span>
                <span className="font-semibold text-[var(--d-fg)]">%52</span>
              </li>
            </ul>
            <div className="mt-3 flex justify-end">
              <DemoActionButton
                variant="solid"
                onClick={() => toast({ title: "Rapor indirildi", desc: "Özet rapor PDF olarak hazırlandı", tone: "success", icon: FileText })}
              >
                <Download className="h-4 w-4" /> Rapor İndir
              </DemoActionButton>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  function ayarlarView() {
    const rows: { k: keyof typeof settings; label: string; desc: string }[] = [
      { k: "online", label: "Online Randevu", desc: "Müşteriler web sitenizden kendi randevusunu alabilir." },
      { k: "whatsapp", label: "WhatsApp Hatırlatma", desc: "Randevudan önce otomatik hatırlatma gönderilir." },
      { k: "sms", label: "SMS Hatırlatma", desc: "WhatsApp'a ek olarak SMS gönderilir." },
      { k: "kvkk", label: "KVKK Onayı", desc: "Müşteri kayıtlarında KVKK metni gösterilir." },
    ];
    return (
      <div className="space-y-3">
        <Panel title="Çalışma Ayarları">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField label="Çalışma Saatleri" value={workHours} onChange={setWorkHours} options={["10:00 – 19:00", "09:00 – 20:00", "11:00 – 21:00"]} />
            <SelectField label="Randevu Aralığı" value={interval} onChange={setIntervalVal} options={["60 dk", "90 dk", "120 dk"]} />
          </div>
        </Panel>
        <Panel title="Bildirimler & Tercihler">
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
      case "randevular": return randevularView();
      case "musteriler": return musterilerView();
      case "seanslar": return seanslarView();
      case "paketler": return paketlerView();
      case "personeller": return personellerView();
      case "gelir": return gelirView();
      case "raporlar": return raporlarView();
      case "ayarlar": return ayarlarView();
      default: return genelView();
    }
  }

  return (
    <BrowserFrame url="beautycrm.app/pano">
      <div className="lg:grid lg:grid-cols-[180px_1fr] lg:gap-3">
        <DemoSidebar brand={{ icon: Sparkles, name: "Beauty CRM" }} items={SIDEBAR} active={view} onSelect={setView} onPresent={() => setPresentOpen(true)} />
        <div>
          <DemoMobileNav items={SIDEBAR} active={view} onSelect={setView} onPresent={() => setPresentOpen(true)} />
          <AnimatedView id={view}>{renderView()}</AnimatedView>
        </div>
      </div>

      {/* customer card modal */}
      <DemoModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Müşteri Kartı · ${selected.name}` : ""}
        footer={
          selected && (
            <>
              {selected.status !== "tamamlandi" && selected.status !== "iptal" && (
                <DemoActionButton
                  variant="ghost"
                  onClick={() => {
                    complete(selected);
                    setSelected(null);
                  }}
                >
                  <Check className="h-4 w-4" /> Tamamla
                </DemoActionButton>
              )}
              <DemoActionButton variant="solid" onClick={() => setSelected(null)}>
                Kapat
              </DemoActionButton>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--d-border)] bg-[var(--d-surface-2)] p-3">
              <Avatar name={selected.name} className="h-11 w-11 text-[13px]" />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[var(--d-fg)]">{selected.name}</div>
                <div className="inline-flex items-center gap-1.5 text-[12px] text-[var(--d-muted)]">
                  <Phone className="h-3.5 w-3.5" /> {selected.phone}
                </div>
              </div>
              <Tag tone={STATUS_META[selected.status].tone}>{STATUS_META[selected.status].label}</Tag>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--d-border)] px-3 py-2.5">
                <div className="text-[11px] text-[var(--d-muted)]">Cilt Tipi</div>
                <div className="mt-0.5 text-[13px] font-semibold text-[var(--d-fg)]">{selected.skin}</div>
              </div>
              <div className="rounded-xl border border-[var(--d-border)] px-3 py-2.5">
                <div className="text-[11px] text-[var(--d-muted)]">Bugünkü İşlem</div>
                <div className="mt-0.5 text-[13px] font-semibold text-[var(--d-fg)]">{selected.service}</div>
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-[12px] font-medium text-[var(--d-muted)]">Geçmiş İşlemler</div>
              <ul className="space-y-1.5">
                {selected.history.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 rounded-lg border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2 text-[12px] text-[var(--d-fg)]"
                  >
                    <Heart className="h-3.5 w-3.5 text-[var(--d-accent)]" /> {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2.5 text-[13px]">
              <span className="text-[var(--d-muted)]">Uzman · Saat</span>
              <span className="font-semibold text-[var(--d-fg)]">
                {selected.staff} · {selected.time}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2.5 text-[13px]">
              <span className="text-[var(--d-muted)]">Ücret</span>
              <span className="font-bold text-[var(--d-accent)]">₺{fmtTRY(selected.price)}</span>
            </div>
          </div>
        )}
      </DemoModal>

      {/* add appointment / customer modal */}
      <DemoModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Yeni Randevu / Müşteri"
        footer={
          <>
            <DemoActionButton variant="ghost" onClick={() => setAddOpen(false)}>
              Vazgeç
            </DemoActionButton>
            <DemoActionButton variant="solid" onClick={addCustomer}>
              <Plus className="h-4 w-4" /> Ekle
            </DemoActionButton>
          </>
        }
      >
        <div className="space-y-3">
          <TextField
            label="Ad Soyad"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="Örn. Derya Çelik"
          />
          <TextField
            label="Telefon"
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
            placeholder="05__ ___ __ __"
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="İşlem"
              value={form.service}
              onChange={(v) => setForm((f) => ({ ...f, service: v }))}
              options={SERVICES}
            />
            <SelectField
              label="Uzman"
              value={form.staff}
              onChange={(v) => setForm((f) => ({ ...f, staff: v }))}
              options={STAFF}
            />
          </div>
          <SelectField
            label="Saat"
            value={form.time}
            onChange={(v) => setForm((f) => ({ ...f, time: v }))}
            options={SLOTS}
          />
        </div>
      </DemoModal>

      {/* cancel confirmation */}
      <ConfirmDialog
        open={confirmId !== null}
        title="Randevu iptal edilsin mi?"
        message="Bu randevu iptal edilecek ve günün listesinden çıkarılacak."
        confirmLabel="Evet, iptal et"
        cancelLabel="Vazgeç"
        onConfirm={() => confirmId !== null && cancel(confirmId)}
        onClose={() => setConfirmId(null)}
      />

      <PresentationMode open={presentOpen} steps={STEPS} onClose={() => setPresentOpen(false)} onStepView={setView} />
    </BrowserFrame>
  );
}

/* --------------------------- static page content --------------------------- */
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
        subtitle="Soldaki menüden her bölüme geçebilir, 'Sunum Modu' ile sistemi adım adım tanıtabilirsiniz. Panel gerçekten çalışır: randevuyu tamamlayın, paketten seans düşürün veya yeni müşteri ekleyin — gelir, aktif paket ve popüler işlemler anında güncellenir."
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

      <DemoClosingCTA defaultSector="Güzellik & Estetik" serif />
    </DemoShell>
  );
}
