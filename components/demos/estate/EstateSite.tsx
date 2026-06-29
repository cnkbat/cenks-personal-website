"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Bell,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  Filter,
  Home,
  KeyRound,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Settings,
  Star,
  TrendingUp,
  User,
  UserCog,
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
  FeatureGrid,
  FilterChips,
  IconButton,
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
  Tag,
  Toggle,
  demoThemes,
  useDemoToast,
  type PresentationStep,
  type SidebarItem,
} from "@/components/demos/kit";

const fmtTRY = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const ease = [0.22, 1, 0.36, 1] as const;

/* --------------------------- demo data --------------------------- */
const AGENTS = ["Cem Yılmaz", "Deniz Ak", "Pınar Öz"] as const;
const AGENT_ROLE: Record<string, string> = {
  "Cem Yılmaz": "Kıdemli Danışman",
  "Deniz Ak": "Satış Danışmanı",
  "Pınar Öz": "Kiralama Uzmanı",
};
const THUMB = "/demos/estate/apartment-interior.webp";

type ListingType = "Satılık Daire" | "Kiralık Daire" | "Villa" | "Arsa" | "Ticari";
type ListingStatus = "Satılık" | "Kiralık" | "Satıldı";

type Listing = {
  id: number;
  title: string;
  type: ListingType;
  district: string;
  price: string;
  rooms: string;
  area: string;
  agent: (typeof AGENTS)[number];
  tone: "accent" | "success" | "soft";
  label: ListingStatus;
  image: string;
};

const LISTINGS: Listing[] = [
  {
    id: 1,
    title: "Bağdat Caddesi Lüks Daire",
    type: "Satılık Daire",
    district: "Kadıköy",
    price: "₺8.450.000",
    rooms: "3+1",
    area: "145 m²",
    agent: "Cem Yılmaz",
    tone: "accent",
    label: "Satılık",
    image: THUMB,
  },
  {
    id: 2,
    title: "Deniz Manzaralı Villa",
    type: "Villa",
    district: "Beşiktaş",
    price: "₺24.900.000",
    rooms: "5+2",
    area: "420 m²",
    agent: "Deniz Ak",
    tone: "accent",
    label: "Satılık",
    image: THUMB,
  },
  {
    id: 3,
    title: "Çankaya Eşyalı Rezidans",
    type: "Kiralık Daire",
    district: "Çankaya",
    price: "₺28.500/ay",
    rooms: "2+1",
    area: "98 m²",
    agent: "Pınar Öz",
    tone: "success",
    label: "Kiralık",
    image: THUMB,
  },
  {
    id: 4,
    title: "Merkezi Ticari Mağaza",
    type: "Ticari",
    district: "Kadıköy",
    price: "₺4.250.000",
    rooms: "Dükkan",
    area: "120 m²",
    agent: "Cem Yılmaz",
    tone: "soft",
    label: "Satıldı",
    image: THUMB,
  },
  {
    id: 5,
    title: "Göktürk Arsa (İmarlı)",
    type: "Arsa",
    district: "Beşiktaş",
    price: "₺6.900.000",
    rooms: "Arsa",
    area: "640 m²",
    agent: "Deniz Ak",
    tone: "accent",
    label: "Satılık",
    image: THUMB,
  },
  {
    id: 6,
    title: "Moda Bahçeli Kiralık Daire",
    type: "Kiralık Daire",
    district: "Kadıköy",
    price: "₺42.000/ay",
    rooms: "4+1",
    area: "165 m²",
    agent: "Pınar Öz",
    tone: "success",
    label: "Kiralık",
    image: THUMB,
  },
];

const LISTING_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "Satılık Daire", label: "Satılık Daire" },
  { id: "Kiralık Daire", label: "Kiralık Daire" },
  { id: "Villa", label: "Villa" },
  { id: "Arsa", label: "Arsa" },
  { id: "Ticari", label: "Ticari" },
];

/* --- Satış Süreci (Kanban) --- */
const STAGES = [
  { id: "yeni", label: "Yeni Başvuru" },
  { id: "gorusme", label: "İlk Görüşme" },
  { id: "teklif", label: "Teklif Hazırlandı" },
  { id: "sozlesme", label: "Sözleşme" },
  { id: "tamamlandi", label: "Tamamlandı" },
] as const;

type StageId = (typeof STAGES)[number]["id"];

type Lead = {
  id: number;
  name: string;
  phone: string;
  interest: string;
  budget: number;
  agent: (typeof AGENTS)[number];
  stage: StageId;
  commission: number;
  notes: string;
};

