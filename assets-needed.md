# Visual Assets — Source of Truth

This document lists every production visual asset the site reserves space for.
Until a real asset ships, an elegant in-place placeholder (realistic UI + a
`filename · dimensions` caption) stands in for it. Drop the final files into
`public/assets/` and swap the placeholder for a `next/image` (or `<img>`) with
matching dimensions.

**Shared design language (applies to every asset):**
Dark UI · purple (`#7C5CFF`) + blue/cyan (`#22D3EE`) accents · subtle magenta
(`#E879F9`) · glassmorphism · rounded corners (16–28px) · soft shadows ·
minimal · premium SaaS / high-end product design · OKLCH-clean color · no
stock-photo feel · no harsh pure-black (always slightly tinted `#060711`).

Priority: **P0** = on first viewport (hero), **P1** = key sections, **P2** = nice-to-have.
Status: `placeholder` = in-place placeholder live · `needed` = not yet produced · `shipped` = real asset live in `public/assets/`.

---

## ✅ Generated & live (2026-06-26, via OpenAI gpt-image-1, WebP)

Real product-preview images now live in `public/assets/` and wired in:
- `beauty-crm-preview.webp` — demo card + demo detail **and** reused as the hero main dashboard
- `barber-preview.webp`, `clinic-preview.webp`, `real-estate-preview.webp`, `restaurant-preview.webp` — demo cards + demo detail previews

Still hand-built placeholders (intentionally): hero floating phone / analytics / notification
cards (bilingual, crisp) and the About profile card. **`cenk-profile.webp` should be a real
photo of Cenk — not AI-generated** (a fake face on a personal sales site undermines trust).

---

## 1. beauty-crm-dashboard.webp
- **Dimensions:** 1600×900
- **Usage:** Hero — main floating product showcase (`components/sections/HeroShowcase.tsx`)
- **Description:** Luxury Beauty Clinic CRM dashboard. Sidebar nav, KPI stat cards
  (appointments, revenue, customers), a weekly revenue bar chart, and a list of
  upcoming appointments with avatars.
- **Style:** Dark SaaS dashboard, purple accents, glassmorphism, generous spacing,
  appointment calendar + revenue cards + customer list + analytics.
- **Priority:** P0
- **Status:** placeholder
- **Image prompt:**
  > A premium dark-mode SaaS CRM dashboard for a luxury beauty clinic, inside a
  > macOS browser frame. Left sidebar with minimal icons, top KPI cards showing
  > "Appointments 48", "Revenue ₺62K", "Customers 312", a glowing purple-to-cyan
  > gradient bar chart, and a list of upcoming appointments with circular avatars.
  > Glassmorphism panels, deep navy `#0A0C18` background, purple `#7C5CFF` and cyan
  > `#22D3EE` accents, soft shadows, rounded corners, ultra-clean, Linear/Stripe
  > quality, 16:9.

## 2. crm-mobile-app.webp
- **Dimensions:** 800×1600
- **Usage:** Hero — floating iPhone mockup in the showcase
- **Description:** CRM mobile app. Header "CRM", "Today" section, a stack of
  appointment cards, a WhatsApp-integration accent, and a bottom tab bar.
- **Style:** Dark UI, modern iOS design, purple/cyan accents, rounded cards.
- **Priority:** P0
- **Status:** placeholder
- **Image prompt:**
  > A sleek dark-mode iOS CRM app screen on an iPhone, showing a "Today" list of
  > appointment cards (09:30 Ayşe, 11:00 Mert, 14:30 Elif), a small green WhatsApp
  > status dot, and a minimal bottom tab bar with a glowing purple active tab.
  > Deep navy background, glassmorphism, purple `#7C5CFF` + cyan `#22D3EE` accents,
  > rounded corners, premium product design, portrait 1:2.

## 3. analytics-floating-card.webp
- **Dimensions:** 600×400
- **Usage:** Hero — floating analytics widget
- **Description:** Floating analytics card. "+120 Completed Projects", a "+24%"
  growth pill, and an upward customer-growth sparkline.
- **Style:** Modern SaaS analytics widget, glassmorphism, cyan line graph.
- **Priority:** P0
- **Status:** placeholder
- **Image prompt:**
  > A small floating glassmorphism analytics widget on a dark background, big number
  > "+120" with label "Completed Projects", a green "+24%" pill, and a smooth upward
  > cyan sparkline with a soft gradient fill. Purple/cyan accents, rounded corners,
  > soft glow, premium SaaS, 3:2.

## 4. notification-widget.webp
- **Dimensions:** 420×220
- **Usage:** Hero — floating notification toast
- **Description:** Floating notification. Bell icon, title "New Appointment",
  body "Ayşe Y. • 14:30", timestamp "now".
- **Style:** Modern minimal notification toast, glassmorphism, gradient icon tile.
- **Priority:** P0
- **Status:** placeholder
- **Image prompt:**
  > A minimal dark-mode notification toast with a purple-to-cyan gradient bell icon,
  > title "New Appointment", subtitle "Ayşe Y. • 14:30", and a faint "now" timestamp.
  > Glassmorphism, rounded corners, soft shadow, premium SaaS, landscape ~2:1.

