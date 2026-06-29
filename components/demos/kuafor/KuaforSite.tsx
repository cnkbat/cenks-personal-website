"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  Clock,
  Coins,
  Crown,
  Images,
  LayoutDashboard,
  MessageCircle,
  Pencil,
  Plus,
  Repeat,
  RotateCcw,
  Scissors,
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
  status: Status;
};

const STAFF = ["Ahmet Usta", "Emre", "Selim"];
const SLOTS = ["09:30", "10:15", "11:00", "11:45", "12:30", "13:30", "14:15", "15:00", "15:45", "16:30", "17:15", "18:00"];
const SERVICE_PRICES: Record<string, number> = {
  "Saç Kesimi": 250,
  "Sakal Tasarımı": 150,
  "Saç + Sakal": 350,
  "Damat Tıraşı": 400,
  "Saç Bakımı": 300,
  "Keratin Bakımı": 900,
};
const SERVICES = Object.keys(SERVICE_PRICES);
const DAY_CAPACITY = 12;

const INITIAL: Appt[] = [
  { id: 1, time: "09:30", name: "Ahmet Yılmaz", phone: "0532 111 22 33", service: "Saç Kesimi", staff: "Ahmet Usta", price: 250, status: "tamamlandi" },
  { id: 2, time: "10:15", name: "Mert Kaya", phone: "0533 222 33 44", service: "Sakal Tasarımı", staff: "Emre", price: 150, status: "tamamlandi" },
  { id: 3, time: "11:00", name: "Burak Demir", phone: "0535 333 44 55", service: "Damat Tıraşı", staff: "Ahmet Usta", price: 400, status: "onayli" },
  { id: 4, time: "11:45", name: "Kaan Çelik", phone: "0536 444 55 66", service: "Saç + Sakal", staff: "Selim", price: 350, status: "onayli" },
  { id: 5, time: "13:30", name: "Caner Şahin", phone: "0537 555 66 77", service: "Saç + Sakal", staff: "Selim", price: 350, status: "bekliyor" },
  { id: 6, time: "14:15", name: "Tolga Aslan", phone: "0538 666 77 88", service: "Saç Kesimi", staff: "Emre", price: 250, status: "bekliyor" },
  { id: 7, time: "15:00", name: "Onur Aydın", phone: "0539 777 88 99", service: "Keratin Bakımı", staff: "Emre", price: 900, status: "onayli" },
  { id: 8, time: "16:00", name: "Serkan Koç", phone: "0531 888 99 00", service: "Saç Bakımı", staff: "Ahmet Usta", price: 300, status: "bekliyor" },
];

const STATUS_META: Record<Status, { label: string; tone: "accent" | "warn" | "success" | "danger" }> = {
  onayli: { label: "Onaylı", tone: "accent" },
  bekliyor: { label: "Bekliyor", tone: "warn" },
  tamamlandi: { label: "Tamamlandı", tone: "success" },
  iptal: { label: "İptal", tone: "danger" },
  yeni: { label: "Yeni", tone: "accent" },
};

const STATUS_FILTERS = [
  { id: "all", label: "Tümü" },
  { id: "onayli", label: "Onaylı" },
  { id: "bekliyor", label: "Bekliyor" },
  { id: "tamamlandi", label: "Tamamlandı" },
];

