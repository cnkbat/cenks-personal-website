"use client";

/**
 * Lightweight, abstract product mockups rendered purely with markup so demo
 * cards look like real apps without shipping any raster images.
 */

const bar = "rounded-full bg-white/10";
const accentBar = "rounded-full bg-[var(--accent)]/60";

function Frame({ children, url }: { children: React.ReactNode; url?: string }) {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(180deg,#0c0f1d,#080a14)] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_20px_40px_-24px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.02] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]/70" />
        <span className="ml-2 flex h-3.5 flex-1 items-center rounded-[5px] border border-white/[0.07] bg-white/[0.03] px-2 font-mono text-[7px] leading-none text-white/30">
          {url ?? ""}
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function BeautyCrm() {
  return (
    <Frame url="beauty-crm.app/dashboard">
      <div className="flex gap-3">
        <div className="flex w-12 flex-col gap-1.5">
          <div className={`h-2 ${accentBar}`} />
          <div className={`h-2 w-9 ${bar}`} />
          <div className={`h-2 w-10 ${bar}`} />
          <div className={`h-2 w-8 ${bar}`} />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-md border border-white/10 bg-white/[0.03] p-1.5"
              >
                <div className={`h-1.5 w-6 ${bar}`} />
                <div className="mt-1 h-3 w-8 rounded bg-white/20" />
              </div>
            ))}
          </div>
          <div className="mt-2 flex h-12 items-end gap-1 rounded-md border border-white/10 bg-white/[0.02] p-1.5">
            {[5, 8, 4, 10, 6, 9, 7].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-[linear-gradient(to_top,#7c5cff,#22d3ee)]"
                style={{ height: `${h * 9}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Barber() {
  return (
    <Frame url="berber.studio">
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-white/20" />
        <div className={`h-2 w-32 ${bar}`} />
        <div className="mt-1 flex gap-2">
          <div className="h-6 w-20 rounded-full bg-[linear-gradient(110deg,#7c5cff,#22d3ee)]" />
          <div className="h-6 w-16 rounded-full border border-white/15" />
        </div>
        <div className="mt-1 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-10 rounded-md border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Clinic() {
  return (
    <Frame url="klinik.app/randevu">
      <div className="flex items-center justify-between">
        <div className={`h-2 w-16 ${bar}`} />
        <div className={`h-2 w-8 ${accentBar}`} />
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-[3px] ${
              [4, 9, 15, 22].includes(i)
                ? "bg-[var(--accent)]/70"
                : i === 18
                  ? "bg-[var(--accent-2)]/70"
                  : "bg-white/[0.06]"
            }`}
          />
        ))}
      </div>
    </Frame>
  );
}

function RealEstate() {
  return (
    <Frame url="emlak.co/ilanlar">
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-md border border-white/10 bg-white/[0.03]"
          >
            <div className="h-7 bg-[linear-gradient(120deg,rgba(124,92,255,0.35),rgba(34,211,238,0.2))]" />
            <div className="space-y-1 p-1.5">
              <div className={`h-1.5 w-12 ${bar}`} />
              <div className={`h-1.5 w-8 ${accentBar}`} />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Restaurant() {
  return (
    <Frame url="restoran.menu">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded bg-white/20" />
          <div className={`h-2 w-10 ${accentBar}`} />
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5"
          >
            <div className="space-y-1">
              <div className={`h-1.5 w-16 ${bar}`} />
              <div className={`h-1.5 w-10 ${bar}`} />
            </div>
            <div className={`h-2 w-6 ${accentBar}`} />
          </div>
        ))}
      </div>
    </Frame>
  );
}

const map: Record<string, () => React.JSX.Element> = {
  "beauty-crm": BeautyCrm,
  barber: Barber,
  clinic: Clinic,
  "real-estate": RealEstate,
  restaurant: Restaurant,
};

export function Mockup({ slug }: { slug: string }) {
  const Component = map[slug] ?? BeautyCrm;
  return <Component />;
}