const INITIAL_LEADS: Lead[] = [
  { id: 1, name: "Selin Aydın", phone: "0532 111 22 33", interest: "Bağdat Caddesi · 3+1 Satılık", budget: 8500000, agent: "Cem Yılmaz", stage: "yeni", commission: 254000, notes: "Sahibinden ilanından geldi, peşin alıcı." },
  { id: 2, name: "Murat Kılıç", phone: "0533 222 33 44", interest: "Deniz Manzaralı Villa", budget: 25000000, agent: "Deniz Ak", stage: "gorusme", commission: 747000, notes: "Hafta sonu yerinde gösterim istedi." },
  { id: 3, name: "Ayşe Demir", phone: "0535 333 44 55", interest: "Çankaya Kiralık · 2+1", budget: 30000, agent: "Pınar Öz", stage: "gorusme", commission: 28500, notes: "Eşyalı tercih ediyor, hızlı taşınacak." },
  { id: 4, name: "Kerem Şahin", phone: "0536 444 55 66", interest: "Göktürk Arsa (İmarlı)", budget: 7000000, agent: "Deniz Ak", stage: "teklif", commission: 207000, notes: "İmar durumu evrakı bekleniyor." },
  { id: 5, name: "Elif Yıldız", phone: "0537 555 66 77", interest: "Merkezi Ticari Mağaza", budget: 4250000, agent: "Cem Yılmaz", stage: "teklif", commission: 127500, notes: "Pazarlık ₺4M seviyesinde." },
  { id: 6, name: "Burak Aslan", phone: "0538 666 77 88", interest: "Moda Bahçeli · 4+1 Kiralık", budget: 42000, agent: "Pınar Öz", stage: "sozlesme", commission: 42000, notes: "Kira sözleşmesi imzaya hazır." },
  { id: 7, name: "Zeynep Kaya", phone: "0539 777 88 99", interest: "Bağdat Caddesi · 3+1 Satılık", budget: 8200000, agent: "Cem Yılmaz", stage: "yeni", commission: 246000, notes: "Kredi ön onayı mevcut." },
];

const TASKS = [
  { agent: "Cem Yılmaz", text: "Kadıköy dairesi için ekspertiz randevusu", due: "Bugün 14:00", tone: "warn" as const, label: "Bugün" },
  { agent: "Deniz Ak", text: "Villa müşterisine teklif evrakı gönder", due: "Yarın 11:00", tone: "accent" as const, label: "Yarın" },
  { agent: "Pınar Öz", text: "Çankaya kiralık için kira sözleşmesi", due: "Bugün 17:30", tone: "warn" as const, label: "Bugün" },
  { agent: "Cem Yılmaz", text: "Yeni müşteri adayı — geri arama planla", due: "Cuma 10:00", tone: "soft" as const, label: "Planlı" },
];

const TOP_AGENTS = [
  { name: "Cem Yılmaz", deals: 6, volume: 92 },
  { name: "Deniz Ak", deals: 4, volume: 68 },
  { name: "Pınar Öz", deals: 3, volume: 47 },
];

/* base monthly commission already booked per agent (TL) */
const AGENT_BASE_COMMISSION: Record<string, number> = {
  "Cem Yılmaz": 612000,
  "Deniz Ak": 418000,
  "Pınar Öz": 210000,
};

const DISTRICT_VOLUME = [
  { district: "Kadıköy", deals: 7, volume: 88 },
  { district: "Beşiktaş", deals: 5, volume: 71 },
  { district: "Çankaya", deals: 4, volume: 54 },
  { district: "Göktürk", deals: 2, volume: 31 },
];

const SIDEBAR: SidebarItem[] = [
  { id: "genel", icon: LayoutDashboard, label: "Genel Bakış" },
  { id: "portfoy", icon: Building2, label: "Portföy" },
  { id: "adaylar", icon: Users, label: "Müşteri Adayları" },
  { id: "surec", icon: TrendingUp, label: "Satış Süreci" },
  { id: "danismanlar", icon: UserCog, label: "Danışmanlar" },
  { id: "komisyonlar", icon: Wallet, label: "Komisyonlar" },
  { id: "raporlar", icon: FileText, label: "Raporlar" },
  { id: "ayarlar", icon: Settings, label: "Ayarlar" },
];

const STEPS: PresentationStep[] = [
  { view: "genel", title: "Portföy Genel Bakışı", text: "Aktif portföy, bu ayki satış ve komisyon durumunu tek ekrandan görürsünüz.", action: "Üstteki canlı kartları gösterin." },
  { view: "adaylar", title: "Müşteri Adayları", text: "Gelen her müşteri adayı kaydedilir; bir danışman ayrılsa bile adaylar kaybolmaz.", action: "Bir müşteri adayı kartını açın." },
  { view: "surec", title: "Satış Süreci", text: "Adaylar Yeni Başvuru → İlk Görüşme → Teklif → Sözleşme → Tamamlandı aşamalarında takip edilir.", action: "Bir kartı ileri aşamaya taşıyın; komisyon güncellensin." },
  { view: "danismanlar", title: "Danışman Takibi", text: "Hangi danışmanın ne kadar sattığını ve performansını görürsünüz.", action: "Danışman performans kartlarını gösterin." },
  { view: "komisyonlar", title: "Komisyon Takibi", text: "Kapanan satışların komisyonları otomatik hesaplanır.", action: "Komisyon dağılımını gösterin." },
  { view: "raporlar", title: "Raporlar", text: "Satış hacmi, bölge ve ilan tipi analizlerini net görürsünüz.", action: "Rapor kartlarını gösterin." },
  { view: "genel", title: "Size Özel Kurulum", text: "Bu sistem ofisinizin portföyüne, ekibine ve çalışma düzenine göre özelleştirilebilir.", action: "Sunumu bitirip teklif aşamasına geçin." },
];

const STAGE_TONE: Record<StageId, "accent" | "warn" | "success" | "soft"> = {
  yeni: "accent",
  gorusme: "warn",
  teklif: "accent",
  sozlesme: "soft",
  tamamlandi: "success",
};

