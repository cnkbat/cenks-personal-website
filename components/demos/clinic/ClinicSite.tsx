"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Bell,
  CalendarCheck,
  CalendarDays,
  Check,
  ClipboardList,
  Clock,
  CreditCard,
  Download,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LogIn,
  MessageCircle,
  Receipt,
  Settings,
  Stethoscope,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
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
  MiniBars,
  Panel,
  PresentationMode,
  PricingCards,
  ProblemSection,
  Scenario,
  SearchInput,
  Section,
  SelectField,
  SolutionSection,
  Sparkline,
  StatTile,
  Tabs,
  Tag,
  Toggle,
  demoThemes,
  useDemoToast,
  type PresentationStep,
  type SidebarItem,
} from "@/components/demos/kit";

const fmtTRY = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/* --------------------------- demo data --------------------------- */
const CLINIC_TYPES = ["Diş Kliniği", "Fizik Tedavi", "Diyetisyen", "Özel Muayenehane"] as const;

const DOCTOR_NAMES = ["Dr. Mehmet Aydın", "Dr. Selin Korkmaz", "Dr. Burak Şahin"] as const;
const SLOTS = ["09:00", "09:45", "10:30", "11:15", "12:00", "13:30", "14:15", "15:00", "15:45", "16:30"];

type ApptStatus = "onayli" | "bekliyor" | "geldi" | "tamamlandi";

const APPT_META: Record<ApptStatus, { label: string; tone: "accent" | "warn" | "success" }> = {
  onayli: { label: "Onaylı", tone: "accent" },
  bekliyor: { label: "Bekliyor", tone: "warn" },
  geldi: { label: "Geldi", tone: "accent" },
  tamamlandi: { label: "Tamamlandı", tone: "success" },
};

type Appt = {
  id: number;
  time: string;
  name: string;
  phone: string;
  branch: (typeof CLINIC_TYPES)[number];
  treatment: string;
  doctor: (typeof DOCTOR_NAMES)[number];
  status: ApptStatus;
  history: { date: string; text: string }[];
  ledger: { date: string; text: string; amount: number; paid: boolean }[];
};

const SCHEDULE: Appt[] = [
  {
    id: 1,
    time: "09:00",
    name: "Ayşe Kılıç",
    phone: "0532 111 22 33",
    branch: "Diş Kliniği",
    treatment: "Kontrol Muayenesi",
    doctor: "Dr. Mehmet Aydın",
    status: "tamamlandi",
    history: [
      { date: "12.01.2026", text: "Diş taşı temizliği" },
      { date: "03.09.2025", text: "Dolgu yenileme (alt sol azı)" },
    ],
    ledger: [{ date: "29.06.2026", text: "Kontrol Muayenesi", amount: 850, paid: true }],
  },
  {
    id: 2,
    time: "09:45",
    name: "Hasan Yıldız",
    phone: "0533 222 33 44",
    branch: "Diş Kliniği",
    treatment: "Dolgu",
    doctor: "Dr. Mehmet Aydın",
    status: "tamamlandi",
    history: [{ date: "20.05.2026", text: "Kanal tedavisi 2. seans" }],
    ledger: [{ date: "29.06.2026", text: "Dolgu", amount: 1200, paid: true }],
  },
  {
    id: 3,
    time: "10:30",
    name: "Zeynep Arslan",
    phone: "0535 333 44 55",
    branch: "Fizik Tedavi",
    treatment: "Fizik Tedavi Seansı",
    doctor: "Dr. Selin Korkmaz",
    status: "onayli",
    history: [
      { date: "26.06.2026", text: "Fizik tedavi 9. seans" },
      { date: "24.06.2026", text: "Fizik tedavi 8. seans" },
    ],
    ledger: [{ date: "10.06.2026", text: "Fizik Tedavi (10 seans)", amount: 6500, paid: false }],
  },
  {
    id: 4,
    time: "11:15",
    name: "Emre Doğan",
    phone: "0536 444 55 66",
    branch: "Diyetisyen",
    treatment: "Diyet Kontrolü",
    doctor: "Dr. Selin Korkmaz",
    status: "onayli",
    history: [{ date: "15.06.2026", text: "İlk ölçüm ve beslenme planı" }],
    ledger: [{ date: "29.06.2026", text: "Diyet Kontrolü", amount: 600, paid: true }],
  },
  {
    id: 5,
    time: "13:30",
    name: "Fatma Şen",
    phone: "0537 555 66 77",
    branch: "Diş Kliniği",
    treatment: "Diş Çekimi",
    doctor: "Dr. Burak Şahin",
    status: "bekliyor",
    history: [{ date: "18.06.2026", text: "Röntgen ve muayene" }],
    ledger: [{ date: "29.06.2026", text: "Diş Çekimi", amount: 1500, paid: false }],
  },
  {
    id: 6,
    time: "14:15",
    name: "Ali Çelik",
    phone: "0538 666 77 88",
    branch: "Özel Muayenehane",
    treatment: "Kanal Tedavisi",
    doctor: "Dr. Burak Şahin",
    status: "bekliyor",
    history: [{ date: "22.06.2026", text: "Kanal tedavisi 1. seans" }],
    ledger: [{ date: "22.06.2026", text: "Kanal Tedavisi", amount: 3400, paid: false }],
  },
];

