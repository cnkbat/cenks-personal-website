# Project Progress

## cenks-personal-website

GitHub: https://github.com/cnkbat/cenks-personal-website
Live: https://cenk-emir-bat.vercel.app

---

## Completed

- [x] Full rebuild as a premium bilingual (TR/EN) business marketing site
- [x] Stack: Next.js 16 (App Router, static export), TypeScript, Tailwind 4, Framer Motion, Lucide, Geist
- [x] Dark-luxury design system (`app/globals.css`) — glass, glow, blobs, grid, particles
- [x] i18n via React context + typed dictionaries (`lib/i18n/dictionaries.ts`), TR default
- [x] Sections: Hero, Business Value, Services, Demos, Packages, About, Contact
- [x] Sticky glass navbar w/ language switcher + WhatsApp + CTA; floating WhatsApp button
- [x] Demo placeholder routes with product mockups: `/demos/{beauty-crm,barber,clinic,real-estate,restaurant}`
- [x] SEO: metadata, generated Open Graph image, `robots.txt`, `sitemap.xml`
- [x] Production build verified (all routes static, 0 TypeScript / lint / console errors)
- [x] Preserved separate-product assets: `content-machine/` legal pages + TikTok verification files

## Preserved (separate product — do not remove)

- `app/content-machine/privacy` and `app/content-machine/terms` (+ `app/components/legal/LegalLayout.tsx`)
- `public/tiktok-developers-site-verification.txt`
- `public/tiktokhdqx7r1Ek28viAqxrQrRkbu6Gi2sN4Z3`
- `public/content-machine/privacy/tiktokckwqS5Qfv2ECBQVieIkjzQm3IGAxZTJg`
- TikTok meta tag in root `app/layout.tsx`

---

## Architecture Notes

The marketing site lives in the `(site)` route group so its chrome (navbar, footer,
animated background) never bleeds into the preserved `content-machine` legal pages,
which keep their own light-themed `LegalLayout`.
