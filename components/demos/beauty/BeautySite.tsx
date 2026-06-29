"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CreditCard,
  Crown,
  Gem,
  Heart,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Package,
  Phone,
  Plus,
  Repeat,
  Sparkles,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  Avatar,
  Bar,
  BrowserFrame,
  ConfirmDialog,
  DemoActionButton,
  DemoCounter,
  DemoHero,
  DemoModal,
  DemoShell,
  DemoStage,
  Donut,
  FeatureGrid,
  FilterChips,
  FinalCTA,
  IconButton,
  Panel,
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
  demoThemes,
  useDemoToast,
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

/* --------------------------- the interactive panel --------------------------- */
function BeautyPanel() {
  const toast = useDemoToast();

  const [appts, setAppts] = useState<Appt[]>(INITIAL_APPTS);
  const [packages, setPackages] = useState<Pkg[]>(INITIAL_PACKAGES);
  const [extraRevenue, setExtraRevenue] = useState(0);
  const [newCustomers, setNewCustomers] = useState(7);

  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");

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

  /* derived, live stats */
  const active = appts.filter((a) => a.status !== "iptal");
  const completedRevenue = appts
    .filter((a) => a.status === "tamamlandi")
    .reduce((s, a) => s + a.price, 0);
  const gunlukGelir = completedRevenue + extraRevenue;
  const haftalik = 112400 + gunlukGelir;
  const aktifPaket = packages.reduce((s, p) => s + Math.max(0, p.total - p.done), 0);

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
    return [{ id: "all", label: "Tümü" }, ...[...set].map((s) => ({ id: s, label: s }))];
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

  function sendReminder() {
    toast({
      title: "Hatırlatmalar gönderildi",
      desc: `${active.length} müşteriye WhatsApp mesajı`,
      tone: "success",
      icon: MessageCircle,
    });
  }

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
            <StatTile
              label="Bugünkü Randevu"
              value={<DemoCounter value={active.length} />}
              delta="+4"
              icon={CalendarDays}
            />
            <StatTile
              label="Aktif Paket"
              value={<DemoCounter value={aktifPaket} />}
              delta="+6"
              icon={Package}
            />
            <StatTile
              label="Günlük Gelir"
              value={<DemoCounter value={gunlukGelir} format={(n) => `₺${fmtTRY(n)}`} />}
              delta="+22%"
              icon={Wallet}
            />
            <StatTile
              label="Yeni Müşteri"
              value={<DemoCounter value={newCustomers} />}
              delta="+3"
              icon={UserPlus}
            />
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
                {visible.map((a) => {
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
                      <span className="w-11 text-[12px] font-semibold tabular-nums text-[var(--d-accent)]">
                        {a.time}
                      </span>
                      <Avatar name={a.name} className="h-8 w-8" />
                      <div className="min-w-0 flex-1">
                        <div
                          className={
                            "truncate text-[12.5px] font-medium text-[var(--d-fg)] " +
                            (a.status === "iptal" ? "line-through" : "")
                          }
                        >
                          {a.name}
                        </div>
                        <div className="truncate text-[11px] text-[var(--d-faint)]">
                          {a.service} · {a.staff}
                        </div>
                      </div>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {isActive && (
                          <>
                            <IconButton icon={Check} label="Tamamla" tone="success" onClick={() => complete(a)} />
                            <IconButton icon={X} label="İptal et" tone="danger" onClick={() => setConfirmId(a.id)} />
                          </>
                        )}
                        {a.status === "tamamlandi" && <Tag tone={meta.tone}>{meta.label}</Tag>}
                        {isActive && (
                          <span className="hidden sm:block">
                            <Tag tone={meta.tone}>{meta.label}</Tag>
                          </span>
                        )}
                        {a.status === "iptal" && <Tag tone={meta.tone}>{meta.label}</Tag>}
                      </div>
                    </li>
                  );
                })}
                {visible.length === 0 && (
                  <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-6 text-center text-[12px] text-[var(--d-faint)]">
                    Sonuç bulunamadı.
                  </li>
                )}
              </ul>
            </Panel>

            {/* package & session tracking — the signature panel */}
            <Panel title="Paket & Seans Takibi" action={`Aktif ${aktifPaket}`}>
              <ul className="space-y-3">
                {packages.map((p) => {
                  const pct = Math.round((p.done / p.total) * 100);
                  const full = p.done >= p.total;
                  return (
                    <li
                      key={p.id}
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
                })}
              </ul>
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
        subtitle="Aşağıdaki panel gerçekten çalışır: randevuyu tamamlayın, paketten seans düşürün veya yeni müşteri ekleyin — gelir, aktif paket ve popüler işlemler anında güncellenir."
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