type WaitStatus = "sirada" | "kayit";
type Waiting = { id: number; name: string; note: string; waited: string; status: WaitStatus };

const WAIT_META: Record<WaitStatus, { label: string; tone: "accent" | "warn" }> = {
  sirada: { label: "Sırada", tone: "accent" },
  kayit: { label: "Kayıt", tone: "warn" },
};

const WAITING: Waiting[] = [
  { id: 1, name: "Merve Aksoy", note: "Sıra No 4 · Dr. Mehmet Aydın", waited: "8 dk", status: "sirada" },
  { id: 2, name: "Kerem Polat", note: "İlk muayene · Evrak bekliyor", waited: "12 dk", status: "kayit" },
  { id: 3, name: "Selin Yavuz", note: "Kontrol · Dr. Selin Korkmaz", waited: "3 dk", status: "sirada" },
];

type Payment = {
  id: number;
  name: string;
  treatment: string;
  amount: number;
  paid: boolean;
};

const PAYMENTS: Payment[] = [
  { id: 1, name: "Ayşe Kılıç", treatment: "Kontrol Muayenesi", amount: 850, paid: true },
  { id: 2, name: "Hasan Yıldız", treatment: "Dolgu", amount: 1200, paid: true },
  { id: 3, name: "Zeynep Arslan", treatment: "Fizik Tedavi (10 seans)", amount: 6500, paid: false },
  { id: 4, name: "Ali Çelik", treatment: "Kanal Tedavisi", amount: 3400, paid: false },
];

const DOCTORS = [
  { name: "Dr. Mehmet Aydın", role: "Diş Hekimi", branch: "Diş Kliniği", today: 12, fill: 92 },
  { name: "Dr. Selin Korkmaz", role: "Fizyoterapist", branch: "Fizik Tedavi", today: 9, fill: 78 },
  { name: "Dr. Burak Şahin", role: "Diş Hekimi", branch: "Özel Muayenehane", today: 8, fill: 64 },
] as const;

type Treatment = { name: string; branch: (typeof CLINIC_TYPES)[number]; duration: string; price: number };

const TREATMENTS: Treatment[] = [
  { name: "Kontrol Muayenesi", branch: "Diş Kliniği", duration: "20 dk", price: 850 },
  { name: "Dolgu", branch: "Diş Kliniği", duration: "45 dk", price: 1200 },
  { name: "Diş Çekimi", branch: "Diş Kliniği", duration: "30 dk", price: 1500 },
  { name: "Kanal Tedavisi", branch: "Özel Muayenehane", duration: "60 dk", price: 3400 },
  { name: "Fizik Tedavi Seansı", branch: "Fizik Tedavi", duration: "40 dk", price: 700 },
  { name: "Diyet Kontrolü", branch: "Diyetisyen", duration: "30 dk", price: 600 },
];

const SIDEBAR: SidebarItem[] = [
  { id: "genel", icon: LayoutDashboard, label: "Genel Bakış" },
  { id: "takvim", icon: CalendarDays, label: "Takvim" },
  { id: "hastalar", icon: Users, label: "Hastalar" },
  { id: "doktorlar", icon: Stethoscope, label: "Doktorlar" },
  { id: "odemeler", icon: CreditCard, label: "Ödemeler" },
  { id: "tedaviler", icon: ClipboardList, label: "Tedaviler" },
  { id: "raporlar", icon: FileText, label: "Raporlar" },
  { id: "ayarlar", icon: Settings, label: "Ayarlar" },
];

const STEPS: PresentationStep[] = [
  { view: "genel", title: "Günlük Klinik Akışı", text: "Kliniğin günlük hasta, doluluk ve tahsilat durumunu tek ekrandan görürsünüz.", action: "Üstteki canlı kartları gösterin." },
  { view: "takvim", title: "Doktor Takvimi", text: "Her hekimin müsait saatleri tek ekranda; çakışan randevular biter.", action: "Bir hastayı 'Geldi' ve 'Tamamla' ile ilerletin." },
  { view: "hastalar", title: "Hasta Kartları", text: "Hasta bilgileri, geçmiş tedaviler ve ödemeler tek kartta toplanır.", action: "Bir hasta kartını açın." },
  { view: "hastalar", title: "Tedavi Geçmişi", text: "Geçmiş tedaviler ve reçeteler kaybolmadan saklanır.", action: "Hasta kartında 'Geçmiş' sekmesini gösterin." },
  { view: "odemeler", title: "Ödeme Takibi", text: "Tahsil edilen ve bekleyen ödemeler tek panelde; hiçbir alacak kaçmaz.", action: "Bekleyen bir ödemeyi 'Tahsil Et' ile kapatın." },
  { view: "genel", title: "Hatırlatmalar", text: "Randevu ve kontrol hatırlatmaları WhatsApp/SMS ile otomatik gönderilir.", action: "WhatsApp kartından 'Gönder'e basın." },
  { view: "genel", title: "Size Özel Kurulum", text: "Bu sistem kliniğinizin branşına, hekimlerine ve işleyişine göre özelleştirilebilir.", action: "Sunumu bitirip teklif aşamasına geçin." },
];

