# Project Progress

## cenks-personal-website

GitHub: https://github.com/cnkbat/cenks-personal-website
Live: https://cenk-emir-bat.vercel.app
Last updated: 2026-06-29

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
- [x] Demo placeholder routes with product mockups: `/demos/{beauty-crm,barber,clinic,real-estate,restaurant}`
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
