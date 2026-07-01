# Project Progress

## cenks-personal-website

GitHub: https://github.com/cnkbat/cenks-personal-website
Live: https://cenk-emir-bat.vercel.app
Last updated: 2026-07-01

---

## Status: ✅ Live in production

A premium, bilingual (TR default / EN) business marketing site for Cenk Emir Bat's
digital solutions work. Built, polished, and deployed to the existing Vercel
project `cenk-emir-bat`.

---

## Completed

### Foundation
- [x] Full rebuild as a premium bilingual (TR/EN) business marketing site
- [x] Stack: Next.js 16 (App Router, static export), TypeScript, Tailwind 4, Framer Motion, Lucide, Geist
- [x] Dark-luxury design system (`app/globals.css`) — glass, glow, blobs, grid, particles
- [x] i18n via React context + typed dictionaries (`lib/i18n/dictionaries.ts`), TR default, client-side switch
- [x] Sections: Hero, Business Value, Services, Demos, Packages, About, Contact
- [x] Sticky glass navbar w/ language switcher + WhatsApp + CTA; floating WhatsApp button
- [x] ~~Demo placeholder routes~~ → **replaced** by the standalone sector-demo suite below
      (old `/demos/{beauty-crm,barber,clinic,real-estate,restaurant}` now 301-redirect to the new branded routes)
- [x] SEO: metadata, generated Open Graph image (forced `image/png` via `vercel.json`), `robots.txt`, `sitemap.xml`
- [x] Preserved separate-product assets: `content-machine/` legal pages + TikTok verification files

### Premium visual polish sprint
- [x] +25% section spacing, premium glass-card/shadow utilities, stronger grid, glow-pulse + float animations
- [x] Richer ambient background (layered purple/blue/magenta radial lights, blobs, particles, depth)
- [x] Thinner navbar with stronger glass + premium shadow on scroll
- [x] Hero redesigned to two columns + layered floating product showcase (dashboard, iPhone, analytics + notification cards) with asset-filename captions
- [x] Animated count-up stat cards
- [x] Apple-style Services cards, richer Business Value / Demos / Contact cards
- [x] Premium glass pricing (highlighted card scaled + gradient ring)
- [x] Wider About with premium profile card (`cenk-profile.webp` placeholder)
- [x] Demo detail pages redesigned: hero, large preview, problem/solution, feature grid, benefits, CTA, sticky contact button
- [x] `assets-needed.md` — single source of truth for all pending visual assets

### Bug fixes
- [x] Cards no longer disappear on language switch (stable list keys instead of translated-string keys)
- [x] Hero stat count-up no longer restarts every frame (stable `useEffect` deps in `AnimatedNumber`)

### Generated visual assets (OpenAI gpt-image-1)
- [x] 5 industry product-preview images generated as compact WebP in `public/assets/`
      (beauty-crm, barber, clinic, real-estate, restaurant)
- [x] Wired into demo cards + demo detail previews; beauty image reused as the hero main dashboard
- [x] Hero floating phone/analytics/notification stay hand-built (bilingual, crisp) — **kept as code
      by decision**: AI can't render legible small UI text, and code keeps them sharp + TR/EN aware
- [x] Real owner portrait wired into the About card — `public/assets/cenk-profile.webp`
      (converted from `me.png`, cropped 4:5 → 1000×1200 WebP, 38 KB); monogram placeholder removed

### Verified
- [x] Production build green (all routes static, 0 TS errors; only pre-existing content-machine lint warnings)
- [x] Live production checks: home, demo pages, TikTok verification (`text/plain`), content-machine pages, OG image (`image/png`) all 200
- [x] Visual QA on desktop + mobile; language toggle verified

### Client demo: Püruze Caffe (Kuzguncuk)
- [x] Standalone premium, warm (cream / terracotta / espresso) Turkish cafe website demo
      at `/puruze-caffe` — self-contained route outside the dark `(site)` group so it keeps
      its own light theme (`components/puruze/PuruzeSite.tsx`)
- [x] Home sections: hero (3 CTAs), story (Kuzguncuk + Ekmek Teknesi), weekend breakfast
      notice card (09:00–14:00 kahvaltı / 14:00 sonrası kahve-tatlı), menu teaser
      (category cards → menu page), gallery, sample reviews, location (address,
      phone 0216 310 15 35, @puruzecaffe, Google Maps embed + CTA)
- [x] Dedicated menu page at `/puruze-caffe/menu` (`components/puruze/PuruzeMenu.tsx`):
      full menu by category with a sticky, horizontally-scrollable category nav;
      shared header/footer/mobile-bar extracted to `components/puruze/shared.tsx`