/* --------------------------- the interactive dashboard --------------------------- */
function ClinicPanel() {
  const toast = useDemoToast();

  const [appts, setAppts] = useState<Appt[]>(SCHEDULE);
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS);
  const [waiting, setWaiting] = useState<Waiting[]>(WAITING);
  const [newRecords, setNewRecords] = useState(6);

  const [query, setQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [patientQuery, setPatientQuery] = useState("");

  const [view, setView] = useState("genel");
  const [presentOpen, setPresentOpen] = useState(false);

  const [selected, setSelected] = useState<Appt | null>(null);
  const [tab, setTab] = useState("bilgiler");
  const [draft, setDraft] = useState<{ time: string; doctor: string }>({ time: "", doctor: "" });

  const [confirmWait, setConfirmWait] = useState<Waiting | null>(null);

  const [docAvail, setDocAvail] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DOCTORS.map((d) => [d.name, true])),
  );
  const [settings, setSettings] = useState({ online: true, whatsapp: true, sms: false, kvkk: true });
  const [workHours, setWorkHours] = useState("09:00 – 17:00");
  const [slotInterval, setSlotInterval] = useState("45 dk");
  const [reminderTime, setReminderTime] = useState("1 gün önce");

  /* derived, live stats */
  const todayPatients = appts.length;
  const dayCapacity = 35;
  const filledSlots = appts.filter((a) => a.status !== "bekliyor").length + waiting.length;
  const doluluk = Math.min(100, Math.round((filledSlots / dayCapacity) * 100));
  const emptySlots = Math.max(0, dayCapacity - filledSlots);
  const dailyCollected = payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
  const pendingTotal = payments.filter((p) => !p.paid).reduce((s, p) => s + p.amount, 0);
  const weeklyCollected = 77900 + dailyCollected;
  const monthlyCollected = 312000 + dailyCollected;
  const completedToday = appts.filter((a) => a.status === "tamamlandi").length;

  const branchFilters = useMemo(
    () => [{ id: "all", label: "Tümü" }, ...CLINIC_TYPES.map((t) => ({ id: t, label: t }))],
    [],
  );
  const doctorFilters = useMemo(
    () => [{ id: "all", label: "Tüm Hekimler" }, ...DOCTOR_NAMES.map((d) => ({ id: d, label: d }))],
    [],
  );

  const visible = appts.filter((a) => {
    if (branchFilter !== "all" && a.branch !== branchFilter) return false;
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return true;
    return (
      a.name.toLocaleLowerCase("tr").includes(q) ||
      a.treatment.toLocaleLowerCase("tr").includes(q) ||
      a.doctor.toLocaleLowerCase("tr").includes(q)
    );
  });

  const scheduleVisible = appts.filter((a) => {
    if (doctorFilter !== "all" && a.doctor !== doctorFilter) return false;
    if (branchFilter !== "all" && a.branch !== branchFilter) return false;
    return true;
  });

  // treatment counts for today (by treatment name)
  const treatmentCounts = useMemo(() => {
    const m = new Map<string, number>();
    appts.forEach((a) => m.set(a.treatment, (m.get(a.treatment) ?? 0) + 1));
    return m;
  }, [appts]);

  // unique patients (from appointments)
  const patients = useMemo(() => {
    const m = new Map<string, Appt>();
    appts.forEach((a) => {
      if (!m.has(a.name)) m.set(a.name, a);
    });
    return [...m.values()];
  }, [appts]);

  /* actions */
  function arrive(a: Appt) {
    setAppts((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: "geldi" } : x)));
    toast({ title: "Hasta geldi olarak işaretlendi", desc: `${a.name} · ${a.time}`, tone: "success", icon: LogIn });
  }

  function complete(a: Appt) {
    setAppts((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: "tamamlandi" } : x)));
    toast({ title: "Randevu tamamlandı", desc: `${a.name} · ${a.doctor}`, tone: "success", icon: Check });
  }

  function openDetail(a: Appt) {
    setSelected(a);
    setTab("bilgiler");
    setDraft({ time: a.time, doctor: a.doctor });
  }

  function saveDetail() {
    if (!selected) return;
    const safeDoctor = (DOCTOR_NAMES as readonly string[]).includes(draft.doctor)
      ? (draft.doctor as Appt["doctor"])
      : selected.doctor;
    setAppts((prev) =>
      prev
        .map((x) => (x.id === selected.id ? { ...x, time: draft.time, doctor: safeDoctor } : x))
        .sort((a, b) => a.time.localeCompare(b.time)),
    );
    toast({ title: "Randevu güncellendi", desc: `${selected.name} · ${safeDoctor} · ${draft.time}`, tone: "default", icon: CalendarCheck });
    setSelected(null);
  }

  function collect(p: Payment) {
    setPayments((prev) => prev.map((x) => (x.id === p.id ? { ...x, paid: true } : x)));
    setNewRecords((n) => n + 1);
    toast({ title: "Ödeme tahsil edildi", desc: `${p.name} · +₺${fmtTRY(p.amount)} günlük tahsilata eklendi`, tone: "success", icon: Wallet });
  }

  function callWaiting(w: Waiting) {
    setWaiting((prev) => prev.filter((x) => x.id !== w.id));
    toast({ title: "Hasta muayeneye alındı", desc: `${w.name} hekim odasına yönlendirildi`, tone: "success", icon: HeartPulse });
  }

  function sendReminders(label: string, desc: string) {
    toast({ title: label, desc, tone: "success", icon: MessageCircle });
  }

  // live view of the open appointment so the modal footer/tag reflect state changes
  const current = selected ? appts.find((a) => a.id === selected.id) ?? selected : null;

  /* ---------- shared appointment row ---------- */
  function apptRow(a: Appt) {
    const meta = APPT_META[a.status];
    const canArrive = a.status === "onayli" || a.status === "bekliyor";
    const canComplete = a.status === "geldi";
    return (
      <li
        key={a.id}
        onClick={() => openDetail(a)}
        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 transition-colors hover:border-[var(--d-accent)]/40"
      >
        <span className="w-11 text-[12px] font-semibold tabular-nums text-[var(--d-accent)]">{a.time}</span>
        <Avatar name={a.name} className="h-8 w-8" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{a.name}</div>
          <div className="truncate text-[11px] text-[var(--d-faint)]">
            {a.treatment} · {a.doctor}
          </div>
        </div>
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {canArrive && (
            <DemoActionButton variant="soft" onClick={() => arrive(a)} className="px-2.5 py-1">
              <LogIn className="h-3.5 w-3.5" /> Geldi
            </DemoActionButton>
          )}
          {canComplete && (
            <DemoActionButton variant="solid" onClick={() => complete(a)} className="px-2.5 py-1">
              <Check className="h-3.5 w-3.5" /> Tamamla
            </DemoActionButton>
          )}
          <span className="hidden sm:block">
            <Tag tone={meta.tone}>{meta.label}</Tag>
          </span>
        </div>
      </li>
    );
  }

  /* ---------- VIEWS ---------- */
  function genelView() {
    return (
      <div className="space-y-3">
        {/* live stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Bugünkü Hasta" value={<DemoCounter value={todayPatients} />} delta="+4" icon={Users} />
          <StatTile label="Doluluk" value={<DemoCounter value={doluluk} format={(n) => `%${Math.round(n)}`} />} delta="+9%" icon={Activity} />
          <StatTile label="Günlük Tahsilat" value={<DemoCounter value={dailyCollected} format={(n) => `₺${fmtTRY(n)}`} />} delta="+14%" icon={Wallet} />
          <StatTile label="Yeni Kayıt" value={<DemoCounter value={newRecords} />} delta="+3" icon={UserPlus} />
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          {/* schedule — interactive */}
          <Panel title="Hekim Takvimi · Günün Programı" action="Bugün">
            <div className="mb-2.5 space-y-2">
              <SearchInput value={query} onChange={setQuery} placeholder="Hasta, tedavi veya hekim ara…" />
              <FilterChips options={branchFilters} value={branchFilter} onChange={setBranchFilter} />
            </div>
            <ul className="space-y-2">
              {visible.map((a) => apptRow(a))}
              {visible.length === 0 && (
                <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-6 text-center text-[12px] text-[var(--d-faint)]">
                  Bu filtreyle eşleşen randevu yok.
                </li>
              )}
            </ul>
          </Panel>

          {/* right column */}
          <div className="space-y-3">
            <Panel title="Haftalık Tahsilat">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-[var(--d-fg)]">
                    ₺<DemoCounter value={weeklyCollected} format={(n) => fmtTRY(n)} />
                  </div>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-pos)]">
                    <TrendingUp className="h-3 w-3" /> bugünkü tahsilat dahil
                  </div>
                </div>
                <Receipt className="h-5 w-5 text-[var(--d-accent)]" />
              </div>
              <Sparkline data={[28, 35, 30, 44, 40, 55, 63]} className="mt-3 h-10" />
            </Panel>

            <Panel title="Genel Doluluk">
              <div className="flex items-center gap-4">
                <Donut value={doluluk} size={72} label={`%${doluluk}`} />
                <div className="flex-1 space-y-1.5 text-[11px] text-[var(--d-muted)]">
                  <div className="flex items-center justify-between">
                    <span>Dolu slot</span>
                    <span className="font-semibold text-[var(--d-fg)]">
                      <DemoCounter value={filledSlots} /> / {dayCapacity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Boş slot</span>
                    <span className="font-semibold text-[var(--d-fg)]">
                      <DemoCounter value={emptySlots} />
                    </span>
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

        {/* doctors + waiting */}
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
              {waiting.map((w) => {
                const meta = WAIT_META[w.status];
                return (
                  <li
                    key={w.id}
                    className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
                  >
                    <Avatar name={w.name} className="h-8 w-8" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{w.name}</div>
                      <div className="truncate text-[11px] text-[var(--d-faint)]">{w.note}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end gap-1">
                        <Tag tone={meta.tone}>{meta.label}</Tag>
                        <span className="text-[10px] text-[var(--d-faint)]">{w.waited}</span>
                      </div>
                      <DemoActionButton variant="solid" onClick={() => setConfirmWait(w)} className="px-2.5 py-1">
                        Çağır
                      </DemoActionButton>
                    </div>
                  </li>
                );
              })}
              {waiting.length === 0 && (
                <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-6 text-center text-[12px] text-[var(--d-faint)]">
                  Bekleme salonu boş. Tüm hastalar muayeneye alındı.
                </li>
              )}
            </ul>
          </Panel>
        </div>

        {/* payments + whatsapp */}
        <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          <Panel title="Ödeme Takibi" action="Tümü">
            <ul className="space-y-2">
              {payments.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--d-accent)]/12 text-[var(--d-accent)]">
                    <Wallet className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{p.name}</div>
                    <div className="truncate text-[11px] text-[var(--d-faint)]">{p.treatment}</div>
                  </div>
                  <span className="text-[12.5px] font-semibold tabular-nums text-[var(--d-fg)]">₺{fmtTRY(p.amount)}</span>
                  {p.paid ? (
                    <Tag tone="success">Ödendi</Tag>
                  ) : (
                    <DemoActionButton variant="solid" onClick={() => collect(p)} className="px-2.5 py-1">
                      Tahsil Et
                    </DemoActionButton>
                  )}
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
                <span className="font-semibold text-[var(--d-fg)]"> 13:30</span> Dr. Burak Şahin ile diş çekimi
                randevunuzu hatırlatırız. Onaylıyor musunuz?
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => sendReminders("Hatırlatma gönderildi", "Fatma Şen · WhatsApp randevu onayı")}
                    className="rounded-full bg-[#25D366] px-2.5 py-1 text-[10px] font-semibold text-[#06210f] transition-transform hover:scale-[1.03]"
                  >
                    Gönder
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toast({ title: "Randevu ertelendi", desc: "Fatma Şen için yeni saat istendi", tone: "warn", icon: CalendarDays })
                    }
                    className="rounded-full border border-[var(--d-border)] px-2.5 py-1 text-[10px] font-semibold text-[var(--d-muted)] transition-colors hover:text-[var(--d-fg)]"
                  >
                    Ertele
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                <CalendarCheck className="h-3.5 w-3.5 text-[var(--d-accent)]" /> 6 ay kontrol
              </span>
              <button
                type="button"
                onClick={() => sendReminders("Kontrol hatırlatması gönderildi", "8 hastaya otomatik WhatsApp / SMS")}
                className="font-semibold text-[var(--d-accent)] transition-colors hover:text-[var(--d-fg)]"
              >
                8 hastaya gönder
              </button>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  function takvimView() {
    return (
      <Panel title="Hekim Takvimi" action="Bugün">
        <div className="mb-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2 text-center">
            <div className="text-lg font-bold text-[var(--d-fg)]">{scheduleVisible.length}</div>
            <div className="text-[10px] text-[var(--d-faint)]">Randevu</div>
          </div>
          <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2 text-center">
            <div className="text-lg font-bold text-[var(--d-fg)]">{scheduleVisible.filter((a) => a.status === "geldi").length}</div>
            <div className="text-[10px] text-[var(--d-faint)]">Geldi</div>
          </div>
          <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2 text-center">
            <div className="text-lg font-bold text-[var(--d-fg)]">{scheduleVisible.filter((a) => a.status === "tamamlandi").length}</div>
            <div className="text-[10px] text-[var(--d-faint)]">Tamamlandı</div>
          </div>
        </div>
        <div className="mb-2.5 space-y-2">
          <FilterChips options={branchFilters} value={branchFilter} onChange={setBranchFilter} />
          <FilterChips options={doctorFilters} value={doctorFilter} onChange={setDoctorFilter} />
        </div>
        <ul className="space-y-2">
          {scheduleVisible.map((a) => apptRow(a))}
          {scheduleVisible.length === 0 && (
            <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-8 text-center text-[12px] text-[var(--d-faint)]">
              Bu filtreyle eşleşen randevu yok.
            </li>
          )}
        </ul>
      </Panel>
    );
  }

  function hastalarView() {
    const list = patients.filter((p) =>
      p.name.toLocaleLowerCase("tr").includes(patientQuery.trim().toLocaleLowerCase("tr")),
    );
    return (
      <Panel title="Hastalar" action={`${patients.length} hasta`}>
        <div className="mb-2.5">
          <SearchInput value={patientQuery} onChange={setPatientQuery} placeholder="Hasta ara…" />
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {list.map((p) => (
            <li
              key={p.name}
              onClick={() => openDetail(p)}
              className="group flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 transition-colors hover:border-[var(--d-accent)]/40"
            >
              <Avatar name={p.name} className="h-9 w-9" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{p.name}</div>
                <div className="truncate text-[11px] text-[var(--d-faint)]">
                  {p.branch} · {p.phone}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-[var(--d-fg)]">{p.history.length + 1} işlem</div>
                <div className="text-[10px] text-[var(--d-faint)]">{p.doctor.replace("Dr. ", "")}</div>
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-8 text-center text-[12px] text-[var(--d-faint)] sm:col-span-2">
              Hasta bulunamadı.
            </li>
          )}
        </ul>
      </Panel>
    );
  }

  function doktorlarView() {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {DOCTORS.map((d) => (
          <Panel key={d.name} title={d.name.replace("Dr. ", "Dr. ")} action={d.branch}>
            <div className="flex items-center gap-3">
              <Avatar name={d.name} className="h-11 w-11 text-[13px]" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--d-muted)]">{d.role}</span>
                  <span className="font-semibold text-[var(--d-fg)]">{d.today} hasta</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Bar value={d.fill} />
                  <span className="w-9 shrink-0 text-right text-[11px] font-semibold text-[var(--d-fg)]">%{d.fill}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2">
              <span className="text-[12px] font-medium text-[var(--d-fg)]">{docAvail[d.name] ? "Müsait" : "İzinli"}</span>
              <Toggle
                checked={docAvail[d.name]}
                onChange={(v) => {
                  setDocAvail((s) => ({ ...s, [d.name]: v }));
                  toast({ title: v ? "Hekim müsait" : "Hekim izinli", desc: d.name, tone: v ? "success" : "warn", icon: Stethoscope });
                }}
              />
            </div>
          </Panel>
        ))}
      </div>
    );
  }

  function odemelerView() {
    const paidCount = payments.filter((p) => p.paid).length;
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile label="Günlük Tahsilat" value={<DemoCounter value={dailyCollected} format={(n) => `₺${fmtTRY(n)}`} />} delta="+14%" icon={Wallet} />
          <StatTile label="Bekleyen Alacak" value={<DemoCounter value={pendingTotal} format={(n) => `₺${fmtTRY(n)}`} />} icon={Clock} />
          <StatTile label="Tahsil Edilen" value={<DemoCounter value={paidCount} format={(n) => `${Math.round(n)} / ${payments.length}`} />} icon={Receipt} />
        </div>
        <Panel title="Ödeme Takibi" action="Tümü">
          <ul className="space-y-2">
            {payments.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--d-accent)]/12 text-[var(--d-accent)]">
                  <CreditCard className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{p.name}</div>
                  <div className="truncate text-[11px] text-[var(--d-faint)]">{p.treatment}</div>
                </div>
                <span className="text-[12.5px] font-semibold tabular-nums text-[var(--d-fg)]">₺{fmtTRY(p.amount)}</span>
                {p.paid ? (
                  <Tag tone="success">Ödendi</Tag>
                ) : (
                  <DemoActionButton variant="solid" onClick={() => collect(p)} className="px-2.5 py-1">
                    Tahsil Et
                  </DemoActionButton>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }

  function tedavilerView() {
    return (
      <Panel title="Tedavi Türleri" action={`${TREATMENTS.length} tedavi`}>
        <ul className="space-y-2">
          {TREATMENTS.map((t) => {
            const count = treatmentCounts.get(t.name) ?? 0;
            return (
              <li
                key={t.name}
                className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--d-accent)]/15 text-[var(--d-accent)]">
                  <ClipboardList className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{t.name}</div>
                  <div className="text-[11px] text-[var(--d-faint)]">
                    {t.branch} · {t.duration}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12.5px] font-semibold tabular-nums text-[var(--d-fg)]">₺{fmtTRY(t.price)}</div>
                  <div className="text-[10px] text-[var(--d-faint)]">Bugün {count} kez</div>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    );
  }

  function raporlarView() {
    const branchRev = CLINIC_TYPES.map((b) => ({
      b,
      rev: payments
        .filter((p) => p.paid)
        .reduce((s, p) => {
          // approximate: match by treatment listed in treatments table
          const t = TREATMENTS.find((tt) => p.treatment.startsWith(tt.name));
          return s + (t && t.branch === b ? p.amount : 0);
        }, 0),
    }));
    const maxRev = Math.max(1, ...branchRev.map((r) => r.rev));
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Bugünkü Hasta" value={<DemoCounter value={todayPatients} />} delta="+4" icon={Users} />
          <StatTile label="Tamamlanan" value={<DemoCounter value={completedToday} />} icon={Check} />
          <StatTile label="Günlük Tahsilat" value={<DemoCounter value={dailyCollected} format={(n) => `₺${fmtTRY(n)}`} />} delta="+14%" icon={Wallet} />
          <StatTile label="Aylık Tahsilat" value={<DemoCounter value={monthlyCollected} format={(n) => `₺${fmtTRY(n)}`} />} delta="+9%" icon={TrendingUp} />
        </div>
        <Panel
          title="Son 7 Gün · Tahsilat"
          action={
            <button
              type="button"
              onClick={() => toast({ title: "Rapor hazırlandı", desc: "Haftalık tahsilat raporu indirildi", tone: "success", icon: Download })}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-accent)]"
            >
              <Download className="h-3.5 w-3.5" /> Rapor İndir
            </button>
          }
        >
          <MiniBars data={[42, 55, 48, 63, 58, 71, Math.max(20, Math.round(dailyCollected / 200))]} className="h-24" />
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
        <Panel title="Branş Bazlı Tahsilat (Bugün)">
          {branchRev.every((r) => r.rev === 0) ? (
            <div className="px-1 py-6 text-center text-[12px] text-[var(--d-faint)]">
              Henüz tahsilat yok. Ödemeler ekranından bir tahsilat yapın.
            </div>
          ) : (
            <ul className="space-y-2.5">
              {branchRev
                .filter((r) => r.rev > 0)
                .sort((a, b) => b.rev - a.rev)
                .map((r) => (
                  <li key={r.b}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[var(--d-muted)]">{r.b}</span>
                      <span className="font-semibold text-[var(--d-fg)]">₺{fmtTRY(r.rev)}</span>
                    </div>
                    <Bar value={(r.rev / maxRev) * 100} className="mt-1" />
                  </li>
                ))}
            </ul>
          )}
        </Panel>
      </div>
    );
  }

  function ayarlarView() {
    const rows: { k: keyof typeof settings; label: string; desc: string }[] = [
      { k: "online", label: "Online Randevu", desc: "Hastalar klinik sayfanızdan kendi randevusunu alabilir." },
      { k: "whatsapp", label: "WhatsApp Hatırlatma", desc: "Randevudan önce otomatik WhatsApp hatırlatması gönderilir." },
      { k: "sms", label: "SMS Hatırlatma", desc: "WhatsApp'a ek olarak SMS ile hatırlatma gönderilir." },
      { k: "kvkk", label: "KVKK Onayı", desc: "Hasta kayıtlarında KVKK aydınlatma metni gösterilir." },
    ];
    return (
      <div className="space-y-3">
        <Panel title="Klinik Ayarları">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField label="Çalışma Saatleri" value={workHours} onChange={setWorkHours} options={["09:00 – 17:00", "08:00 – 18:00", "10:00 – 20:00"]} />
            <SelectField label="Randevu Aralığı" value={slotInterval} onChange={setSlotInterval} options={["30 dk", "45 dk", "60 dk"]} />
          </div>
          <div className="mt-3">
            <SelectField label="Hatırlatma Zamanı" value={reminderTime} onChange={setReminderTime} options={["1 gün önce", "2 gün önce", "Aynı gün sabah"]} />
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
              onClick={() => toast({ title: "Ayarlar kaydedildi", desc: "Klinik tercihleriniz güncellendi", tone: "success", icon: Settings })}
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
      case "takvim": return takvimView();
      case "hastalar": return hastalarView();
      case "doktorlar": return doktorlarView();
      case "odemeler": return odemelerView();
      case "tedaviler": return tedavilerView();
      case "raporlar": return raporlarView();
      case "ayarlar": return ayarlarView();
      default: return genelView();
    }
  }

  return (
    <BrowserFrame url="clinicos.app/pano">
      <div className="lg:grid lg:grid-cols-[180px_1fr] lg:gap-3">
        <DemoSidebar brand={{ icon: Stethoscope, name: "ClinicOS" }} items={SIDEBAR} active={view} onSelect={setView} onPresent={() => setPresentOpen(true)} />
        <div>
          <DemoMobileNav items={SIDEBAR} active={view} onSelect={setView} onPresent={() => setPresentOpen(true)} />
          <AnimatedView id={view}>{renderView()}</AnimatedView>
        </div>
      </div>

      {/* patient profile modal — Bilgiler / Geçmiş / Ödemeler */}
      <DemoModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={current ? current.name : ""}
        footer={
          current && (
            <>
              {current.status === "onayli" || current.status === "bekliyor" ? (
                <DemoActionButton variant="ghost" onClick={() => arrive(current)}>
                  <LogIn className="h-4 w-4" /> Geldi
                </DemoActionButton>
              ) : current.status === "geldi" ? (
                <DemoActionButton variant="ghost" onClick={() => complete(current)}>
                  <Check className="h-4 w-4" /> Tamamla
                </DemoActionButton>
              ) : null}
              <DemoActionButton variant="solid" onClick={saveDetail}>Kaydet</DemoActionButton>
            </>
          )
        }
      >
        {current && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--d-border)] bg-[var(--d-surface-2)] p-3">
              <Avatar name={current.name} className="h-11 w-11 text-[13px]" />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[var(--d-fg)]">{current.name}</div>
                <div className="inline-flex items-center gap-1.5 text-[12px] text-[var(--d-muted)]">
                  {current.branch} · {current.phone}
                </div>
              </div>
              <Tag tone={APPT_META[current.status].tone}>{APPT_META[current.status].label}</Tag>
            </div>

            <Tabs
              tabs={[
                { id: "bilgiler", label: "Bilgiler" },
                { id: "gecmis", label: "Geçmiş" },
                { id: "odemeler", label: "Ödemeler" },
              ]}
              value={tab}
              onChange={setTab}
            />

            {tab === "bilgiler" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2.5 text-[13px]">
                  <span className="text-[var(--d-muted)]">Tedavi</span>
                  <span className="font-semibold text-[var(--d-fg)]">{current.treatment}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <SelectField label="Saat" value={draft.time} onChange={(v) => setDraft((d) => ({ ...d, time: v }))} options={SLOTS} />
                  <SelectField label="Hekim" value={draft.doctor} onChange={(v) => setDraft((d) => ({ ...d, doctor: v }))} options={[...DOCTOR_NAMES]} />
                </div>
                <p className="text-[11px] leading-relaxed text-[var(--d-faint)]">
                  Saat veya hekimi değiştirip Kaydet&apos;e basın; randevu güncellenir ve takvim yeniden sıralanır.
                </p>
              </div>
            )}

            {tab === "gecmis" && (
              <ul className="space-y-2">
                {current.history.map((h) => (
                  <li
                    key={`${h.date}-${h.text}`}
                    className="flex items-start gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--d-accent)]/12 text-[var(--d-accent)]">
                      <ClipboardList className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-medium text-[var(--d-fg)]">{h.text}</div>
                      <div className="text-[11px] text-[var(--d-faint)]">{h.date}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {tab === "odemeler" && (
              <ul className="space-y-2">
                {current.ledger.map((l) => (
                  <li
                    key={`${l.date}-${l.text}`}
                    className="flex items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--d-accent)]/12 text-[var(--d-accent)]">
                      <Wallet className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-medium text-[var(--d-fg)]">{l.text}</div>
                      <div className="text-[11px] text-[var(--d-faint)]">{l.date}</div>
                    </div>
                    <span className="text-[12.5px] font-semibold tabular-nums text-[var(--d-fg)]">₺{fmtTRY(l.amount)}</span>
                    <Tag tone={l.paid ? "success" : "warn"}>{l.paid ? "Ödendi" : "Bekliyor"}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </DemoModal>

      {/* call waiting patient confirmation */}
      <ConfirmDialog
        open={confirmWait !== null}
        title="Hasta muayeneye alınsın mı?"
        message={
          confirmWait
            ? `${confirmWait.name} bekleme listesinden çıkarılıp hekim odasına yönlendirilecek.`
            : ""
        }
        confirmLabel="Muayeneye Al"
        cancelLabel="Vazgeç"
        tone="accent"
        onConfirm={() => confirmWait && callWaiting(confirmWait)}
        onClose={() => setConfirmWait(null)}
      />

      <PresentationMode open={presentOpen} steps={STEPS} onClose={() => setPresentOpen(false)} onStepView={setView} />
    </BrowserFrame>
  );
}

/* --------------------------- static page content --------------------------- */
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
        subtitle="Soldaki menüden her bölüme geçebilir, 'Sunum Modu' ile sistemi adım adım tanıtabilirsiniz. Panel gerçekten çalışır: hasta 'Geldi' işaretleyin, randevu tamamlayın, ödeme tahsil edin — kartlar anında güncellenir."
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

      <DemoClosingCTA defaultSector="Klinik / Sağlık" />
    </DemoShell>
  );
}