const stageLabel = (id: StageId) => STAGES.find((s) => s.id === id)?.label ?? id;

/* --------------------------- the interactive panel --------------------------- */
function EstatePanel() {
  const toast = useDemoToast();

  const [view, setView] = useState("genel");
  const [presentOpen, setPresentOpen] = useState(false);

  /* kanban / satış süreci state */
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [completeLead, setCompleteLead] = useState<Lead | null>(null);

  /* portföy state */
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("Tümü");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  /* aday arama */
  const [leadQuery, setLeadQuery] = useState("");

  /* ayarlar state */
  const [settings, setSettings] = useState({ aday: true, whatsapp: true, gorev: true, evSahibi: false, kvkk: true });
  const [region, setRegion] = useState("İstanbul Anadolu");
  const [commissionRate, setCommissionRate] = useState("%3");

  /* live, derived stats */
  const activePortfolio = LISTINGS.filter((l) => l.label !== "Satıldı").length;
  const baseCommission = 1240000;
  const closedThisMonth = 4;

  const closedLeads = useMemo(() => leads.filter((l) => l.stage === "tamamlandi"), [leads]);
  const earnedCommission = useMemo(
    () => closedLeads.reduce((s, l) => s + l.commission, 0),
    [closedLeads],
  );
  const totalCommission = baseCommission + earnedCommission;
  const monthSales = closedThisMonth + closedLeads.length;
  const newLeads = useMemo(() => leads.filter((l) => l.stage === "yeni").length, [leads]);

  const leadsByStage = useMemo(() => {
    const map: Record<StageId, Lead[]> = {
      yeni: [], gorusme: [], teklif: [], sozlesme: [], tamamlandi: [],
    };
    leads.forEach((l) => map[l.stage].push(l));
    return map;
  }, [leads]);

  /* per-agent commission breakdown (base + earned from closed leads) */
  const agentCommissions = useMemo(() => {
    return AGENTS.map((name) => {
      const earned = closedLeads.filter((l) => l.agent === name).reduce((s, l) => s + l.commission, 0);
      const base = AGENT_BASE_COMMISSION[name] ?? 0;
      const open = leads.filter((l) => l.agent === name && l.stage !== "tamamlandi").length;
      return { name, base, earned, total: base + earned, open };
    }).sort((a, b) => b.total - a.total);
  }, [closedLeads, leads]);

  const agentCommissionTotal = useMemo(
    () => agentCommissions.reduce((s, a) => s + a.total, 0),
    [agentCommissions],
  );
  const maxAgentCommission = Math.max(1, ...agentCommissions.map((a) => a.total));

  /* portföy filtering */
  const visibleListings = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return LISTINGS.filter((l) => {
      if (typeFilter !== "all" && l.type !== typeFilter) return false;
      if (agentFilter !== "Tümü" && l.agent !== agentFilter) return false;
      if (!q) return true;
      return (
        l.title.toLocaleLowerCase("tr").includes(q) ||
        l.district.toLocaleLowerCase("tr").includes(q) ||
        l.type.toLocaleLowerCase("tr").includes(q)
      );
    });
  }, [query, typeFilter, agentFilter]);

  /* aday filtering */
  const visibleLeads = useMemo(() => {
    const q = leadQuery.trim().toLocaleLowerCase("tr");
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.name.toLocaleLowerCase("tr").includes(q) ||
        l.interest.toLocaleLowerCase("tr").includes(q) ||
        l.agent.toLocaleLowerCase("tr").includes(q),
    );
  }, [leads, leadQuery]);

  /* kanban actions */
  function moveLead(lead: Lead, dir: -1 | 1) {
    const idx = STAGES.findIndex((s) => s.id === lead.stage);
    const next = idx + dir;
    if (next < 0 || next >= STAGES.length) return;
    const target = STAGES[next].id;
    if (target === "tamamlandi") {
      setCompleteLead(lead);
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, stage: target } : l)));
    toast({
      title: `${lead.name} taşındı`,
      desc: `${stageLabel(target)} aşamasına alındı`,
      tone: "default",
    });
  }

  function confirmComplete() {
    if (!completeLead) return;
    const lead = completeLead;
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, stage: "tamamlandi" } : l)));
    toast({
      title: "Satış tamamlandı",
      desc: `+₺${fmtTRY(lead.commission)} komisyon eklendi`,
      tone: "success",
      icon: CheckCircle2,
    });
    setCompleteLead(null);
  }

  /* ---------- shared rows ---------- */
  function listingRow(l: Listing) {
    return (
      <motion.li
        key={l.id}
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease }}
        onClick={() => setSelectedListing(l)}
        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] p-2.5 transition-colors hover:border-[var(--d-accent)]/40"
      >
        <img
          src={l.image}
          alt={l.title}
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-12 w-14 shrink-0 rounded-lg border border-[var(--d-border)] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[12.5px] font-semibold text-[var(--d-fg)]">{l.title}</span>
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
          <div className="text-[12.5px] font-bold tabular-nums text-[var(--d-accent)]">{l.price}</div>
          <div className="text-[10px] text-[var(--d-faint)]">{l.agent}</div>
        </div>
      </motion.li>
    );
  }

  function leadRow(l: Lead) {
    return (
      <li
        key={l.id}
        onClick={() => setSelectedLead(l)}
        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 transition-colors hover:border-[var(--d-accent)]/40"
      >
        <Avatar name={l.name} className="h-9 w-9" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{l.name}</div>
          <div className="truncate text-[11px] text-[var(--d-faint)]">{l.interest}</div>
        </div>
        <div className="hidden text-right sm:block">
          <div className="text-[11.5px] font-bold tabular-nums text-[var(--d-accent)]">₺{fmtTRY(l.budget)}</div>
          <div className="text-[10px] text-[var(--d-faint)]">{l.agent.split(" ")[0]}</div>
        </div>
        <Tag tone={STAGE_TONE[l.stage]}>{stageLabel(l.stage)}</Tag>
      </li>
    );
  }

  /* ---------- VIEWS ---------- */
  function genelView() {
    return (
      <div className="space-y-3">
        {/* live stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Aktif Portföy" value={<DemoCounter value={activePortfolio} />} delta="+9" icon={Building2} />
          <StatTile label="Bu Ay Satış" value={<DemoCounter value={monthSales} />} delta="+1" icon={KeyRound} />
          <StatTile
            label="Toplam Komisyon"
            value={<DemoCounter value={totalCommission} format={(n) => `₺${fmtTRY(n)}`} />}
            delta="+22%"
            icon={Wallet}
          />
          <StatTile label="Yeni Müşteri Adayı" value={<DemoCounter value={newLeads} />} delta="+6" icon={Users} />
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          {/* portfolio / listings — interactive */}
          <Panel
            title="Portföy / İlanlar"
            action={
              <button
                type="button"
                onClick={() => setView("portfoy")}
                className="text-[11px] font-medium text-[var(--d-accent)]"
              >
                Tümünü gör
              </button>
            }
          >
            <div className="mb-2.5 space-y-2">
              <SearchInput value={query} onChange={setQuery} placeholder="İlan, bölge veya tür ara…" />
              <FilterChips options={LISTING_FILTERS} value={typeFilter} onChange={setTypeFilter} />
            </div>
            <ul className="space-y-2">
              <AnimatePresence initial={false} mode="popLayout">
                {visibleListings.slice(0, 4).map((l) => listingRow(l))}
              </AnimatePresence>
              {visibleListings.length === 0 && (
                <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-8 text-center text-[12px] text-[var(--d-faint)]">
                  Bu filtreye uygun ilan bulunamadı.
                </li>
              )}
            </ul>
          </Panel>

          {/* right column: commission + top agents */}
          <div className="space-y-3">
            <Panel title="Komisyon (Aylık)">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-[var(--d-fg)]">
                    ₺<DemoCounter value={totalCommission} format={(n) => fmtTRY(n)} />
                  </div>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-pos)]">
                    <TrendingUp className="h-3 w-3" /> tamamlanan satışlar dahil
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
                    <div className="truncate text-[12.5px] font-medium text-[var(--d-fg)]">{t.text}</div>
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

          <Panel title="WhatsApp Aday Takibi" action="Otomatik">
            <div className="flex items-start gap-3 rounded-xl bg-[#25D366]/10 p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#06210f]">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div className="text-[12px] leading-relaxed text-[var(--d-muted)]">
                Merhaba <span className="font-semibold text-[var(--d-fg)]">Selin Hanım</span>,
                Kadıköy{"'"}deki <span className="font-semibold text-[var(--d-fg)]">3+1 Satılık Daire</span> için
                ilginiz için teşekkürler. Yarın bir görüşme ayarlayalım mı?
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      toast({ title: "Görüşme onaylandı", desc: "Selin Hanım · yarın 11:00", tone: "success", icon: CheckCircle2 })
                    }
                    className="rounded-full bg-[#25D366] px-2.5 py-1 text-[10px] font-semibold text-[#06210f] transition-transform hover:scale-[1.04]"
                  >
                    Evet, uygun
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toast({ title: "Geri arama planlandı", desc: "Selin Hanım · Cuma 10:00", tone: "default", icon: Phone })
                    }
                    className="rounded-full border border-[var(--d-border)] px-2.5 py-1 text-[10px] font-semibold text-[var(--d-muted)] transition-colors hover:text-[var(--d-fg)]"
                  >
                    Sonra ara
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                <Star className="h-3.5 w-3.5 text-[var(--d-accent)]" /> Sıcak fırsat
              </span>
              <span className="font-semibold text-[var(--d-fg)]">Bütçe ₺8M · Teklif aşaması</span>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  function portfoyView() {
    return (
      <Panel title="Portföy / İlanlar" action={`${visibleListings.length} ilan`}>
        <div className="mb-2.5 space-y-2">
          <SearchInput value={query} onChange={setQuery} placeholder="İlan, bölge veya tür ara…" />
          <FilterChips options={LISTING_FILTERS} value={typeFilter} onChange={setTypeFilter} />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--d-faint)]">Danışman</span>
            <FilterChips
              options={["Tümü", ...AGENTS].map((a) => ({ id: a, label: a }))}
              value={agentFilter}
              onChange={setAgentFilter}
            />
          </div>
        </div>
        <ul className="space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleListings.map((l) => listingRow(l))}
          </AnimatePresence>
          {visibleListings.length === 0 && (
            <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-8 text-center text-[12px] text-[var(--d-faint)]">
              Bu filtreye uygun ilan bulunamadı.
            </li>
          )}
        </ul>
      </Panel>
    );
  }

  function adaylarView() {
    const chips = [
      { k: "Toplam", v: leads.length },
      { k: "Yeni", v: leadsByStage.yeni.length },
      { k: "Teklif", v: leadsByStage.teklif.length },
      { k: "Kapanan", v: leadsByStage.tamamlandi.length },
    ];
    return (
      <Panel title="Müşteri Adayları" action={`${visibleLeads.length} aday`}>
        <div className="mb-3 grid grid-cols-4 gap-2">
          {chips.map((c) => (
            <div key={c.k} className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2 text-center">
              <div className="text-lg font-bold text-[var(--d-fg)]">{c.v}</div>
              <div className="text-[10px] text-[var(--d-faint)]">{c.k}</div>
            </div>
          ))}
        </div>
        <div className="mb-2.5">
          <SearchInput value={leadQuery} onChange={setLeadQuery} placeholder="Aday, ilan veya danışman ara…" />
        </div>
        <ul className="space-y-2">
          {visibleLeads.map((l) => leadRow(l))}
          {visibleLeads.length === 0 && (
            <li className="rounded-xl border border-dashed border-[var(--d-border)] px-3 py-8 text-center text-[12px] text-[var(--d-faint)]">
              Müşteri adayı bulunamadı.
            </li>
          )}
        </ul>
      </Panel>
    );
  }

  function surecView() {
    return (
      <Panel title="Satış Süreci" action={`${leads.length} müşteri adayı`}>
        <div className="-mx-1 overflow-x-auto pb-1">
          <div className="flex min-w-[760px] gap-2.5 px-1">
            {STAGES.map((stage) => {
              const items = leadsByStage[stage.id];
              return (
                <div
                  key={stage.id}
                  className="flex w-[152px] shrink-0 flex-col rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] p-2"
                >
                  <div className="mb-2 flex items-center justify-between gap-1 px-0.5">
                    <span className="truncate text-[11px] font-semibold text-[var(--d-fg)]">{stage.label}</span>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--d-accent)]/15 px-1 text-[10px] font-bold tabular-nums text-[var(--d-accent)]">
                      <DemoCounter value={items.length} />
                    </span>
                  </div>
                  <div className="flex min-h-[64px] flex-col gap-2">
                    <AnimatePresence initial={false} mode="popLayout">
                      {items.map((lead) => {
                        const idx = STAGES.findIndex((s) => s.id === lead.stage);
                        return (
                          <motion.div
                            key={lead.id}
                            layoutId={`lead-${lead.id}`}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease }}
                            onClick={() => setSelectedLead(lead)}
                            className="group cursor-pointer rounded-lg border border-[var(--d-border)] bg-[var(--d-surface)] p-2 transition-colors hover:border-[var(--d-accent)]/50"
                          >
                            <div className="truncate text-[11.5px] font-semibold text-[var(--d-fg)]">{lead.name}</div>
                            <div className="mt-0.5 truncate text-[10px] text-[var(--d-faint)]">{lead.interest}</div>
                            <div className="mt-1 text-[11px] font-bold tabular-nums text-[var(--d-accent)]">
                              ₺{fmtTRY(lead.budget)}
                            </div>
                            <div className="mt-1.5 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                              <IconButton
                                icon={ChevronLeft}
                                label="Önceki aşama"
                                onClick={() => moveLead(lead, -1)}
                                className={idx === 0 ? "pointer-events-none opacity-30" : ""}
                              />
                              <Tag tone={STAGE_TONE[lead.stage]}>{lead.agent.split(" ")[0]}</Tag>
                              <IconButton
                                icon={ChevronRight}
                                label="Sonraki aşama"
                                tone="success"
                                onClick={() => moveLead(lead, 1)}
                                className={idx === STAGES.length - 1 ? "pointer-events-none opacity-30" : ""}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {items.length === 0 && (
                      <div className="rounded-lg border border-dashed border-[var(--d-border)] px-2 py-4 text-center text-[10px] text-[var(--d-faint)]">
                        Boş
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
    );
  }

  function danismanlarView() {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {agentCommissions.map((a) => {
          const deals = TOP_AGENTS.find((t) => t.name === a.name)?.deals ?? 0;
          const volume = TOP_AGENTS.find((t) => t.name === a.name)?.volume ?? 0;
          return (
            <Panel key={a.name} title={a.name} action={AGENT_ROLE[a.name]}>
              <div className="flex items-center gap-3">
                <Avatar name={a.name} className="h-11 w-11 text-[13px]" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[var(--d-muted)]">Satış hacmi</span>
                    <span className="font-semibold text-[var(--d-fg)]">{deals} işlem</span>
                  </div>
                  <Bar value={volume} className="mt-1.5" />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2">
                  <div className="text-[10px] text-[var(--d-faint)]">Komisyon</div>
                  <div className="text-[13px] font-bold tabular-nums text-[var(--d-accent)]">₺{fmtTRY(a.total)}</div>
                </div>
                <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2">
                  <div className="text-[10px] text-[var(--d-faint)]">Açık aday</div>
                  <div className="text-[13px] font-bold tabular-nums text-[var(--d-fg)]">{a.open}</div>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <DemoActionButton
                  variant="soft"
                  onClick={() =>
                    toast({ title: "Geri arama atandı", desc: `${a.name} · bugün 16:00`, tone: "default", icon: Phone })
                  }
                >
                  <Phone className="h-4 w-4" /> Görev Ata
                </DemoActionButton>
              </div>
            </Panel>
          );
        })}
      </div>
    );
  }

  function komisyonlarView() {
    return (
      <div className="space-y-3">
        <Panel title="Toplam Komisyon (Bu Ay)">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-[var(--d-fg)]">
                ₺<DemoCounter value={agentCommissionTotal} format={(n) => fmtTRY(n)} />
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-pos)]">
                <TrendingUp className="h-3 w-3" /> {closedLeads.length} kapanan satış dahil
              </div>
            </div>
            <DemoActionButton
              variant="solid"
              onClick={() =>
                toast({ title: "Rapor hazırlandı", desc: "Komisyon dağılım raporu indirildi", tone: "success", icon: Download })
              }
            >
              <Download className="h-4 w-4" /> Rapor İndir
            </DemoActionButton>
          </div>
        </Panel>
        <Panel title="Danışman Bazlı Komisyon Dağılımı">
          <ul className="space-y-3">
            {agentCommissions.map((a) => (
              <li key={a.name}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                    <Avatar name={a.name} className="h-6 w-6 text-[10px]" />
                    {a.name}
                  </span>
                  <span className="font-bold tabular-nums text-[var(--d-fg)]">₺{fmtTRY(a.total)}</span>
                </div>
                <Bar value={(a.total / maxAgentCommission) * 100} className="mt-1.5" />
                <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--d-faint)]">
                  <span>Sabit ₺{fmtTRY(a.base)}</span>
                  <span className="text-[var(--d-pos)]">+ Yeni ₺{fmtTRY(a.earned)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }

  function raporlarView() {
    const closedVolume = 142 + closedLeads.length * 6;
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile label="Aylık Satış Hacmi" value={<DemoCounter value={closedVolume} format={(n) => `₺${fmtTRY(n)}M`} />} delta="+14%" icon={TrendingUp} />
          <StatTile label="Kapanan İşlem" value={<DemoCounter value={monthSales} />} delta="+1" icon={KeyRound} />
          <StatTile label="Toplam Komisyon" value={<DemoCounter value={totalCommission} format={(n) => `₺${fmtTRY(n)}`} />} delta="+22%" icon={Wallet} />
        </div>
        <Panel
          title="Aylık Satış Hacmi"
          action={
            <button
              type="button"
              onClick={() =>
                toast({ title: "Rapor hazırlandı", desc: "Aylık satış raporu indirildi", tone: "success", icon: Download })
              }
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--d-accent)]"
            >
              <Download className="h-3.5 w-3.5" /> Rapor İndir
            </button>
          }
        >
          <MiniBars data={[42, 55, 48, 63, 58, 71, Math.max(30, 80 + closedLeads.length * 5)]} className="h-24" />
          <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--d-faint)]">
            <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span>May</span><span>Haz</span><span>Tem</span>
          </div>
        </Panel>
        <Panel title="Bölge Bazlı Satış">
          <ul className="space-y-2.5">
            {DISTRICT_VOLUME.map((d) => (
              <li key={d.district}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="inline-flex items-center gap-1.5 text-[var(--d-muted)]">
                    <MapPin className="h-3.5 w-3.5 text-[var(--d-accent)]" /> {d.district}
                  </span>
                  <span className="font-semibold text-[var(--d-fg)]">{d.deals} işlem</span>
                </div>
                <Bar value={d.volume} className="mt-1.5" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }

  function ayarlarView() {
    const rows: { k: keyof typeof settings; label: string; desc: string }[] = [
      { k: "aday", label: "Otomatik Aday Kaydı", desc: "Gelen her müşteri görüşmesi satış sürecine otomatik düşer." },
      { k: "whatsapp", label: "WhatsApp Aday Bildirimi", desc: "Yeni aday geldiğinde danışmana anında bildirim gider." },
      { k: "gorev", label: "Görev Hatırlatmaları", desc: "Ekspertiz, evrak ve geri arama görevleri hatırlatılır." },
      { k: "evSahibi", label: "Ev Sahibi Portalı", desc: "Mülk sahipleri görüntülenme ve teklif sürecini izler." },
      { k: "kvkk", label: "KVKK Onayı", desc: "Müşteri kayıtlarında KVKK metni gösterilir." },
    ];
    return (
      <div className="space-y-3">
        <Panel title="Ofis Ayarları">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectField label="Çalışma Bölgesi" value={region} onChange={setRegion} options={["İstanbul Anadolu", "İstanbul Avrupa", "Ankara", "İzmir"]} />
            <SelectField label="Komisyon Oranı" value={commissionRate} onChange={setCommissionRate} options={["%2", "%3", "%4"]} />
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
      case "portfoy": return portfoyView();
      case "adaylar": return adaylarView();
      case "surec": return surecView();
      case "danismanlar": return danismanlarView();
      case "komisyonlar": return komisyonlarView();
      case "raporlar": return raporlarView();
      case "ayarlar": return ayarlarView();
      default: return genelView();
    }
  }

  return (
    <BrowserFrame url="estateos.app/pano">
      <div className="lg:grid lg:grid-cols-[190px_1fr] lg:gap-3">
        <DemoSidebar
          brand={{ icon: Building2, name: "EstateOS" }}
          items={SIDEBAR}
          active={view}
          onSelect={setView}
          onPresent={() => setPresentOpen(true)}
        />
        <div>
          <DemoMobileNav items={SIDEBAR} active={view} onSelect={setView} onPresent={() => setPresentOpen(true)} />
          <AnimatedView id={view}>{renderView()}</AnimatedView>
        </div>
      </div>

      {/* İlan detay modal */}
      <DemoModal
        open={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        title={selectedListing ? selectedListing.title : ""}
        footer={
          selectedListing && (
            <>
              <DemoActionButton variant="ghost" onClick={() => setSelectedListing(null)}>
                Kapat
              </DemoActionButton>
              <DemoActionButton
                variant="solid"
                onClick={() => {
                  toast({ title: "İlan paylaşıldı", desc: `${selectedListing.title} · vitrine eklendi`, tone: "success" });
                  setSelectedListing(null);
                }}
              >
                Vitrinde Paylaş
              </DemoActionButton>
            </>
          )
        }
      >
        {selectedListing && (
          <div className="space-y-4">
            <img
              src={selectedListing.image}
              alt={selectedListing.title}
              className="h-40 w-full rounded-2xl border border-[var(--d-border)] object-cover"
            />
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold tabular-nums text-[var(--d-accent)]">{selectedListing.price}</span>
              <Tag tone={selectedListing.tone}>{selectedListing.label}</Tag>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[12.5px]">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5">
                <Home className="h-4 w-4 text-[var(--d-accent)]" />
                <span className="text-[var(--d-fg)]">{selectedListing.rooms}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5">
                <Ruler className="h-4 w-4 text-[var(--d-accent)]" />
                <span className="text-[var(--d-fg)]">{selectedListing.area}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5">
                <MapPin className="h-4 w-4 text-[var(--d-accent)]" />
                <span className="text-[var(--d-fg)]">{selectedListing.district}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5">
                <Building2 className="h-4 w-4 text-[var(--d-accent)]" />
                <span className="text-[var(--d-fg)]">{selectedListing.type}</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2.5 text-[12.5px]">
              <span className="inline-flex items-center gap-2 text-[var(--d-muted)]">
                <User className="h-4 w-4" /> Sorumlu danışman
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--d-fg)]">
                <Avatar name={selectedListing.agent} className="h-6 w-6 text-[10px]" />
                {selectedListing.agent}
              </span>
            </div>
          </div>
        )}
      </DemoModal>

      {/* müşteri adayı profili modal */}
      <DemoModal
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead ? selectedLead.name : ""}
        footer={
          selectedLead && (
            <>
              <DemoActionButton variant="ghost" onClick={() => setSelectedLead(null)}>
                Kapat
              </DemoActionButton>
              <DemoActionButton
                variant="solid"
                onClick={() => {
                  toast({ title: "WhatsApp mesajı gönderildi", desc: selectedLead.name, tone: "success", icon: MessageCircle });
                  setSelectedLead(null);
                }}
              >
                <MessageCircle className="h-4 w-4" /> Mesaj Gönder
              </DemoActionButton>
            </>
          )
        }
      >
        {selectedLead && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--d-border)] bg-[var(--d-surface-2)] p-3">
              <Avatar name={selectedLead.name} className="h-11 w-11 text-[13px]" />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[var(--d-fg)]">{selectedLead.name}</div>
                <div className="inline-flex items-center gap-1.5 text-[12px] text-[var(--d-muted)]">
                  <Phone className="h-3.5 w-3.5" /> {selectedLead.phone}
                </div>
              </div>
              <Tag tone={STAGE_TONE[selectedLead.stage]}>{stageLabel(selectedLead.stage)}</Tag>
            </div>
            <div className="space-y-2 text-[12.5px]">
              <div className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2.5">
                <span className="inline-flex items-center gap-2 text-[var(--d-muted)]">
                  <Home className="h-4 w-4 text-[var(--d-accent)]" /> İlgilendiği ilan
                </span>
                <span className="text-right font-semibold text-[var(--d-fg)]">{selectedLead.interest}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2.5">
                <span className="inline-flex items-center gap-2 text-[var(--d-muted)]">
                  <Wallet className="h-4 w-4 text-[var(--d-accent)]" /> Bütçe
                </span>
                <span className="font-bold tabular-nums text-[var(--d-accent)]">₺{fmtTRY(selectedLead.budget)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2.5">
                <span className="inline-flex items-center gap-2 text-[var(--d-muted)]">
                  <User className="h-4 w-4 text-[var(--d-accent)]" /> Danışman
                </span>
                <span className="font-semibold text-[var(--d-fg)]">{selectedLead.agent}</span>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--d-faint)]">Notlar</div>
              <p className="text-[12.5px] leading-relaxed text-[var(--d-muted)]">{selectedLead.notes}</p>
            </div>
          </div>
        )}
      </DemoModal>

      {/* satış tamamlama onayı */}
      <ConfirmDialog
        open={!!completeLead}
        title="Satış tamamlansın mı?"
        message={
          completeLead
            ? `${completeLead.name} müşteri adayı "Tamamlandı" aşamasına alınacak ve ₺${fmtTRY(completeLead.commission)} komisyon toplam komisyona eklenecek.`
            : ""
        }
        confirmLabel="Evet, tamamla"
        cancelLabel="Vazgeç"
        tone="accent"
        onConfirm={confirmComplete}
        onClose={() => setCompleteLead(null)}
      />

      <PresentationMode open={presentOpen} steps={STEPS} onClose={() => setPresentOpen(false)} onStepView={setView} />
    </BrowserFrame>
  );
}

