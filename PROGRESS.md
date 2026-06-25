# Project Progress

## cenks-personal-website

GitHub: https://github.com/cnkbat/cenks-personal-website
Live: https://cenk-emir-bat.vercel.app
Last updated: 2026-06-26

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
- [x] Hero floating phone/analytics/notification stay hand-built (bilingual, crisp)
- [x] Portrait left as monogram on purpose — `cenk-profile.webp` should be a real photo, not AI

### Verified
- [x] Production build green (all routes static, 0 TS errors; only pre-existing content-machine lint warnings)
- [x] Live production checks: home, demo pages, TikTok verification (`text/plain`), content-machine pages, OG image (`image/png`) all 200
- [x] Visual QA on desktop + mobile; language toggle verified

---

## Preserved (separate product — do not remove)

- `app/content-machine/privacy` and `app/content-machine/terms` (+ `app/components/legal/LegalLayout.tsx`)
- `public/tiktok-developers-site-verification.txt`
- `public/tiktokhdqx7r1Ek28viAqxrQrRkbu6Gi2sN4Z3`
- `public/content-machine/privacy/tiktokckwqS5Qfv2ECBQVieIkjzQm3IGAxZTJg`
- TikTok meta tag in root `app/layout.tsx`

---

## Pending / next

- [ ] Provide a real photo for `cenk-profile.webp` (About profile card) and swap out the monogram
- [ ] Optionally generate real images for the hero floating phone/analytics/notification cards
- [ ] Add a custom domain (Contact + footer currently show the Vercel URL)
- [ ] Rotate the OpenAI API key that was shared in chat (stored locally in gitignored `.env`)

---

## Architecture Notes

- The marketing site lives in the `app/(site)/` route group so its chrome (navbar,
  footer, animated background) never bleeds into the preserved `content-machine`
  legal pages, which keep their own light-themed `LegalLayout`.
- Deploy with `vercel deploy --prod --yes` (project already linked). Pushing to
  `main` also triggers a Vercel build.
- i18n is client-side (no locale URL prefixes); never key React lists by translated
  strings — use stable keys so cards don't remount on language switch.