/* --------------------------- the interactive panel --------------------------- */
function KuaforPanel() {
  const toast = useDemoToast();
  const [appts, setAppts] = useState<Appt[]>(INITIAL);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newCustomers, setNewCustomers] = useState(4);

  const [selected, setSelected] = useState<Appt | null>(null);
  const [draft, setDraft] = useState<{ time: string; staff: string; service: string }>({ time: "", staff: "", service: "" });
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", service: SERVICES[0], staff: STAFF[0], time: SLOTS[4] });

  /* derived, live stats */
  const active = appts.filter((a) => a.status !== "iptal");
  const gelir = appts.filter((a) => a.status === "tamamlandi").reduce((s, a) => s + a.price, 0);
  const doluluk = Math.min(100, Math.round((active.length / DAY_CAPACITY) * 100));
  const haftalik = 56500 + gelir;

  const serviceCounts = useMemo(() => {
    const m = new Map<string, number>();
    active.forEach((a) => m.set(a.service, (m.get(a.service) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [active]);
  const maxService = Math.max(1, ...serviceCounts.map(([, c]) => c));

  const staffLoad = STAFF.map((s) => ({
    name: s,
    count: active.filter((a) => a.staff === s).length,
  }));

  const visible = appts.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return true;
    return (
      a.name.toLocaleLowerCase("tr").includes(q) ||
      a.service.toLocaleLowerCase("tr").includes(q)
    );
  });

  /* actions */
  function complete(a: Appt) {
    setAppts((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: "tamamlandi" } : x)));
    toast({ title: "Randevu tamamlandı", desc: `${a.name} · +₺${fmtTRY(a.price)} gelire eklendi`, tone: "success", icon: Check });
  }
  function cancel(id: number) {
    const a = appts.find((x) => x.id === id);
    setAppts((prev) => prev.map((x) => (x.id === id ? { ...x, status: "iptal" } : x)));
    if (a) toast({ title: "Randevu iptal edildi", desc: a.name, tone: "danger", icon: X });
  }
  function restore(a: Appt) {
    setAppts((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: "onayli" } : x)));
    toast({ title: "Randevu geri alındı", desc: a.name, tone: "default", icon: RotateCcw });
  }
  function openDetail(a: Appt) {
    setSelected(a);
    setDraft({ time: a.time, staff: a.staff, service: a.service });
  }
  function saveDetail() {
    if (!selected) return;
    setAppts((prev) =>
      prev.map((x) =>
        x.id === selected.id
          ? { ...x, time: draft.time, staff: draft.staff, service: draft.service, price: SERVICE_PRICES[draft.service] }
          : x,
      ),
    );
    toast({ title: "Randevu güncellendi", desc: `${selected.name} · ${draft.staff} · ${draft.time}`, tone: "default", icon: Pencil });
    setSelected(null);
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
      status: "yeni",
    };
    setAppts((prev) => [...prev, appt].sort((a, b) => a.time.localeCompare(b.time)));
    setNewCustomers((n) => n + 1);
    toast({ title: "Yeni müşteri eklendi", desc: `${appt.name} · ${appt.time}`, tone: "success", icon: UserPlus });
    setForm({ name: "", phone: "", service: SERVICES[0], staff: STAFF[0], time: SLOTS[4] });
    setAddOpen(false);
  }

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
                (n.active ? "bg-[var(--d-accent)]/15 text-[var(--d-accent)]" : "text-[var(--d-muted)]")
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </span>
          ))}
        </aside>

        {/* main */}
        <div className="space-y-3">
          {/* live stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Bugünkü Randevu" value={<DemoCounter value={active.length} />} delta="+3" icon={CalendarDays} />
            <StatTile label="Doluluk" value={<DemoCounter value={doluluk} format={(n) => `%${Math.round(n)}`} />} delta="+12%" icon={TrendingUp} />
            <StatTile label="Günlük Gelir" value={<DemoCounter value={gelir} format={(n) => `₺${fmtTRY(n)}`} />} delta="+18%" icon={Wallet} />
            <StatTile label="Yeni Müşteri" value={<DemoCounter value={newCustomers} />} delta="+2" icon={UserPlus} />
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
            {/* appointments — interactive */}
            <Panel
              title="Bugünün Randevuları"
              action={
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--d-accent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--d-accent-fg)] transition-transform hover:scale-[1.03]"
                >
                  <Plus className="h-3 w-3" /> Müşteri Ekle
                </button>
              }
            >
              <div className="mb-2.5 space-y-2">
                <SearchInput value={query} onChange={setQuery} placeholder="Müşteri veya hizmet ara…" />
                <FilterChips options={STATUS_FILTERS} value={statusFilter} onChange={setStatusFilter} />
              </div>
              <ul className="space-y-2">
                {visible.map((a) => {
                  const meta = STATUS_META[a.status];
                  const isActive = a.status === "onayli" || a.status === "bekliyor" || a.status === "yeni";
                  return (
                    <li
                      key={a.id}
                      onClick={() => openDetail(a)}
                      className={
                        "group flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--d-border)] bg-[var(--d-surface-2)] px-3 py-2.5 transition-colors hover:border-[var(--d-accent)]/40 " +
                        (a.status === "iptal" ? "opacity-60" : "")
                      }
                    >
                      <span className="w-11 text-[12px] font-semibold tabular-nums text-[var(--d-accent)]">{a.time}</span>
                      <Avatar name={a.name} className="h-8 w-8" />
                      <div className="min-w-0 flex-1">
                        <div className={"truncate text-[12.5px] font-medium text-[var(--d-fg)] " + (a.status === "iptal" ? "line-through" : "")}>
                          {a.name}
                        </div>
                        <div className="truncate text-[11px] text-[var(--d-faint)]">{a.service} · {a.staff}</div>
                      </div>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {isActive && (
                          <>
                            <IconButton icon={Check} label="Tamamla" tone="success" onClick={() => complete(a)} />
                            <IconButton icon={X} label="İptal et" tone="danger" onClick={() => setConfirmId(a.id)} />
                          </>
                        )}
                        {a.status === "iptal" && (
                          <button
                            type="button"
                            onClick={() => restore(a)}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-[var(--d-accent)] hover:bg-[var(--d-accent)]/12"
                          >
                            <RotateCcw className="h-3 w-3" /> Geri Al
                          </button>
                        )}
                        {a.status === "tamamlandi" && <Tag tone={meta.tone}>{meta.label}</Tag>}
                        {(a.status === "onayli" || a.status === "bekliyor" || a.status === "yeni") && (
                          <span className="hidden sm:block">
                            <Tag tone={meta.tone}>{meta.label}</Tag>
                          </span>
                        )}
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

            {/* right column */}
            <div className="space-y-3">
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
                  <Coins className="h-5 w-5 text-[var(--d-accent)]" />
                </div>
                <Sparkline data={[20, 32, 28, 41, 38, 52, 60]} className="mt-3 h-10" />
              </Panel>

              <Panel title="Popüler Hizmetler">
                <ul className="space-y-2.5">
                  {serviceCounts.slice(0, 4).map(([name, count]) => (
                    <li key={name}>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[var(--d-muted)]">{name}</span>
                        <span className="font-semibold text-[var(--d-fg)]">{count}</span>
                      </div>
                      <Bar value={(count / maxService) * 100} className="mt-1" />
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>

          {/* staff load + whatsapp */}
          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
            <Panel title="Personel Programı" action="Bugün">
              <div className="space-y-3">
                {staffLoad.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="w-24 shrink-0">
                      <div className="truncate text-[12px] font-medium text-[var(--d-fg)]">{p.name}</div>
                      <div className="text-[10px] text-[var(--d-faint)]">{p.count} randevu</div>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <Bar value={(p.count / Math.max(1, active.length)) * 100} />
                      <span className="w-7 shrink-0 text-right text-[11px] font-semibold text-[var(--d-fg)]">{p.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="WhatsApp Hatırlatma" action="Otomatik">
              <div className="flex items-start gap-3 rounded-xl bg-[#25D366]/10 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#06210f]">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div className="text-[12px] leading-relaxed text-[var(--d-muted)]">
                  Yarın randevusu olan <span className="font-semibold text-[var(--d-fg)]">{active.length}</span> müşteriye
                  otomatik hatırlatma hazır.
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => toast({ title: "Hatırlatmalar gönderildi", desc: `${active.length} müşteriye WhatsApp mesajı`, tone: "success", icon: MessageCircle })}
                      className="rounded-full bg-[#25D366] px-3 py-1 text-[10px] font-semibold text-[#06210f] transition-transform hover:scale-[1.03]"
                    >
                      Şimdi Gönder
                    </button>
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

      {/* customer / appointment detail modal */}
      <DemoModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? selected.name : ""}
        footer={
          selected && (
            <>
              {selected.status !== "tamamlandi" && selected.status !== "iptal" && (
                <DemoActionButton variant="ghost" onClick={() => { complete(selected); setSelected(null); }}>
                  <Check className="h-4 w-4" /> Tamamla
                </DemoActionButton>
              )}
              <DemoActionButton variant="solid" onClick={saveDetail}>Kaydet</DemoActionButton>
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
                  <Clock className="h-3.5 w-3.5" /> {selected.phone}
                </div>
              </div>
              <Tag tone={STATUS_META[selected.status].tone}>{STATUS_META[selected.status].label}</Tag>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Saat" value={draft.time} onChange={(v) => setDraft((d) => ({ ...d, time: v }))} options={SLOTS} />
              <SelectField label="Personel" value={draft.staff} onChange={(v) => setDraft((d) => ({ ...d, staff: v }))} options={STAFF} />
            </div>
            <SelectField label="Hizmet" value={draft.service} onChange={(v) => setDraft((d) => ({ ...d, service: v }))} options={SERVICES} />
            <div className="flex items-center justify-between rounded-xl border border-[var(--d-border)] px-3 py-2.5 text-[13px]">
              <span className="text-[var(--d-muted)]">Ücret</span>
              <span className="font-bold text-[var(--d-accent)]">₺{fmtTRY(SERVICE_PRICES[draft.service])}</span>
            </div>
          </div>
        )}
      </DemoModal>

      {/* add customer modal */}
      <DemoModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Yeni Müşteri / Randevu"
        footer={
          <>
            <DemoActionButton variant="ghost" onClick={() => setAddOpen(false)}>Vazgeç</DemoActionButton>
            <DemoActionButton variant="solid" onClick={addCustomer}>
              <Plus className="h-4 w-4" /> Ekle
            </DemoActionButton>
          </>
        }
      >
        <div className="space-y-3">
          <TextField label="Ad Soyad" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Örn. Emre Yıldız" />
          <TextField label="Telefon" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="05__ ___ __ __" />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Hizmet" value={form.service} onChange={(v) => setForm((f) => ({ ...f, service: v }))} options={SERVICES} />
            <SelectField label="Personel" value={form.staff} onChange={(v) => setForm((f) => ({ ...f, staff: v }))} options={STAFF} />
          </div>
          <SelectField label="Saat" value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} options={SLOTS} />
        </div>
      </DemoModal>

      {/* cancel confirmation */}
      <ConfirmDialog
        open={confirmId !== null}
        title="Randevu iptal edilsin mi?"
        message="Bu randevu iptal edilecek. İstediğiniz zaman geri alabilirsiniz."
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
  { name: "Başlangıç", tagline: "Tek koltuk / yeni açılan salonlar için", price: "₺", period: "/ özel teklif", features: ["Online randevu takvimi", "Hizmet & fiyat listesi", "WhatsApp ile randevu", "Mobil uyumlu salon sayfası"] },
  { name: "Profesyonel", tagline: "Büyüyen salonlar için en popüler seçim", price: "₺₺", period: "/ özel teklif", highlighted: true, features: ["Başlangıç'taki her şey", "Otomatik WhatsApp hatırlatma", "Personel & vardiya yönetimi", "Müşteri kartları & geçmiş", "Gelir & performans raporu"] },
  { name: "Premium", tagline: "Çok şubeli & kurumsal salonlar", price: "₺₺₺", period: "/ özel teklif", features: ["Profesyonel'deki her şey", "Çoklu şube yönetimi", "Önce/sonra galeri & yorumlar", "Sadakat & kampanya modülü", "Öncelikli destek & danışmanlık"] },
];

const SCENARIO_STEPS = [
  { time: "08:50", text: "Salon açılmadan Ahmet Usta paneli açıyor; günün randevularını, hangi personele kimin geleceğini tek bakışta görüyor." },
  { time: "Gün içi", text: "Yeni müşteri Instagram'dan gelip linke tıklıyor, boş saatlerden 15:00'i seçip kendi randevusunu oluşturuyor. Telefon hiç çalmıyor." },
  { time: "30 dk önce", text: "Sistem, gün içindeki tüm randevulara otomatik WhatsApp hatırlatması gönderiyor; bir müşteri saatini erteliyor, koltuk boşa düşmüyor." },
  { time: "Akşam", text: "Kapanışta Ahmet Usta günlük ciroyu, en çok yapılan hizmeti ve personel performansını rapordan görüyor; deftere hiçbir şey yazmıyor." },
];

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

      <ProblemSection title="Salonların her gün yaşadığı gerçek sorunlar" items={PROBLEMS} soft />

      <SolutionSection
        title="Kuaför OS bu sorunları nasıl çözüyor?"
        subtitle="Randevu, personel, müşteri ve gelir; dağınık defterler yerine tek, akıllı bir panelde."
        items={SOLUTIONS}
      />

      <Section
        id="panel"
        eyebrow="Canlı Panel"
        title="Salonunuzu yöneten dijital pano"
        subtitle="Bu panel gerçekten çalışır: randevuyu tamamlayın, iptal edin, personel değiştirin veya yeni müşteri ekleyin — gelir ve doluluk anında güncellenir."
      >
        <DemoStage>
          <KuaforPanel />
        </DemoStage>
      </Section>

      <Section eyebrow="Özellikler" title="Salonunuz için ihtiyacınız olan her şey">
        <FeatureGrid features={FEATURES} />
      </Section>

      <Section eyebrow="Örnek Senaryo" title="Bir cumartesi, Kuaför OS ile" soft>
        <Scenario persona="Ahmet Usta — Kadıköy'de 2 koltuklu bir erkek kuaförü işletiyor." steps={SCENARIO_STEPS} />
      </Section>

      <Section eyebrow="Paketler" title="İşletmenize göre esnek paketler" subtitle="Fiyatlar salonunuzun büyüklüğüne göre belirlenir. Net teklif için bir mesaj yeterli.">
        <PricingCards plans={PLANS} />
      </Section>

      <FinalCTA />
    </DemoShell>
  );
}