/* --------------------------- static page content --------------------------- */
const PROBLEMS = [
  "İlanlar Sahibinden, Instagram, vitrin ve defter arasında dağınık; hangi portföy güncel belli olmuyor.",
  "Gelen müşteri görüşmeleri kayıt altına alınmıyor; bir danışman ayrılınca tüm müşteri adayları kayboluyor.",
  "Hangi müşteri hangi aşamada (görüşme, teklif, kapanış) takip edilemiyor, sıcak fırsatlar soğuyor.",
  "Komisyon ve satış rakamları Excel'de tutuluyor; danışman performansı net görülemiyor.",
  "Geri arama ve ekspertiz randevuları unutuluyor; müşteri rakip ofise gidiyor.",
  "Portföydeki ev sahipleriyle iletişim kopuk; fiyat güncellemeleri zamanında yansımıyor.",
];

const SOLUTIONS = [
  { icon: Building2, title: "Merkezi Portföy Yönetimi", text: "Satılık, kiralık, villa, arsa ve ticari tüm ilanlar fotoğraf, fiyat ve durumuyla tek panelde toplanır." },
  { icon: Users, title: "Müşteri Adayı & Müşteri Takibi", text: "Her gelen müşteri kaydedilir; Yeni → Görüşme → Teklif → Kapandı aşamalarıyla hiçbir fırsat kaçmaz." },
  { icon: Bell, title: "Otomatik WhatsApp Aday Takibi", text: "Yeni müşteri adayı geldiğinde danışmana bildirim, müşteriye otomatik karşılama; geri arama hatırlatması." },
  { icon: ClipboardList, title: "Danışman Görev Panosu", text: "Ekspertiz, evrak, sözleşme ve geri arama görevleri danışman bazında planlanır, hiçbiri unutulmaz." },
  { icon: Wallet, title: "Komisyon & Satış Raporu", text: "Aylık satış hacmi, kapanan işlem ve danışman komisyonları gerçek rakamlarla takip edilir." },
  { icon: KeyRound, title: "Ev Sahibi Portalı", text: "Mülk sahibi ilanının kaç kez görüntülendiğini, gelen teklifleri ve süreci şeffaf şekilde izler." },
];