- [x] Mobile-first sticky bottom CTA bar (Ara / Yol Tarifi / Instagram) on both pages
- [x] Turkish SEO metadata (title + description + local keywords), serif headings (Playfair Display)
- [x] 7 realistic warm cafe visuals generated (OpenAI gpt-image-1) in `public/puruze/`
- [x] Portfolio card added to the Demos section (links out to `/puruze-caffe`, marked Live);
      demo items now support an optional `href` for standalone demos
- [x] "Demo · Tasarım: Cenk Emir Bat" ribbon + footer credit linking back to the portfolio

### Sector demo suite — real, sector-specific business systems (2026-06-29)
Positioning: *"Sadece web sitesi değil — sektöre özel dijital işletme sistemleri."*
The thin, generic `/demos/*` detail pages were replaced by 5 standalone, **Turkish-only**,
self-themed demo pages, each mirroring the proven Püruze pattern (top-level routes outside
the dark `(site)` group, own theme, back-to-portfolio ribbon, sticky WhatsApp, footer credit).
- [x] Shared, reusable demo kit — `components/demos/kit/` (`DemoShell`, `DemoHero`, `Section`,
      `ProblemSection`, `SolutionSection`, `DemoStage`, `FeatureGrid`, `Scenario`, `PricingCards`,
      `FinalCTA`, `DemoButton`) + mockup atoms (`BrowserFrame`, `PhoneFrame`, `Panel`, `StatTile`,
      `MiniBars`, `Sparkline`, `Donut`, `Bar`, `Avatar`, `Tag`)
- [x] Per-sector theming via CSS variables — `lib/demos/themes.ts` (`--d-*` tokens), so one kit
      renders every palette; apply with `themeVars(theme)` on the shell
- [x] **Kuaför OS** `/demos/kuafor-os` — graphite/gold; salon dashboard (randevular, personel
      programı, popüler hizmetler, gelir, WhatsApp hatırlatma)
- [x] **Beauty Center CRM** `/demos/beauty-center-crm` — cream/gold (serif); signature **paket &
      seans takibi** (Donut + Bar), müşteri/cilt kartı, önce-sonra galeri, gelir
- [x] **ClinicOS** `/demos/clinic-os` — white/blue medical; hekim takvimi, bekleyen hastalar,
      ödeme takibi, doluluk; çok branş (diş / fizik tedavi / diyetisyen / muayenehane)
- [x] **EstateOS** `/demos/estate-os` — navy/gold (serif); portföy/ilanlar, satış süreci,
      danışman görevleri, komisyon
- [x] **RestaurantOS** `/demos/restaurant-os` — dark/amber (serif); masa durumu grid, QR dijital
      menü (telefon çerçevesi), online sipariş, popüler ürünler, Google yorum CTA