## 5. beauty-crm-preview.webp
- **Dimensions:** 1600×1000
- **Usage:** Demo detail page `/demos/beauty-crm` — large product preview
- **Description:** Full Beauty Clinic CRM screen (expanded version of asset #1).
- **Style:** Dark SaaS, purple accents, glassmorphism, appointment + revenue + clients.
- **Priority:** P1
- **Status:** placeholder
- **Image prompt:**
  > A full-screen luxury beauty clinic CRM dashboard, dark mode, in a browser frame:
  > customer list with avatars and package/session tracking, revenue cards, weekly
  > bar chart, automated reminder badges. Purple `#7C5CFF` + cyan `#22D3EE`,
  > glassmorphism, premium, 8:5.

## 6. barber-preview.webp
- **Dimensions:** 1600×1000
- **Usage:** Demo detail page `/demos/barber` — large product preview
- **Description:** Modern barber/salon website with online booking, service +
  price showcase, gallery and reviews.
- **Style:** Dark, premium, purple/cyan accents, large hero + booking CTA.
- **Priority:** P1
- **Status:** placeholder
- **Image prompt:**
  > A modern dark-mode barber shop website homepage in a browser frame: bold hero
  > headline, a glowing purple-to-cyan "Book Now" button, a row of service cards with
  > prices, and a small gallery grid. Glassmorphism, premium, 8:5.

## 7. clinic-preview.webp
- **Dimensions:** 1600×1000
- **Usage:** Demo detail page `/demos/clinic` — large product preview
- **Description:** Clinic appointment system with a per-doctor calendar,
  auto-confirmation, patient intake form, SMS/WhatsApp reminders.
- **Style:** Dark, clinical-clean, purple/cyan accents, calendar grid focus.
- **Priority:** P1
- **Status:** placeholder
- **Image prompt:**
  > A dark-mode medical clinic appointment booking system in a browser frame: a
  > monthly calendar grid with highlighted purple and cyan booked slots, a doctor
  > selector, and an intake form panel. Glassmorphism, soft shadows, premium SaaS, 8:5.

## 8. real-estate-preview.webp
- **Dimensions:** 1600×1000
- **Usage:** Demo detail page `/demos/real-estate` — large product preview
- **Description:** Real-estate platform: filterable listing grid, listings on a
  map, portfolio management, demand matching.
- **Style:** Dark, premium, property cards with image headers, purple/cyan accents.
- **Priority:** P1
- **Status:** placeholder
- **Image prompt:**
  > A dark-mode real-estate platform in a browser frame: a grid of property cards
  > with image thumbnails and prices, a filter sidebar, and a small map with pins.
  > Glassmorphism, purple/cyan accents, premium, 8:5.

## 9. restaurant-preview.webp
- **Dimensions:** 1600×1000
- **Usage:** Demo detail page `/demos/restaurant` — large product preview
- **Description:** Restaurant/café website: digital menu, online reservations,
  order routing, gallery and promotions.
- **Style:** Dark, elegant, warm-tinted purple/cyan accents, menu list focus.
- **Priority:** P1
- **Status:** placeholder
- **Image prompt:**
  > A dark-mode restaurant website in a browser frame: an elegant digital menu list
  > with prices, a "Reserve a Table" CTA, and a small dish gallery. Glassmorphism,
  > purple/cyan accents with a warm hint, premium, 8:5.

## 10. cenk-profile.webp
- **Dimensions:** 1000×1200
- **Usage:** About section — premium profile card (`components/sections/About.tsx`)
- **Description:** Professional portrait of Cenk Emir Bat for the About card.
- **Style:** Dark studio lighting, confident, modern entrepreneur, subtle purple rim light.
- **Priority:** P1
- **Status:** placeholder (monogram stand-in)
- **Image prompt:**
  > A professional studio portrait of a confident young male entrepreneur, dark
  > moody background, subtle purple/cyan rim lighting, sharp focus, modern and
  > premium editorial look, shoulders-up, portrait 5:6. (Use a real photo of Cenk
  > when available — this asset should be an actual photograph, not AI, for trust.)

---

## 11. opengraph-image (already shipping)
- **Dimensions:** 1200×630
- **Usage:** Social share preview — generated at build via `app/opengraph-image.tsx`
- **Description:** Branded OG card with monogram, gradient headline and URL.
- **Priority:** P0
- **Status:** ✅ live (generated, served as `image/png`)

---

### Implementation notes
- Place final files under `public/assets/` and reference as `/assets/<file>`.
- All raster assets should be exported as **WebP** (with an AVIF alt if convenient);
  this project uses `images.unoptimized` (static export), so pre-size/compress them.
- Keep the same aspect ratios listed above to avoid layout shift — the placeholders
  already reserve these exact boxes.
- Replace the placeholder markup in `HeroShowcase.tsx`, `DemoDetail.tsx`, and
  `About.tsx` (search for the `.webp` caption strings).