const FEATURES = [
  { icon: Building2, title: "Portföy & İlan Yönetimi", text: "Tüm gayrimenkulleri fotoğraf, konum ve durumla tek yerde yönetin." },
  { icon: Filter, title: "Akıllı Eşleştirme", text: "Müşteri kriterlerine uygun portföyü otomatik öneren filtre." },
  { icon: Users, title: "Satış Süreci (CRM)", text: "Aşama bazlı müşteri takibi; sıcak fırsatları öne çıkarın." },
  { icon: Bell, title: "WhatsApp Aday Bildirimi", text: "Yeni müşteri adayı ve geri arama hatırlatmaları anında danışmana gider." },
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
      "Temel müşteri adayı kaydı",
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
      "Satış Süreci (CRM) & aşama takibi",
      "Otomatik WhatsApp aday bildirimi",
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
  { time: "09:00", text: "Cem Bey ofise gelir gelmez paneli açıyor; gece gelen 3 yeni müşteri adayını, bekleyen teklifleri ve günün ekspertiz randevusunu tek bakışta görüyor." },
  { time: "Gün içi", text: "Sahibinden ilanına gelen bir müşteri WhatsApp'tan yazıyor; müşteri adayı otomatik satış sürecine 'Yeni Başvuru' olarak düşüyor, danışmana anında bildirim gidiyor." },
  { time: "Öğleden sonra", text: "Müşteri Bağdat Caddesi dairesini beğeniyor; Cem Bey adayı 'Teklif Hazırlandı' aşamasına taşıyor, sistem teklif evrakını ve geri arama görevini oluşturuyor." },
  { time: "Akşam", text: "Kapanışta yönetici panelden ayın satış hacmini, kapanan 4 işlemi ve danışman komisyonlarını rapordan görüyor; hiçbir şey Excel'e yazılmıyor." },
];

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
        promise="Portföy, ilanlar, müşteri takibi ve müşteri adaylarını tek platformda yöneten emlak işletme sistemi. Dağınık ilanlar ve kaçan müşteri görüşmeleri sona ersin."
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
        subtitle="Portföy, müşteri adayı, görev ve komisyon; dağınık ilanlar ve Excel tabloları yerine tek, akıllı bir platformda."
        items={SOLUTIONS}
        serif
      />

      <Section
        id="panel"
        eyebrow="Canlı Panel"
        title="Ofisinizi yöneten emlak panosu"
        subtitle="Soldaki menüden her bölüme geçebilir, 'Sunum Modu' ile sistemi adım adım tanıtabilirsiniz. Panel gerçekten çalışır: müşteri adaylarını satış sürecinde ilerletin, ilanları filtreleyin — komisyon ve istatistikler anında güncellenir."
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

      <DemoClosingCTA defaultSector="Emlak" serif />
    </DemoShell>
  );
}
