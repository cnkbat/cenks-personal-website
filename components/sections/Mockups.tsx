"use client";

/**
 * Lightweight, abstract product mockups rendered purely with markup so demo
 * cards look like real apps without shipping any raster images.
 */

const bar = "rounded-full bg-white/10";
const accentBar = "rounded-full bg-[var(--accent)]/60";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0c18]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <span className="ml-2 h-2 w-24 rounded-full bg-white/[0.06]" />
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function BeautyCrm() {
  return (
    <Frame>
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
    <Frame>
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
    <Frame>
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
    <Frame>
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
    <Frame>
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