- [x] Each page: Hero → Sorun → Çözüm → canlı kodlanmış panel (#panel) → Özellikler (6–10) →
      Örnek Senaryo → Paketler (Başlangıç/Profesyonel/Premium) → final CTA. Interactive areas are
      **coded React mockups** (crisp, legible, themeable) — not images
- [x] Demo cards redesigned (cleaner, image-forward, less text): kategori · ad · değer önerisi ·
      3 madde · durum rozeti (Canlı Demo / Hazır Demo / Yeni) · "Demoyu Aç"; whole card clickable
- [x] 10 text-free sector ambiance photos generated (gpt-image-1) in `public/demos/<sector>/`
- [x] Per-demo branded **Open Graph images** (code-rendered `ImageResponse`, 1200×630, per-sector
      theme + name) via `app/demos/<slug>/opengraph-image.tsx` + shared `lib/demos/og.tsx`;
      content-type forced in `vercel.json`. Wires `og:image` + `twitter:image` (summary_large_image)
- [x] RestaurantOS QR menu is **interactive** — tapping a category chip switches the menu items and
      live cart total (`useState` in `RestaurantSite`)
- [x] Theme-aware status colors (`--d-pos/--d-warn/--d-neg`) so green/amber/red read on the light
      themes (Beauty/Clinic); revenue values de-ambiguated (e.g. `₺18.600`)
- [x] Old routes 301-redirect (`vercel.json`), `sitemap.ts` updated; `DemoDetail.tsx` + `Mockups.tsx`
      removed; built with `next build` — all 21 routes static (incl. OG images), 0 TS errors

### Interactive product prototypes — demos that feel like real SaaS (2026-06-29)
Approved visuals kept 1:1; an interactive layer was added on top so a business owner
sees "this is how my business would actually work". Local React state only — no backend.
- [x] Shared interaction kit — `components/demos/kit/interactive.tsx`: toast system
      (`DemoToastProvider`/`useDemoToast`), animated `DemoModal` + `ConfirmDialog`, `Tabs`,
      `DemoCounter` (animated number), `Skeleton`, `SearchInput`/`TextField`/`SelectField`,
      `FilterChips`, `DemoActionButton`, `IconButton`. Toast provider wired into `DemoShell`;
      `StatTile` value now `ReactNode` so stats animate.
- [x] **Kuaför OS** — complete/cancel/restore randevu (confirm dialog), reassign personel + move
      saat via detail modal, add/search/filter müşteri, live animated gelir/doluluk, popular
      services recompute, toasts on every action.
- [x] **Beauty Center CRM** — paket **Seans Kullan** consumes a session (Donut/Bar animate, gelir
      rises, "yenileme" prompt at full), müşteri kartı modal, randevu ekle/complete/cancel,
      işlem filter + search, WhatsApp reminder simulation.
- [x] **ClinicOS** — branş/hekim filter, hasta profili modal with **Tabs** (Bilgiler/Geçmiş/Ödemeler),
      "Geldi"/"Tamamla" status, "Tahsil Et" moves ödeme Bekliyor→Ödendi (tahsilat animates),
      "Muayeneye Al" clears bekleyen hasta, move randevu in modal.
- [x] **EstateOS** — real **Satış Süreci Kanban** (Yeni Başvuru → İlk Görüşme → Teklif Hazırlandı →
      Sözleşme → Tamamlandı) with framer-motion card moves; reaching Tamamlandı adds komisyon
      (animated). İlan search + tür/danışman filter, ilan & müşteri-adayı detail modals.
- [x] **RestaurantOS** — QR menü basket with +/- qty + live total → "Sipariş Ver" creates a kitchen
      order; masa durumu cycles Boş→Dolu→Rezerve (counts update); online sipariş advances
      Yeni→Hazırlanıyor→Hazır→Servis (ciro rises); rezervasyon status toggles.
- [x] Turkish glossary applied to visible UI (Lead→Müşteri Adayı, Pipeline→Satış Süreci,
      Stage→Aşama, Listing→İlan, etc.); brand acronyms (CRM/OS/QR/WhatsApp) kept.
- [x] Homepage navbar: "CB" monogram replaced with the real profile photo (`/assets/cenk-profile.webp`).
- [x] Micro-interactions throughout: hover states, animated counters, toast notifications, modal
      animations, confirm dialogs, search/filter, empty states. Build: 21 routes static, 0 TS errors.

### Demo app shell — working sidebars, Sunum Modu & sales CTA (2026-06-29)
Pushes the "real application" feeling for self-exploration + a client-facing presenter.
Approved visuals untouched; all additive. Local React state only.
- [x] Kit (`components/demos/kit/app-shell.tsx`): `DemoSidebar` + `DemoMobileNav` (every item
      switches the content area, active highlight, "Sunum Modu" trigger), `AnimatedView` (smooth
      view transitions), `PresentationMode` (guided overlay: step no., title, TR explanation,
      highlighted action, Geri/İleri/Sunumu Bitir, progress bar, Esc/←/→ keyboard, auto-switches
      the relevant sidebar view), `DemoClosingCTA` + `ContactModal` (premium closing section →
      demo-request form with success animation). Added `Toggle` to the kit.
- [x] **Every sidebar item now works** — each opens its own screen with sector widgets/tables/
      cards/actions + realistic Turkish data (no dead items):
      - Kuaför OS: Genel Bakış · Randevular · Müşteriler · Hizmetler · Personeller · Gelir · Ayarlar
      - Beauty: + Seanslar · Paketler · Raporlar
      - ClinicOS: Genel Bakış · Takvim · Hastalar · Doktorlar · Ödemeler · Tedaviler · Raporlar · Ayarlar
      - EstateOS: + Portföy · Müşteri Adayları · Satış Süreci · Danışmanlar · Komisyonlar · Raporlar
      - RestaurantOS: + Menü · Siparişler · Masalar · Rezervasyonlar · Mutfak · Kampanyalar · Raporlar
- [x] **Sunum Modu** per demo — sector-specific 7-step guided flow (~2-3 dk) for sitting with a
      client; each step auto-switches to the relevant page; premium overlay, not a dev tutorial.
- [x] **Premium closing CTA** on every demo: "Bu sistemi işletmeniz için özelleştirebiliriz." +
      4 benefits + [Ücretsiz Demo Talep Et] (opens contact modal: Ad Soyad / İşletme Adı / Telefon /
      Sektör / Mesaj → success animation) + [WhatsApp ile İletişime Geç].
- [x] Note: view render helpers are invoked as functions (not `<X/>` JSX) so text-input focus is
      preserved across re-renders. Build green.

### Sales polish — client-facing tour, AI assistant, fullscreen (2026-06-29)
Final sprint to make demos meeting-ready (shown directly to clients on one screen).
Additive only; approved visuals untouched.
- [x] **Sunum Modu rewritten client-facing** — steps now read as a guided product tour for the
      customer (benefit statements), with all presenter instructions ("gösterin/anlatın/basın")
      removed, across all 5 demos.
- [x] **In-demo AI assistant** (`DemoAssistant`) on every demo — floating "AI Asistan" button +
      chat drawer with sector-specific suggested questions, simulated smart Turkish answers, typing
      animation, and a working text input (keyword-matched). No backend.
- [x] **Fullscreen live panel** (`LivePanel`) — "Tam Ekran" opens the OS as a full overlay
      (Esc / "Kapat" closes, body scroll-locked); sidebar, AI, Sunum Modu all keep working inside.
- [x] **Sales polish:** "Sıfırla" reset button (restores demo to initial state between meetings),
      `localStorage` persistence (`usePersistentState`) so interactions survive refresh, a subtle
      "Bu paneldeki veriler örnek olarak hazırlanmıştır…" data note, and pre-filled Turkish
      WhatsApp messages naming each demo (`demoWhatsAppLink`).
- [x] Final Turkish sweep (Lead→Müşteri Adayı, Pipeline→Satış Süreci, etc.); brand acronyms kept.

### Client site: Dyt. İkram Örnek — Bahçelievler Diyetisyen (2026-07-01)
Real client delivery (**NOT a demo** — no demo ribbon/wording, not added to the homepage or the
`/demos` grid). Self-contained premium wellness site scoped entirely to one route.
- [x] Route `/demo/ikram-ornek-diyetisyen` — thin server `page.tsx` (SEO metadata via
      `title.absolute` + JSON-LD LocalBusiness/MedicalBusiness) → client `IkramSite`
- [x] Components in `app/demo/ikram-ornek-diyetisyen/_components/` (`IkramSite`, `Navbar`,
      `shared`, `data`) — private `_components` folder, nothing leaks to other routes
- [x] Light warm-wellness theme (sage #7E956B / cream #F3EFE7 / olive #4F6245), **Fraunces**
      display serif (latin-ext for Turkish) + Geist body, signature apothecary-arch motif
- [x] 13 sections: sticky glass navbar (full-screen mobile menu) · hero (animated headline w/
      hand-drawn sage underline) · stats · Hakkımda · Sonuçlar · Hizmetler (6) · Süreç (5) ·
      Tarifler (4) · Blog (4) · Yorumlar (3) · SSS accordion (6) · final CTA · footer + iletişim
- [x] All-Turkish copy, no medical guarantees, "sonuçlar bireyseldir" disclaimer, initials-only
      testimonials; CTAs wired real: WhatsApp `wa.me/905388416427` + Google Form randevu
- [x] 7 brand images generated (OpenAI gpt-image-1) in `public/ikram/` — hero botanical, about
      flat-lay, CTA atmosphere, 4 recipe photos. **Owner's face intentionally NOT AI-fabricated**
      (low-res IG refs would misrepresent her); elegant image-ready portrait frame instead,
      ready to drop in a real professional headshot
- [x] Adversarial 3-lens review (design / a11y / brief-compliance) applied: full-screen mobile
      menu overlay, centered process timeline, reduced-motion (`MotionConfig` + count-up),
      WCAG AA contrast, FAQ aria-controls/aria-hidden, visible focus-visible rings
- [x] Verified: `tsc` 0 errors, ESLint 0 errors, `next build` green (route static-exported);
      desktop + mobile visual QA

---

## Preserved (separate product — do not remove)

- `app/content-machine/privacy` and `app/content-machine/terms` (+ `app/components/legal/LegalLayout.tsx`)
- `public/tiktok-developers-site-verification.txt`
- `public/tiktokhdqx7r1Ek28viAqxrQrRkbu6Gi2sN4Z3`
- `public/content-machine/privacy/tiktokckwqS5Qfv2ECBQVieIkjzQm3IGAxZTJg`
- TikTok meta tag in root `app/layout.tsx`

---

## Pending / next

- [ ] Add a custom domain (Contact + footer currently show the Vercel URL)

### Closed (decided, no longer pending)
- [x] Real profile photo added to the About card (see Generated visual assets above)
- [x] Hero floating cards — deliberately kept as hand-built code, not images (see above)

## Secrets

- OpenAI API key (used to generate the product-preview images) is stored locally in
  `.env` as `OPENAI_API_KEY`. `.env` is **gitignored — never commit or push it**.
  Kept as-is per owner's decision (not rotated).

---

## Architecture Notes

- The marketing site lives in the `app/(site)/` route group so its chrome (navbar,
  footer, animated background) never bleeds into the preserved `content-machine`
  legal pages, which keep their own light-themed `LegalLayout`.
- Deploy with `vercel deploy --prod --yes` (project already linked). Pushing to
  `main` also triggers a Vercel build.
- i18n is client-side (no locale URL prefixes); never key React lists by translated
  strings — use stable keys so cards don't remount on language switch.
